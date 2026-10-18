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
      unpin: '取消置顶',
      unpinNamed: '取消置顶 {title}',
      openNamed: '打开 {title}',
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
      unpin: 'Unpin',
      unpinNamed: 'Unpin {title}',
      openNamed: 'Open {title}',
      'time.now': 'now',
      'time.minutes': '{n}min',
      'time.hours': '{n}h',
      'time.days': '{n}d',
      'time.months': '{n}mo',
      'time.years': '{n}y',
    };

    /** Stylesheet, scoped to this plugin's own class names. */
    const CSS = [
      '.dshUS-mount{box-sizing:border-box;flex:none;display:flex;flex-direction:column;',
      'padding-right:var(--dsh-session-list-edge-inset,12px);padding-left:4px;margin:0 0 4px -4px}',
      '.dshUS-mount[data-rail="true"]{display:none}',
      '.dshUS-root{box-sizing:border-box;display:flex;flex-direction:column;gap:2px}',
      // The header copies the host's "Workspaces" section header: same box, same
      // 14px/20px label, same tertiary label colour.
      '.dshUS-header{box-sizing:border-box;display:flex;align-items:center;height:36px;',
      'margin-bottom:4px;padding-left:4px;color:var(--dsw-alias-label-tertiary);font-size:14px;',
      'line-height:20px;overflow:hidden;user-select:none}',
      '.dshUS-row{box-sizing:border-box;display:flex;align-items:center;gap:6px;height:32px;',
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
      'font-size:14px;line-height:20px}',
      '.dshUS-time{flex:none;color:var(--dsw-alias-label-tertiary);font-size:10px;line-height:16px}',
      '.dshUS-unpin{flex:none;display:inline-flex;align-items:center;justify-content:center;width:28px;',
      'height:28px;padding:0;border:0;border-radius:var(--dsw-radius-sm,4px);cursor:pointer;',
      'background:0 0;color:var(--dsw-alias-label-caption,currentColor)}',
      '.dshUS-unpin:hover{background:var(--dsw-alias-interactive-bg-hover);',
      'color:var(--dsw-alias-label-primary)}',
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

    /** Normalize a Session activity stamp to epoch milliseconds; absent means oldest. */
    function toMillis(value) {
      if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
      if (typeof value === 'string') {
        const parsed = Date.parse(value);
        return Number.isNaN(parsed) ? 0 : parsed;
      }
      return 0;
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
     * @returns the portal, or null when nothing is pinned.
     */
    function PinnedSection(props) {
      const { host, open, unpin, t, useWorkspaces, useSessions, usePanelInfo } = props;
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

      const rows = React.useMemo(() => {
        const archived = new Set(archivedSessionIds);
        const owners = new Map();
        for (const workspace of workspaces) {
          for (const id of workspace.sessionIds) owners.set(id, workspace.title);
        }
        const byId = sessions.byId;
        const list = [];
        for (const id of pinnedSessionIds) {
          if (archived.has(id)) continue;
          const summary = byId[id];
          if (summary === undefined) continue;
          list.push({
            id,
            title: summary.displayTitle || id,
            workspace: owners.get(id) ?? '',
            updatedAt: toMillis(summary.updatedAt),
          });
        }
        // Last edited first: `updatedAt` is the Session-list activity stamp the
        // Host advances on each user-authored durable message. Ties keep the
        // registry's order (most recently pinned first).
        list.sort((left, right) => right.updatedAt - left.updatedAt);
        return list;
      }, [pinnedSessionIds, archivedSessionIds, workspaces, sessions]);

      if (rows.length === 0) return null;

      const now = Date.now();
      const body = h(
        'section',
        { className: 'dshUS-root', 'aria-label': t('section') },
        h('div', { className: 'dshUS-header' }, h('span', null, t('section'))),
        rows.map((row) =>
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
              onClick: () => open(row.id),
              onKeyDown: (event) => {
                if (event.key !== 'Enter' && event.key !== ' ') return;
                event.preventDefault();
                open(row.id);
              },
            },
            h('span', { className: 'dshUS-title' }, row.title),
            h('span', { className: 'dshUS-time' }, relativeTime(row.updatedAt, now, t)),
            h(
              'button',
              {
                type: 'button',
                className: 'dshUS-unpin',
                'aria-label': t('unpinNamed', { title: row.title }),
                title: t('unpin'),
                onClick: (event) => {
                  event.stopPropagation();
                  unpin(row.id);
                },
                onKeyDown: (event) => {
                  event.stopPropagation();
                },
              },
              h(PinGlyph, { size: 14 }),
            ),
          ),
        ),
      );

      return host === null ? null : createPortal(body, host);
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
          });
          resize.observe(parent);
        }
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
