const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

const DAY = 86400000;
const KEY = 'dsh-up-session/preferences.v1';

// Drive the shipped components with retained hook state and memo dependencies.
// No production test exports or additional runtime dependencies are needed.
function harness() {
  let definition;
  let cursor = 0;
  let now = Date.UTC(2026, 10, 11, 15);
  const hooks = [];
  const storage = new Map();
  const React = {
    Fragment: 'fragment',
    createElement: (type, props, ...children) => ({ type, props: props ?? {}, children }),
    useState(initial) {
      const index = cursor++;
      if (!(index in hooks)) hooks[index] = typeof initial === 'function' ? initial() : initial;
      return [hooks[index], (next) => {
        hooks[index] = typeof next === 'function' ? next(hooks[index]) : next;
      }];
    },
    useRef(initial) {
      const index = cursor++;
      return hooks[index] ??= { current: initial };
    },
    useMemo(callback, deps) {
      const index = cursor++;
      const previous = hooks[index];
      if (!previous || deps.some((value, i) => !Object.is(value, previous.deps[i]))) {
        hooks[index] = { deps, value: callback() };
      }
      return hooks[index].value;
    },
    useCallback(callback, deps) { return React.useMemo(() => callback, deps); },
    useEffect() {},
  };
  const source = readFileSync(`${__dirname}/../client.js`, 'utf8');
  const instrumented = source.replace('      inject,\n      apply,',
    '      inject,\n      apply,\n      readPreferences, writePreferences, filterRecentByTime, recentRows, PreferenceNumberInput, SidebarSections, zh, en,');
  assert.notEqual(instrumented, source);
  vm.runInNewContext(instrumented, {
    window: { __ModuleLoader__: { load(value) { definition = value; } }, clearTimeout() {} },
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
    },
    Date: class extends Date { static now() { return now; } },
    console,
  });
  const plugin = definition.factory((id) => id === 'react' ? React : { createPortal: (node) => node });
  return {
    plugin, storage, now: () => now, setNow: (value) => { now = value; },
    render(component, props) { cursor = 0; return component(props); },
  };
}

function find(node, predicate) {
  if (!node || typeof node !== 'object') return undefined;
  if (predicate(node)) return node;
  for (const child of node.children ?? []) {
    const found = find(child, predicate);
    if (found) return found;
  }
}

const ids = (rows) => Array.from(rows, (row) => row.id);

test('defaults and older preferences use seven days; stored days must be integers from 0 to 99', () => {
  const { plugin, storage } = harness();
  assert.equal(plugin.readPreferences().recentTimeFilterDays, 7);
  storage.set(KEY, JSON.stringify({ showRecent: false, recentPageSize: 12 }));
  assert.equal(plugin.readPreferences().recentTimeFilterDays, 7);
  assert.equal(plugin.readPreferences().showRecent, false);
  for (const value of [0, 1, 7, 99]) {
    storage.set(KEY, JSON.stringify({ recentTimeFilterDays: value }));
    assert.equal(plugin.readPreferences().recentTimeFilterDays, value);
  }
  for (const value of [-1, 100, 7.5, '7', null, true]) {
    storage.set(KEY, JSON.stringify({ recentTimeFilterDays: value, recentPageSize: 12 }));
    const preferences = plugin.readPreferences();
    assert.equal(preferences.recentTimeFilterDays, 7);
    assert.equal(preferences.recentPageSize, 12);
  }
  const preferences = { ...plugin.readPreferences(), recentTimeFilterDays: 0, showPinned: false };
  plugin.writePreferences(preferences);
  assert.deepEqual(JSON.parse(storage.get(KEY)), preferences);
  storage.set(KEY, '{broken');
  assert.equal(plugin.readPreferences().recentTimeFilterDays, 7);
});

test('the exact 24-hour boundary excludes seven-day sessions, with no status exemption', () => {
  const { plugin, now } = harness();
  const rows = [
    { id: 'inside', updatedAt: now() - 7 * DAY + 1 },
    { id: 'boundary', updatedAt: now() - 7 * DAY, status: 'running' },
    { id: 'older', updatedAt: now() - 7 * DAY - 1, status: 'waiting' },
    { id: 'future', updatedAt: now() + DAY },
  ];
  assert.deepEqual(ids(plugin.filterRecentByTime(rows, 7, now())), ['inside', 'future']);
  assert.equal(plugin.filterRecentByTime(rows, 0, now()), rows);
  assert.equal(rows.length, 4, 'filtering does not modify the workspace data');
  assert.deepEqual(ids(plugin.filterRecentByTime([
    { id: '98-days', updatedAt: now() - 99 * DAY + 1 },
    { id: '99-days', updatedAt: now() - 99 * DAY },
  ], 99, now())), ['98-days']);
});

