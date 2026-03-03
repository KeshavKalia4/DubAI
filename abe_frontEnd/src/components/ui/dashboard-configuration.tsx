import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Search, Check, Plus, RotateCcw, LayoutGrid } from "lucide-react"

export interface DashboardWidget {
  id: string
  title: string
  description: string
  isPermanent?: boolean
}

export interface DashboardLayoutConfiguratorProps {
  open: boolean
  onClose: () => void
  availableWidgets: DashboardWidget[]
  visibleWidgetIds: string[]
  onVisibilityChange: (newVisibleIds: string[]) => void
  onLayoutReset: () => void
  onWidgetDragStart?: (widgetId: string) => void
  onWidgetDragEnd?: () => void
  isDraggingWidget?: boolean
}

const DashboardLayoutConfigurator: React.FC<DashboardLayoutConfiguratorProps> = ({
  open,
  onClose,
  availableWidgets,
  visibleWidgetIds,
  onVisibilityChange,
  onLayoutReset,
  onWidgetDragStart,
  onWidgetDragEnd,
  isDraggingWidget = false,
}) => {
  const [search, setSearch] = useState("")

  const filtered = availableWidgets.filter(
    (w) =>
      w.title.toLowerCase().includes(search.toLowerCase()) ||
      w.description.toLowerCase().includes(search.toLowerCase())
  )

  const toggleWidget = (widget: DashboardWidget) => {
    if (widget.isPermanent) return
    if (visibleWidgetIds.includes(widget.id)) {
      onVisibilityChange(visibleWidgetIds.filter((id) => id !== widget.id))
    } else {
      onVisibilityChange([...visibleWidgetIds, widget.id])
    }
  }

  const activeCount = visibleWidgetIds.length

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity ${isDraggingWidget ? "pointer-events-none" : ""}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 h-screen w-[420px] z-50 flex flex-col bg-[#0a0814] border-l border-white/8 shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4b2e83]/30 border border-[#4b2e83]/40">
                  <LayoutGrid size={14} className="text-[#b7a57a]" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">Customize</p>
                  <h2 className="text-sm font-black text-white/90 leading-tight">Dashboard Cards</h2>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#4b2e83]/25 px-2.5 py-0.5 text-xs font-semibold text-[#d8c8ff]">
                  {activeCount} active
                </span>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-white/35 hover:text-white/70 hover:bg-white/8 transition-colors cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Search */}
            <div className="px-4 py-3 border-b border-white/8">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search cards…"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.04] pl-8 pr-4 py-2 text-sm text-white/75 placeholder:text-white/20 outline-none focus:border-[#7c5cbf]/50 focus:bg-white/[0.06] transition-colors"
                />
              </div>
            </div>

            {/* Card grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {filtered.length === 0 ? (
                <p className="text-center text-xs text-white/25 mt-8">No cards match "{search}"</p>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  {filtered.map((widget) => {
                    const isActive = visibleWidgetIds.includes(widget.id)
                    return (
                      <button
                        key={widget.id}
                        onClick={() => toggleWidget(widget)}
                        draggable={!isActive}
                        onDragStart={(e) => {
                          if (isActive) return
                          e.dataTransfer.setData("application/x-dashboard-widget", widget.id)
                          e.dataTransfer.setData("text/plain", widget.id)
                          e.dataTransfer.effectAllowed = "copyMove"
                          onWidgetDragStart?.(widget.id)
                        }}
                        onDragEnd={() => onWidgetDragEnd?.()}
                        className={`text-left rounded-xl p-3 border transition-all cursor-pointer group ${
                          isActive
                            ? "border-[#b7a57a]/35 bg-[#b7a57a]/6 hover:bg-[#b7a57a]/10"
                            : "border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.05]"
                        }`}
                      >
                        {/* Title row */}
                        <div className="flex items-start justify-between gap-1.5 mb-1.5">
                          <p
                            className={`text-xs font-semibold leading-tight ${
                              isActive ? "text-[#b7a57a]" : "text-white/65"
                            }`}
                          >
                            {widget.title}
                          </p>
                          <span
                            className={`shrink-0 mt-0.5 flex h-4 w-4 items-center justify-center rounded-full transition-colors ${
                              isActive
                                ? "bg-[#b7a57a]/20 text-[#b7a57a]"
                                : "bg-white/5 text-white/25 group-hover:text-white/45"
                            }`}
                          >
                            {isActive ? <Check size={9} strokeWidth={3} /> : <Plus size={9} strokeWidth={2.5} />}
                          </span>
                        </div>
                        {/* Description */}
                        <p className="text-[10px] text-white/30 leading-snug">{widget.description}</p>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-white/8">
              <button
                onClick={() => { onLayoutReset(); onClose() }}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-2.5 text-xs font-semibold text-white/35 hover:text-red-400 hover:border-red-500/25 hover:bg-red-500/6 transition-colors cursor-pointer"
              >
                <RotateCcw size={12} />
                Reset to Default Layout
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export { DashboardLayoutConfigurator }
export default DashboardLayoutConfigurator
