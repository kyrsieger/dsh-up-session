window.__ModuleLoader__.load({
  id: 'dsh-up-session',
  factory(require) {
    const React = require('react');
    const { createPortal } = require('react-dom');
    const h = React.createElement;

    /** Dictionary namespace owned by this plugin. */
    const NS = 'upSession';
    /** Services required to read pin state, render, and unpin. */
    const inject = ['slots', 'locale', 'uiWorkspace'];

    /** Simplified Chinese dictionary and key source of truth. */
    const zh = {
      section: '置顶',
      expand: '展开置顶会话',
      collapse: '收起置顶会话',
      empty: '无置顶会话',
      unpin: '取消置顶',
      unpinNamed: '取消置顶 {title}',
      archive: '归档会话',
      archiveNamed: '归档 {title}',
      openNamed: '打开 {title}',
      'archiveConfirm.title': '停止并归档此会话？',
      'archiveConfirm.desc':
        '“{title}”仍有正在进行的工作。归档会先停止这些工作并同时取消置顶；之后可在侧栏“全部对话（显示已归档）”中恢复会话，但被停止的工作不会继续，置顶也不会恢复。',
      'archiveConfirm.activity': '将被停止的工作',
      'archiveConfirm.turn': '进行中的回合',
      'archiveConfirm.subagents.one': '{n} 个运行中的子智能体：{names}',
      'archiveConfirm.subagents.other': '{n} 个运行中的子智能体：{names}',
      'archiveConfirm.jobs.one': '{n} 个后台任务：{names}',
      'archiveConfirm.jobs.other': '{n} 个后台任务：{names}',
      'archiveConfirm.schedules.one': '{n} 条定时提醒：{names}',
      'archiveConfirm.schedules.other': '{n} 条定时提醒：{names}',
      'archiveConfirm.other.one': '{n} 项其他工作（{kind}）',
      'archiveConfirm.other.other': '{n} 项其他工作（{kind}）',
      'archiveConfirm.listSeparator': '、',
      'archiveConfirm.action': '停止并归档',
      'archiveConfirm.pending': '正在停止并归档…',
      'archiveConfirm.cancel': '取消',
      'archiveConfirm.close': '关闭',
      'time.now': '刚刚',
      'time.minutes': '{n}分钟',
      'time.hours': '{n}小时',
      'time.days': '{n}天',
      'time.months': '{n}个月',
      'time.years': '{n}年',
    };
    /** English dictionary checked against the Chinese key set. */
    const en = {
      section: 'Pinned',
      expand: 'Expand pinned sessions',
      collapse: 'Collapse pinned sessions',
      empty: 'No pinned sessions',
      unpin: 'Unpin',
      unpinNamed: 'Unpin {title}',
      archive: 'Archive session',
      archiveNamed: 'Archive {title}',
      openNamed: 'Open {title}',
      'archiveConfirm.title': 'Stop and archive this session?',
      'archiveConfirm.desc':
        '“{title}” still has work in progress. Archiving stops it first and also unpins the session; you can restore the session later from the “All conversations (show archived)” filter in the sidebar, but the stopped work will not resume and the pin will not come back.',
      'archiveConfirm.activity': 'Work that will be stopped',
      'archiveConfirm.turn': 'The turn in progress',
      'archiveConfirm.subagents.one': '{n} running subagent: {names}',
      'archiveConfirm.subagents.other': '{n} running subagents: {names}',
      'archiveConfirm.jobs.one': '{n} background job: {names}',
      'archiveConfirm.jobs.other': '{n} background jobs: {names}',
      'archiveConfirm.schedules.one': '{n} scheduled reminder: {names}',
      'archiveConfirm.schedules.other': '{n} scheduled reminders: {names}',
      'archiveConfirm.other.one': '{n} other item of work ({kind})',
      'archiveConfirm.other.other': '{n} other items of work ({kind})',
      'archiveConfirm.listSeparator': ', ',
      'archiveConfirm.action': 'Stop and archive',
      'archiveConfirm.pending': 'Stopping and archiving…',
      'archiveConfirm.cancel': 'Cancel',
      'archiveConfirm.close': 'Close',
      'time.now': 'now',
      'time.minutes': '{n}min',
      'time.hours': '{n}h',
      'time.days': '{n}d',
      'time.months': '{n}mo',
      'time.years': '{n}y',
    };

    /** Stylesheet, scoped to this plugin's own class names. */
    const CSS = [
      // Right edge is measured at runtime from a native session row (see
      // alignToNativeRows): arithmetic on the host's padding chain got this wrong
      // twice, so the section copies the real geometry instead of predicting it.
      '.dshUS-mount{box-sizing:border-box;flex:none;display:flex;flex-direction:column;',
      'padding-left:4px;margin:0 0 4px -4px}',
      '.dshUS-mount[data-rail="true"]{display:none}',
      '.dshUS-root{box-sizing:border-box;display:flex;flex-direction:column;gap:2px}',
      // The header copies the host's "Workspaces" section header: same box, same
      // 14px/20px label, same tertiary label colour. The whole row is the toggle.
      '.dshUS-header{box-sizing:border-box;display:flex;align-items:center;gap:4px;width:100%;',
      'height:36px;margin:0 0 4px;padding:0 4px 0 4px;border:0;background:0 0;font:inherit;',
      'text-align:left;color:var(--dsw-alias-label-tertiary);font-size:14px;line-height:20px;',
      'overflow:hidden;user-select:none;cursor:pointer;border-radius:var(--dsw-radius-sm,4px)}',
      '.dshUS-header:hover{color:var(--dsw-alias-label-secondary)}',
      '.dshUS-header:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid ',
      'var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary,#4d6bfe));outline-offset:-2px}',
      '.dshUS-label{flex:none;min-width:0;overflow:hidden;text-overflow:ellipsis;',
      'white-space:nowrap}',
      // A V-shaped chevron: points down when expanded, back right when collapsed,
      // rotating on the host's own easing curve.
      '.dshUS-arrow{flex:none;display:inline-flex;align-items:center;justify-content:center;',
      'color:var(--dsw-alias-label-caption,currentColor);',
      'transition:transform .15s var(--ds-ease-in-out);transform:rotate(0deg)}',
      '.dshUS-arrow[data-open="false"]{transform:rotate(-90deg)}',
      '@media (prefers-reduced-motion:reduce){.dshUS-arrow{transition:none}}',
      // Row geometry copied from the host's session row: zero gap (the host's
      // row sets `gap:0`), the title's own 4/6px margins around it, and a
      // pin-sized 16x20 trailing box with a 6px lead — the same box the host's
      // own pinned marker occupies.
      '.dshUS-row{box-sizing:border-box;display:flex;align-items:center;gap:0;height:32px;',
      'padding:0 8px;border-radius:var(--dsw-radius-md,8px);cursor:pointer;font:inherit;',
      'font-size:14px;line-height:20px;color:var(--dsw-alias-label-primary);background:0 0;',
      'border:0;text-align:left;width:100%}',
      '.dshUS-row:hover{background:var(--dsw-alias-interactive-bg-hover)}',
      // Matches the sidebar's own selected row (same surface, same label weight).
      '.dshUS-current{background:var(--dsw-alias-interactive-bg-hover);',
      'color:var(--dsw-alias-label-primary)}',
      '.dshUS-row:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid ',
      'var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary,#4d6bfe));outline-offset:-2px}',
      '.dshUS-title{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;',
      'margin:0 6px 0 4px;font-size:14px;line-height:20px}',
      '.dshUS-time{flex:none;margin:0;color:var(--dsw-alias-label-tertiary);font-size:10px;',
      'line-height:16px}',
      // The row's trailing actions sit in one group that swallows clicks, so a
      // button press never also opens the row (the host's rows do the same).
      '.dshUS-actions{flex:none;display:inline-flex;align-items:center;gap:8px;margin-left:6px}',
      // Placeholder that fills the row the section would otherwise not draw.
      // It spans space without any hover surface, so nothing looks clickable:
      // the title keeps the native row's indent and the text stays at the
      // sidebar's tertiary label colour.
      '.dshUS-empty{box-sizing:border-box;display:flex;align-items:center;height:32px;',
      'padding:0 8px;cursor:default}',
      '.dshUS-emptyLabel{flex:1;min-width:0;margin:0 6px 0 4px;overflow:hidden;',
      'text-overflow:ellipsis;white-space:nowrap;font-size:14px;line-height:20px;',
      'color:var(--dsw-alias-label-tertiary)}',
      '.dshUS-action{box-sizing:border-box;flex:none;display:inline-flex;align-items:center;',
      'justify-content:center;width:16px;height:20px;padding:0;border:0;cursor:pointer;',
      'border-radius:var(--dsw-radius-xs,2px);background:0 0;',
      'color:var(--dsw-alias-label-caption,currentColor)}',
      '.dshUS-action:hover{color:var(--dsw-alias-label-primary)}',
      '.dshUS-action:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid ',
      'var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary,#4d6bfe));outline-offset:1px}',
      // Archive stays out of the resting row and appears on hover or once the row
      // holds keyboard focus, the way the host's own session rows reveal their
      // actions. `:focus-within` is what keeps it reachable: the button cannot be
      // tabbed to while `display:none`, and this rule holds it visible from the
      // row's own focus all the way onto the button.
      '.dshUS-action.dshUS-archive{display:none}',
      '.dshUS-row:hover .dshUS-action.dshUS-archive,',
      '.dshUS-row:focus-visible .dshUS-action.dshUS-archive,',
      '.dshUS-row:focus-within .dshUS-action.dshUS-archive{display:inline-flex}',
      // The relative time is what the action replaces, so it goes away under
      // exactly the conditions that bring the action in — the host's session rows
      // drop their time and pin marker on hover for the same reason.
      '.dshUS-row:hover .dshUS-time,',
      '.dshUS-row:focus-visible .dshUS-time,',
      '.dshUS-row:focus-within .dshUS-time{display:none}',
      // A touch surface never hovers, so the action stays visible there and the
      // time stays hidden with it.
      '@media (hover:none){.dshUS-action.dshUS-archive{display:inline-flex}',
      '.dshUS-time{display:none}}',
      // "Stop and archive" confirmation: the host's Modal geometry (380px panel,
      // layer-2 surface, 24px body inset) narrowed to the host's confirmation
      // width, all painted with theme tokens.
      '.dshUS-dialogRoot{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;',
      'justify-content:center;padding:24px}',
      '.dshUS-dialogMask{position:absolute;inset:0;background:var(--dsw-alias-bg-mask-1,rgba(0,0,0,.45))}',
      '.dshUS-dialog{box-sizing:border-box;position:relative;z-index:1;display:flex;',
      'flex-direction:column;gap:20px;width:min(440px,100%);max-height:100%;padding:0 0 24px;',
      'overflow:hidden;border-radius:var(--dsw-radius-lg,8px);background:var(--dsw-alias-bg-layer-2);',
      'box-shadow:var(--dsw-elevation-prominent,0 8px 32px rgba(0,0,0,.24));',
      'animation:dshUS-dialogIn var(--ds-transition-duration,.15s) var(--ds-ease-in-out)}',
      '@keyframes dshUS-dialogIn{0%{opacity:0}to{opacity:1}}',
      '@media (prefers-reduced-motion:reduce){.dshUS-dialog{animation:none}}',
      '.dshUS-dialog:focus{outline:none}',
      '.dshUS-dialogHeader{display:flex;align-items:center;justify-content:space-between;gap:8px;',
      'padding:22px 14px 12px 24px}',
      '.dshUS-dialogTitle{margin:0;font-size:16px;line-height:24px;font-weight:500;',
      'color:var(--dsw-alias-label-primary)}',
      '.dshUS-dialogClose{flex:none;display:inline-flex;align-items:center;justify-content:center;',
      'width:28px;height:28px;border:0;border-radius:var(--dsw-radius-sm,4px);background:0 0;',
      'cursor:pointer;color:var(--dsw-alias-label-secondary)}',
      '.dshUS-dialogClose:hover{background:var(--dsw-alias-interactive-bg-hover)}',
      '.dshUS-dialogBody{display:flex;flex-direction:column;min-width:0;margin-top:12px;',
      'padding:0 24px;max-height:60vh;overflow-y:auto;overscroll-behavior:contain}',
      '.dshUS-dialogDesc{margin:0;font-size:14px;line-height:22px;',
      'color:var(--dsw-alias-label-primary)}',
      '.dshUS-activity{color:var(--dsw-alias-label-primary);margin:0 0 8px;padding-left:18px;',
      'font-size:13px;line-height:20px}',
      '.dshUS-activity li{overflow-wrap:anywhere}',
      '.dshUS-dialogStatus{color:var(--dsw-alias-label-secondary);font-size:12px;line-height:18px}',
      '.dshUS-dialogError{color:var(--dsw-alias-state-error-primary);margin-top:8px;font-size:12px;',
      'line-height:18px}',
      '.dshUS-dialogFooter{display:flex;align-items:center;justify-content:flex-end;gap:8px;',
      'padding:0 24px}',
      '.dshUS-button{box-sizing:border-box;display:inline-flex;align-items:center;',
      'justify-content:center;gap:4px;height:36px;padding:0 14px;border:0;cursor:pointer;',
      'border-radius:var(--dsw-radius-md,8px);font:inherit;font-size:14px;line-height:22px;',
      'color:var(--dsw-alias-label-primary);background:transparent}',
      '.dshUS-button:disabled{cursor:not-allowed;opacity:.4}',
      '.dshUS-buttonOutline{border:.5px solid var(--dsw-alias-border-l3)}',
      '.dshUS-buttonOutline:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover)}',
      '.dshUS-buttonDanger:not(:disabled){color:var(--dsw-alias-state-error-primary)}',
    ].join('');

    /**
     * The host's own pin glyph (the one the session rows use), copied verbatim
     * so the section matches the sidebar without importing a Client package.
     * @param props - square edge in pixels.
     * @returns the filled pin icon.
     */
    function PinGlyph({ size }) {
      return h(
        'svg',
        {
          width: size,
          height: size,
          viewBox: '0 0 16 16',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
          'aria-hidden': 'true',
          strokeWidth: 1,
        },
        h('path', {
          d: 'M9.96976 1.70572L13.1554 3.93629L10.9019 8.12317L11.5158 11.605L10.7192 12.7427L2.52767 7.00693L3.3243 5.86922L6.80612 5.25528L9.96976 1.70572Z',
          fill: 'currentColor',
          stroke: 'currentColor',
          strokeLinejoin: 'round',
        }),
        h('path', {
          d: 'M6.05285 9.47511C6.27284 9.16094 6.70586 9.08458 7.02003 9.30457C7.3342 9.52455 7.41055 9.95757 7.19057 10.2717L3.98587 14.4708L3.21223 13.9291L6.05285 9.47511Z',
          fill: 'currentColor',
        }),
      );
    }

    /**
     * The host's own archive glyph (a lidded box), copied verbatim so the row
     * action reads like the sidebar's own rather than importing a Client package.
     * @param props - square edge in pixels.
     * @returns the outline archive icon.
     */
    function ArchiveGlyph({ size }) {
      return h(
        'svg',
        {
          width: size,
          height: size,
          viewBox: '0 0 16 16',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
          'aria-hidden': 'true',
          strokeWidth: 1,
        },
        h('path', {
          d: 'M13.5 2.5H2.5C1.94772 2.5 1.5 2.94772 1.5 3.5V4.5C1.5 5.05228 1.94772 5.5 2.5 5.5H13.5C14.0523 5.5 14.5 5.05228 14.5 4.5V3.5C14.5 2.94772 14.0523 2.5 13.5 2.5Z',
          stroke: 'currentColor',
        }),
        h('path', {
          d: 'M2.5 5.5V13.5C2.5 13.7652 2.60536 14.0196 2.79289 14.2071C2.98043 14.3946 3.23478 14.5 3.5 14.5H12.5C12.7652 14.5 13.0196 14.3946 13.2071 14.2071C13.3946 14.0196 13.5 13.7652 13.5 13.5V5.5',
          stroke: 'currentColor',
        }),
        h('path', { d: 'M6.5 9.5H9.5', stroke: 'currentColor' }),
      );
    }

    /**
     * The host's modal close glyph, copied for the confirmation dialog.
     * @param props - square edge in pixels.
     * @returns the crossed icon.
     */
    function CloseGlyph({ size }) {
      return h(
        'svg',
        {
          width: size,
          height: size,
          viewBox: '0 0 16 16',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
          'aria-hidden': 'true',
          strokeWidth: 1,
        },
        h('path', { d: 'M3.5 3.5L12.5 12.5', stroke: 'currentColor' }),
        h('path', { d: 'M12.5 3.5L3.5 12.5', stroke: 'currentColor' }),
      );
    }

    /**
     * The host's own V-shaped chevron, copied from the Client artifact so the
     * section matches without importing a Client package.
     * @param props - `open` turns it from pointing down to pointing right.
     * @returns the chevron element.
     */
    function ChevronGlyph({ open }) {
      return h(
        'span',
        { className: 'dshUS-arrow', 'data-open': open ? 'true' : 'false' },
        h(
          'svg',
          {
            width: 14,
            height: 14,
            viewBox: '0 0 16 16',
            fill: 'none',
            xmlns: 'http://www.w3.org/2000/svg',
            'aria-hidden': 'true',
            strokeWidth: 1,
          },
          h('path', {
            d: 'M4 6L7.29289 9.29289C7.68342 9.68342 8.31658 9.68342 8.70711 9.29289L12 6',
            stroke: 'currentColor',
          }),
        ),
      );
    }
    /** Normalize a Session activity stamp to epoch milliseconds; absent means oldest. */
    function toMillis(value) {
      if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
      if (typeof value === 'string') {
        const parsed = Date.parse(value);
        return Number.isNaN(parsed) ? 0 : parsed;
      }
      return 0;
    }

    /** Normalize directory separators the way the sidebar compares Workspace paths. */
    function folderPath(path) {
      const slashed =
        /^[A-Za-z]:[/\\]/.test(path) || path.startsWith('\\\\') ? path.replaceAll('\\', '/') : path;
      return slashed.replace(/\/+$/, '');
    }

    /**
     * The nearest registered Workspace directory that contains `path`, or
     * undefined when no other Workspace holds it. Mirrors the sidebar's own
     * nesting rule: the longest containing registered path, compared
     * case-sensitively and excluding the directory itself.
     * @param path - one Workspace directory.
     * @param paths - every registered Workspace directory.
     * @returns the owning parent directory, if any.
     */
    function nearestAncestorPath(path, paths) {
      const child = folderPath(path);
      let owner;
      let length = -1;
      for (const candidate of paths) {
        const root = folderPath(candidate);
        if (root.length > length && child !== root && child.startsWith(`${root}/`)) {
          owner = candidate;
          length = root.length;
        }
      }
      return owner;
    }

    /**
     * The Workspace groups whose rows lead to `workspaceId` in Workspace Tree
     * grouping: outermost ancestor first, the Workspace itself last. The empty
     * key is the sidebar's "Ungrouped" bucket and has no ancestors. A flat
     * grouped list needs only the Workspace itself, which is what the lookup
     * returns when no other registered path contains it.
     * @param workspaces - the sidebar's Workspace items, in list order.
     * @param workspaceId - the Workspace that owns one pinned Session.
     * @returns the group ids to open, outermost first.
     */
    function workspaceChain(workspaces, workspaceId) {
      if (workspaceId === '') return [''];
      const folders = workspaces.filter((workspace) => typeof workspace.path === 'string');
      const paths = folders.map((workspace) => workspace.path);
      const idByPath = new Map(folders.map((workspace) => [workspace.path, workspace.workspaceId]));
      const chain = [workspaceId];
      let workspace = folders.find((item) => item.workspaceId === workspaceId);
      while (workspace !== undefined) {
        const parentPath = nearestAncestorPath(workspace.path, paths);
        if (parentPath === undefined) break;
        const parentId = idByPath.get(parentPath);
        if (parentId === undefined || chain.includes(parentId)) break;
        chain.unshift(parentId);
        workspace = folders.find((item) => item.workspaceId === parentId);
      }
      return chain;
    }

    /**
     * Expand every collapsed Workspace group on the way to one Workspace, then
     * open the Session. A plugin has no service handle on the sidebar's
     * expansion state, so the plugin drives the host's own group toggle: a
     * group row's click handler is the one the sidebar's header uses, and it
     * both opens the group and saves that choice exactly as a user's click
     * would. The Workspace's own row is always opened; an ancestor is opened
     * only when its descendant row is missing, which is exactly the nested
     * Workspace Tree case — a flat grouped list renders every Workspace, so no
     * unrelated folder is unfolded there. Nothing here touches the selected-row
     * highlight: that stays the sidebar's own `mainView` rendering.
     * @param workspaces - the sidebar's Workspace items, in list order.
     * @param workspaceId - the Workspace that owns the Session being opened.
     */
    function expandWorkspacePath(workspaces, workspaceId) {
      // No known owner means the Workspace list has not been applied yet; the
      // "Ungrouped" bucket would be a guess, so leave the tree alone.
      if (workspaceId === undefined) return;
      const chain = workspaceChain(workspaces, workspaceId);
      if (chain.length === 0) return;
      // Ids are opaque Host values, so rows are matched through `dataset` rather
      // than through a selector assembled from one. No group row at all means
      // the list is not showing a grouped tree (a folded sidebar, the flat
      // "Last updated" view, or search results), so there is nothing to unfold.
      const rowsIn = () =>
        document.querySelectorAll('[data-slot="sidebar.workspaces"] [data-row-key^="workspace:"]');
      const findRow = (key) => {
        for (const row of rowsIn()) {
          if (row instanceof HTMLElement && row.dataset.rowKey === workspaceRowKey(key)) return row;
        }
        return undefined;
      };
      if (rowsIn().length === 0) return;
      // A folded ancestor renders no child rows, so the walk runs outermost
      // first. React commits a discrete click before `dispatchEvent` returns,
      // which makes the children's rows visible to the next lookup; should a
      // host version commit them later, the walk repeats next frame, and each
      // key is clicked at most once so a repeat never folds a group it opened.
      let remaining = chain.length + 1;
      const opened = new Set();
      const pass = () => {
        for (const [index, key] of chain.entries()) {
          if (opened.has(key)) continue;
          const row = findRow(key);
          if (row === undefined || row.getAttribute('aria-expanded') !== 'false') continue;
          const last = index === chain.length - 1;
          const hidesTarget =
            !last && chain.slice(index + 1).some((next) => findRow(next) === undefined);
          if (!last && !hidesTarget) continue;
          opened.add(key);
          row.click();
        }
        const target = chain[chain.length - 1];
        const targetRow = findRow(target);
        const done = targetRow !== undefined && targetRow.getAttribute('aria-expanded') !== 'false';
        if (done || remaining <= 0) return;
        remaining -= 1;
        requestAnimationFrame(pass);
      };
      pass();
    }

    /** The data-row-key value of one Workspace group row. */
    function workspaceRowKey(workspaceId) {
      return `workspace:${workspaceId}`;
    }

    /** Compact relative time of one row's last activity. */
    function relativeTime(value, now, t) {
      const then = toMillis(value);
      if (then === 0) return '';
      const diff = Math.max(0, now - then);
      const minutes = Math.floor(diff / 60000);
      if (minutes < 1) return t('time.now');
      if (minutes < 60) return t('time.minutes', { n: minutes });
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return t('time.hours', { n: hours });
      const days = Math.floor(hours / 24);
      if (days < 30) return t('time.days', { n: days });
      const months = Math.floor(days / 30);
      if (months < 12) return t('time.months', { n: months });
      return t('time.years', { n: Math.floor(months / 12) });
    }

    /**
     * The pinned section body, rendered through a portal into the host node the
     * plugin keeps just above the workspace slot's anchor.
     * @param props - composed slot props plus the injected host and actions.
     * @returns the portal, or null when there is nowhere to portal into.
     */
    function PinnedSection(props) {
      const {
        host,
        open: openSession,
        unpin,
        archive,
        stopAndArchive,
        t,
        useWorkspaces,
        useSessions,
        usePanelInfo,
      } = props;
      const pinnedSessionIds = useWorkspaces((state) => state.pinnedSessionIds);
      const archivedSessionIds = useWorkspaces((state) => state.archivedSessionIds);
      const workspaces = useWorkspaces((state) => state.items);
      const sessions = useSessions((state) => state);
      // The sidebar's own definition of "current session": the one retained by
      // the main view, and only while the Conversation (not a panel) is shown.
      const panelActive = usePanelInfo((info) => info.activePanelId !== null);
      const currentId = panelActive
        ? undefined
        : Object.values(sessions.byId).find((session) => (session.retainedBy?.mainView ?? 0) > 0)?.id;
      // Expanded by default; the choice lasts for this mount. Nothing is
      // persisted, so a reload returns to the default and no stale collapse can
      // hide the section without the user knowing why.
      const [expanded, setExpanded] = React.useState(true);
      // The archive confirm request: `null` until the Host refuses an archive
      // because the Session still has running work. It lives at the section
      // root because the row that raised it may unmount (a sibling archive
      // changes the pin set) while the question is still open.
      const [archiveRequest, setArchiveRequest] = React.useState(null);
      const toggleExpanded = () => setExpanded((value) => !value);
      // Opening a row first opens the Workspace that owns it, so the Session
      // the sidebar marks as current is actually on screen. The open call is
      // unchanged, so the section keeps its own `dshUS-current` highlight and
      // the sidebar keeps its native selected row.
      const openRow = (row) => {
        expandWorkspacePath(workspaces, row.workspaceId);
        openSession(row.id);
      };

      const rows = React.useMemo(() => {
        const archived = new Set(archivedSessionIds);
        const owners = new Map();
        for (const workspace of workspaces) {
          for (const id of workspace.sessionIds) owners.set(id, workspace);
        }
        const byId = sessions.byId;
        const list = [];
        for (const id of pinnedSessionIds) {
          if (archived.has(id)) continue;
          const summary = byId[id];
          if (summary === undefined) continue;
          const owner = owners.get(id);
          list.push({
            id,
            title: summary.displayTitle || id,
            workspace: owner?.title ?? '',
            // A known owner names its Workspace; once the list has loaded, a
            // Session no Workspace accounts for sits in the "Ungrouped" bucket
            // (`''`). Before that, leave it unknown so nothing is guessed.
            workspaceId: owner?.workspaceId ?? (workspaces.length === 0 ? undefined : ''),
            updatedAt: toMillis(summary.updatedAt),
          });
        }
        // Last edited first: `updatedAt` is the Session-list activity stamp the
        // Host advances on each user-authored durable message. Ties keep the
        // registry's order (most recently pinned first).
        list.sort((left, right) => right.updatedAt - left.updatedAt);
        return list;
      }, [pinnedSessionIds, archivedSessionIds, workspaces, sessions]);

      // The section stays put with nothing pinned: an empty pin set renders a
      // placeholder row instead of hiding the whole section, so the header never
      // moves around as pins come and go. A pending confirmation still has to be
      // answerable while that placeholder shows (it portals to the frame, not to
      // the section node).
      const dialog = h(ArchiveConfirmDialog, {
        request: archiveRequest,
        stopAndArchive,
        onSettle: () => setArchiveRequest(null),
        t,
      });

      const now = Date.now();
      const body = h(
        'section',
        { className: 'dshUS-root', 'aria-label': t('section') },
        h(
          'button',
          {
            type: 'button',
            className: 'dshUS-header',
            'aria-expanded': expanded,
            'aria-label': expanded ? t('collapse') : t('expand'),
            title: expanded ? t('collapse') : t('expand'),
            onClick: toggleExpanded,
          },
          h('span', { className: 'dshUS-label' }, t('section')),
          h(ChevronGlyph, { open: expanded }),
        ),
        expanded &&
          (rows.length === 0
            ? h(
                'div',
                { className: 'dshUS-empty' },
                h('span', { className: 'dshUS-emptyLabel' }, t('empty')),
              )
            : rows.map((row) =>
                h(
                  'div',
                  {
                    key: row.id,
                    className: row.id === currentId ? 'dshUS-row dshUS-current' : 'dshUS-row',
                    role: 'button',
                    tabIndex: 0,
                    'aria-current': row.id === currentId ? 'true' : undefined,
                    title: row.workspace === '' ? row.title : `${row.title} · ${row.workspace}`,
                    'aria-label': t('openNamed', { title: row.title }),
                    onClick: () => openRow(row),
                    onKeyDown: (event) => {
                      if (event.key !== 'Enter' && event.key !== ' ') return;
                      event.preventDefault();
                      openRow(row);
                    },
                  },
                  h('span', { className: 'dshUS-title' }, row.title),
                  h('span', { className: 'dshUS-time' }, relativeTime(row.updatedAt, now, t)),
                  h(
                    'span',
                    {
                      className: 'dshUS-actions',
                      onClick: (event) => {
                        event.stopPropagation();
                      },
                      onKeyDown: (event) => {
                        event.stopPropagation();
                      },
                    },
                    h(
                      'button',
                      {
                        type: 'button',
                        className: 'dshUS-action dshUS-archive',
                        'aria-label': t('archiveNamed', { title: row.title }),
                        title: t('archive'),
                        onClick: () => {
                          archive(row.id)
                            .then((result) => {
                              if (!result.refused) return;
                              setArchiveRequest({
                                sessionId: row.id,
                                title: row.title,
                                activity: result.activity,
                              });
                            })
                            .catch((reason) => {
                              console.warn('session archive rejected:', reason);
                            });
                        },
                      },
                      h(ArchiveGlyph, { size: 14 }),
                    ),
                    h(
                      'button',
                      {
                        type: 'button',
                        className: 'dshUS-action',
                        'aria-label': t('unpinNamed', { title: row.title }),
                        title: t('unpin'),
                        onClick: () => unpin(row.id),
                      },
                      h(PinGlyph, { size: 14 }),
                    ),
                  ),
                ),
              )),
        dialog,
      );

      return host === null ? null : createPortal(body, host);
    }

    /**
     * One line of the confirmation list: the family's count and the items it
     * names. A family this dictionary does not know falls through to the
     * generic line, because the Host merges provider-supplied kinds.
     * @param entry - one activity family with its items.
     * @param t - the plugin's translator.
     * @returns the list item text.
     */
    function activityLine(entry, t) {
      const items = entry.items ?? [];
      const n = items.length;
      const names = items.map((item) => item.label ?? item.id).join(t('archiveConfirm.listSeparator'));
      const plural = n === 1 ? 'one' : 'other';
      switch (entry.kind) {
        case 'turn':
          return t('archiveConfirm.turn');
        case 'subagent':
          return t(`archiveConfirm.subagents.${plural}`, { n, names });
        case 'job':
          return t(`archiveConfirm.jobs.${plural}`, { n, names });
        case 'schedule':
          return t(`archiveConfirm.schedules.${plural}`, { n, names });
        default:
          return t(`archiveConfirm.other.${plural}`, { kind: entry.kind, n });
      }
    }

    /**
     * The host's "Stop and archive" confirmation, rebuilt here: an archive the
     * Host refused because work is still running asks once, lists that work,
     * and only the explicit confirm asks the Host to stop it and archive.
     * @param props - the pending request, the stop-and-archive hop, settlement, and the translator.
     * @returns the dialog, or null while nothing is pending.
     */
    function ArchiveConfirmDialog({ request, stopAndArchive, onSettle, t }) {
      if (request === null) return null;
      // The dialog leaves the sidebar column: the section's own node is inside a
      // scrolling, clipping column, so a frame-wide modal renders on the body.
      // `key` restates the request identity on the element (React.createElement
      // takes keys through props, not a trailing argument), so answering one
      // question never reuses another Session's in-flight/error state.
      return createPortal(
        h(ArchiveConfirmForm, {
          key: request.sessionId,
          request,
          stopAndArchive,
          onSettle,
          t,
        }),
        document.body,
      );
    }

    /** One request's dialog; in-flight and error state die with the request. */
    function ArchiveConfirmForm({ request, stopAndArchive, onSettle, t }) {
      const [archiving, setArchiving] = React.useState(false);
      const [error, setError] = React.useState(null);
      const dialog = React.useRef(null);
      // Escape closes the dialog, but never while the Host call is in flight, so
      // the listener reads the latest state through a ref instead of capturing
      // the first render's closure.
      const archivingRef = React.useRef(archiving);
      archivingRef.current = archiving;
      const settle = React.useRef(onSettle);
      settle.current = onSettle;
      // Focus moves into the dialog on open (the host's Modal does the same), so
      // Escape acts on it instead of the sidebar behind the mask.
      React.useEffect(() => {
        dialog.current?.focus();
      }, []);
      React.useEffect(() => {
        const onKeyDown = (event) => {
          if (event.key !== 'Escape') return;
          event.preventDefault();
          if (archivingRef.current) return;
          settle.current();
        };
        document.addEventListener('keydown', onKeyDown, true);
        return () => {
          document.removeEventListener('keydown', onKeyDown, true);
        };
      }, []);
      const close = () => {
        if (archiving) return;
        onSettle();
      };
      const confirm = () => {
        setArchiving(true);
        setError(null);
        stopAndArchive(request.sessionId)
          .then(() => {
            setArchiving(false);
            onSettle();
          })
          .catch((reason) => {
            setArchiving(false);
            setError(reason instanceof Error ? reason.message : String(reason));
          });
      };
      return h(
        'div',
        { className: 'dshUS-dialogRoot', role: 'presentation' },
        h('div', { className: 'dshUS-dialogMask', 'aria-hidden': 'true', onClick: close }),
        h(
          'div',
          {
            ref: dialog,
            tabIndex: -1,
            className: 'dshUS-dialog',
            role: 'dialog',
            'aria-modal': 'true',
            'aria-label': t('archiveConfirm.title'),
          },
          h(
            'div',
            { className: 'dshUS-dialogHeader' },
            h('h2', { className: 'dshUS-dialogTitle' }, t('archiveConfirm.title')),
            h(
              'button',
              {
                type: 'button',
                className: 'dshUS-dialogClose',
                'aria-label': t('archiveConfirm.close'),
                onClick: close,
              },
              h(CloseGlyph, { size: 14 }),
            ),
          ),
          h(
            'div',
            { className: 'dshUS-dialogBody' },
            h(
              'p',
              { className: 'dshUS-dialogDesc' },
              t('archiveConfirm.desc', { title: request.title }),
            ),
            h(
              'ul',
              { className: 'dshUS-activity', 'aria-label': t('archiveConfirm.activity') },
              request.activity.map((entry, index) =>
                h('li', { key: `${entry.kind}-${String(index)}` }, activityLine(entry, t)),
              ),
            ),
            archiving &&
              h(
                'div',
                { className: 'dshUS-dialogStatus', role: 'status' },
                t('archiveConfirm.pending'),
              ),
            error !== null &&
              h('div', { className: 'dshUS-dialogError', role: 'alert' }, error),
          ),
          h(
            'div',
            { className: 'dshUS-dialogFooter' },
            h(
              'button',
              {
                type: 'button',
                className: 'dshUS-button dshUS-buttonOutline',
                disabled: archiving,
                onClick: close,
              },
              t('archiveConfirm.cancel'),
            ),
            h(
              'button',
              {
                type: 'button',
                className: 'dshUS-button dshUS-buttonOutline dshUS-buttonDanger',
                disabled: archiving,
                onClick: confirm,
              },
              t('archiveConfirm.action'),
            ),
          ),
        ),
      );
    }

    /** Insert the stylesheet once per plugin generation and remove it on unload. */
    function mountStyle(ctx) {
      const tagId = 'dsh-up-session/PinnedSection.css';
      ctx.effect(() => {
        if (document.querySelector(`style[data-plugin-css="${tagId}"]`) !== null) return () => {};
        const tag = document.createElement('style');
        tag.dataset.plugin = 'dsh-up-session';
        tag.dataset.pluginCss = tagId;
        tag.textContent = CSS;
        document.head.appendChild(tag);
        return () => {
          tag.remove();
        };
      }, 'up-session: stylesheet');
    }

    /**
     * Copy the right edge of a native session row onto the section, so the two
     * stop on the same line without predicting the host's padding chain (which
     * arithmetic got wrong twice). Measured, not assumed.
     * @param host - the section's mount node.
     */
    function alignToNativeRows(host) {
      const row = document.querySelector('[data-slot="sidebar.workspaces"] [data-row-key^="session:"]');
      if (!(row instanceof Element)) return;
      const rowRect = row.getBoundingClientRect();
      const hostRect = host.getBoundingClientRect();
      if (rowRect.width <= 0 || hostRect.width <= 0) return;
      const style = getComputedStyle(host);
      const leftPad = parseFloat(style.paddingLeft) || 0;
      // Width the host's rows would need to end exactly where the native row ends.
      const needed = rowRect.right - hostRect.left - leftPad;
      if (!Number.isFinite(needed) || needed < 0) return;
      // Solve the padding that leaves exactly that width for the rows.
      const padding = Math.max(0, host.clientWidth - leftPad - needed);
      if (Math.abs(padding - (parseFloat(style.paddingRight) || 0)) < 0.5) return;
      host.style.paddingRight = `${padding}px`;
    }

    /**
     * The activity a Host `workspace/session-active` refusal reported, or nothing
     * for any other failure. The class identity check goes by name, because a
     * Client plugin bundle does not share the host package's error-class identity.
     * @param reason - the rejection of a plain archive attempt.
     * @returns the activity families, or undefined when this was some other failure.
     */
    function activeSessionRefusal(reason) {
      if (!(reason instanceof Error) || reason.name !== 'WorkspaceArchiveError') return undefined;
      const { rpcError } = reason;
      return rpcError?.code === 'workspace/session-active' ? rpcError.details?.activity : undefined;
    }

    /**
     * Keep the host node immediately before the workspace slot's anchor. The
     * workspaces seat lives in the sidebar's column flex container, so a sibling
     * inserted there takes its own space and pushes the browser down instead of
     * covering it. Hiding in the collapsed rail mirrors the shell's own rule.
     * @param host - the container the portal renders into.
     * @returns the disposer that detaches the node and its observers.
     */
    function mountHost(host) {
      let frame = 0;
      let resize;

      const place = () => {
        const anchor = document.querySelector('[data-slot="sidebar.workspaces"]');
        if (!(anchor instanceof Element)) return;
        const parent = anchor.parentElement;
        if (parent === null) return;
        if (host.parentElement !== parent || host.nextElementSibling !== anchor) {
          parent.insertBefore(host, anchor);
        }
        if (resize === undefined) {
          // The seat spans the sidebar's inner width, which is narrower than the
          // column by its inline padding; the rail seat is far narrower still.
          resize = new ResizeObserver((entries) => {
            const width = entries[0]?.contentRect.width ?? 0;
            host.dataset.rail = width < 200 ? 'true' : 'false';
            alignToNativeRows(host);
          });
          resize.observe(parent);
        }
        alignToNativeRows(host);
      };

      const schedule = () => {
        if (frame !== 0) return;
        frame = requestAnimationFrame(() => {
          frame = 0;
          place();
        });
      };

      place();
      const observer = new MutationObserver(schedule);
      observer.observe(document.documentElement, { childList: true, subtree: true });

      return () => {
        observer.disconnect();
        resize?.disconnect();
        if (frame !== 0) cancelAnimationFrame(frame);
        host.remove();
      };
    }

    /** Contribute the pinned section above the workspace list. */
    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'up-session: dictionaries');
      const t = ctx.locale.bind(NS);
      mountStyle(ctx);

      // The portal host is created with the plugin and removed by its effect, so
      // a reload never leaves an orphan node in the sidebar.
      const host = document.createElement('div');
      host.dataset.dshUpSession = '';
      host.className = 'dshUS-mount';
      ctx.effect(() => mountHost(host), 'up-session: sidebar section host');

      const injected = () => ({
        host,
        open: (sessionId) => {
          ctx.uiWorkspace.openSession(sessionId);
        },
        unpin: (sessionId) => {
          ctx.uiWorkspace.unpinSession(sessionId).catch((reason) => {
            console.warn('session unpin rejected:', reason);
          });
        },
        // Mirrors the sidebar's own archive action: try plainly first, and only
        // the Host's "still running" refusal (workspace/session-active, whose
        // details list that work) is reported back so the row can raise the
        // confirmation. Anything else is a real failure and stays in the log.
        archive: async (sessionId) => {
          try {
            await ctx.uiWorkspace.archiveSession(sessionId);
            return { refused: false };
          } catch (reason) {
            const activity = activeSessionRefusal(reason);
            if (activity === undefined) {
              console.warn('session archive rejected:', reason);
              return { refused: false };
            }
            return { refused: true, activity };
          }
        },
        stopAndArchive: (sessionId) => ctx.uiWorkspace.archiveSession(sessionId, { stopActivity: true }),
      });

      ctx.slots.inject('shell.overlay', () =>
        ctx.slots.register(
          {
            name: 'shell.overlay',
            id: 'dsh-up-session',
            locale: NS,
            inject: injected,
          },
          PinnedSection,
        ),
      );
    }

    return {
      inject,
      apply,
    };
  },
});
