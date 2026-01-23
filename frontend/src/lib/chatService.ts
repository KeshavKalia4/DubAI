/**
 * Chat Service
 *
 * Handles chat message sending with API integration.
 * Manages conversation persistence and history.
 */

import { chatApi } from '@/lib/api';
import type { BackendMessage, BackendConversation } from '@/types';

// API Contract
export interface ChatResponse {
  response: string;
  sources?: Array<{ title: string; url: string }>;
  conversationId?: string;
}

// Conversation state (managed per session)
let currentConversationId: string | null = null;
let currentUserNetid: string | null = null;

/**
 * Set the current user for chat operations
 */
export function setChatUser(userNetid: string | null) {
  if (userNetid !== currentUserNetid) {
    currentUserNetid = userNetid;
    currentConversationId = null; // Reset conversation when user changes
  }
}

/**
 * Get the current conversation ID
 */
export function getCurrentConversationId(): string | null {
  return currentConversationId;
}

/**
 * Start a new conversation
 */
export function startNewConversation() {
  currentConversationId = null;
}

/**
 * Send a chat message and get a response
 *
 * @param message - The user's message
 * @param userNetid - Optional user netid for persistence
 * @returns Chat response with AI-generated content
 */
export async function sendChatMessage(
  message: string,
  userNetid?: string
): Promise<ChatResponse> {
  // Update user if provided
  if (userNetid) {
    setChatUser(userNetid);
  }

  try {
    // Use the AI chat endpoint
    const response = await chatApi.sendAiMessage({
      message,
      user_netid: currentUserNetid || undefined,
    });

    return {
      response: response.response,
    };
  } catch (error) {
    console.error('Chat API error, falling back to mock:', error);

    // Fallback to mock response on error
    return getMockResponse(message);
  }
}

/**
 * Get mock response for offline/error scenarios
 */
function getMockResponse(message: string): Promise<ChatResponse> {
  // Simulate network delay
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        response: `I received your message: "${message}". The chat backend is currently unavailable, but I'm here to help once it's back online!`,
      });
    }, 500);
  });
}

/**
 * Load conversation history for a user
 */
export async function loadUserConversations(
  userNetid: string
): Promise<BackendConversation[]> {
  try {
    return await chatApi.getUserConversations(userNetid);
  } catch (error) {
    console.error('Failed to load conversations:', error);
    return [];
  }
}

/**
 * Load messages from a specific conversation
 */
export async function loadConversationMessages(
  conversationId: string
): Promise<BackendMessage[]> {
  try {
    return await chatApi.getMessages(conversationId);
  } catch (error) {
    console.error('Failed to load conversation messages:', error);
    return [];
  }
}

/**
 * Switch to a specific conversation
 */
export function switchToConversation(conversationId: string) {
  currentConversationId = conversationId;
}

/**
 * Delete a conversation
 */
export async function deleteConversation(
  conversationId: string
): Promise<boolean> {
  try {
    await chatApi.delete(conversationId);

    // Reset current conversation if it was deleted
    if (currentConversationId === conversationId) {
      currentConversationId = null;
    }

    return true;
  } catch (error) {
    console.error('Failed to delete conversation:', error);
    return false;
  }
}

/**
 * Clear all conversations for a user
 */
export async function clearUserConversations(
  userNetid: string
): Promise<boolean> {
  try {
    await chatApi.clearUserConversations(userNetid);
    currentConversationId = null;
    return true;
  } catch (error) {
    console.error('Failed to clear conversations:', error);
    return false;
  }
}
