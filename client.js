window.__ModuleLoader__.load({
  id: 'dsh-up-session',
  factory(require) {
    const React = require('react');
    const { createPortal } = require('react-dom');
    const h = React.createElement;

    /** Dictionary namespace owned by this plugin. */
    const NS = 'upSession';
    /** Services required to read pin state, render, pin, unpin, archive, and open the host session menu. */
    const inject = ['slots', 'locale', 'uiWorkspace', 'contextMenus'];

    /** Simplified Chinese dictionary and key source of truth. */
    const zh = {
      section: '置顶',
      recent: '最近',
      expand: '展开置顶会话',
      collapse: '收起置顶会话',
      recentExpand: '展开最近会话',
      recentCollapse: '收起最近会话',
      empty: '无置顶会话',
      recentEmpty: '无最近会话',
      showMore: '展开更多',
      showLess: '收起',
      settings: '设置',
      settingsTitle: '设置',
      settingsOpen: '打开设置',
      settingsEntryDesc: '管理列表显示、最近区展示数量和打开会话时的工作区展开行为。',
      settingsClose: '关闭设置',
      settingsShowPinned: '显示置顶',
      settingsShowPinnedDesc: '在侧边栏显示置顶会话列表。',
      settingsShowRecent: '显示最近',
      settingsShowRecentDesc: '在侧边栏显示最近会话列表。',
      settingsRecentPageSize: '最近区默认展示的会话数',
      settingsRecentPageSizeDesc:
        '「最近」默认显示最新的多少条会话；「展开更多」每次增加 5 条，「收起」回到这个数量。可填 1–50，默认 5。',
      settingsPageSizeIncrease: '增加 1',
      settingsPageSizeDecrease: '减少 1',
      settingsExpandWorkspace: '展开工作区中的原会话',
      settingsExpandWorkspaceDesc:
        '从置顶或最近区打开会话时，同时展开它在工作区列表中的位置。关闭后只打开会话，不改变工作区的展开状态。',
      untitled: '未命名',
      pin: '置顶',
      pinned: '已置顶',
      pinNamed: '置顶 {title}',
      unpin: '取消置顶',
      unpinNamed: '取消置顶 {title}',
      archive: '归档会话',
      archiveNamed: '归档 {title}',
      mute: '从最近隐藏',
      muteNamed: '从最近隐藏 {title}',
      mutedRestore: '恢复',
      mutedRestoreDesc:
        '点击「恢复」，可将所有已隐藏的会话重新显示在「最近」区；向某条已隐藏的会话发送新消息后，该会话也会自动重新显示。',
      settingsMuted: '已隐藏的会话',
      settingsMutedDesc: '从「最近」隐藏、但仍留在各自工作区里的会话。',
      mutedNone: '没有被隐藏的会话',
      mutedCount: '已隐藏 {n} 条会话。',
      openNamed: '打开 {title}',
      revealOriginal: '在原位置显示',
      openNamedStatus: '打开 {title}（{status}）',
      'hover.ungrouped': '未分组',
      'status.running': '进行中',
      'status.completed': '已完成',
      'status.idle': '空闲',
      'status.waitingApproval': '等待审批',
      'status.planReview': '计划待审',
      'status.waitingAnswer': '等待回答',
      'status.subagents.one': '{n} 个子智能体运行中',
      'status.subagents.other': '{n} 个子智能体运行中',
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
      'time.ago': '{t}前',
    };
    /** English dictionary checked against the Chinese key set. */
    const en = {
      section: 'Pinned',
      recent: 'Recent',
      expand: 'Expand pinned sessions',
      collapse: 'Collapse pinned sessions',
      recentExpand: 'Expand recent sessions',
      recentCollapse: 'Collapse recent sessions',
      empty: 'No pinned sessions',
      recentEmpty: 'No recent sessions',
      showMore: 'Show more',
      showLess: 'Show less',
      settings: 'Settings',
      settingsTitle: 'Settings',
      settingsOpen: 'Open settings',
      settingsEntryDesc:
        'Manage list visibility, how many sessions Recent shows, and workspace expansion when opening sessions.',
      settingsClose: 'Close settings',
      settingsShowPinned: 'Show Pinned',
      settingsShowPinnedDesc: 'Show the pinned session list in the sidebar.',
      settingsShowRecent: 'Show Recent',
      settingsShowRecentDesc: 'Show the recent session list in the sidebar.',
      settingsRecentPageSize: 'Sessions shown in Recent',
      settingsRecentPageSizeDesc:
        'How many recent sessions to show by default. “Show more” adds five each time and “Show less” folds the list back to it; accepts 1–50, five by default.',
      settingsPageSizeIncrease: 'Increase by 1',
      settingsPageSizeDecrease: 'Decrease by 1',
      settingsExpandWorkspace: 'Reveal the session in its workspace',
      settingsExpandWorkspaceDesc:
        'When you open a session from Pinned or Recent, also expand its workspace in the sidebar. Turn this off to open the session without changing which workspaces are expanded.',
      untitled: 'Untitled',
      pin: 'Pin',
      pinned: 'Pinned',
      pinNamed: 'Pin {title}',
      unpin: 'Unpin',
      unpinNamed: 'Unpin {title}',
      archive: 'Archive session',
      archiveNamed: 'Archive {title}',
      mute: 'Hide from Recent',
      muteNamed: 'Hide {title} from Recent',
      mutedRestore: 'Restore',
      mutedRestoreDesc:
        'Click “Restore” to show all hidden sessions in Recent again. Sending a new message to a hidden session also makes that session reappear automatically.',
      settingsMuted: 'Hidden sessions',
      settingsMutedDesc: 'Sessions hidden from Recent; they stay in their workspaces.',
      mutedNone: 'Nothing has been hidden',
      mutedCount: 'Hidden sessions: {n}.',
      openNamed: 'Open {title}',
      revealOriginal: 'Show in original location',
      openNamedStatus: 'Open {title} ({status})',
      'hover.ungrouped': 'Ungrouped',
      'status.running': 'Running',
      'status.completed': 'Completed',
      'status.idle': 'Idle',
      'status.waitingApproval': 'Waiting for approval',
      'status.planReview': 'Plan awaiting review',
      'status.waitingAnswer': 'Waiting for answer',
      'status.subagents.one': '{n} subagent running',
      'status.subagents.other': '{n} subagents running',
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
      'time.ago': '{t} ago',
    };

    /** Stylesheet, scoped to this plugin's own class names. */
    const CSS = [
      // An inset shadow tints the background below the row's content without
      // replacing the host's selected/hover background or changing its layout.
      // Resolve the theme token in CSS, so theme changes also affect an active pulse.
      // Fade in for 0.6s, hold peak intensity for 1.2s, then fade out for 1.2s.
      '[data-dsh-up-session-reveal]{animation:dshUS-revealOriginal 3s ease-in-out}',
      '@keyframes dshUS-revealOriginal{',
      '0%,100%{box-shadow:inset 0 0 0 100vmax color-mix(in srgb,var(--dsw-alias-brand-primary) 0%,transparent)}',
      '20%,60%{box-shadow:inset 0 0 0 100vmax color-mix(in srgb,var(--dsw-alias-brand-primary) 20%,transparent)}}',
      // Right edge is measured at runtime from a native session row (see
      // alignToNativeRows): arithmetic on the host's padding chain got this wrong
      // twice, so the section copies the real geometry instead of predicting it.
      '.dshUS-mount{box-sizing:border-box;flex:none;display:flex;flex-direction:column;gap:4px;',
      'padding-left:4px;margin:0 0 4px -4px}',
      '.dshUS-mount[data-rail="true"],.dshUS-mount[data-searching="true"]{display:none}',
      '.dshUS-root{box-sizing:border-box;display:flex;flex-direction:column;gap:2px;',
      '--dshUS-status-width:16px}',
      // The header copies the host's "Workspaces" section header: same box, same
      // 14px/20px label, same tertiary label colour. The whole row is the toggle,
      // and the settings entry floats over its right edge without taking space,
      // so revealing it on hover never shifts the label or the chevron.
      '.dshUS-headerRow{box-sizing:border-box;position:relative;display:flex;align-items:center;',
      'height:36px;margin:0 0 4px}',
      '.dshUS-header{box-sizing:border-box;display:flex;align-items:center;gap:4px;width:100%;',
      // The mount's left edge matches the native header's. DSH uses the sidebar
      // row padding for that header and shifts its label 1px back to the left.
      'height:100%;margin:0;padding:0 4px 0 calc(var(--dsh-sidebar-row-padding,5px) - 1px);',
      'border:0;background:0 0;font:inherit;',
      'text-align:left;color:var(--dsw-alias-label-tertiary);font-size:14px;line-height:20px;',
      'overflow:hidden;user-select:none;cursor:pointer;border-radius:var(--dsw-radius-sm,4px)}',
      '.dshUS-header:hover,',
      '.dshUS-headerRow:hover .dshUS-header{color:var(--dsw-alias-label-secondary)}',
      '.dshUS-header:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid ',
      'var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary,#4d6bfe));outline-offset:-2px}',
      // The section's settings entry: the host's own gear, kept out of the way
      // until the header row is hovered or holds keyboard focus. It floats over
      // the header's empty right side, so the header keeps its full hit area and
      // nothing reflows when it appears. A touch surface never hovers, so there
      // it stays visible, exactly as the row actions do.
      '.dshUS-settingsButton{box-sizing:border-box;position:absolute;top:50%;right:4px;',
      'z-index:1;transform:translateY(-50%);display:inline-flex;align-items:center;justify-content:center;',
      'width:24px;height:24px;padding:0;border:0;border-radius:var(--dsw-radius-sm,4px);',
      'background:0 0;cursor:pointer;color:var(--dsw-alias-label-tertiary);',
      'visibility:hidden;opacity:0;transition:opacity .12s var(--ds-ease-in-out)}',
      '.dshUS-headerRow:hover .dshUS-settingsButton,',
      '.dshUS-header:focus-visible + .dshUS-settingsButton,',
      '.dshUS-settingsButton:focus-visible{visibility:visible;opacity:1}',
      '.dshUS-settingsButton:hover{background:var(--dsw-alias-interactive-bg-hover);',
      'color:var(--dsw-alias-label-primary)}',
      '.dshUS-settingsButton:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid ',
      'var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary,#4d6bfe));outline-offset:1px}',
      '@media (prefers-reduced-motion:reduce){.dshUS-settingsButton{transition:none}}',
      '@media (hover:none){.dshUS-settingsButton{visibility:visible;opacity:1}}',
      '.dshUS-label{flex:none;min-width:0;overflow:hidden;text-overflow:ellipsis;',
      'white-space:nowrap}',
      // A V-shaped chevron: points down when expanded, back right when collapsed,
      // rotating on the host's own easing curve.
      '.dshUS-arrow{flex:none;display:inline-flex;align-items:center;justify-content:center;',
      'color:var(--dsw-alias-label-caption,currentColor);',
      'transition:transform .15s var(--ds-ease-in-out);transform:rotate(0deg)}',
      '.dshUS-arrow[data-open="false"]{transform:rotate(-90deg)}',
      '@media (prefers-reduced-motion:reduce){.dshUS-arrow{transition:none}}',
      // Like a top-level native session row, the title starts after the sidebar
      // row inset, a reserved status slot, and the sidebar label gap.
      '.dshUS-row{box-sizing:border-box;display:flex;align-items:center;gap:0;height:32px;',
      'padding:0 8px 0 var(--dsh-sidebar-row-padding,12px);',
      'border-radius:var(--dsw-radius-md,8px);cursor:pointer;font:inherit;',
      'font-size:14px;line-height:20px;color:var(--dsw-alias-label-primary);background:0 0;',
      'border:0;text-align:left;width:100%}',
      '.dshUS-row:hover{background:var(--dsw-alias-interactive-bg-hover)}',
      // Matches the sidebar's own selected row (same surface, same label weight).
      '.dshUS-current,.dshUS-menuOpen{background:var(--dsw-alias-interactive-bg-hover);',
      'color:var(--dsw-alias-label-primary)}',
      '.dshUS-row:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid ',
      'var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary,#4d6bfe));outline-offset:-2px}',
      '.dshUS-title{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;',
      'margin:0 6px 0 var(--dsh-sidebar-label-gap,6px);font-size:14px;line-height:20px}',
      // Reserve the same space on idle rows so the title stays put as status changes.
      '.dshUS-status{flex:none;display:inline-flex;align-items:center;justify-content:center;',
      'width:var(--dshUS-status-width);height:20px;color:var(--dsw-alias-label-tertiary)}',
      // The host's ongoing loader: a 14px ring whose arc sweeps while the
      // Session runs, drawn with the primitives' own stroke recipe and easing
      // so both rows animate identically.
      '.dshUS-spinner{flex:none;color:var(--dsw-alias-label-tertiary)}',
      '.dshUS-spinnerMotion{transform-origin:center;animation:dshUS-spin 1.5s linear infinite}',
      '.dshUS-spinnerTrack,.dshUS-spinnerArc{fill:none;stroke:currentColor;stroke-width:2;',
      'stroke-linecap:round}',
      '.dshUS-spinnerTrack{opacity:.25}',
      '.dshUS-spinnerArc{stroke-dasharray:12 150;animation:dshUS-dash 1.5s ease-in-out infinite}',
      '@keyframes dshUS-spin{to{transform:rotate(360deg)}}',
      '@keyframes dshUS-dash{0%{stroke-dasharray:12 150;stroke-dashoffset:0}',
      '50%{stroke-dasharray:24 150;stroke-dashoffset:-6}',
      'to{stroke-dasharray:12 150;stroke-dashoffset:0}}',
      // A status dot is the host's 10px box with a 20% inset circle inside it, so
      // the mark itself is 6px: done is the success green, a pending interaction
      // the warning amber, exactly the colours the sidebar's own StateDot paints.
      '.dshUS-dot{position:relative;display:inline-block;flex:none;width:10px;height:10px}',
      '.dshUS-dot:after{content:"";position:absolute;inset:20%;border-radius:50%;',
      'corner-shape:round;background:currentColor}',
      '.dshUS-dot[data-state="done"]{color:var(--dsw-alias-state-success-primary)}',
      '.dshUS-dot[data-state="warning"]{color:var(--dsw-alias-state-warn-primary)}',
      '.dshUS-dot[data-state="idle"]{color:var(--dsw-alias-state-idle-primary)}',
      '@media (prefers-reduced-motion:reduce){.dshUS-spinnerMotion,.dshUS-spinnerArc{animation:none}',
      '.dshUS-spinnerArc{stroke-dasharray:18 150;stroke-dashoffset:-3}}',
      '.dshUS-time{flex:none;margin:0;color:var(--dsw-alias-label-tertiary);font-size:10px;',
      'line-height:16px}',
      // The hover card copies the host's own Session hover card: a fixed 244px
      // dark surface hanging to the right of the row, with the same 14px title
      // and 12px details. Its colors are the host card's fixed ones rather than
      // theme tokens, because the card is dark in every theme. It takes pointer
      // events like the host's card, so moving onto it keeps it open to read.
      '.dshUS-hoverCard{position:fixed;z-index:100;box-sizing:border-box;width:244px;',
      'max-width:calc(100vw - 16px);padding:12px 16px;',
      'border-radius:var(--dsw-radius-lg,8px);background:#2c2c2e;',
      'box-shadow:var(--dsw-shadow-lv3,0 8px 32px rgba(0,0,0,.24));',
      'display:flex;flex-direction:column;gap:8px}',
      '.dshUS-hoverTitle{color:#fff;overflow-wrap:break-word;font-size:14px;line-height:20px}',
      // The one field these sections add to the host card: the Workspace that
      // owns the Session, named by its (renamable) title rather than its folder.
      // It carries no label; the bare title reads as the Session's context.
      '.dshUS-hoverWorkspace{color:#cfd3d6;overflow-wrap:anywhere;font-size:12px;line-height:16px}',
      '.dshUS-hoverPath{color:#cfd3d6;word-break:break-all;font-size:12px;line-height:16px}',
      '.dshUS-hoverTime{color:#cfd3d6;font-size:12px;line-height:16px}',
      '.dshUS-hoverStatus{display:flex;align-items:center;gap:8px;color:#adb2b8;',
      'font-size:12px;line-height:20px}',
      // The host's own pinned marker, kept on the row at rest exactly as the
      // sidebar keeps its marker on a pinned Session: same 16px box, same 6px
      // lead, same caption colour. It is the trailing cell of a pinned row, so
      // the title is measured against it even while the actions are hidden —
      // dropping it would widen the title past the sidebar's and hide the
      // ellipsis the sidebar draws. Hovering swaps it for the row's actions,
      // the way the sidebar swaps its marker for its menu.
      '.dshUS-pinMark{flex:none;display:inline-flex;align-items:center;justify-content:center;',
      'width:16px;height:20px;margin-left:6px;color:var(--dsw-alias-label-caption,currentColor)}',
      // The row's trailing actions sit in one group that swallows clicks, so a
      // button press never also opens the row (the host's rows do the same).
      // The group hides as a whole rather than each button: `display:none`
      // removes its margin too, so a row whose trailing cells are all absent
      // ends with the time flush against the row edge, as the host's own rows
      // do. Showing the group on the row's focus is what keeps its buttons
      // reachable, since a `display:none` button cannot be tabbed to.
      '.dshUS-actions{flex:none;display:none;align-items:center;gap:8px;margin-left:6px}',
      // Placeholder that fills the row the section would otherwise not draw.
      // It spans space without any hover surface, so nothing looks clickable:
      // the title keeps the native row's indent and the text stays at the
      // sidebar's tertiary label colour.
      '.dshUS-empty{box-sizing:border-box;display:flex;align-items:center;height:32px;',
      'padding:0 8px;cursor:default}',
      '.dshUS-emptyLabel{flex:1;min-width:0;margin:0 6px 0;overflow:hidden;',
      'text-overflow:ellipsis;white-space:nowrap;font-size:14px;line-height:20px;',
      'color:var(--dsw-alias-label-tertiary)}',
      // The host's own "Show more" row: one full-width 28px text button whose
      // label lines up with the Session titles above it.
      '.dshUS-more{box-sizing:border-box;display:block;width:100%;height:28px;margin:0;',
      'padding:0 12px;border:0;border-radius:var(--dsw-radius-sm,4px);background:0 0;font:inherit;',
      'font-size:12px;line-height:18px;text-align:left;color:var(--dsw-alias-label-tertiary);',
      'cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dshUS-empty,.dshUS-more{padding-left:calc(var(--dsh-sidebar-row-padding,12px) + ',
      'var(--dshUS-status-width) + var(--dsh-sidebar-label-gap,6px))}',
      '.dshUS-more:hover{color:var(--dsw-alias-label-secondary)}',
      '.dshUS-more:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid ',
      'var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary,#4d6bfe));outline-offset:-2px}',
      // A row's actions stay out of its resting state and appear on hover or
      // once the row holds keyboard focus, the way the host's own session rows
      // reveal theirs. `:focus-within` is what keeps them reachable: the group
      // cannot be tabbed into while `display:none`, and this rule holds it
      // visible from the row's own focus all the way onto the buttons.
      '.dshUS-action{box-sizing:border-box;flex:none;display:inline-flex;align-items:center;',
      'justify-content:center;width:16px;height:20px;padding:0;border:0;cursor:pointer;',
      'border-radius:var(--dsw-radius-xs,2px);background:0 0;',
      'color:var(--dsw-alias-label-caption,currentColor)}',
      '.dshUS-row:hover .dshUS-actions,',
      '.dshUS-row:focus-visible .dshUS-actions,',
      '.dshUS-row:focus-within .dshUS-actions,',
      '.dshUS-menuOpen .dshUS-actions{display:inline-flex}',
      '.dshUS-action:hover{color:var(--dsw-alias-label-primary)}',
      '.dshUS-action:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid ',
      'var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary,#4d6bfe));outline-offset:1px}',
      // The relative time and the pinned marker are what the actions replace, so
      // they go away under exactly the conditions that bring the actions in —
      // the host's session rows drop their time and pin marker on hover for the
      // same reason. With both gone the actions keep the row's trailing edge.
      '.dshUS-row:hover .dshUS-time,',
      '.dshUS-row:focus-visible .dshUS-time,',
      '.dshUS-row:focus-within .dshUS-time,',
      '.dshUS-row:hover .dshUS-pinMark,',
      '.dshUS-row:focus-visible .dshUS-pinMark,',
      '.dshUS-row:focus-within .dshUS-pinMark,',
      '.dshUS-menuOpen .dshUS-time,',
      '.dshUS-menuOpen .dshUS-pinMark{display:none}',
      // A touch surface never hovers, so the actions stay visible there and the
      // time and marker stay hidden with them.
      '@media (hover:none){.dshUS-actions{display:inline-flex}',
      '.dshUS-time,.dshUS-pinMark{display:none}}',
      // The plugin's settings popup, rebuilt on the host's own settings panel:
      // the 800px panel narrowed for a single page, the mask and elevation, the
      // 54px header with a 28px close, and the content's 24px inset. The page
      // itself holds the host's 36x20 switches beside one themed number field.
      '.dshUS-settingsRoot{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;',
      'justify-content:center;padding:24px}',
      '.dshUS-settingsMask{position:absolute;inset:var(--dsh-frame-chrome-top,0px) 0 0;',
      'background:var(--dsw-alias-bg-mask-1,rgba(0,0,0,.45));backdrop-filter:var(--dsw-mask-blur,blur(4px))}',
      '.dshUS-settingsPanel{box-sizing:border-box;position:relative;z-index:1;display:flex;',
      'flex-direction:column;width:min(560px,100%);max-height:100%;overflow:hidden;',
      'border-radius:var(--dsw-radius-panel,var(--dsw-radius-lg,8px));',
      'background:var(--dsw-alias-bg-layer-2);',
      'box-shadow:var(--dsw-elevation-prominent,0 8px 32px rgba(0,0,0,.24));',
      'animation:dshUS-dialogIn var(--ds-transition-duration,.15s) var(--ds-ease-in-out)}',
      '.dshUS-settingsPanel:focus{outline:none}',
      '.dshUS-settingsHeader{box-sizing:border-box;flex:none;display:flex;align-items:flex-start;',
      'justify-content:space-between;gap:8px;height:54px;padding:20px 14px 8px 24px}',
      '.dshUS-settingsTitle{margin:0;font-size:16px;line-height:24px;font-weight:500;',
      'color:var(--dsw-alias-label-primary)}',
      '.dshUS-settingsHeader .dshUS-dialogClose{color:var(--dsw-alias-label-primary)}',
      '.dshUS-settingsBody{flex:1;min-height:0;padding:0 24px 24px;overflow-y:auto;',
      'overscroll-behavior:contain}',
      '.dshUS-settingsRow{display:flex;align-items:center;justify-content:space-between;gap:24px;',
      'padding:16px 0;border-bottom:.5px solid var(--dsw-alias-border-l2)}',
      '.dshUS-settingsRow:last-child{border-bottom:none}',
      '.dshUS-settingsCopy{min-width:0}',
      '.dshUS-settingsRowTitle{font-size:14px;line-height:20px;color:var(--dsw-alias-label-primary)}',
      '.dshUS-settingsRowDesc{margin-top:4px;font-size:12px;line-height:18px;',
      'color:var(--dsw-alias-label-secondary)}',
      // The host's switch, copied from its primitives: a 36x20 track with a 16px
      // thumb that slides on the brand surface when checked.
      '.dshUS-switch{box-sizing:border-box;position:relative;flex:none;width:36px;height:20px;',
      'padding:2px;border:0;border-radius:999px;corner-shape:round;',
      'background:var(--dsw-alias-border-l3);cursor:pointer}',
      '.dshUS-switch[aria-checked="true"]{background:var(--dsw-alias-brand-primary)}',
      '.dshUS-switch:disabled{cursor:not-allowed;opacity:.4}',
      '.dshUS-switch:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid ',
      'var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary,#4d6bfe));outline-offset:2px}',
      '.dshUS-switchThumb{display:block;width:16px;height:16px;border-radius:50%;corner-shape:round;',
      'background:var(--dsw-alias-label-primary-foreground);transition:transform .12s ease}',
      '.dshUS-switch[aria-checked="false"] .dshUS-switchThumb{',
      'background:var(--dsw-alias-switch-thumb)}',
      '.dshUS-switch[aria-checked="true"] .dshUS-switchThumb{transform:translate(16px)}',
      '@media (prefers-reduced-motion:reduce){.dshUS-switchThumb{transition:none}}',
      // The Recent count field, styled as the host's own compact input: the
      // same hairline border, radius, and focus ring as the buttons, with the
      // native spinner hidden so the number reads as one value. The chevrons
      // beside it are the visible way to step; they are plain ghost buttons so
      // the pair stays quiet next to the switches.
      '.dshUS-numberField{display:flex;align-items:center;gap:6px;flex:none}',
      '.dshUS-number{box-sizing:border-box;flex:none;width:72px;height:32px;padding:0 10px;',
      'border:.5px solid var(--dsw-alias-border-l3);border-radius:var(--dsw-radius-md,8px);',
      'background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:14px;',
      'line-height:22px;text-align:center;-moz-appearance:textfield;appearance:textfield}',
      '.dshUS-number:hover{background:var(--dsw-alias-interactive-bg-hover)}',
      '.dshUS-number:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid ',
      'var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary,#4d6bfe));outline-offset:1px}',
      '.dshUS-number::-webkit-outer-spin-button,',
      '.dshUS-number::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}',
      '.dshUS-stepper{display:flex;flex-direction:column;gap:1px}',
      '.dshUS-step{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;',
      'width:22px;height:15px;padding:0;border:0;border-radius:var(--dsw-radius-sm,4px);',
      'background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer}',
      '.dshUS-step:hover:not(:disabled){background:var(--dsw-alias-interactive-bg-hover);',
      'color:var(--dsw-alias-label-primary)}',
      '.dshUS-step:disabled{cursor:not-allowed;opacity:.35}',
      '.dshUS-step:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid ',
      'var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary,#4d6bfe));outline-offset:0}',
      '.dshUS-stepGlyphUp{transform:rotate(180deg)}',
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
      '@media (prefers-reduced-motion:reduce){.dshUS-dialog,.dshUS-settingsPanel{animation:none}}',
      '.dshUS-dialog:focus{outline:none}',
      '.dshUS-dialogHeader{display:flex;align-items:center;justify-content:space-between;gap:8px;',
      'padding:22px 14px 12px 24px}',
      '.dshUS-dialogTitle{margin:0;font-size:16px;line-height:24px;font-weight:500;',
      'color:var(--dsw-alias-label-primary)}',
      '.dshUS-dialogClose{flex:none;display:inline-flex;align-items:center;justify-content:center;',
      'width:28px;height:28px;border:0;border-radius:var(--dsw-radius-sm,4px);background:0 0;',
      'cursor:pointer;color:var(--dsw-alias-label-secondary)}',
      '.dshUS-dialogClose:hover{background:var(--dsw-alias-interactive-bg-hover)}',
      '.dshUS-dialogClose:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid ',
      'var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary,#4d6bfe));outline-offset:1px}',
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
      '.dshUS-settingsRestore{flex:none;white-space:nowrap}',
      '.dshUS-settingsRestore:focus-visible{outline:var(--dsw-focus-ring-width,2px) solid ',
      'var(--dsw-focus-ring-color,var(--dsw-alias-state-business-primary,#4d6bfe));outline-offset:1px}',
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

    /** Target with four ticks for revealing a session's original location. */
    function RevealOriginalGlyph() {
      return h(
        'svg',
        {
          width: 14,
          height: 14,
          viewBox: '0 0 16 16',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
          'aria-hidden': 'true',
          stroke: 'currentColor',
          strokeWidth: 1,
          strokeLinecap: 'round',
        },
        h('circle', { cx: 8, cy: 8, r: 4.5 }),
        h('circle', { cx: 8, cy: 8, r: 1.5 }),
        h('path', { d: 'M8 1v3M8 12v3M1 8h3M12 8h3' }),
      );
    }

    /** Eye with a slash for hiding a session from Recent. */
    function EyeOffGlyph({ size }) {
      return h(
        'svg',
        {
          width: size,
          height: size,
          viewBox: '0 0 16 16',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
          'aria-hidden': 'true',
          stroke: 'currentColor',
          strokeWidth: 1,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        },
        h('path', {
          d: 'M6.3 3.8A6.8 6.8 0 0 1 8 3.6C12 3.6 14.3 8 14.3 8a12.1 12.1 0 0 1-2.1 2.7M10 12a6.4 6.4 0 0 1-2 .4C4 12.4 1.7 8 1.7 8a12 12 0 0 1 2.4-2.9',
        }),
        h('path', { d: 'M6.6 6.6a2 2 0 0 0 2.8 2.8M2 2l12 12' }),
      );
    }

    /**
     * The host's own settings gear, copied from the primitives so the section
     * entry matches the host's settings trigger without importing a Client
     * package.
     * @param props - square edge in pixels.
     * @returns the outline gear icon.
     */
    function SettingsGlyph({ size }) {
      return h(
        'svg',
        {
          width: size,
          height: size,
          viewBox: '0 0 16 16',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
          'aria-hidden': 'true',
          strokeWidth: 1.3,
        },
        h('path', {
          d: 'M8 9.75012C8.9665 9.75012 9.75 8.96662 9.75 8.00012C9.75 7.03362 8.9665 6.25012 8 6.25012C7.0335 6.25012 6.25 7.03362 6.25 8.00012C6.25 8.96662 7.0335 9.75012 8 9.75012Z',
          stroke: 'currentColor',
        }),
        h('path', {
          d: 'M13.0107 7.79377C12.9505 7.89401 12.9205 7.94413 12.9205 7.99951C12.9205 8.0549 12.9505 8.10502 13.0106 8.20528L13.9849 9.83006C14.045 9.93029 14.0751 9.9804 14.0751 10.0358C14.0751 10.0911 14.045 10.1413 13.9849 10.2415L13.0037 11.8777C12.9468 11.9726 12.9184 12.0201 12.8725 12.0461C12.8267 12.072 12.7713 12.072 12.6607 12.072H10.6704C10.5598 12.072 10.5045 12.072 10.4586 12.098C10.4128 12.1239 10.3843 12.1714 10.3274 12.2662L9.33825 13.9142C9.28133 14.009 9.25287 14.0564 9.20703 14.0823C9.16118 14.1083 9.10588 14.1083 8.99529 14.1083H7.00486C6.89426 14.1083 6.83896 14.1083 6.79312 14.0823C6.74727 14.0564 6.71881 14.009 6.6619 13.9142L5.67273 12.2662C5.61581 12.1714 5.58735 12.1239 5.54151 12.098C5.49566 12.072 5.44036 12.072 5.32977 12.072H3.33945C3.2288 12.072 3.17347 12.072 3.12761 12.0461C3.08176 12.0201 3.0533 11.9726 2.9964 11.8777L2.0152 10.2415C1.9551 10.1413 1.92505 10.0911 1.92505 10.0358C1.92505 9.9804 1.9551 9.93029 2.0152 9.83006L2.98951 8.20528C3.04963 8.10502 3.07969 8.0549 3.07969 7.99951C3.07968 7.94413 3.04961 7.89401 2.98946 7.79377L2.01529 6.17011C1.95514 6.06987 1.92507 6.01975 1.92507 5.96437C1.92506 5.90899 1.95512 5.85886 2.01524 5.7586L2.9964 4.1224C3.0533 4.0275 3.08176 3.98005 3.12761 3.95408C3.17347 3.92811 3.2288 3.92811 3.33945 3.92811H5.32977C5.44036 3.92811 5.49566 3.92811 5.54151 3.90216C5.58735 3.87621 5.61581 3.82879 5.67273 3.73397L6.6619 2.08599C6.71881 1.99116 6.74727 1.94375 6.79312 1.9178C6.83896 1.89185 6.89426 1.89185 7.00486 1.89185H8.99529C9.10588 1.89185 9.16118 1.89185 9.20703 1.9178C9.25287 1.94375 9.28133 1.99116 9.33825 2.08599L10.3274 3.73397C10.3843 3.82879 10.4128 3.87621 10.4586 3.90216C10.5045 3.92811 10.5598 3.92811 10.6704 3.92811H12.6607C12.7713 3.92811 12.8267 3.92811 12.8725 3.95408C12.9184 3.98005 12.9468 4.0275 13.0037 4.1224L13.9849 5.7586C14.045 5.85886 14.0751 5.90899 14.0751 5.96437C14.0751 6.01975 14.045 6.06987 13.9849 6.17011L13.0107 7.79377Z',
          stroke: 'currentColor',
          strokeMiterlimit: 10,
        }),
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
    /** No live status at all: what an older host that publishes no status feed looks like. */
    const NO_STATUSES = new Map();
    /** Stand-in for a host without the status hook, so the sections still render. */
    const useNoSessionStatus = (selector) => selector(NO_STATUSES);
    /** Used when the host has no context-menu target store; the row still opens the menu. */
    const useNoContextMenuTarget = () => undefined;

    /**
     * The pending-interaction kind the sidebar renders, or undefined for a kind
     * this plugin does not know. Mirrors the host's own closed set, so a future
     * interaction kind never paints a marker the sidebar would not paint.
     * @param kind - the runtime's pending-interaction classification.
     * @returns the dictionary suffix naming that interaction, if any.
     */
    function pendingStatus(kind) {
      switch (kind) {
        case 'approval':
          return 'waitingApproval';
        case 'plan-review':
          return 'planReview';
        case 'question':
          return 'waitingAnswer';
        default:
          return undefined;
      }
    }

    /**
     * How many of one Session's direct subagents are running, counted exactly
     * as the sidebar counts them: the parent's persisted catalog, each child's
     * live status winning over its list summary.
     * @param sessions - the Session-list snapshot.
     * @param sessionId - the parent Session.
     * @param statuses - the Session-status snapshot.
     * @returns the running direct-child count.
     */
    function runningChildCount(sessions, sessionId, statuses) {
      const catalog = sessions.projectionsBySession?.[sessionId]?.values?.subagentCatalog;
      if (!Array.isArray(catalog)) return 0;
      let count = 0;
      for (const child of catalog) {
        const running = statuses.get(child.id)?.running ?? sessions.byId[child.id]?.running;
        if (running === true) count += 1;
      }
      return count;
    }

    /**
     * One Session's primary status, in the sidebar's own precedence: a pending
     * interaction first, then live activity (its own turn or a running child),
     * then an unviewed completion. An idle Session has no status, which is why
     * its row draws no marker at all.
     * @param sessions - the Session-list snapshot.
     * @param statuses - the Session-status snapshot.
     * @param sessionId - the Session to classify.
     * @returns the primary status, or undefined while idle.
     */
    function sessionStatus(sessions, statuses, sessionId) {
      const status = statuses.get(sessionId);
      const pending = pendingStatus(status?.pendingInteraction?.kind);
      if (pending !== undefined) return { state: 'warning', label: pending };
      const running = status?.running ?? sessions.byId[sessionId]?.running;
      if (running === true) return { state: 'ongoing', label: 'running' };
      const children = runningChildCount(sessions, sessionId, statuses);
      if (children > 0) return { state: 'ongoing', label: 'subagents', count: children };
      if (status?.completionUnread === true) return { state: 'done', label: 'completed' };
      return undefined;
    }

    /**
     * Every status line one Session's hover card lists, in the host card's own
     * precedence: a pending interaction first, then live activity (its own turn
     * or a running child), then an unviewed completion, and finally idle — which
     * the row never marks but the card always states. A pending interaction
     * outranks the Session's own turn, so the two never share the leading line,
     * while a running child keeps its own second line beside either.
     * @param sessions - the Session-list snapshot.
     * @param statuses - the Session-status snapshot.
     * @param sessionId - the Session to describe.
     * @returns the status lines, at least the idle one.
     */
    function sessionHoverStatuses(sessions, statuses, sessionId) {
      const status = statuses.get(sessionId);
      const pending = pendingStatus(status?.pendingInteraction?.kind);
      const running = status?.running ?? sessions.byId[sessionId]?.running;
      const children = runningChildCount(sessions, sessionId, statuses);
      const lines = [];
      if (pending !== undefined) lines.push({ state: 'warning', label: pending });
      else if (running === true) lines.push({ state: 'ongoing', label: 'running' });
      if (children > 0) lines.push({ state: 'ongoing', label: 'subagents', count: children });
      if (lines.length > 0) return lines;
      if (status?.completionUnread === true) return [{ state: 'done', label: 'completed' }];
      return [{ state: 'idle', label: 'idle' }];
    }

    /** The readable text of one primary status, localized by the section. */
    function statusText(status, t) {
      if (status.label === 'subagents') {
        return t(status.count === 1 ? 'status.subagents.one' : 'status.subagents.other', {
          n: status.count,
        });
      }
      return t(`status.${status.label}`);
    }

    /**
     * The Session row's leading status marker: the host's spinning ring while
     * the Session works, otherwise the host's small state dot — the same green
     * completion and amber pending-interaction colours the sidebar paints. The
     * marker is decorative; the row's own label carries the status in words.
     * @param props - the primary status and its readable text.
     * @returns the marker element.
     */
    function StatusMark({ status, label }) {
      return h(
        'span',
        { className: 'dshUS-status', title: label, 'aria-hidden': 'true' },
        h(StatusGlyph, { status }),
      );
    }

    /**
     * One status's mark without the row's reserved 16px cell: the host's
     * spinning ring while the Session works, otherwise its small state dot.
     * The hover card lines up these marks the way its own status lines do.
     * @param props - the status to draw.
     * @returns the marker element.
     */
    function StatusGlyph({ status }) {
      if (status.state !== 'ongoing') {
        return h('span', { className: 'dshUS-dot', 'data-state': status.state });
      }
      return h(
        'svg',
        {
          className: 'dshUS-spinner',
          'data-state': 'ongoing',
          width: 14,
          height: 14,
          viewBox: '0 0 24 24',
          'aria-hidden': 'true',
        },
        h(
          'g',
          { className: 'dshUS-spinnerMotion' },
          h('circle', { className: 'dshUS-spinnerTrack', cx: '12', cy: '12', r: '9.5' }),
          h('circle', { className: 'dshUS-spinnerArc', cx: '12', cy: '12', r: '9.5' }),
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

    /** Pending group expansions, including those started by normal row opens. */
    const pendingWorkspaceExpansions = new Set();

    /**
     * Expand every collapsed Workspace group on the way to one Workspace.
     * A plugin has no service handle on the sidebar's
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
     * @returns cancellation of any remaining expansion retries.
     */
    function expandWorkspacePath(workspaces, workspaceId) {
      // No known owner means the Workspace list has not been applied yet; the
      // "Ungrouped" bucket would be a guess, so leave the tree alone.
      if (workspaceId === undefined) return () => {};
      const chain = workspaceChain(workspaces, workspaceId);
      if (chain.length === 0) return () => {};
      // Ids are opaque Host values, so rows are matched through `dataset` rather
      // than through a selector assembled from one. No group row at all means
      // the list is not showing a grouped tree (a folded sidebar, the flat
      // "Last updated" view, or search results), so there is nothing to unfold.
      if (workspaceRows().length === 0) return () => {};
      // A folded ancestor renders no child rows, so the walk runs outermost
      // first. React commits a discrete click before `dispatchEvent` returns,
      // which makes the children's rows visible to the next lookup; should a
      // host version commit them later, the walk repeats next frame, and each
      // key is clicked at most once so a repeat never folds a group it opened.
      let remaining = chain.length + 1;
      const opened = new Set();
      let frame = 0;
      let cancelled = false;
      const cancel = () => {
        cancelled = true;
        cancelAnimationFrame(frame);
        pendingWorkspaceExpansions.delete(cancel);
      };
      pendingWorkspaceExpansions.add(cancel);
      const pass = () => {
        frame = 0;
        if (cancelled) return;
        for (const [index, key] of chain.entries()) {
          if (opened.has(key)) continue;
          const row = findWorkspaceRow(key);
          if (row === undefined || row.getAttribute('aria-expanded') !== 'false') continue;
          const last = index === chain.length - 1;
          const hidesTarget =
            !last && chain.slice(index + 1).some((next) => findWorkspaceRow(next) === undefined);
          if (!last && !hidesTarget) continue;
          opened.add(key);
          row.click();
        }
        const target = chain[chain.length - 1];
        const targetRow = findWorkspaceRow(target);
        const done = targetRow !== undefined && targetRow.getAttribute('aria-expanded') !== 'false';
        if (done || remaining <= 0) {
          pendingWorkspaceExpansions.delete(cancel);
          return;
        }
        remaining -= 1;
        frame = requestAnimationFrame(pass);
      };
      pass();
      return cancel;
    }

    /** The data-row-key value of one Workspace group row. */
    function workspaceRowKey(workspaceId) {
      return `workspace:${workspaceId}`;
    }

    /** Every Workspace group row the sidebar currently renders. */
    function workspaceRows() {
      return document.querySelectorAll(
        '[data-slot="sidebar.workspaces"] [data-row-key^="workspace:"]',
      );
    }

    /**
     * The rendered Workspace group row for one Workspace id, if the sidebar is
     * showing a grouped tree.
     * @param workspaceId - the Workspace whose group row is wanted.
     * @returns the row, or undefined when it is not rendered.
     */
    function findWorkspaceRow(workspaceId) {
      for (const row of workspaceRows()) {
        if (row instanceof HTMLElement && row.dataset.rowKey === workspaceRowKey(workspaceId)) {
          return row;
        }
      }
      return undefined;
    }

    /** Only the latest explicit reveal may move the workspace list. */
    let revealFrame = 0;
    let cancelRevealExpansion = () => {};
    /** Remove the previous pulse and its listeners, including on plugin unload. */
    let clearRevealHighlight = () => {};

    /** Pulse the native row's background once, restarting on repeated reveals. */
    function highlightOriginalSession(row) {
      clearRevealHighlight();
      const cleanup = () => {
        delete row.dataset.dshUpSessionReveal;
        row.removeEventListener('animationend', onEnd);
        clearRevealHighlight = () => {};
      };
      const onEnd = (event) => {
        if (event.target === row && event.animationName === 'dshUS-revealOriginal') cleanup();
      };
      // Commit the attribute removal before adding it again, so repeating the menu
      // action on the same row starts a fresh three-second animation.
      void row.offsetWidth;
      row.addEventListener('animationend', onEnd);
      // React owns the host row's className, but leaves our data attribute alone.
      row.dataset.dshUpSessionReveal = '';
      clearRevealHighlight = cleanup;
    }

    /** Expand the owning groups and any session overflow, then scroll to the native row. */
    function revealOriginalSession(workspaces, sessionId, workspaceId, sessionCount) {
      cancelAnimationFrame(revealFrame);
      cancelRevealExpansion();
      cancelRevealExpansion = expandWorkspacePath(workspaces, workspaceId);
      // Group toggles and overflow buttons may commit on the next frame. Bound
      // retries by the list size, including sessions beyond the host's watermark.
      let remaining = sessionCount + workspaces.length + 10;
      const pass = () => {
        revealFrame = 0;
        const rows = document.querySelectorAll('[data-slot="sidebar.workspaces"] [data-row-key]');
        for (const row of rows) {
          if (row instanceof HTMLElement && row.dataset.rowKey === `session:${sessionId}`) {
            row.scrollIntoView({ block: 'center', inline: 'nearest' });
            highlightOriginalSession(row);
            return;
          }
        }
        // The host renders only the first batch of sessions in a workspace.
        // Use its own button so the expanded count follows the host's rules.
        for (const row of rows) {
          if (
            row instanceof HTMLElement &&
            row.dataset.rowKey === `overflow:${workspaceId}` &&
            row.getAttribute('aria-expanded') === 'false'
          ) {
            row.click();
            break;
          }
        }
        if (--remaining > 0) revealFrame = requestAnimationFrame(pass);
      };
      revealFrame = requestAnimationFrame(pass);
    }

    /**
     * Keep a collapsed Workspace group collapsed when the reveal preference is
     * off. The sidebar expands the group that owns the current Session whenever
     * that group has no explicit expansion choice on record, so without this a
     * group the user has never toggled would open on its own and defeat the
     * preference. The group row's click handler is the sidebar's own toggle, so
     * clicking it twice restores the visible state while leaving that explicit
     * record; both discrete clicks flush inside this task, so no frame paints
     * the intermediate state. An already-expanded group needs nothing: its
     * choice is either explicit or already the state the sidebar would keep.
     * @param workspaceId - the Workspace that owns the Session being opened.
     */
    function pinCollapsedWorkspace(workspaceId) {
      if (workspaceId === undefined) return;
      const row = findWorkspaceRow(workspaceId);
      if (row === undefined || row.getAttribute('aria-expanded') !== 'false') return;
      row.click();
      row.click();
      // Should a host version batch the pair instead of flushing each discrete
      // click, the row would end expanded; restore it on the next frame.
      requestAnimationFrame(() => {
        const current = findWorkspaceRow(workspaceId);
        if (current?.getAttribute('aria-expanded') === 'true') current.click();
      });
    }

    /**
     * The relative-time bucket of one row's last activity, before it is put in
     * either the row's compact form (「5分钟」) or the hover card's form
     * (「5分钟前」).
     * @param value - the Session's activity stamp.
     * @param now - the current time in epoch milliseconds.
     * @returns the unit and count, or undefined for a missing stamp.
     */
    function relativeTimeParts(value, now) {
      const then = toMillis(value);
      if (then === 0) return undefined;
      const diff = Math.max(0, now - then);
      const minutes = Math.floor(diff / 60000);
      if (minutes < 1) return { unit: 'now' };
      if (minutes < 60) return { unit: 'minutes', n: minutes };
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return { unit: 'hours', n: hours };
      const days = Math.floor(hours / 24);
      if (days < 30) return { unit: 'days', n: days };
      const months = Math.floor(days / 30);
      if (months < 12) return { unit: 'months', n: months };
      return { unit: 'years', n: Math.floor(months / 12) };
    }

    /** Compact relative time of one row's last activity. */
    function relativeTime(value, now, t) {
      const parts = relativeTimeParts(value, now);
      if (parts === undefined) return '';
      return parts.unit === 'now' ? t('time.now') : t(`time.${parts.unit}`, { n: parts.n });
    }

    /** Hover-card relative time: the same distance written as 「5分钟前」. */
    function hoverTime(value, now, t) {
      const parts = relativeTimeParts(value, now);
      if (parts === undefined) return '';
      return parts.unit === 'now'
        ? t('time.now')
        : t('time.ago', { t: t(`time.${parts.unit}`, { n: parts.n }) });
    }

    /**
     * The recent list's rest-size bounds, and the fixed step one "Show more"
     * click reveals. The rest size is configurable; the step stays at five, so
     * raising the rest size never widens how far one click jumps.
     */
    const RECENT_PAGE_DEFAULT = 5;
    const RECENT_PAGE_MIN = 1;
    const RECENT_PAGE_MAX = 50;
    const RECENT_PAGE_STEP = 5;
    /**
     * Hover-card timing and gap, copied from the host's own Session card: the
     * first card in a list waits 800ms, a neighbouring row then replaces an open
     * one immediately, and leaving the row and the card waits 100ms before the
     * card closes.
     */
    const HOVER_CARD_DELAY = 800;
    const HOVER_CARD_CLOSE_DELAY = 100;
    const HOVER_CARD_GAP = 8;
    /** localStorage key holding this plugin's browser-local preferences. */
    const PREFERENCES_KEY = 'dsh-up-session/preferences.v1';
    /** localStorage key holding the Sessions the user removed from Recent. */
    const MUTED_KEY = 'dsh-up-session/muted-from-recent.v1';

    /**
     * The Sessions the user removed from Recent, keyed by Session id. Each value
     * is the Session's activity stamp at the moment it was removed: the Recent
     * list skips that Session while its stamp has not advanced, and shows it
     * again as soon as a new message pushes the stamp forward. A missing,
     * malformed, or unreadable record means nothing is removed.
     * @returns Session id to the removal-time activity stamp.
     */
    function readMuted() {
      try {
        const raw = localStorage.getItem(MUTED_KEY);
        if (raw === null) return {};
        const parsed = JSON.parse(raw);
        if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
        const muted = {};
        for (const [id, stamp] of Object.entries(parsed)) {
          if (typeof id === 'string' && id !== '' && typeof stamp === 'number' && Number.isFinite(stamp)) {
            muted[id] = stamp;
          }
        }
        return muted;
      } catch (_reason) {
        return {};
      }
    }

    /**
     * Persist the removal record. An empty record clears the key, and a refused
     * write only costs the persisted removal, which the caller has already
     * applied in memory.
     * @param muted - Session id to the removal-time activity stamp.
     */
    function writeMuted(muted) {
      try {
        if (Object.keys(muted).length === 0) {
          localStorage.removeItem(MUTED_KEY);
          return;
        }
        localStorage.setItem(MUTED_KEY, JSON.stringify(muted));
      } catch (reason) {
        console.warn('recent removal not saved:', reason);
      }
    }


    /**
     * A page size that can actually drive the list: a whole number inside the
     * supported range, rounded, and every other number pulled back to that
     * range. Hand-edited or migrated records can therefore never ask for zero
     * rows or for an unbounded list.
     * @param value - any number.
     * @returns the usable page size.
     */
    function clampRecentPageSize(value) {
      if (!Number.isFinite(value)) return RECENT_PAGE_DEFAULT;
      return Math.min(RECENT_PAGE_MAX, Math.max(RECENT_PAGE_MIN, Math.round(value)));
    }

    /**
     * The plugin's preferences, read from browser storage. A missing, malformed,
     * or unreadable record falls back to the defaults; in particular the
     * workspace-reveal behavior is on, which is what every earlier version did,
     * and the Recent page size is five, which is what every earlier version
     * showed. Each field is validated on its own, so one damaged value costs
     * only that preference.
     * @returns the current preference values.
     */
    function readPreferences() {
      const fallback = {
        expandWorkspaceOnOpen: true,
        showPinned: true,
        showRecent: true,
        recentPageSize: RECENT_PAGE_DEFAULT,
      };
      try {
        const raw = localStorage.getItem(PREFERENCES_KEY);
        if (raw === null) return fallback;
        const parsed = JSON.parse(raw);
        const preferences = { ...fallback };
        for (const key of Object.keys(fallback)) {
          const value = parsed?.[key];
          if (key === 'recentPageSize') {
            if (typeof value === 'number') preferences[key] = clampRecentPageSize(value);
          } else if (typeof value === 'boolean') {
            preferences[key] = value;
          }
        }
        return preferences;
      } catch (_reason) {
        return fallback;
      }
    }

    /**
     * Persist the whole preference record. A refused write only costs the
     * persisted choice, which the caller has already applied in memory.
     * @param preferences - the values to store.
     */
    function writePreferences(preferences) {
      try {
        localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
      } catch (reason) {
        console.warn('session preference not saved:', reason);
      }
    }

    /**
     * The recent list's window for one page limit. A limit below the rest size
     * still shows the rest size, so the list never shrinks under it; "Show
     * more" always adds the same five rows.
     * @param rowCount - how many recent Sessions there are.
     * @param limit - how many the list is currently allowed to show.
     * @param pageSize - how many rows show at rest.
     * @returns the visible row count, whether every Session is on screen, and
     *   the limit one click installs next.
     */
    function recentWindow(rowCount, limit, pageSize) {
      const shown = Math.max(pageSize, limit);
      const allShown = shown >= rowCount;
      return {
        visible: Math.min(shown, rowCount),
        allShown,
        next: allShown ? pageSize : shown + RECENT_PAGE_STEP,
      };
    }

    /**
     * One Session-list summary as one row of either section. Every row carries
     * the same shape; only which Sessions become rows and which trailing
     * actions they offer differ between the sections.
     * @param summary - the Session-list summary.
     * @param owner - the Workspace that accounts for it, if one does.
     * @param loaded - whether the Workspace list has loaded at all.
     * @param untitled - the label an untitled Session shows.
     * @param statuses - the Session-status snapshot.
     * @param sessions - the Session-list snapshot, read for a Session's own and child activity.
     * @returns the row.
     */
    function sessionRow(summary, owner, loaded, untitled, statuses, sessions) {
      return {
        id: summary.id,
        title: summary.displayTitle || untitled,
        // The host menu's rename draft is the raw title, not the untitled label.
        menuTitle: summary.blank ? '' : summary.title?.trim() ?? '',
        workspace: owner?.title ?? '',
        // A known owner names its Workspace; once the list has loaded, a Session
        // no Workspace accounts for sits in the "Ungrouped" bucket (`''`).
        // Before that, leave it unknown so nothing is guessed.
        workspaceId: owner?.workspaceId ?? (loaded ? '' : undefined),
        updatedAt: toMillis(summary.updatedAt),
        // The Session's own working directory, which the host's hover card shows
        // under the title. The Host omits it for a Session that reports none.
        cwd: typeof summary.cwd === 'string' && summary.cwd !== '' ? summary.cwd : undefined,
        // Undefined while the Session is idle, and for the provisional New
        // Session blank: the row then draws no leading marker at all, which is
        // also how the sidebar renders both of those rows.
        status: summary.blank ? undefined : sessionStatus(sessions, statuses, summary.id),
        // Unlike the row marker, the hover card always states a status, idle
        // included, and names a running child beside the leading line.
        hoverStatuses: summary.blank
          ? []
          : sessionHoverStatuses(sessions, statuses, summary.id),
      };
    }

    /**
     * The pinned section's rows: every pinned Session that is not archived,
     * newest activity first. Ties keep the registry's order (most recently
     * pinned first).
     * @param pinnedSessionIds - the Host's pin set.
     * @param archivedSessionIds - the Host's archive set.
     * @param sessions - the Session-list snapshot.
     * @param statuses - the Session-status snapshot.
     * @param owners - Session id to the Workspace that accounts for it.
     * @param loaded - whether the Workspace list has loaded at all.
     * @param untitled - the label an untitled Session shows.
     * @returns the rows in display order.
     */
    function pinnedRows(
      pinnedSessionIds,
      archivedSessionIds,
      sessions,
      statuses,
      owners,
      loaded,
      untitled,
    ) {
      const archived = new Set(archivedSessionIds);
      const rows = [];
      for (const id of pinnedSessionIds) {
        if (archived.has(id)) continue;
        const summary = sessions.byId[id];
        if (summary === undefined) continue;
        rows.push(sessionRow(summary, owners.get(id), loaded, untitled, statuses, sessions));
      }
      // `updatedAt` is the Session-list activity stamp the Host advances on each
      // user-authored durable message.
      rows.sort((left, right) => right.updatedAt - left.updatedAt);
      return rows;
    }

    /**
     * The recent section's rows: every ordinary Session that is neither pinned
     * nor archived, newest activity first. The pinned section already holds the
     * pinned ones, so the two sections never show one conversation twice; the
     * provisional New Session blank and subagent children stay out exactly as
     * the sidebar hides them.
     * @param sessions - the Session-list snapshot.
     * @param archivedSessionIds - the Host's archive set.
     * @param pinnedSessionIds - the Host's pin set.
     * @param statuses - the Session-status snapshot.
     * @param owners - Session id to the Workspace that accounts for it.
     * @param loaded - whether the Workspace list has loaded at all.
     * @param untitled - the label an untitled Session shows.
     * @param muted - Session id to the removal-time activity stamp.
     * @returns the rows in display order.
     */
    function recentRows(
      sessions,
      archivedSessionIds,
      pinnedSessionIds,
      statuses,
      owners,
      loaded,
      untitled,
      muted,
    ) {
      const archived = new Set(archivedSessionIds);
      const pinned = new Set(pinnedSessionIds);
      const removed = muted ?? {};
      const rows = [];
      for (const id of sessions.ids) {
        const summary = sessions.byId[id];
        if (summary === undefined) continue;
        if (summary.blank || summary.origin === 'subagent') continue;
        if (archived.has(id) || pinned.has(id)) continue;
        // A Session the user removed from Recent stays out only while its
        // activity stamp has not advanced past the removal time. Any new
        // message pushes the stamp forward, which brings the Session back on
        // its own, exactly as if it had never been removed.
        if (removed[id] !== undefined && removed[id] >= toMillis(summary.updatedAt)) continue;
        rows.push(sessionRow(summary, owners.get(id), loaded, untitled, statuses, sessions));
      }
      // Equal stamps break by id, the way the sidebar's own recency order does,
      // so the list never jitters between renders.
      rows.sort((left, right) => right.updatedAt - left.updatedAt || (left.id < right.id ? -1 : 1));
      return rows;
    }

    /**
     * The root of the plugin's sidebar surface: the pinned section, the recent
     * section, their one shared hover card, and the one archive confirmation
     * both sections can raise. It is rendered through a portal into the host
     * node the plugin keeps at the top of the workspace list, inside the
     * "Workspaces" section.
     * @param props - composed slot props plus the injected host and actions.
     * @returns the portal, or null when there is nowhere to portal into.
     */
    function SidebarSections(props) {
      const {
        host,
        open: openSession,
        pin,
        unpin,
        archive,
        stopAndArchive,
        t,
        useWorkspaces,
        useSessions,
        useSessionStatus,
        usePanelInfo,
        settingsEvents,
        openMenu,
        useContextMenuTarget,
      } = props;
      const pinnedSessionIds = useWorkspaces((state) => state.pinnedSessionIds);
      const archivedSessionIds = useWorkspaces((state) => state.archivedSessionIds);
      const workspaces = useWorkspaces((state) => state.items);
      const sessions = useSessions((state) => state);
      // The sidebar's own live-status feed: running turns, running direct
      // children, pending interactions, and unviewed completions, keyed by
      // Session id. Reading the same source is what keeps these rows in step
      // with the workspace list rather than on a separate timer. A host that
      // predates the feed still renders: the running flag then comes from the
      // Session summary alone, and the other two states are simply never seen.
      const readStatuses = useSessionStatus ?? useNoSessionStatus;
      const statuses = readStatuses((state) => state);
      // The sidebar's own definition of "current session": the one retained by
      // the main view, and only while the Conversation (not a panel) is shown.
      const panelActive = usePanelInfo((info) => info.activePanelId !== null);
      const currentId = panelActive
        ? undefined
        : Object.values(sessions.byId).find((session) => (session.retainedBy?.mainView ?? 0) > 0)?.id;
      // The archive confirm request: `null` until the Host refuses an archive
      // because the Session still has running work. It lives at the root because
      // the row that raised it may unmount (a sibling archive changes the pinned
      // or recent set) while the question is still open.
      const [archiveRequest, setArchiveRequest] = React.useState(null);
      // The plugin's own settings popup and the preferences it edits. Both
      // live at the root so either section header can open the same popup and
      // every row reads the same value; the choice is persisted on each click.
      const [settingsOpen, setSettingsOpen] = React.useState(false);
      React.useEffect(() => {
        const openSettings = () => setSettingsOpen(true);
        settingsEvents.addEventListener('open', openSettings);
        return () => settingsEvents.removeEventListener('open', openSettings);
      }, [settingsEvents]);
      const [preferences, setPreferences] = React.useState(readPreferences);
      const { expandWorkspaceOnOpen, recentPageSize, showPinned, showRecent } = preferences;
      React.useEffect(() => writePreferences(preferences), [preferences]);
      // Sessions the user removed from Recent, keyed by id. The stored value is
      // the activity stamp at removal time and nothing else: no title, no
      // content, no Workspace change. The record is browser-local.
      const [muted, setMuted] = React.useState(readMuted);
      React.useEffect(() => writeMuted(muted), [muted]);
      const changePreference = (key, value) => {
        setPreferences((previous) => {
          const next = { ...previous, [key]: value };
          return next;
        });
      };
      // The one shared hover card. Rows never each own a portal: the pointer's
      // current row and the card's viewport position live here, so two rows can
      // hand the card over without a gap. The host's own dwell is copied: the
      // first card waits 800ms, a neighbouring row replaces an open one at once,
      // and leaving the row and card waits 100ms before it closes.
      const [hoverCard, setHoverCard] = React.useState(null);
      const hoverDelay = React.useRef(0);
      const hoverCloseDelay = React.useRef(0);
      const hoverWarm = React.useRef(false);
      const hideHover = React.useCallback(() => {
        window.clearTimeout(hoverDelay.current);
        window.clearTimeout(hoverCloseDelay.current);
        hoverDelay.current = 0;
        hoverCloseDelay.current = 0;
        hoverWarm.current = false;
        setHoverCard(null);
      }, []);
      const revealHover = React.useCallback((sessionId, element) => {
        if (!(element instanceof HTMLElement) || !element.isConnected) return;
        const rect = element.getBoundingClientRect();
        hoverWarm.current = true;
        setHoverCard({ id: sessionId, element, left: rect.right + HOVER_CARD_GAP, top: rect.top });
      }, []);
      const beginHover = React.useCallback(
        (row, element) => {
          window.clearTimeout(hoverDelay.current);
          window.clearTimeout(hoverCloseDelay.current);
          hoverDelay.current = 0;
          hoverCloseDelay.current = 0;
          if (hoverWarm.current) {
            revealHover(row.id, element);
            return;
          }
          hoverDelay.current = window.setTimeout(() => {
            hoverDelay.current = 0;
            revealHover(row.id, element);
          }, HOVER_CARD_DELAY);
        },
        [revealHover],
      );
      const endHover = React.useCallback(() => {
        window.clearTimeout(hoverDelay.current);
        window.clearTimeout(hoverCloseDelay.current);
        hoverDelay.current = 0;
        hoverCloseDelay.current = window.setTimeout(() => {
          hoverCloseDelay.current = 0;
          hoverWarm.current = false;
          setHoverCard(null);
        }, HOVER_CARD_CLOSE_DELAY);
      }, []);
      // Entering the card cancels the dwell started when the pointer left the
      // row, so the card stays put while it is being read; it closes once the
      // pointer leaves both again.
      const keepHover = React.useCallback(() => {
        window.clearTimeout(hoverDelay.current);
        window.clearTimeout(hoverCloseDelay.current);
        hoverDelay.current = 0;
        hoverCloseDelay.current = 0;
      }, []);
      const raiseArchive = (row) => {
        hideHover();
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
      };
      // Opening a row first opens the Workspace that owns it, so the Session
      // the sidebar marks as current is actually on screen. The open call is
      // unchanged, so the sections keep their own `dshUS-current` highlight and
      // the sidebar keeps its native selected row. The reveal step is the one
      // preference: with it off, the click only opens the Session and pins the
      // group's current collapsed state so the sidebar's own current-Session
      // expansion cannot unfold it either.
      const openRow = (row) => {
        hideHover();
        if (expandWorkspaceOnOpen) expandWorkspacePath(workspaces, row.workspaceId);
        else pinCollapsedWorkspace(row.workspaceId);
        openSession(row.id);
      };

      const owners = React.useMemo(() => {
        const index = new Map();
        for (const workspace of workspaces) {
          for (const id of workspace.sessionIds) index.set(id, workspace);
        }
        return index;
      }, [workspaces]);

      const loaded = workspaces.length > 0;
      const untitled = t('untitled');
      const pinned = React.useMemo(
        () =>
          pinnedRows(
            pinnedSessionIds,
            archivedSessionIds,
            sessions,
            statuses,
            owners,
            loaded,
            untitled,
          ),
        [pinnedSessionIds, archivedSessionIds, sessions, statuses, owners, loaded, untitled],
      );
      const recent = React.useMemo(
        () =>
          recentRows(
            sessions,
            archivedSessionIds,
            pinnedSessionIds,
            statuses,
            owners,
            loaded,
            untitled,
            muted,
          ),
        [sessions, archivedSessionIds, pinnedSessionIds, statuses, owners, loaded, untitled, muted],
      );

      const dialog = h(ArchiveConfirmDialog, {
        request: archiveRequest,
        stopAndArchive,
        onSettle: () => setArchiveRequest(null),
        t,
      });
      const settingsDialog =
        settingsOpen &&
        h(SettingsDialog, {
          preferences,
          mutedCount: Object.keys(muted).length,
          onRestoreMuted: () => setMuted({}),
          onChangePreference: changePreference,
          onClose: () => setSettingsOpen(false),
          t,
        });

      // The host menu's captured target, so the row that opened it stays marked
      // after the pointer leaves. Undefined until a session menu is open.
      const readMenuTarget = useContextMenuTarget ?? useNoContextMenuTarget;
      const menuSessionId = readMenuTarget(
        (target) => (target?.kind === 'session' ? target.value.sessionId : undefined),
      );
      // A card never floats over an open menu or a modal dialog, exactly as the
      // host hides its own card while a Session row menu is open.
      React.useEffect(() => {
        if (menuSessionId !== undefined || settingsOpen || archiveRequest !== null) hideHover();
      }, [menuSessionId, settingsOpen, archiveRequest, hideHover]);
      // Resolve the card's Session from the current lists, so a status change or
      // a Workspace assignment reaches the open card without reopening it.
      const hoveredRow = React.useMemo(() => {
        if (hoverCard === null) return undefined;
        return (
          pinned.find((row) => row.id === hoverCard.id) ??
          recent.find((row) => row.id === hoverCard.id)
        );
      }, [hoverCard, pinned, recent]);
      // The sidebar scrolls, and a row can disappear (unpinned into a collapsed
      // section, archived, folded, or its whole section hidden) while its card is
      // open. This check runs after every render because those unmounts happen
      // inside the sections' own state, which the root never sees.
      React.useEffect(() => {
        if (hoverCard === null) return;
        if (hoveredRow === undefined || !hoverCard.element.isConnected) hideHover();
      });
      const hoverAnchor = hoverCard === null ? undefined : hoverCard.element;
      React.useEffect(() => {
        if (hoverAnchor === undefined) return undefined;
        let frame = 0;
        const place = () => {
          frame = 0;
          if (!hoverAnchor.isConnected) {
            hideHover();
            return;
          }
          const rect = hoverAnchor.getBoundingClientRect();
          const left = rect.right + HOVER_CARD_GAP;
          const top = rect.top;
          setHoverCard((current) =>
            current === null || current.element !== hoverAnchor
              ? current
              : current.left === left && current.top === top
                ? current
                : { ...current, left, top },
          );
        };
        const schedule = () => {
          if (frame === 0) frame = requestAnimationFrame(place);
        };
        window.addEventListener('scroll', schedule, true);
        window.addEventListener('resize', schedule);
        return () => {
          if (frame !== 0) cancelAnimationFrame(frame);
          window.removeEventListener('scroll', schedule, true);
          window.removeEventListener('resize', schedule);
        };
      }, [hoverAnchor, hideHover]);
      const hoverCardElement =
        hoverCard !== null && hoveredRow !== undefined
          ? h(SessionHoverCard, {
              key: hoveredRow.id,
              card: hoverCard,
              row: hoveredRow,
              onEnter: keepHover,
              onLeave: endHover,
              t,
            })
          : null;
      // Removing a row from Recent only records its activity stamp: the
      // Session, its Workspace, its pin and its history are untouched. The
      // record stops applying the moment new activity advances that stamp, so
      // the Session walks back into Recent on its own.
      const muteRow = (row) => {
        hideHover();
        setMuted((previous) => ({ ...previous, [row.id]: row.updatedAt }));
      };
      const shared = {
        currentId,
        onOpen: openRow,
        onArchive: raiseArchive,
        onMute: muteRow,
        onOpenMenu: (sessionId, displayTitle, point) => {
          const workspaceId = owners.get(sessionId)?.workspaceId ?? (loaded ? '' : undefined);
          openMenu(sessionId, displayTitle, point, () =>
            revealOriginalSession(workspaces, sessionId, workspaceId, Object.keys(sessions.byId).length),
          );
        },
        menuSessionId,
        onOpenSettings: () => setSettingsOpen(true),
        settingsOpen,
        onHoverStart: beginHover,
        onHoverEnd: endHover,
        t,
      };

      const body = h(
        React.Fragment,
        null,
        showPinned && h(PinnedSection, {
          ...shared,
          rows: pinned,
          onUnpin: (row) => unpin(row.id),
        }),
        showRecent && h(RecentSection, {
          ...shared,
          rows: recent,
          pageSize: recentPageSize,
          onPin: (row) => pin(row.id),
        }),
        settingsDialog,
        dialog,
        hoverCardElement,
      );

      return host === null ? null : createPortal(body, host);
    }

    /**
     * One collapsible section header, copied from the host's "Workspaces"
     * header: the row itself is the toggle, the chevron states the direction,
     * and the settings entry appears at the row's right edge on hover. The entry
     * is a sibling of the toggle rather than a child, because a button cannot
     * nest inside another button.
     * @param props - the visible label, the expanded state, the toggle, the labels naming the action, and the settings entry.
     * @returns the header row.
     */
    function SectionHeader({
      label,
      expanded,
      onToggle,
      expandLabel,
      collapseLabel,
      onOpenSettings,
      settingsOpen,
      settingsLabel,
    }) {
      return h(
        'div',
        { className: 'dshUS-headerRow' },
        h(
          'button',
          {
            type: 'button',
            className: 'dshUS-header',
            'aria-expanded': expanded,
            'aria-label': expanded ? collapseLabel : expandLabel,
            title: expanded ? collapseLabel : expandLabel,
            onClick: onToggle,
          },
          h('span', { className: 'dshUS-label' }, label),
          h(ChevronGlyph, { open: expanded }),
        ),
        h(
          'button',
          {
            type: 'button',
            className: 'dshUS-settingsButton',
            'aria-label': settingsLabel,
            'aria-haspopup': 'dialog',
            'aria-expanded': settingsOpen,
            title: settingsLabel,
            onClick: onOpenSettings,
          },
          h(SettingsGlyph, { size: 16 }),
        ),
      );
    }

    /** The placeholder row a section shows while it holds no Session. */
    function EmptyRow({ label }) {
      return h('div', { className: 'dshUS-empty' }, h('span', { className: 'dshUS-emptyLabel' }, label));
    }

    /**
     * One Session row: an optional leading status marker, the title, the
     * relative time, and the trailing actions that replace the time on hover or
     * keyboard focus. A pinned row keeps the host's own pin marker where the
     * time would end, so a pinned row looks pinned at rest exactly as the
     * sidebar's rows do. Hovering the row starts the dwell that reveals the
     * shared hover card; no native `title` tooltip competes with it.
     * @param props - the row, the current Session id, the open handler, the host menu opener, the trailing buttons, the pin marker, the hover hooks, and the translator.
     * @returns the row element.
     */
    function SessionRow({
      row,
      currentId,
      onOpen,
      onOpenMenu,
      menuOpen,
      actions,
      pinned,
      onHoverStart,
      onHoverEnd,
      t,
    }) {
      const now = Date.now();
      const statusLabel = row.status === undefined ? undefined : statusText(row.status, t);
      // Same capture the host's session rows use: right-click, the Context Menu
      // key, or Shift+F10 open the shared session menu at the pointer or the row.
      const showMenu = (point, event) => {
        if (typeof onOpenMenu !== 'function') return;
        event.preventDefault();
        event.stopPropagation();
        if (event.currentTarget instanceof HTMLElement) event.currentTarget.focus({ preventScroll: true });
        onOpenMenu(row.id, row.menuTitle ?? '', point);
      };
      const className = ['dshUS-row', row.id === currentId ? 'dshUS-current' : '', menuOpen ? 'dshUS-menuOpen' : '']
        .filter(Boolean)
        .join(' ');
      return h(
        'div',
        {
          className,
          role: 'button',
          tabIndex: 0,
          'aria-current': row.id === currentId ? 'true' : undefined,
          'aria-haspopup': 'menu',
          'aria-label':
            statusLabel === undefined
              ? t('openNamed', { title: row.title })
              : t('openNamedStatus', { title: row.title, status: statusLabel }),
          onClick: () => onOpen(row),
          // Only a mouse on a hover-capable device starts the card, exactly as
          // the host's rows do; touch and pen have no hover to dwell on.
          onPointerEnter: (event) => {
            if (event.pointerType !== 'mouse') return;
            if (!window.matchMedia('(any-hover: hover)').matches) return;
            onHoverStart(row, event.currentTarget);
          },
          onPointerLeave: onHoverEnd,
          onContextMenu: (event) => {
            const keyboard = event.clientX === 0 && event.clientY === 0;
            const rect = keyboard ? event.currentTarget.getBoundingClientRect() : undefined;
            showMenu(
              { x: rect?.left ?? event.clientX, y: rect?.bottom ?? event.clientY },
              event,
            );
          },
          onKeyDown: (event) => {
            if (
              !event.repeat &&
              !event.nativeEvent.isComposing &&
              !event.ctrlKey &&
              !event.altKey &&
              !event.metaKey &&
              (event.key === 'ContextMenu' || (event.key === 'F10' && event.shiftKey))
            ) {
              const rect = event.currentTarget.getBoundingClientRect();
              showMenu({ x: rect.left, y: rect.bottom }, event);
              return;
            }
            if (event.key !== 'Enter' && event.key !== ' ') return;
            event.preventDefault();
            onOpen(row);
          },
        },
        row.status === undefined
          ? h('span', { className: 'dshUS-status', 'aria-hidden': 'true' })
          : h(StatusMark, { status: row.status, label: statusLabel }),
        h('span', { className: 'dshUS-title' }, row.title),
        h('span', { className: 'dshUS-time' }, relativeTime(row.updatedAt, now, t)),
        pinned === true &&
          h(
            'span',
            {
              className: 'dshUS-pinMark',
              role: 'img',
              'aria-label': t('pinned'),
              title: t('pinned'),
            },
            h(PinGlyph, { size: 14 }),
          ),
        // The trailing group swallows clicks, so a button press never also
        // opens the row (the host's rows do the same).
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
          actions.map((action) =>
            h(
              'button',
              {
                key: action.key,
                type: 'button',
                className: 'dshUS-action',
                'aria-label': action.label,
                title: action.title,
                onClick: action.onClick,
              },
              action.icon,
            ),
          ),
        ),
      );
    }

    /**
     * The hover card of one Session row: the host Session card's fields — full
     * title, working directory, relative time, and every live status, idle
     * included — plus the one field these sections add, the Workspace that owns
     * the Session. The Workspace is named by its title, which the user can
     * rename, never by its directory name. The card portals to the body because
     * the sidebar's scroll box would clip it, and it hangs to the right of the
     * row like the host's own card, moving up when it would leave the viewport.
     * Entering the card holds it open while the pointer reads it; leaving it
     * starts the same close dwell as leaving the row.
     * @param props - the anchor position, the row, the pointer hooks, and the translator.
     * @returns the portaled card.
     */
    function SessionHoverCard({ card, row, onEnter, onLeave, t }) {
      const node = React.useRef(null);
      const [placement, setPlacement] = React.useState({ left: card.left, top: card.top });
      React.useLayoutEffect(() => {
        const element = node.current;
        if (element === null) return undefined;
        // Same viewport guards as the host's compact card: keep the whole card
        // on screen when the row sits near the window's right or bottom edge.
        // The observer reapplies them when the content grows (a Workspace line
        // arriving, a second status line, a longer title).
        const place = () => {
          const left = Math.max(8, Math.min(card.left, window.innerWidth - element.offsetWidth - 8));
          const top = Math.max(8, Math.min(card.top, window.innerHeight - element.offsetHeight - 8));
          setPlacement((current) =>
            current.left === left && current.top === top ? current : { left, top },
          );
        };
        place();
        const observer = new ResizeObserver(place);
        observer.observe(element);
        return () => observer.disconnect();
      }, [card.left, card.top, row.id]);
      const now = Date.now();
      const time = hoverTime(row.updatedAt, now, t);
      // An unknown owner (the Workspace list has not loaded) omits the field; a
      // loaded list with no owner means the Session sits in "Ungrouped".
      const workspace =
        row.workspaceId === undefined
          ? undefined
          : row.workspace === ''
            ? t('hover.ungrouped')
            : row.workspace;
      return createPortal(
        h(
          'div',
          {
            ref: node,
            className: 'dshUS-hoverCard',
            role: 'tooltip',
            style: { left: placement.left, top: placement.top },
            onPointerEnter: onEnter,
            onPointerLeave: onLeave,
          },
          h('div', { className: 'dshUS-hoverTitle' }, row.title),
          workspace !== undefined &&
            h('div', { className: 'dshUS-hoverWorkspace' }, workspace),
          row.cwd !== undefined && h('div', { className: 'dshUS-hoverPath' }, row.cwd),
          time !== '' && h('div', { className: 'dshUS-hoverTime' }, time),
          row.hoverStatuses.map((status) =>
            h(
              'div',
              { className: 'dshUS-hoverStatus', key: `${status.label}-${status.count ?? ''}` },
              h(StatusGlyph, { status }),
              h('span', null, statusText(status, t)),
            ),
          ),
        ),
        document.body,
      );
    }

    /** The archive button every row owns, built from one row's identity. */
    function archiveAction(row, onArchive, t) {
      return {
        key: 'archive',
        label: t('archiveNamed', { title: row.title }),
        title: t('archive'),
        icon: h(ArchiveGlyph, { size: 14 }),
        onClick: () => onArchive(row),
      };
    }

    /**
     * The pinned section: every pinned Session across all Workspaces, newest
     * activity first. Its trailing action unpins, which is the one state the
     * recent section never has to offer.
     * @returns the section element.
     */
    function PinnedSection({
      rows,
      currentId,
      onOpen,
      onArchive,
      onUnpin,
      onOpenMenu,
      menuSessionId,
      onOpenSettings,
      settingsOpen,
      onHoverStart,
      onHoverEnd,
      t,
    }) {
      // Expanded by default; the choice lasts for this mount. Nothing is
      // persisted, so a reload returns to the default and no stale collapse can
      // hide the section without the user knowing why.
      const [expanded, setExpanded] = React.useState(true);
      const toggleExpanded = () => setExpanded((value) => !value);
      return h(
        'section',
        { className: 'dshUS-root', 'aria-label': t('section') },
        h(SectionHeader, {
          label: t('section'),
          expanded,
          onToggle: toggleExpanded,
          expandLabel: t('expand'),
          collapseLabel: t('collapse'),
          onOpenSettings,
          settingsOpen,
          settingsLabel: t('settings'),
        }),
        expanded &&
          (rows.length === 0
            ? h(EmptyRow, { label: t('empty') })
            : rows.map((row) =>
                h(SessionRow, {
                  key: row.id,
                  row,
                  currentId,
                  onOpen,
                  onOpenMenu,
                  menuOpen: menuSessionId === row.id,
                  onHoverStart,
                  onHoverEnd,
                  t,
                  // Every row here is pinned, so every row wears the marker.
                  pinned: true,
                  actions: [
                    archiveAction(row, onArchive, t),
                    {
                      key: 'unpin',
                      label: t('unpinNamed', { title: row.title }),
                      title: t('unpin'),
                      icon: h(PinGlyph, { size: 14 }),
                      onClick: () => onUnpin(row),
                    },
                  ],
                }),
              )),
      );
    }

    /**
     * The recent section: ordinary Sessions that are not pinned, newest
     * activity first, revealed from a configurable rest size. The header
     * collapses the whole section; the footer button reveals five more, and
     * once every Session is on screen it folds the list back to its rest size.
     * @param props - the rows, the configured page size, row callbacks, and the translator.
     * @returns the section element.
     */
    function RecentSection({
      rows,
      pageSize,
      currentId,
      onOpen,
      onArchive,
      onPin,
      onMute,
      onOpenMenu,
      menuSessionId,
      onOpenSettings,
      settingsOpen,
      onHoverStart,
      onHoverEnd,
      t,
    }) {
      const [expanded, setExpanded] = React.useState(true);
      // How many rows the list is allowed to show; the button below the list
      // moves it by five, and no change to the Session set resets it, so a new
      // message elsewhere never folds a list the user opened. A new rest size
      // is a deliberate choice, so it does reset it.
      const [limit, setLimit] = React.useState(pageSize);
      React.useEffect(() => setLimit(pageSize), [pageSize]);
      const toggleExpanded = () => setExpanded((value) => !value);
      const page = recentWindow(rows.length, limit, pageSize);
      const visible = rows.slice(0, page.visible);
      const pager =
        rows.length > pageSize
          ? h(
              'button',
              {
                type: 'button',
                className: 'dshUS-more',
                'aria-expanded': page.allShown,
                title: page.allShown ? t('showLess') : t('showMore'),
                onClick: () => setLimit(page.next),
              },
              page.allShown ? t('showLess') : t('showMore'),
            )
          : null;
      return h(
        'section',
        { className: 'dshUS-root', 'aria-label': t('recent') },
        h(SectionHeader, {
          label: t('recent'),
          expanded,
          onToggle: toggleExpanded,
          expandLabel: t('recentExpand'),
          collapseLabel: t('recentCollapse'),
          onOpenSettings,
          settingsOpen,
          settingsLabel: t('settings'),
        }),
        expanded &&
          (rows.length === 0
            ? h(EmptyRow, { label: t('recentEmpty') })
            : visible.map((row) =>
                h(SessionRow, {
                  key: row.id,
                  row,
                  currentId,
                  onOpen,
                  onOpenMenu,
                  menuOpen: menuSessionId === row.id,
                  onHoverStart,
                  onHoverEnd,
                  t,
                  // No row here is pinned, so no row wears the marker and the
                  // time is the row's trailing cell, flush with its edge.
                  pinned: false,
                  actions: [
                    archiveAction(row, onArchive, t),
                    {
                      key: 'pin',
                      label: t('pinNamed', { title: row.title }),
                      title: t('pin'),
                      icon: h(PinGlyph, { size: 14 }),
                      onClick: () => onPin(row),
                    },
                    {
                      key: 'mute',
                      label: t('muteNamed', { title: row.title }),
                      title: t('mute'),
                      icon: h(EyeOffGlyph, { size: 14 }),
                      onClick: () => onMute(row),
                    },
                  ],
                }),
              )),
        expanded && pager,
      );
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

    /** Entry on this bundle's native Plugins detail page, sharing the sidebar popup. */
    function PluginSettingsEntry({ t, onOpenSettings }) {
      return h(
        'div',
        { className: 'dshUS-settingsRow' },
        h(
          'div',
          { className: 'dshUS-settingsCopy' },
          h('div', { className: 'dshUS-settingsRowTitle' }, t('settingsTitle')),
          h('div', { className: 'dshUS-settingsRowDesc' }, t('settingsEntryDesc')),
        ),
        h(
          'button',
          { type: 'button', className: 'dshUS-button dshUS-buttonOutline', onClick: onOpenSettings },
          t('settingsOpen'),
        ),
      );
    }

    /**
     * One stepper chevron: a small V pointing up or down beside the count field,
     * drawn at the size of the host's compact controls.
     * @param props - the direction the chevron points.
     * @returns the chevron SVG.
     */
    function StepGlyph({ direction }) {
      return h(
        'svg',
        {
          width: 12,
          height: 12,
          viewBox: '0 0 16 16',
          fill: 'none',
          xmlns: 'http://www.w3.org/2000/svg',
          'aria-hidden': 'true',
          strokeWidth: 2,
          className: direction === 'up' ? 'dshUS-stepGlyphUp' : undefined,
        },
        h('path', {
          d: 'M4 6L7.29289 9.29289C7.68342 9.68342 8.31658 9.68342 8.70711 9.29289L12 6',
          stroke: 'currentColor',
        }),
      );
    }

    /**
     * The Recent page-size field: the number, plus one chevron per direction.
     * Typing only moves the draft, so nothing is applied mid-edit; the value is
     * confirmed when the field is left, Enter is pressed, or a chevron is
     * clicked. Confirming writes the clamped number and drops a draft that is
     * not a number at all. The draft follows the stored value when the
     * preference changes elsewhere.
     * @param props - the stored size, its writer, the field and button labels, and the id of its description.
     * @returns the field and its stepper.
     */
    function RecentPageSizeInput({
      value,
      onChange,
      label,
      descriptionId,
      increaseLabel,
      decreaseLabel,
    }) {
      const [draft, setDraft] = React.useState(String(value));
      React.useEffect(() => {
        setDraft(String(value));
      }, [value]);
      // What the field itself considers its number: a usable draft, clamped, or
      // the stored value while the draft says nothing readable.
      const parsed = draft.trim() === '' ? Number.NaN : Number(draft);
      const current = Number.isFinite(parsed) ? clampRecentPageSize(parsed) : value;
      const settle = () => {
        setDraft(String(current));
        if (current !== value) onChange(current);
      };
      // A click on a chevron is a confirmation of its own, so it applies its
      // step immediately instead of waiting for the field to be left.
      const step = (delta) => {
        const next = clampRecentPageSize(current + delta);
        setDraft(String(next));
        if (next !== value) onChange(next);
      };
      return h(
        'div',
        { className: 'dshUS-numberField' },
        h('input', {
          className: 'dshUS-number',
          type: 'number',
          inputMode: 'numeric',
          min: RECENT_PAGE_MIN,
          max: RECENT_PAGE_MAX,
          step: 1,
          value: draft,
          'aria-label': label,
          'aria-describedby': descriptionId,
          // Typing only edits the draft; Enter, blur, or a chevron confirms it.
          onChange: (event) => setDraft(event.target.value),
          onBlur: settle,
          onKeyDown: (event) => {
            if (event.key !== 'Enter') return;
            event.preventDefault();
            settle();
            event.currentTarget.blur();
          },
        }),
        h(
          'span',
          { className: 'dshUS-stepper' },
          h(
            'button',
            {
              type: 'button',
              className: 'dshUS-step',
              'aria-label': increaseLabel,
              title: increaseLabel,
              disabled: current >= RECENT_PAGE_MAX,
              onClick: () => step(1),
            },
            h(StepGlyph, { direction: 'up' }),
          ),
          h(
            'button',
            {
              type: 'button',
              className: 'dshUS-step',
              'aria-label': decreaseLabel,
              title: decreaseLabel,
              disabled: current <= RECENT_PAGE_MIN,
              onClick: () => step(-1),
            },
            h(StepGlyph, { direction: 'down' }),
          ),
        ),
      );
    }

    /**
     * The plugin's settings popup, built to read like the host's settings panel:
     * a centered layer-2 panel with a 54px header and preference rows whose
     * switch is the host's own 36x20 control and whose count field is a themed
     * number input with one chevron per direction. It portals to the body
     * because the sidebar column clips its contents, and it owns no saved state:
     * each control applies its value when the user confirms it — a switch on
     * click, the count on Enter, blur, or a chevron — so closing the popup keeps
     * every confirmed choice.
     * @param props - the preference values, their writer, settlement, and the translator.
     * @returns the modal layer.
     */
    function SettingsDialog({ preferences, mutedCount, onRestoreMuted, onChangePreference, onClose, t }) {
      const titleId = React.useId();
      const descriptionId = React.useId();
      const panel = React.useRef(null);
      const settings = [
        { key: 'showPinned', label: 'settingsShowPinned', description: 'settingsShowPinnedDesc' },
        { key: 'showRecent', label: 'settingsShowRecent', description: 'settingsShowRecentDesc' },
        { key: 'expandWorkspaceOnOpen', label: 'settingsExpandWorkspace',
          description: 'settingsExpandWorkspaceDesc' },
        { key: 'recentPageSize', control: 'number', label: 'settingsRecentPageSize',
          description: 'settingsRecentPageSizeDesc' },
      ];
      // Focus moves into the panel on open (the host's Modal does the same), and
      // the effect puts it back on the section's settings entry on close. That
      // entry hides when the header is not hovered and a hidden element cannot
      // take focus, so the fallback is the always-visible section toggle beside
      // it: keyboard users then tab once more to the revealed gear.
      React.useEffect(() => {
        const previous = document.activeElement;
        panel.current?.focus();
        return () => {
          if (!(previous instanceof HTMLElement)) return;
          const target =
            getComputedStyle(previous).visibility === 'hidden'
              ? previous.previousElementSibling
              : previous;
          if (target instanceof HTMLElement) target.focus();
        };
      }, []);
      // Escape closes the popup while it is the top layer. The listener reads
      // the latest close handler through the effect's dependency, so a re-render
      // never leaves a stale one attached.
      React.useEffect(() => {
        const onKeyDown = (event) => {
          if (event.key !== 'Escape') return;
          event.preventDefault();
          event.stopPropagation();
          onClose();
        };
        document.addEventListener('keydown', onKeyDown, true);
        return () => {
          document.removeEventListener('keydown', onKeyDown, true);
        };
      }, [onClose]);
      return createPortal(
        h(
          'div',
          { className: 'dshUS-settingsRoot', role: 'presentation' },
          h('div', { className: 'dshUS-settingsMask', 'aria-hidden': 'true', onClick: onClose }),
          h(
            'div',
            {
              ref: panel,
              tabIndex: -1,
              className: 'dshUS-settingsPanel',
              role: 'dialog',
              'aria-modal': 'true',
              'aria-labelledby': titleId,
            },
            h(
              'div',
              { className: 'dshUS-settingsHeader' },
              h('h2', { className: 'dshUS-settingsTitle', id: titleId }, t('settingsTitle')),
              h(
                'button',
                {
                  type: 'button',
                  className: 'dshUS-dialogClose',
                  'aria-label': t('settingsClose'),
                  title: t('settingsClose'),
                  onClick: onClose,
                },
                h(CloseGlyph, { size: 14 }),
              ),
            ),
            h(
              'div',
              { className: 'dshUS-settingsBody' },
              ...settings.map((setting) => {
                const copyId = descriptionId + setting.key;
                return h(
                  'div',
                  { className: 'dshUS-settingsRow', key: setting.key },
                  h(
                    'div',
                    { className: 'dshUS-settingsCopy' },
                    h('div', { className: 'dshUS-settingsRowTitle' }, t(setting.label)),
                    h('div', { className: 'dshUS-settingsRowDesc', id: copyId },
                      t(setting.description)),
                  ),
                  setting.control === 'number'
                    ? h(RecentPageSizeInput, {
                        value: preferences[setting.key],
                        onChange: (value) => onChangePreference(setting.key, value),
                        label: t(setting.label),
                        descriptionId: copyId,
                        increaseLabel: t('settingsPageSizeIncrease'),
                        decreaseLabel: t('settingsPageSizeDecrease'),
                      })
                    : h(
                        'button',
                        {
                          type: 'button',
                          role: 'switch',
                          className: 'dshUS-switch',
                          'aria-checked': preferences[setting.key],
                          'aria-label': t(setting.label),
                          'aria-describedby': copyId,
                          onClick: () => onChangePreference(setting.key, !preferences[setting.key]),
                        },
                        h('span', { className: 'dshUS-switchThumb' }),
                      ),
                );
              }),
              h(
                'div',
                { className: 'dshUS-settingsRow', key: 'mutedFromRecent' },
                h(
                  'div',
                  { className: 'dshUS-settingsCopy' },
                  h('div', { className: 'dshUS-settingsRowTitle' }, t('settingsMuted')),
                  h(
                    'div',
                    { className: 'dshUS-settingsRowDesc', id: descriptionId + 'muted' },
                    `${mutedCount === 0
                      ? t('mutedNone')
                      : `${t('settingsMutedDesc')} ${t('mutedRestoreDesc')}`} ${t('mutedCount', { n: mutedCount })}`,
                  ),
                ),
                mutedCount === 0
                  ? null
                  : h(
                      'button',
                      {
                        type: 'button',
                        className: 'dshUS-button dshUS-buttonOutline dshUS-settingsRestore',
                        onClick: onRestoreMuted,
                      },
                      t('mutedRestore'),
                    ),
              ),
            ),
          ),
        ),
        document.body,
      );
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
     * The scroll box holding the workspace list. In the grouped and flat views
     * the `role="tree"` box scrolls itself; while searching, the results tree
     * sits one level inside that same box, so the nearest scrolling ancestor is
     * the seat either way. The sections live at the top of this box, inside the
     * "Workspaces" section, and scroll away with the workspace rows instead of
     * taking a fixed slice of the sidebar above them.
     * @param anchor - the Workspaces slot anchor.
     * @returns the scroll box, or null while the sidebar renders no list.
     */
    function workspaceScrollBox(anchor) {
      const tree = anchor.querySelector('[role="tree"]');
      if (!(tree instanceof Element)) return null;
      for (let node = tree; node !== null && node !== anchor; node = node.parentElement) {
        const { overflowY } = getComputedStyle(node);
        if (overflowY === 'auto' || overflowY === 'scroll') return node;
      }
      return null;
    }

    /**
     * Keep the host node at the top of the workspace list. Both sections share
     * that node and stack inside it, so they read as the first two groups of
     * the "Workspaces" section rather than as sections of their own. Hiding in
     * the collapsed rail mirrors the shell's own rule, and the list cannot hold
     * the sections while the user is searching its rows, so they step aside for
     * the results.
     * @param host - the container the portal renders into.
     * @returns the disposer that detaches the node and its observers.
     */
    function mountHost(host) {
      let frame = 0;
      let resize;

      const place = () => {
        const anchor = document.querySelector('[data-slot="sidebar.workspaces"]');
        if (!(anchor instanceof Element)) {
          host.remove();
          return;
        }
        const parent = anchor.parentElement;
        if (parent === null) return;
        const seat = workspaceScrollBox(anchor);
        if (seat === null) {
          host.remove();
          return;
        }
        if (host.parentElement !== seat || seat.firstElementChild !== host) {
          seat.insertBefore(host, seat.firstChild);
        }
        // Search results replace the list's rows; the sections would otherwise
        // sit above those results as unrelated pinned and recent rows.
        const search = anchor.querySelector('input[type="text"]');
        host.dataset.searching =
          search instanceof HTMLInputElement && search.value.trim() !== '' ? 'true' : 'false';
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

    /** Contribute the pinned and recent sections inside the workspace list. */
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
      // Both entry surfaces send requests to the single sidebar-owned dialog.
      const settingsEvents = new EventTarget();

      ctx.slots.inject('contextMenu.icon', () => ctx.slots.register({
        name: 'contextMenu.icon',
        key: 'up-session.reveal-original',
      }, RevealOriginalGlyph));

      // Only menus opened from our sections carry this callback. Native rows
      // continue to use the host's menu without the extra action.
      ctx.effect(() => ctx.contextMenus.register({
        id: 'up-session.reveal-original',
        target: 'session',
        order: 550, // After the host's file-manager action (500), before archive (600).
        observe: () => [ctx.locale],
        resolve: (target) => typeof target.revealOriginal === 'function' ? [{
          id: 'reveal-original',
          label: t('revealOriginal'),
          icon: { key: 'up-session.reveal-original' },
          run: target.revealOriginal,
        }] : [],
      }), 'up-session: reveal original menu action');
      ctx.effect(() => () => {
        cancelAnimationFrame(revealFrame);
        for (const cancel of pendingWorkspaceExpansions) cancel();
        cancelRevealExpansion = () => {};
        clearRevealHighlight();
      }, 'up-session: cancel pending reveal');

      ctx.slots.inject('plugins.bundle.config', () =>
        ctx.slots.register(
          {
            name: 'plugins.bundle.config',
            key: 'dsh-up-session',
            locale: NS,
            inject: () => ({ onOpenSettings: () => settingsEvents.dispatchEvent(new Event('open')) }),
          },
          PluginSettingsEntry,
        ),
      );

      const injected = () => ({
        host,
        settingsEvents,
        open: (sessionId) => {
          ctx.uiWorkspace.openSession(sessionId);
        },
        // Pin and unpin go through the same hop the sidebar's own row actions
        // use; a failure stays in the log, like an unpin failure always did.
        pin: (sessionId) => {
          ctx.uiWorkspace.pinSession(sessionId).catch((reason) => {
            console.warn('session pin rejected:', reason);
          });
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
        // The sidebar's own session menu (pin, rename, fork, copy id, Finder, archive).
        // Opening it here reuses every contribution registered for target "session".
        openMenu: (sessionId, displayTitle, point, revealOriginal) => {
          ctx.contextMenus.open(
            {
              kind: 'session',
              value: { sessionId, displayTitle, revealOriginal },
            },
            point,
          );
        },
        hooks: { contextMenuTarget: ctx.contextMenus.active },
      });

      ctx.slots.inject('shell.overlay', () =>
        ctx.slots.register(
          {
            name: 'shell.overlay',
            id: 'dsh-up-session',
            locale: NS,
            inject: injected,
          },
          SidebarSections,
        ),
      );
    }

    return {
      inject,
      apply,
    };
  },
});
