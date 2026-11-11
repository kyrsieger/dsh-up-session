const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

// Exercise the shipped factory without a browser or third-party dependencies.
function harness() {
  const frames = new Map();
  const rows = [];
  let frameId = 0;
  class Row extends EventTarget {
    constructor(key, expanded, click = () => {}) {
      super();
      const classes = new Set();
      this.classList = {
        add: (name) => classes.add(name),
        remove: (name) => classes.delete(name),
        contains: (name) => classes.has(name),
      };
      this.dataset = { rowKey: key };
      this.expanded = expanded;
      this.click = click;
      this.scrolls = 0;
    }
    getAttribute() { return this.expanded; }
    scrollIntoView() { this.scrolls += 1; }
  }
  let definition;
  const sandbox = {
    window: { __ModuleLoader__: { load(value) { definition = value; } } },
    document: {
      querySelectorAll(selector) {
        return selector.includes('workspace:')
          ? rows.filter((row) => row.dataset.rowKey.startsWith('workspace:'))
          : rows;
      },
      createElement: () => ({ dataset: {} }),
    },
    HTMLElement: Row,
    EventTarget,
    requestAnimationFrame(callback) { frames.set(++frameId, callback); return frameId; },
    cancelAnimationFrame(id) { frames.delete(id); },
  };
  const source = readFileSync(`${__dirname}/../client.js`, 'utf8');
  const instrumented = source.replace('      inject,\n      apply,',
    '      inject,\n      apply,\n      revealOriginalSession,\n      CSS,');
  assert.notEqual(instrumented, source);
  vm.runInNewContext(instrumented, sandbox);
  const plugin = definition.factory((name) => name === 'react' ? { createElement() {} } : {});
  function flush() {
    let count = 0;
    while (frames.size) {
      assert.ok(++count < 1000, 'reveal must stop retrying');
      const callbacks = [...frames.values()];
      frames.clear();
      callbacks.forEach((callback) => callback());
    }
  }
  return { plugin, rows, Row, flush, frames };
}

test('expands nested ancestors before scrolling to the original session', () => {
  const { plugin, rows, Row, flush } = harness();
  const target = new Row('session:target');
  const child = new Row('workspace:child', 'false', () => {
    child.expanded = 'true'; rows.push(target);
  });
  const parent = new Row('workspace:parent', 'false', () => {
    parent.expanded = 'true'; rows.push(child);
  });
  rows.push(parent);
  plugin.revealOriginalSession([
    { workspaceId: 'parent', path: 'D:/parent', sessionIds: [] },
    { workspaceId: 'child', path: 'D:/parent/child', sessionIds: ['target'] },
  ], 'target', 'child', 1);
  flush();
  assert.equal(parent.expanded, 'true');
  assert.equal(child.expanded, 'true');
  assert.equal(target.scrolls, 1);
});

test('expands multiple overflow batches, including an ungrouped session', () => {
  const { plugin, rows, Row, flush, frames } = harness();
  const target = new Row('session:target');
  let clicks = 0;
  rows.push(new Row('overflow:', 'false', () => {
    if (++clicks === 12) {
      frames.set(-1, () => rows.push(target));
    }
  }));
  plugin.revealOriginalSession([], 'target', '', 65);
  flush();
  assert.equal(clicks, 12);
  assert.equal(target.scrolls, 1);
});

test('matches opaque session ids without building a CSS selector from them', () => {
  const { plugin, rows, Row, flush } = harness();
  const id = 'opaque:"]\\id';
  const target = new Row(`session:${id}`);
  rows.push(target);
  plugin.revealOriginalSession([], id, undefined, 1);
  flush();
  assert.equal(target.scrolls, 1);
});

test('a later reveal cancels the previous pending scroll', () => {
  const { plugin, rows, Row, flush } = harness();
  const first = new Row('session:first');
  const second = new Row('session:second');
  rows.push(first, second);
  plugin.revealOriginalSession([], 'first', '', 2);
  plugin.revealOriginalSession([], 'second', '', 2);
  flush();
  assert.equal(first.scrolls, 0);
  assert.equal(second.scrolls, 1);
});

function delayedNestedExpansion(harness) {
  const { rows, Row, frames } = harness;
  let childClicks = 0;
  const child = new Row('workspace:child', 'false', () => {
    childClicks += 1;
    child.expanded = 'true';
  });
  const parent = new Row('workspace:parent', 'false', () => {
    parent.expanded = 'true';
    // The host commits child rows later than the initial discrete click.
    frames.set(-1, () => rows.push(child));
  });
  rows.push(parent);
  const workspaces = [
    { workspaceId: 'parent', path: 'D:/parent', sessionIds: [] },
    { workspaceId: 'child', path: 'D:/parent/child', sessionIds: ['target'] },
  ];
  return { workspaces, childClicks: () => childClicks };
}

test('a later reveal cancels delayed workspace expansion from the previous reveal', () => {
  const state = harness();
  const delayed = delayedNestedExpansion(state);
  const latest = new state.Row('session:latest');
  state.rows.push(latest);
  state.plugin.revealOriginalSession(delayed.workspaces, 'target', 'child', 2);
  state.plugin.revealOriginalSession([], 'latest', undefined, 2);
  state.flush();
  assert.equal(delayed.childClicks(), 0);
  assert.equal(latest.scrolls, 1);
});

