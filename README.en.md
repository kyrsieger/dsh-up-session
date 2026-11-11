<p align="center">
  <img src="./icon.svg" width="128" height="128" alt="dsh-up-session logo">
</p>

# dsh-up-session

[简体中文](./README.md) | English

A simple DeepSeek Harness sidebar plugin: it inserts two groups, "Pinned" and "Recent", at the top of the "Workspaces" list, gathering pinned sessions from all workspaces into one place and collecting your latest sessions into another.

<p align="center">
  <img src="./assets/screenshot.png" width="32%" alt="The sidebar showing the Pinned and Recent groups at the top of the Workspaces list">
  <img src="./assets/settings.png" width="64%" alt="The plugin settings popup with toggles for Show Pinned, Show Recent, and Reveal the session in its workspace">
</p>

## Installation and compatibility

**Upgrade to DSH 0.2.2-alpha.3 or later. This plugin uses the session menu API introduced in that version.**

Plugin version 1.1.0 requires DSH `>=0.2.2-alpha.3`. Installing it on an earlier DSH version may prevent DSH from starting.

**Web**

```sh
dsh plugin --profile web add dsh-up-session
```

Restart DSH after installation. If you use a custom profile, replace `web` with its name.

**Desktop**

Open **Plugins** in the sidebar, click **Add plugin**, enter `dsh-up-session`, and click **Enable now** after installation.

### Installing 1.0.3 on older DSH versions

If your DSH version is older than 0.2.2-alpha.3 and falls within plugin version 1.0.3's compatibility range (`>=0.2.1-rc.2`), install `dsh-up-session@1.0.3`.

**Web**

```sh
dsh plugin --profile web add dsh-up-session@1.0.3
```

Restart DSH after installation. If you use a custom profile, replace `web` with its name.

**Desktop**

Open **Plugins** in the sidebar, click **Add plugin**, enter `dsh-up-session@1.0.3`, and click **Enable now** after installation.

## Pinned section

Gathers the pinned sessions of every workspace, newest activity first, and collapses like the host's own sections. Hovering a row reveals its archive and unpin buttons.

Right-clicking a pinned or recent row, or focusing it and pressing the menu key or Shift+F10, opens the same session menu as a row in the workspace list: pin or unpin, rename, fork, copy the Session ID, reveal in the file manager, and archive. These items are the host's own contributions, so they stay in step with the same session further down the list. The plugin also adds “Show in original location” directly below the file-manager action. It expands the owning workspace (including collapsed ancestors in the workspace tree and any “Show more” session batches) and scrolls the list to the original session row. Its background fades in and out over three seconds using the current DSH primary brand color, following theme changes. This action works regardless of the “Reveal the session in its workspace” setting. Rename is prefilled with the session's own title; an untitled session is not prefilled with the "Untitled" label.

Both Pinned and Recent sit at the top of the workspaces list as its first two groups and scroll together with the workspace groups below. While the workspace search is open, they step aside so the list can show the results.

## Recent section

Sits between the pinned section and the workspace rows, lists the sessions that are not pinned, newest activity first, and shows the latest five by default. The rest count is configurable in Settings (1–50); "Show more" always adds five. It looks and collapses exactly like the pinned section. Once there are more sessions than the current count, a "Show more" button appears at the bottom of the list:

- each click reveals five more sessions,
- once every session is on screen the button reads "Show less",
- clicking "Show less" folds the list back to the configured count.

Hovering a row reveals its archive, pin and **Hide from Recent** buttons. The context menu is the same as in the pinned section. Pinned sessions appear only in the pinned section, so no conversation is listed twice.

By default, Recent only includes sessions updated less than seven days ago. Settings accepts 0–99 days; 0 disables the filter. A day is a continuous 24 hours, and a session is excluded as soon as it reaches the configured age, including running sessions, sessions waiting for a response, and the currently open session. Filtering only affects Recent; sessions remain in their original workspaces. "Show more" only reveals sessions that meet the filter.

The time filter follows the native session updates: for example, switching sessions updates the list and rechecks every idle session too. With no relevant page updates, a newly expired session may remain until the next update. The plugin adds no timer or page focus listener for filtering.

## Hide from Recent

Every recent row ends with a **Hide from Recent** button, shown with a slashed-eye icon on hover to the right of archive and pin. Clicking it hides the session from Recent only: it stays in its workspace with its position, title, history, pin and archive state untouched.

The plugin remembers just one thing about that moment, the session's activity stamp. Open the session from its workspace and send a new message and the stamp moves forward, which puts the session back into Recent on its own, with nothing else to click.

The record lives in browser storage and holds only the session id and that stamp — no titles, no content. It stops applying after a browser change or a cache clear, which is also the sign that no session data was touched. A mistaken click is reversible from Settings with one button.

## Session hover card

Resting the pointer on a row in Pinned or Recent for about 0.8 seconds opens the same Session hover card as a row in the workspace list: the full session title, working directory, relative time, and current status. Idle sessions read "Idle", and a pending interaction or running subagents get their own lines. The card also adds the title of the workspace that owns the session right below the session title — the renamable workspace title, not the project folder name.

The card's time and status come from the same data as the workspace list. Moving to a neighbouring row replaces the card immediately, and leaving both closes it. Touch devices have no hover and show no card.

## Settings

Each section header carries a gear at its right edge, shown while the pointer is over the header. Clicking it opens this plugin's settings popup, styled like DSH's own settings page.

You can also open the same settings popup from the sidebar via **Plugins → Installed plugins → dsh-up-session**, then click **Open settings** on the plugin detail page.

There are five settings:

- **Show Pinned** (on by default): show or hide the entire Pinned section.
- **Show Recent** (on by default): show or hide the entire Recent section. Both lists can be turned off together and enabled again through **Open settings** on the native plugin detail page.
- **Reveal the session in its workspace** (on by default): opening a session from Pinned or Recent also expands its workspace group in the sidebar so the original row is visible. Turn it off to open the session without changing which groups are expanded.
- **Sessions shown in Recent** (five by default): how many recent sessions Recent shows at rest. Accepts 1–50; a value outside that range snaps to the nearest bound. Typing applies on Enter or when the field loses focus, and the arrow buttons beside the field step by one. "Show more" always adds five, regardless of this count.
- **Recent time filter (days)** (7 by default): accepts only integers from 0 to 99; 0 disables the filter. Applies on Enter, blur, or an arrow-button click. Invalid input reverts to the previous valid value without rounding or clamping. The setting is stored locally in the browser; existing users also start with seven days.

The popup also carries a **Hidden sessions** row: it states how many sessions are currently hidden and offers one button to clear all hidden records. Restored sessions must still meet the time filter and other inclusion rules. With nothing hidden, the row shows no button.

## License

This project is licensed under the [MIT License](./LICENSE).
