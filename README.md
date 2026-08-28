# EquityMind — web frontend

React + Vite chat interface for EquityMind. Talks to the backend over a
WebSocket and streams the answer in as it is written.

Deployed on Vercel; the backend lives in `equitymind-web-backend` on
Railway, which proxies through to `equitymind-core`.

## Running it

```bash
npm install
npm run dev          # localhost:5173, talks to a backend on this machine
npm run dev:phone    # also serves on the LAN, talks to Railway
```

`dev:phone` prints a `Network:` address that a phone on the same wifi can
open. It points at the deployed backend rather than a local one, so
nothing has to be running on this machine — useful when the point is to
look at the layout rather than to change the agent.

Which backend is in use is printed to the browser console on load. A
request going to the wrong one looks exactly like a request going to the
right one until the answers come back wrong, so it is worth a glance when
something behaves unexpectedly.

## Layout

```
src/
├── App.jsx              all state and the WebSocket lifecycle
├── config.js            picks the backend, prints which one
├── main.jsx             mounts React, blocks iOS pinch zoom
└── components/
    ├── Header.jsx          logo and the menu button for narrow screens
    ├── Sidebar.jsx         drawer below md, fixed panel above it
    ├── QueryInput.jsx      the box at the bottom
    ├── ProgressPanel.jsx   node-by-node progress while a query runs
    └── ReportPanel.jsx     the streamed answer
```

The components hold no state of their own — `App.jsx` owns everything and
passes it down.

## A query, end to end

```
QueryInput submits
  → App opens a WebSocket, sends { question, messages, session_memory }
  → the backend streams back four kinds of message:
        progress      a node started        → ProgressPanel
        sub_progress  a signal started      → ProgressPanel, indented
        token         a piece of the answer → ReportPanel
        done          finished              → duration, memory, history
```

`messages` and `session_memory` come back from the backend and are sent up
again with the next question. The frontend does not touch either.

## Notes on the mobile layout

The column is sized to `100dvh` with the message list as the only
scrolling element; the header and the input box are `shrink-0` and stay
put. `min-h-0` on the scroll area matters — without it a flex item
refuses to shrink below its content and the header gets pushed off the
top once the first answer arrives.

iOS Safari needs three things it does not get from the viewport meta tag:
a 16px font on the textarea, or focusing it zooms the page; `env(safe-area-inset-bottom)`
plus a fixed allowance for the toolbar, which sits over the page; and
`gesturestart`/`touchend` handlers in `main.jsx`, because `user-scalable=no`
is ignored on accessibility grounds.
