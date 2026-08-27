import { ArrowUpIcon } from '@heroicons/react/24/outline'
import { useState, useRef } from 'react'

function QueryInput({ onSubmit, isStreaming }) {
  const [question, setQuestion] = useState('')
  const textareaRef = useRef(null)

  // A textarea holds its rows attribute whatever is typed into it, so a
  // long question or a shift+enter line break just scrolls out of sight.
  // Resetting to auto first lets scrollHeight report the content's real
  // height rather than the one already set; the cap keeps the box from
  // swallowing the conversation on a phone.
  const resize = (el) => {
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  const handleSubmit = () => {
    if (!question.trim() || isStreaming) return
    onSubmit(question.trim())
    setQuestion('')
    // Not resize(): the state change has not reached the DOM yet, so
    // scrollHeight would still measure the text that was just sent and
    // leave the empty box several lines tall.
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    textareaRef.current?.blur()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="shrink-0 px-4 sm:px-8 lg:px-16 xl:px-36 pt-0 pb-[calc(3rem+env(safe-area-inset-bottom))] md:pb-2">
       <div className="flex items-end bg-gray-900 border border-gray-700 rounded-2xl pl-4 pr-2 py-2.5 focus-within:border-teal-500 transition-colors">
        <textarea
          ref={textareaRef}
          className="flex-1 bg-transparent text-white placeholder-gray-500 text-base md:text-sm leading-6 py-1.5 resize-none focus:outline-none pl-2 overflow-y-auto"
          placeholder="Ask about a stock..."
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value)
            resize(e.target)
          }}
          onKeyDown={handleKeyDown}
          rows={1}
          autoFocus
        />
        <button
          onClick={handleSubmit}
          disabled={!question.trim() || isStreaming}
          className="ml-3 w-9 h-9 flex items-center justify-center rounded-xl bg-teal-500 hover:bg-teal-600 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        >
          {isStreaming ? (
            <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <ArrowUpIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
          )}
        </button>
      </div>
      <p className="text-gray-600 text-xs mt-2 text-center">
        SEC filings · market data · news · quant signals
      </p>
    </div>
  )
}

export default QueryInput