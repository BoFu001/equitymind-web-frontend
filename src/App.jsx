import { useState, useRef } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import QueryInput from './components/QueryInput'
import ProgressPanel from './components/ProgressPanel'
import ReportPanel from './components/ReportPanel'
import { WS_URL } from './config'

function App() {
  // ── State ────────────────────────────────────────────────
  const [turns, setTurns] = useState([])
  const [messages, setMessages] = useState([])
  const [sessionMemory, setSessionMemory] = useState(null)
  const [isStreaming, setIsStreaming] = useState(false)



  const mainRef = useRef(null)
  const autoScroll = useRef(true)
  const isScrollingProgrammatically = useRef(false)

  const scrollToBottom = () => {
    if (autoScroll.current && mainRef.current) {
      isScrollingProgrammatically.current = true
      mainRef.current.scrollTop = mainRef.current.scrollHeight
      setTimeout(() => { isScrollingProgrammatically.current = false }, 50)
    }
  }


  // ── Helpers ──────────────────────────────────────────────
  const updateLastTurn = (updater) => {
    setTurns(prev => {
      const updated = [...prev]
      updated[updated.length - 1] = updater(updated[updated.length - 1])
      return updated
    })
  }

  // ── Handle query ─────────────────────────────────────────
  const handleQuery = (question) => {
    const startTime = Date.now()

    // Add new turn
    setTurns(prev => [...prev, {
      question,
      progress: [],
      report: '',
      isStreaming: true,
      duration: null,
      progressOpen: true,
    }])

    autoScroll.current = true
    setTimeout(() => scrollToBottom(), 100)

    setIsStreaming(true)

    const ws = new WebSocket(WS_URL)

    ws.onopen = () => {
      ws.send(JSON.stringify({ question, messages, session_memory: sessionMemory }))
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.type === 'progress') {
        updateLastTurn(turn => ({
          ...turn,
          progress: [...turn.progress, { message: data.message, isSub: false }]
        }))
        scrollToBottom()
      }

      if (data.type === 'sub_progress') {
        updateLastTurn(turn => ({
          ...turn,
          progress: [...turn.progress, { message: data.message, isSub: true }]
        }))
        scrollToBottom()
      }

      if (data.type === 'token') {
        updateLastTurn(turn => ({
          ...turn,
          report: turn.report + data.text
        }))
        scrollToBottom()
      }

      if (data.type === 'done') {
        const duration = Math.round((Date.now() - startTime) / 1000)
        updateLastTurn(turn => ({
          ...turn,
          isStreaming: false,
          duration,
        }))
        setMessages(data.messages || [])
        setSessionMemory(data.session_memory || null)
        setIsStreaming(false)
        ws.close()
      }

      if (data.type === 'error') {
        updateLastTurn(turn => ({ ...turn, isStreaming: false }))
        setIsStreaming(false)
        ws.close()
      }
    }

    ws.onerror = () => {
      updateLastTurn(turn => ({ ...turn, isStreaming: false }))
      setIsStreaming(false)
    }
  }

  // ── Toggle progress panel for a turn ─────────────────────
  const toggleProgress = (index) => {
    setTurns(prev => prev.map((turn, i) =>
      i === index
        ? { ...turn, progressOpen: !turn.progressOpen }
        : turn
    ))
  }

  // ── Return ───────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-gray-950 text-white">
      <Sidebar turns={turns} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main 
          ref={mainRef}
          className="flex-1 overflow-y-auto overscroll-contain px-44 py-6 pb-2 space-y-6"
          onScroll={() => {
            if (isScrollingProgrammatically.current) return
            const el = mainRef.current
            if (!el) return
            const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50
            if (atBottom) {
              autoScroll.current = true
            } else {
              autoScroll.current = false
            }
          }}
        >

          {turns.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <p className="text-2xl font-semibold mb-2">EquityMind</p>
                <p className="text-sm">Ask me about any stock, comparison, or investment idea</p>
              </div>
            </div>
          )}

          {turns.map((turn, index) => (
            <div key={index}>

              {/* User bubble — right aligned */}
              <div className="flex justify-end mb-3">
                <div className="bg-teal-600 text-white px-4 py-2 rounded-2xl rounded-br-sm max-w-lg text-sm">
                  {turn.question}
                </div>
              </div>
              {/* Agent response — full width */}
              <div className="space-y-3">

                {/* Progress panel — collapsible for past turns */}
                {turn.progress.length > 0 && (
                  <ProgressPanel
                    messages={turn.progress}
                    isStreaming={turn.isStreaming}
                    duration={turn.duration}
                    progressOpen={turn.progressOpen}
                    onToggle={() => toggleProgress(index)}
                  />
                )}

                {/* Report */}
                {turn.report && (
                  <ReportPanel
                    report={turn.report}
                    isStreaming={turn.isStreaming}
                  />
                )}

              </div>
            </div>
          ))}
        </main>

        <QueryInput onSubmit={handleQuery} isStreaming={isStreaming} />
      </div>
    </div>
  )
}

export default App