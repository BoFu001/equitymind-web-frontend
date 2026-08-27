function Sidebar({ open, onClose }) {
  return (
    <>
      {/* Backdrop — only on small screens, only when open. Tapping it
          closes the panel, which is the gesture people expect from a
          drawer and saves them hunting for the button again. */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Fixed and slid off-canvas below md, a normal flex child above
          it. The panel is 256px either way; what changes is whether it
          takes that width from the page or floats over it. */}
      <div
        className={`
          fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 border-r border-gray-800
          flex flex-col transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:static md:translate-x-0
        `}
      >
        <div className="px-4 h-[56px] flex items-center border-b border-gray-800">
          <h2 className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
            Query History
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2" />
      </div>
    </>
  )
}

export default Sidebar