test('plugin unload cancels delayed nested workspace expansion and scrolling', () => {
  const state = harness();
  const effects = new Map();
  state.plugin.apply({
    locale: { bind: () => (key) => key },
    effect: (callback, label) => effects.set(label, callback),
    slots: { inject() {} },
  });
  const dispose = effects.get('up-session: cancel pending reveal')();
  const delayed = delayedNestedExpansion(state);
  state.plugin.revealOriginalSession(delayed.workspaces, 'target', 'child', 1);
  dispose();
  state.flush();
  assert.equal(delayed.childClicks(), 0);
});

test('a missing target stops retrying and never collapses expanded overflow', () => {
  const { plugin, rows, Row, flush } = harness();
  rows.push(new Row('overflow:owner', 'true', () => assert.fail('must not collapse')));
  plugin.revealOriginalSession([], 'missing', 'owner', 0);
  flush();
});

function animationEnd(row, name = 'dshUS-revealOriginal') {
  const event = new Event('animationend');
  event.animationName = name;
  row.dispatchEvent(event);
}

test('highlights only the revealed row, then restores it when the pulse finishes', () => {
  const { plugin, rows, Row, flush } = harness();
  const target = new Row('session:target');
  const other = new Row('session:other');
  rows.push(target, other);
  plugin.revealOriginalSession([], 'target', '', 2);
  flush();
  assert.equal(Object.hasOwn(target.dataset, 'dshUpSessionReveal'), true);
  assert.equal(Object.hasOwn(other.dataset, 'dshUpSessionReveal'), false);
  animationEnd(target, 'unrelated-host-animation');
  assert.equal(Object.hasOwn(target.dataset, 'dshUpSessionReveal'), true);
  animationEnd(target);
  assert.equal(Object.hasOwn(target.dataset, 'dshUpSessionReveal'), false);
});

test('native className updates leave the active pulse intact', () => {
  const { plugin, rows, Row, flush } = harness();
  const target = new Row('session:target');
  rows.push(target);
  plugin.revealOriginalSession([], 'target', '', 1);
  flush();
  // React replaces the full class attribute when selection or menu state changes.
  target.className = 'native-session-row native-selected';
  assert.equal(Object.hasOwn(target.dataset, 'dshUpSessionReveal'), true);
  assert.match(plugin.CSS, /\[data-dsh-up-session-reveal\]\{animation:dshUS-revealOriginal/);
  animationEnd(target);
  assert.equal(Object.hasOwn(target.dataset, 'dshUpSessionReveal'), false);
  assert.equal(target.className, 'native-session-row native-selected');
});

test('repeated reveals restart the pulse and moving to another row clears the old pulse', () => {
  const { plugin, rows, Row, flush } = harness();
  const first = new Row('session:first');
  const second = new Row('session:second');
  rows.push(first, second);
  for (let repeat = 0; repeat < 2; repeat += 1) {
    plugin.revealOriginalSession([], 'first', '', 2);
    flush();
    assert.equal(Object.hasOwn(first.dataset, 'dshUpSessionReveal'), true);
  }
  plugin.revealOriginalSession([], 'second', '', 2);
  flush();
  assert.equal(Object.hasOwn(first.dataset, 'dshUpSessionReveal'), false);
  assert.equal(Object.hasOwn(second.dataset, 'dshUpSessionReveal'), true);
  animationEnd(first);
  assert.equal(Object.hasOwn(second.dataset, 'dshUpSessionReveal'), true);
  animationEnd(second);
  assert.equal(Object.hasOwn(second.dataset, 'dshUpSessionReveal'), false);
});

test('pulse uses the live DSH theme token with a 20% fade in, 40% hold, and 40% fade out over three seconds', () => {
  const { plugin } = harness();
  assert.match(plugin.CSS, /animation:dshUS-revealOriginal 3s ease-in-out/);
  assert.match(plugin.CSS, /0%,100%\{box-shadow:[^}]+var\(--dsw-alias-brand-primary\) 0%/);
  assert.match(plugin.CSS, /20%,60%\{box-shadow:[^}]+var\(--dsw-alias-brand-primary\) 20%/);
});

test('plugin unload removes an active highlight', () => {
  const { plugin, rows, Row, flush } = harness();
  const effects = new Map();
  plugin.apply({
    locale: { bind: () => (key) => key },
    effect: (callback, label) => effects.set(label, callback),
    slots: { inject() {} },
  });
  const dispose = effects.get('up-session: cancel pending reveal')();
  const target = new Row('session:target');
  rows.push(target);
  plugin.revealOriginalSession([], 'target', '', 1);
  flush();
  assert.equal(Object.hasOwn(target.dataset, 'dshUpSessionReveal'), true);
  dispose();
  assert.equal(Object.hasOwn(target.dataset, 'dshUpSessionReveal'), false);
});

test('menu contribution is limited to section targets and follows file-manager action', () => {
  const { plugin } = harness();
  const effects = new Map();
  let menu;
  plugin.apply({
    locale: { bind: () => (key) => key },
    effect: (callback, label) => effects.set(label, callback),
    slots: { inject() {} },
    contextMenus: { register(value) { menu = value; } },
  });
  effects.get('up-session: reveal original menu action')();
  assert.equal(menu.target, 'session');
  assert.ok(menu.order > 500 && menu.order < 600);
  assert.equal(menu.resolve({ sessionId: 'native' }).length, 0);
  let called = false;
  const [item] = menu.resolve({ sessionId: 'section', revealOriginal() { called = true; } });
  assert.equal(item.label, 'revealOriginal');
  item.run();
  assert.equal(called, true);
});
