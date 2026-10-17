import { Conversation, Message } from '../../types';
import { mockConversations, initialMessages } from '../../mocks/mockConversations';
import { simulateNetworkDelay } from '../api/apiClient';

class MessageService {
  private conversations: Conversation[] = [...mockConversations];
  private messages: Record<string, Message[]> = { ...initialMessages };

  async getConversations(): Promise<Conversation[]> {
    await simulateNetworkDelay(250);
    return [...this.conversations];
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    await simulateNetworkDelay(200);
    return this.messages[conversationId] || [];
  }

  async sendMessage(params: {
    conversationId: string;
    text: string;
    receiverId: string;
  }): Promise<Message> {
    await simulateNetworkDelay(200);

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      conversationId: params.conversationId,
      senderId: 'user_current',
      receiverId: params.receiverId,
      text: params.text,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
    };

    if (!this.messages[params.conversationId]) {
      this.messages[params.conversationId] = [];
    }
    this.messages[params.conversationId].push(newMessage);

    // Update conversation last message
    const conv = this.conversations.find((c) => c.id === params.conversationId);
    if (conv) {
      conv.lastMessage = params.text;
      conv.lastTimestamp = 'Just now';
    }

    return newMessage;
  }
}

export const messageService = new MessageService();
