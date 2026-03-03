import { useState, useRef, useEffect } from 'react'
import { sendChatMessage } from '@/lib/chatService'
import { ChatbotSurface } from '@/components/ui/chatbot-surface'
import { useUserProfile } from '@/hooks/useUserProfile'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface Conversation {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
}

export default function ChatInterface() {
  const { profile } = useUserProfile()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'UW Events This Week',
      lastMessage: 'What events are happening this week?',
      timestamp: new Date('2024-01-15'),
    },
    {
      id: '2',
      title: 'Campus Dining Options',
      lastMessage: 'Where can I find good food on campus?',
      timestamp: new Date('2024-01-14'),
    },
    {
      id: '3',
      title: 'Library Hours',
      lastMessage: 'What are the library hours?',
      timestamp: new Date('2024-01-13'),
    },
  ])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleNewChat = () => {
    setMessages([])
    setCurrentConversationId(null)
    setInput('')
  }

  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversationId(conversationId)
    setMessages([])
  }

  const sendMessage = async (raw: string) => {
    const content = raw.trim()
    if (!content) return
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Pass user ID to the chat service for personalized responses
      const aiResponse = await sendChatMessage(userMessage.content, profile?.id)
      const assistantId = (Date.now() + 1).toString()
      const fullText = aiResponse.response
      setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }])

      for (let i = 1; i <= fullText.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 12))
        setMessages((prev) =>
          prev.map((message) =>
            message.id === assistantId ? { ...message, content: fullText.slice(0, i) } : message
          )
        )
      }
    } catch (error) {
      console.error('Chat error', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSend = async () => sendMessage(input)
  const handlePromptQuickSend = async (prompt: string) => sendMessage(prompt)

  const promptSuggestions = [
    'What events are happening this week?',
    'Tell me about clubs on campus',
    'When is the next career fair?',
    'Study spots near me',
  ]

  return (
    <div className="h-full bg-[#08060f]">
      <ChatbotSurface
        input={input}
        onInputChange={setInput}
        onSend={handleSend}
        onNewChat={handleNewChat}
        messages={messages}
        prompts={promptSuggestions}
        onPromptClick={handlePromptQuickSend}
        isLoading={isLoading}
        conversations={conversations}
        currentConversationId={currentConversationId}
        onSelectConversation={handleSelectConversation}
      />
      <div ref={messagesEndRef} />
    </div>
  )
}
