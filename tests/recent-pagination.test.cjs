const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

// Exercise the shipped section and its event handlers with retained hooks.
function harness(language = 'zh') {
  let definition;
  let cursor = 0;
  let dirty = false;
  let effects = [];
  const hooks = [];
  const React = {
    createElement: (type, props, ...children) => ({ type, props: props ?? {}, children: children.flat(Infinity) }),
    useState(initial) {
      const index = cursor++;
      if (!(index in hooks)) hooks[index] = initial;
      return [hooks[index], (next) => {
        const value = typeof next === 'function' ? next(hooks[index]) : next;
        if (!Object.is(value, hooks[index])) dirty = true;
        hooks[index] = value;
      }];
    },
    useEffect(callback, deps) {
      const index = cursor++;
      if (!hooks[index] || deps.some((value, i) => !Object.is(value, hooks[index][i]))) {
        hooks[index] = deps;
        effects.push(callback);
      }
    },
  };
  const source = readFileSync(`${__dirname}/../client.js`, 'utf8');
  const instrumented = source.replace('      inject,\n      apply,',
    '      inject,\n      apply,\n      RecentSection, zh, en,');
  assert.notEqual(instrumented, source);
  vm.runInNewContext(instrumented, {
    window: { __ModuleLoader__: { load(value) { definition = value; } } }, console,
  });
  const plugin = definition.factory((id) => id === 'react' ? React : { createPortal: (node) => node });
  const props = {
    rows: Array.from({ length: 20 }, (_, index) => ({ id: String(index), title: String(index) })),
    pageSize: 5,
    t: (key, values = {}) => plugin[language][key].replace(/\{(\w+)\}/g, (_, name) => values[name]),
    onArchive(row) { props.rows = props.rows.filter((item) => item.id !== row.id); },
  };
  return {
    props,
    render() {
      let tree;
      let passes = 0;
      do {
        assert.ok(passes++ < 5, 'effects settle');
        cursor = 0;
        dirty = false;
        effects = [];
        tree = plugin.RecentSection(props);
        effects.forEach((effect) => effect());
      } while (dirty);
      return tree;
    },
  };
}

function nodes(node, predicate) {
  if (!node || typeof node !== 'object') return [];
  return [...(predicate(node) ? [node] : []), ...(node.children ?? []).flatMap((child) => nodes(child, predicate))];
}
const text = (node) => typeof node === 'string' ? node : (node?.children ?? []).map(text).join('');
const buttons = (tree) => nodes(tree, (node) => node.type === 'button');
const rows = (tree) => nodes(tree, (node) => node.type.name === 'SessionRow');
const divider = (tree) => nodes(tree, (node) => node.props.className === 'dshUS-pageDivider');
const labels = (tree) => buttons(tree).map(text);
const more = (tree) => buttons(tree).find((button) => button.props.className === 'dshUS-more');
const less = (tree) => buttons(tree).find((button) => button.props.className.includes('dshUS-less'));

test('more counts every remaining session; collapse is available after the first batch', () => {
  const h = harness();
  let tree = h.render();
  assert.equal(rows(tree).length, 5);
  assert.deepEqual(labels(tree), ['展开更多（15）']);
  assert.equal(divider(tree).length, 0);
  more(tree).props.onClick();
  tree = h.render();
  assert.equal(rows(tree).length, 10);
  assert.deepEqual(labels(tree), ['展开更多（10）', '收起']);
  assert.equal(divider(tree).length, 1);
  less(tree).props.onClick();
  tree = h.render();
  assert.equal(rows(tree).length, 5);
  assert.deepEqual(labels(tree), ['展开更多（15）']);
});

test('the final partial batch leaves only collapse, which returns directly to the default count', () => {
  const h = harness();
  h.props.rows = h.props.rows.slice(0, 17);
  let tree = h.render();
  for (const remaining of [12, 7, 2]) {
    assert.equal(text(more(tree)), `展开更多（${remaining}）`);
    more(tree).props.onClick();
    tree = h.render();
  }
  assert.equal(rows(tree).length, 17);
  assert.deepEqual(labels(tree), ['收起']);
  assert.equal(divider(tree).length, 0);
  less(tree).props.onClick();
  assert.equal(rows(h.render()).length, 5);
});

test('archiving a visible session fills its place and updates the remaining count', () => {
  const h = harness();
  more(h.render()).props.onClick();
  let tree = h.render();
  rows(tree)[0].props.actions.find((action) => action.key === 'archive').onClick();
  tree = h.render();
  assert.deepEqual(rows(tree).map((row) => row.props.row.id), Array.from({ length: 10 }, (_, index) => String(index + 1)));
  assert.deepEqual(labels(tree), ['展开更多（9）', '收起']);
});

test('shrinking hides inapplicable actions without discarding the expanded count', () => {
  const h = harness();
  const original = h.props.rows;
  more(h.render()).props.onClick();
  h.props.rows = original.slice(0, 8);
  let tree = h.render();
  assert.equal(rows(tree).length, 8);
  assert.deepEqual(labels(tree), ['收起']);
  for (const count of [5, 3, 0]) {
    h.props.rows = original.slice(0, count);
    tree = h.render();
    assert.equal(rows(tree).length, count);
    assert.deepEqual(labels(tree), []);
    assert.equal(divider(tree).length, 0);
  }
  h.props.rows = original.slice(0, 12);
  tree = h.render();
  assert.equal(rows(tree).length, 10);
  assert.deepEqual(labels(tree), ['展开更多（2）', '收起']);
  less(tree).props.onClick();
  h.props.rows = original;
  assert.equal(rows(h.render()).length, 5);
});

test('header folding preserves paging; a new default count resets it', () => {
  const h = harness();
  more(h.render()).props.onClick();
  let tree = h.render();
  const header = () => nodes(tree, (node) => node.type.name === 'SectionHeader')[0];
  header().props.onToggle();
  tree = h.render();
  assert.equal(rows(tree).length, 0);
  assert.deepEqual(labels(tree), []);
  header().props.onToggle();
  tree = h.render();
  assert.equal(rows(tree).length, 10);
  h.props.pageSize = 3;
  tree = h.render();
  assert.equal(rows(tree).length, 3);
  assert.deepEqual(labels(tree), ['展开更多（17）']);
  more(tree).props.onClick();
  tree = h.render();
  assert.equal(rows(tree).length, 8, 'each batch still adds five');
  less(tree).props.onClick();
  assert.equal(rows(h.render()).length, 3);
});

test('English labels update the remaining count after archiving and collapsing', () => {
  const h = harness('en');
  more(h.render()).props.onClick();
  let tree = h.render();
  assert.deepEqual(labels(tree), ['Show more (10)', 'Show less']);
  assert.equal(more(tree).props.title, 'Show more (10)');
  assert.equal(more(tree).props['aria-label'], 'Show more (10)');
  h.props.onArchive(h.props.rows[0]);
  tree = h.render();
  assert.deepEqual(labels(tree), ['Show more (9)', 'Show less']);
  less(tree).props.onClick();
  tree = h.render();
  assert.deepEqual(labels(tree), ['Show more (14)']);
});
