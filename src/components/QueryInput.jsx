import { ArrowUpIcon } from '@heroicons/react/24/outline'
import { useState, useRef } from 'react'

function QueryInput({ onSubmit, isStreaming }) {
  const [question, setQuestion] = useState('')
  const textareaRef = useRef(null)

  const handleSubmit = () => {
    if (!question.trim() || isStreaming) return
    onSubmit(question.trim())
    setQuestion('')
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="px-4 sm:px-8 lg:px-16 xl:px-36 pt-0 pb-2">
       <div className="flex items-center bg-gray-900 border border-gray-700 rounded-full pl-4 pr-2 py-2 focus-within:border-teal-500 transition-colors">
        <textarea
          ref={textareaRef}
          className="flex-1 bg-transparent text-white placeholder-gray-500 text-base md:text-sm resize-none focus:outline-none pl-2"
          placeholder="Ask about a stock, or what to look for..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          autoFocus
        />
        <button
          onClick={handleSubmit}
          disabled={!question.trim() || isStreaming}
          className="ml-3 w-10 h-10 flex items-center justify-center rounded-full bg-teal-500 hover:bg-teal-600 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        >
          {isStreaming ? (
            <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <ArrowUpIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
          )}
        </button>
      </div>
      <p className="text-gray-600 text-xs mt-2 text-center">
        Built on SEC filings, market data, news sentiment and quantitative signals.
      </p>
    </div>
  )
}

export default QueryInput