test('disabling time filtering or restoring hidden sessions does not bypass other inclusion rules', () => {
  const { plugin, now } = harness();
  const byId = Object.fromEntries(['old', 'pinned', 'archived', 'hidden', 'blank', 'child'].map((id) =>
    [id, { id, title: id, updatedAt: now() - 8 * DAY }]));
  byId.blank.blank = true;
  byId.child.origin = 'subagent';
  const sessions = { ids: Object.keys(byId), byId };
  const candidates = (muted) => plugin.recentRows(sessions, ['archived'], ['pinned'], new Map(), new Map(), true, 'Untitled', muted);
  assert.deepEqual(ids(plugin.filterRecentByTime(candidates({ hidden: now() }), 0, now())), ['old']);
  assert.deepEqual(ids(plugin.filterRecentByTime(candidates({}), 7, now())), []);
  assert.deepEqual(ids(plugin.filterRecentByTime(candidates({}), 0, now())), ['hidden', 'old']);
});

test('day input applies only on confirmation, rejects invalid drafts and steps within 0–99', () => {
  const h = harness();
  const calls = [];
  let value = 7;
  const render = () => h.render(h.plugin.PreferenceNumberInput, {
    value, min: 0, max: 99, strictDays: true,
    onChange(next) { calls.push(next); value = next; },
  });
  const field = () => find(render(), (node) => node.type === 'input');
  const type = (draft) => field().props.onChange({ target: { value: draft } });
  const enter = () => field().props.onKeyDown({ key: 'Enter', preventDefault() {}, currentTarget: { blur() {} } });
  type('12');
  assert.equal(value, 7);
  assert.equal(field().props.value, '12');
  enter();
  assert.equal(value, 12);
  for (const draft of ['7.5', '-1', '100', '1e1', 'abc', '', ' ', '999']) {
    const count = calls.length;
    type(draft);
    field().props.onBlur();
    assert.equal(calls.length, count, `invalid draft ${JSON.stringify(draft)} is not saved`);
    assert.equal(field().props.value, '12');
  }
  type('0'); enter();
  const buttons = () => render().children[1].children;
  assert.equal(value, 0);
  assert.equal(buttons()[1].props.disabled, true);
  buttons()[0].props.onClick();
  assert.equal(value, 1);
  type('99'); field().props.onBlur();
  assert.equal(value, 99);
  assert.equal(buttons()[0].props.disabled, true);
  buttons()[1].props.onClick();
  assert.equal(value, 98);
});

test('switching B/C rechecks idle A, and settings apply immediately even with cached candidates', () => {
  const h = harness();
  const a = { id: 'A', title: 'A', updatedAt: h.now() - 7 * DAY + 1, retainedBy: {} };
  const b = { id: 'B', title: 'B', updatedAt: h.now(), retainedBy: { mainView: 1 } };
  const c = { id: 'C', title: 'C', updatedAt: h.now(), retainedBy: {} };
  let sessions = { ids: ['A', 'B', 'C'], byId: { A: a, B: b, C: c } };
  const workspaces = { items: [], pinnedSessionIds: [], archivedSessionIds: [] };
  const statuses = new Map();
  const props = {
    host: {}, t: (key) => key,
    useWorkspaces: (select) => select(workspaces),
    useSessions: (select) => select(sessions),
    useSessionStatus: (select) => select(statuses),
    usePanelInfo: (select) => select({ activePanelId: null }),
  };
  const render = () => h.render(h.plugin.SidebarSections, props);
  const recent = () => find(render(), (node) => node.type.name === 'RecentSection');
  assert.ok(ids(recent().props.rows).includes('A'));
  h.setNow(h.now() + 2);
  sessions = { ...sessions, byId: { A: a, B: { ...b, retainedBy: {} }, C: { ...c, retainedBy: { mainView: 1 } } } };
  assert.ok(!ids(recent().props.rows).includes('A'));
  assert.equal(sessions.byId.A, a, 'A itself did not change');
  recent().props.onOpenSettings();
  const dialog = find(render(), (node) => node.type.name === 'SettingsDialog');
  dialog.props.onChangePreference('recentTimeFilterDays', 0);
  assert.ok(ids(recent().props.rows).includes('A'), 'setting changes recheck memoized candidates');
  dialog.props.onChangePreference('recentTimeFilterDays', 7);
  assert.ok(!ids(recent().props.rows).includes('A'));
});

test('Chinese and English settings dictionaries expose identical keys', () => {
  const { plugin } = harness();
  assert.deepEqual(Object.keys(plugin.zh).sort(), Object.keys(plugin.en).sort());
});
