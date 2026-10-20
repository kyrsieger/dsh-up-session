# dsh-up-session

[简体中文](./README.md) | English

A simple DeepSeek Harness sidebar plugin: it inserts two sections, "Pinned" and "Recent", above the "Workspaces" list, gathering pinned sessions from all workspaces into one place and collecting your latest sessions into another.

<p align="center">
  <img src="./assets/screenshot.png" alt="The sidebar showing the Pinned and Recent sections above the Workspaces list">
</p>

## Pinned section

Gathers the pinned sessions of every workspace, newest activity first, and collapses like the host's own sections. Hovering a row reveals its archive and unpin buttons.

## Recent section

Sits between the pinned section and the workspaces, lists the sessions that are not pinned, newest activity first, and shows the latest five by default. It looks and collapses exactly like the pinned section. Once there are more than five sessions, a "Show more" button appears at the bottom of the list:

- each click reveals five more sessions,
- once every session is on screen the button reads "Show less",
- clicking "Show less" folds the list back to the latest five.

Hovering a row reveals its archive and pin buttons. Pinned sessions appear only in the pinned section, so no conversation is listed twice.

## License

This project is licensed under the [MIT License](./LICENSE).
