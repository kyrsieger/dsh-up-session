const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const vm = require('node:vm');

function harness({ modern = true, search = false } = {}) {
  let notify = () => {};
  let definition;
  let modalOpen = true;
  let longList = false;
  let mutations = 0;
  const frames = new Map();
  let frameId = 0;
  class Element {
    constructor(attributes = {}, overflowY = 'visible') {
      this.attributes = attributes;
      this.overflowY = overflowY;
      this.children = [];
      this.parentElement = null;
      this.dataset = {};
    }
    matches(selector) {
      if (selector === '[role="tree"]') return this.attributes.role === 'tree';
      if (selector === '[data-sidebar-list-area]') return this.attributes.listArea;
      return false;
    }
    querySelector(selector) {
      for (const child of this.children) {
        if (child.matches(selector)) return child;
        const found = child.querySelector(selector);
        if (found) return found;
      }
      return null;
    }
    closest(selector) {
      for (let node = this; node; node = node.parentElement) {
        if (node.matches(selector)) return node;
      }
      return null;
    }
    contains(node) {
      for (; node; node = node.parentElement) if (node === this) return true;
      return false;
    }
    get firstChild() { return this.children[0] ?? null; }
    get firstElementChild() { return this.firstChild; }
    insertBefore(node, before) {
      node.remove();
      this.children.splice(before ? this.children.indexOf(before) : this.children.length, 0, node);
      node.parentElement = this;
      mutations++;
      notify();
    }
    remove() {
      if (!this.parentElement) return;
      const parent = this.parentElement;
      parent.children.splice(parent.children.indexOf(this), 1);
      this.parentElement = null;
      mutations++;
      notify();
    }
  }
  const shell = new Element();
  const anchor = new Element();
  const area = new Element({ listArea: modern }, modern || search ? 'auto' : 'visible');
  const tree = new Element({ role: 'tree' }, modern || search ? 'visible' : 'auto');
  const host = new Element();
  shell.insertBefore(anchor, null);
  anchor.insertBefore(area, null);
  area.insertBefore(tree, null);
  const source = readFileSync(`${__dirname}/../client.js`, 'utf8');
  const instrumented = source.replace('      inject,\n      apply,',
    '      inject,\n      apply,\n      workspaceScrollBox, mountHost,');
  assert.notEqual(source, instrumented);
  vm.runInNewContext(instrumented, {
    window: { __ModuleLoader__: { load(value) { definition = value; } } },
    Element, HTMLInputElement: class extends Element {},
    document: {
      documentElement: shell,
      querySelector: (selector) => selector === '[data-slot="sidebar.workspaces"]' ? anchor : null,
    },
    getComputedStyle(node) {
      // rc.2 changes overflow when the longer plugin list makes the outer
      // sidebar scrollable. Removing the plugin restores the previous style.
      return { overflowY: node === area && modern && !modalOpen && longList && area.contains(host)
        ? 'hidden' : node.overflowY };
    },
    MutationObserver: class {
      constructor(callback) { this.callback = callback; }
      observe() { notify = this.callback; }
      disconnect() { notify = () => {}; }
    },
    ResizeObserver: class { observe() {} disconnect() {} },
    requestAnimationFrame(callback) { frames.set(++frameId, callback); return frameId; },
    cancelAnimationFrame(id) { frames.delete(id); },
  });
  const plugin = definition.factory(() => ({}));
  return {
    plugin, anchor, area, tree, host, frames,
    mutations: () => mutations,
    disableTimeFilter() { longList = true; notify(); },
    closeSettings() { modalOpen = false; notify(); },
    flush() {
      let count = 0;
      while (frames.size) {
        assert.ok(++count <= 10, 'sidebar must settle instead of repeatedly removing and inserting sections');
        const callbacks = [...frames.values()];
        frames.clear();
        callbacks.forEach((callback) => callback());
      }
    },
  };
}

test('rc.2 keeps sections mounted when closing settings changes the long list overflow to hidden', () => {
  const h = harness();
  const dispose = h.plugin.mountHost(h.host);
  assert.equal(h.host.parentElement, h.area);
  h.disableTimeFilter();
  h.flush();
  const mutations = h.mutations();
  h.closeSettings();
  h.flush();
  assert.equal(h.host.parentElement, h.area);
  assert.equal(h.area.firstElementChild, h.host);
  assert.equal(h.mutations(), mutations, 'closing settings must not detach the sections');
  dispose();
  assert.equal(h.host.parentElement, null);
  assert.equal(h.frames.size, 0);
});

test('older grouped and flat lists still mount inside the scrolling tree', () => {
  const h = harness({ modern: false });
  assert.equal(h.plugin.workspaceScrollBox(h.anchor), h.tree);
});

test('older search results still use the scrolling ancestor', () => {
  const h = harness({ modern: false, search: true });
  assert.equal(h.plugin.workspaceScrollBox(h.anchor), h.area);
});

test('replacing the native tree remounts sections and removing the list detaches them', () => {
  const h = harness();
  const dispose = h.plugin.mountHost(h.host);
  h.host.remove();
  h.flush();
  assert.equal(h.area.firstElementChild, h.host);
  h.tree.remove();
  h.flush();
  assert.equal(h.host.parentElement, null);
  dispose();
});
