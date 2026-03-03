"use client"

import React from "react"
import { motion } from "framer-motion"
import { MessageSquarePlus, Send } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TextShimmer } from "@/components/ui/text-shimmer"
import { WaveDivider } from "@/components/ui/wave-divider"

interface SurfaceMessage {
  id: string
  role: "user" | "assistant"
  content: string
}

interface SurfaceConversation {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
}

interface ChatbotSurfaceProps {
  input: string
  onInputChange: (value: string) => void
  onSend: () => void
  onNewChat: () => void
  messages: SurfaceMessage[]
  isLoading?: boolean
  prompts?: string[]
  onPromptClick?: (prompt: string) => void
  conversations?: SurfaceConversation[]
  currentConversationId?: string | null
  onSelectConversation?: (conversationId: string) => void
}

function formatDate(date: Date) {
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === today.toDateString()) return "Today"
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday"
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function ChatbotSurface({
  input,
  onInputChange,
  onSend,
  onNewChat,
  messages,
  isLoading = false,
  prompts = [],
  onPromptClick,
  conversations = [],
  currentConversationId = null,
  onSelectConversation,
}: ChatbotSurfaceProps) {
  const MIN_SIDEBAR_WIDTH = 240
  const MAX_SIDEBAR_WIDTH = 420
  const DEFAULT_SIDEBAR_WIDTH = 304

  const layoutRef = React.useRef<HTMLDivElement>(null)
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
  const [sidebarWidth, setSidebarWidth] = React.useState(DEFAULT_SIDEBAR_WIDTH)
  const [isResizingSidebar, setIsResizingSidebar] = React.useState(false)

  const hasAssistantResponse = messages.some((message) => message.role === "assistant" && message.content.trim().length > 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSend()
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  React.useEffect(() => {
    if (!isResizingSidebar) return

    const handleMouseMove = (event: MouseEvent) => {
      const layoutBounds = layoutRef.current?.getBoundingClientRect()
      if (!layoutBounds) return
      const nextWidth = event.clientX - layoutBounds.left
      const clampedWidth = Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, nextWidth))
      setSidebarWidth(clampedWidth)
      if (!isSidebarOpen) setIsSidebarOpen(true)
    }

    const handleMouseUp = () => setIsResizingSidebar(false)

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizingSidebar, isSidebarOpen])

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-[#0d0a1a]", isResizingSidebar && "select-none")}>
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-grid-pattern bg-[length:30px_30px] bg-repeat" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0d0a1a]/95 via-[#0d0a1a]/55 to-[#0d0a1a]/5" />
      </div>

      <div className="relative z-10 flex h-full flex-col">
        <div className="bg-[#08060f]/75 px-4 py-3 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#4b2e83]/50 bg-[#4b2e83]/20 text-sm font-bold text-white/80">
                S
              </div>
              <div>
                <p className="text-sm font-semibold tracking-tight text-white/78">Welcome user</p>
              </div>
            </div>
            <Button
              type="button"
              onClick={onNewChat}
              className="h-8 rounded-lg border border-[#4b2e83]/40 bg-[#4b2e83]/40 px-3 text-xs hover:bg-[#4b2e83]/65"
            >
              <MessageSquarePlus className="mr-1.5 h-3.5 w-3.5" />
              New Chat
            </Button>
          </div>

          <div className="mt-2 bg-black/20 px-4 py-1">
            <WaveDivider height={14} speed={14} opacity={0.9} />
          </div>
        </div>

        <div ref={layoutRef} className="flex min-h-0 flex-1">
          <aside
            className="hidden min-h-0 shrink-0 bg-[#08060f]/55 md:flex md:flex-col"
            style={{
              width: isSidebarOpen ? `${sidebarWidth}px` : "0px",
              minWidth: isSidebarOpen ? `${MIN_SIDEBAR_WIDTH}px` : "0px",
              transition: isResizingSidebar ? "none" : "width 220ms ease",
              overflow: "hidden",
            }}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#b7a57a]/70">history</p>
              <p className="mt-1 text-xs text-white/35">{conversations.length} conversations</p>
              </div>
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="rounded-md px-2 py-1 text-[10px] font-mono uppercase tracking-[0.16em] text-white/40 transition-colors hover:text-white/70"
              >
                hide
              </button>
            </div>
            <div className="px-4">
              <div className="mt-2">
                <WaveDivider height={10} speed={18} opacity={0.2} />
              </div>
            </div>
            <div
              className="h-full overflow-y-auto px-3 pb-3"
              style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(183,165,122,0.55) rgba(255,255,255,0.08)" }}
            >
              <div className="space-y-2 pb-2">
                {conversations.map((conversation) => {
                  const active = currentConversationId === conversation.id
                  return (
                    <button
                      key={conversation.id}
                      type="button"
                      onClick={() => onSelectConversation?.(conversation.id)}
                      className={cn(
                        "group relative w-full rounded-xl px-3 py-2.5 text-left transition-colors",
                        active
                          ? "bg-[#7c5cbf]/15"
                          : "bg-white/[0.03] hover:bg-white/[0.045]"
                      )}
                    >
                      <div
                        className={cn(
                          "absolute bottom-2 left-0 top-2 w-px rounded-full transition-opacity",
                          active ? "bg-[#7c5cbf]/75" : "bg-[#b7a57a]/45 opacity-50 group-hover:opacity-80"
                        )}
                      />
                      <div className="min-w-0 pl-2.5 pr-1">
                        <p className={cn("break-words text-[12px] font-semibold leading-snug tracking-tight", active ? "text-[#e2d6ff]" : "text-white/75")}>
                          {conversation.title}
                        </p>
                        <p className="mt-1 break-words font-mono text-[10px] tracking-[0.1em] text-white/40">
                          {conversation.lastMessage}
                        </p>
                        <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#b7a57a]/55">
                          {formatDate(conversation.timestamp)}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </aside>

          <div
            className={cn(
              "relative hidden w-4 shrink-0 cursor-col-resize md:block",
              !isSidebarOpen && "cursor-default"
            )}
            onMouseDown={() => {
              if (!isSidebarOpen) return
              setIsResizingSidebar(true)
            }}
          >
            {isSidebarOpen && (
              <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/10" />
            )}
          </div>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <div className="px-4 pt-2 md:pt-3">
              <button
                type="button"
                onClick={() => setIsSidebarOpen((current) => !current)}
                className="hidden rounded-md bg-white/[0.04] px-2.5 py-1 text-[10px] font-mono uppercase tracking-[0.16em] text-white/45 transition-colors hover:text-white/75 md:inline-flex"
              >
                {isSidebarOpen ? "collapse history" : "open history"}
              </button>
            </div>
            <ScrollArea className="h-full w-full flex-1 px-4 py-4">
            {messages.length === 0 ? (
              <div className="mx-auto flex min-h-[65vh] max-w-3xl flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center"
                >
                  {hasAssistantResponse ? (
                    <h1 className="flex flex-col py-2 text-center text-3xl font-black leading-none tracking-tight text-[#d5ad73] md:flex-row md:text-5xl">
                      <span className="px-2">madr AI</span>
                    </h1>
                  ) : (
                    <h1 className="flex flex-col py-2 text-center text-3xl font-black leading-none tracking-tight md:flex-row md:text-5xl">
                      <TextShimmer
                        as="span"
                        duration={1.5}
                        spread={1.5}
                        className="px-2 [--base-color:#b88744] [--base-gradient-color:#f1cd90]"
                      >
                        madr AI
                      </TextShimmer>
                    </h1>
                  )}

                  {hasAssistantResponse ? (
                    <p className="mx-auto mt-2 text-center text-sm text-[#b8925f] md:max-w-2xl">
                      Campus Intelligence
                    </p>
                  ) : (
                    <TextShimmer
                      as="p"
                      duration={1.6}
                      spread={1.25}
                      className="mx-auto mt-2 text-center text-sm [--base-color:#b8925f] [--base-gradient-color:#f0c98c] md:max-w-2xl"
                    >
                      Campus Intelligence
                    </TextShimmer>
                  )}
                </motion.div>

                <div className="mt-3 w-full max-w-2xl px-2">
                  <WaveDivider height={14} speed={16} opacity={0.36} />
                </div>

                {prompts.length > 0 && (
                  <div className="mt-7 grid w-full grid-cols-1 gap-2 sm:grid-cols-2">
                    {prompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left font-mono text-[10px] uppercase tracking-[0.18em] text-white/60 transition-all hover:border-[#4b2e83]/40 hover:bg-[#4b2e83]/10 hover:text-white/85"
                        onClick={() => onPromptClick?.(prompt)}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}

                <div className="mt-4 w-full max-w-2xl px-2">
                  <WaveDivider height={12} speed={20} opacity={0.24} />
                </div>
              </div>
            ) : (
              <div className="mx-auto max-w-4xl space-y-3 pb-6">
                {messages.map((message) => (
                  <div key={message.id}>
                    <div className="group relative overflow-hidden rounded-xl bg-white/[0.03] px-4 py-3 transition-colors hover:bg-white/[0.045]">
                      <div
                        className="absolute bottom-3 left-0 top-3 w-px rounded-full"
                        style={{ backgroundColor: message.role === "assistant" ? "#b7a57a" : "#7c5cbf" }}
                      />
                      <div className="relative pl-3.5">
                        <div className="mb-1.5 flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: message.role === "assistant" ? "#b7a57a" : "#7c5cbf" }} />
                          <span
                            className={cn(
                              "font-mono text-[10px] uppercase tracking-[0.22em]",
                              message.role === "assistant" ? "text-[#b7a57a]" : "text-[#7c5cbf]"
                            )}
                          >
                            {message.role === "assistant" ? "assistant" : "you"}
                          </span>
                          <span className="text-white/10">·</span>
                          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/25">
                            {new Date(parseInt(message.id)).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-white/78">{message.content}</p>
                      </div>
                    </div>
                    <div className="px-3">
                      <WaveDivider height={10} speed={22} opacity={0.16} />
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="group relative overflow-hidden rounded-xl bg-white/[0.03] px-4 py-3">
                    <div className="absolute bottom-3 left-0 top-3 w-px rounded-full bg-[#b7a57a]" />
                    <div className="relative pl-3.5">
                      <div className="mb-1.5 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#b7a57a]" />
                        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#b7a57a]">assistant</span>
                        <span className="text-white/10">·</span>
                        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/25">typing</span>
                      </div>
                      {hasAssistantResponse ? (
                        <p className="mb-1 text-[11px] text-[#a9926e]">madr AI is thinking...</p>
                      ) : (
                        <TextShimmer
                          as="p"
                          duration={1.4}
                          spread={1.1}
                          className="mb-1 text-[11px] [--base-color:#9f8a67] [--base-gradient-color:#e7c17b]"
                        >
                          madr AI is thinking...
                        </TextShimmer>
                      )}
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#7c5cbf]/80" style={{ animationDelay: "0ms" }} />
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#7c5cbf]/80" style={{ animationDelay: "150ms" }} />
                        <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#7c5cbf]/80" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            </ScrollArea>
          </div>
        </div>

        <div className="bg-black/20 px-4 py-1">
          <WaveDivider height={14} speed={14} opacity={0.9} />
        </div>

        <div className="bg-[#08060f]/82 px-4 py-3 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">
              student chat · instant answers
            </p>
            <div className="relative flex items-end gap-2 rounded-2xl bg-white/[0.05] p-2.5 shadow-[0_12px_36px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all focus-within:bg-white/[0.07]">
              <div className="pointer-events-none absolute bottom-2 left-0 top-2 w-px rounded-full bg-[#b7a57a]/65" />
              <textarea
                value={input}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="What matters to you today?"
                rows={1}
                className="max-h-32 flex-1 resize-none border-none bg-transparent px-2 py-1.5 pl-3 text-sm text-white/85 placeholder-white/25 outline-none"
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={cn(
                  "rounded-xl p-2.5 text-white transition-all disabled:cursor-not-allowed disabled:opacity-30",
                  input.trim() && !isLoading
                    ? "bg-[#5a36a0] shadow-[0_0_0_1px_rgba(124,92,191,0.45),0_0_24px_rgba(90,54,160,0.45)] hover:bg-[#6a40ba]"
                    : "bg-[#4b2e83]/35 hover:bg-[#4b2e83]/50"
                )}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
