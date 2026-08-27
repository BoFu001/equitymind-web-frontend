const isDev = import.meta.env.DEV

// Three ways this gets opened, and the backend address differs for each:
//
//   production            Railway
//   laptop, npm run dev   the backend on this machine, at localhost
//   phone, same wifi      the same backend, but reached by the laptop's
//                         LAN address — a phone's localhost is itself
//
// The last case is why this reads the hostname rather than hardcoding:
// Vite serves the page from whatever address the phone typed in, and
// the backend sits on that same machine. The LAN address changes with
// the network, so deriving it beats writing it down.
//
// Set VITE_USE_REMOTE=1 to point at Railway from either dev case:
//
//   VITE_USE_REMOTE=1 npm run dev -- --host
//
const useRemote = import.meta.env.VITE_USE_REMOTE === '1'

const REMOTE_WS = 'wss://equitymind-web-backend.up.railway.app/api/v1/stream'
const LOCAL_WS  = `ws://${window.location.hostname}:8001/api/v1/stream`

export const WS_URL = (!isDev || useRemote) ? REMOTE_WS : LOCAL_WS

// Printed once on load. Three near-identical setups is two too many to
// keep straight from memory, and a request going to the wrong backend
// looks the same as one going to the right one until the answers come
// back wrong.
if (isDev) {
  const target = WS_URL === REMOTE_WS ? 'Railway' : 'local backend'
  console.info(
    `%c EquityMind %c ${target} %c ${WS_URL}`,
    'background:#14b8a6;color:#fff;border-radius:3px 0 0 3px;padding:2px 6px',
    'background:#334155;color:#fff;padding:2px 6px',
    'color:#94a3b8',
  )
}
