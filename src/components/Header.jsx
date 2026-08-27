function Header({ onMenuClick }) {
  return (
    <header className="px-4 md:px-6 h-[56px] flex items-center gap-3">
      {/* Hidden above md, where the panel is always on screen and a
          button to reveal it would do nothing. */}
      <button
        onClick={onMenuClick}
        className="md:hidden -ml-1 p-1 text-gray-400 hover:text-white"
        aria-label="Toggle history"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center shrink-0">
        <span className="text-white font-bold text-sm">E</span>
      </div>
      <div>
        <h1 className="text-white font-semibold text-lg leading-none">EquityMind</h1>
        <p className="text-gray-500 text-xs mt-0.5">Financial AI Research</p>
      </div>
    </header>
  )
}

export default Header
