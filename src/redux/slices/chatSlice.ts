import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isUser: boolean;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

export interface Chat {
  [x: string]: unknown;
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  unreadCount: number;
  isFavorite: boolean;
  messages?: Message[];
}

interface ChatState {
  chats: Chat[];
  activeChat: Chat | null;
  favorites: string[];
}

const initialState: ChatState = {
  chats: [
    {
      id: '1',
      name: 'John Doe',
      lastMessage: 'Hey, how are you doing?',
      timestamp: '2m ago',
      avatar: '👨‍💼',
      unreadCount: 2,
      isFavorite: false,
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      lastMessage: 'Thanks for the help today!',
      timestamp: '10m ago',
      avatar: '👩‍💻',
      unreadCount: 0,
      isFavorite: true,
    },
    {
      id: '3',
      name: 'Team Group',
      lastMessage: 'Meeting at 3 PM tomorrow',
      timestamp: '1h ago',
      avatar: '👥',
      unreadCount: 5,
      isFavorite: false,
    },
    {
      id: '4',
      name: 'Mom',
      lastMessage: 'Don\'t forget to call grandma',
      timestamp: '2h ago',
      avatar: '👩‍🦳',
      unreadCount: 1,
      isFavorite: true,
    },
    {
      id: '5',
      name: 'Alex Johnson',
      lastMessage: 'The project looks great!',
      timestamp: '1d ago',
      avatar: '👨‍🎨',
      unreadCount: 0,
      isFavorite: false,
    },
  ],
  activeChat: null,
  favorites: ['2', '4'],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const chatId = action.payload;
      const chat = state.chats.find(c => c.id === chatId);
      if (chat) {
        chat.isFavorite = !chat.isFavorite;
        if (chat.isFavorite) {
          state.favorites.push(chatId);
        } else {
          state.favorites = state.favorites.filter(id => id !== chatId);
        }
      }
    },
    setActiveChat: (state, action: PayloadAction<Chat>) => {
      state.activeChat = action.payload;
    },
    addMessage: (state, action: PayloadAction<{ chatId: string; message: Message }>) => {
      const { chatId, message } = action.payload;
      const chat = state.chats.find(c => c.id === chatId);
      if (chat) {
        if (!chat.messages) {
          chat.messages = [];
        }
        chat.messages.push(message);
        chat.lastMessage = message.text;
        chat.timestamp = 'now';
      }
    },
    updateMessageStatus: (state, action: PayloadAction<{ chatId: string; messageId: string; status: Message['status'] }>) => {
      const { chatId, messageId, status } = action.payload;
      const chat = state.chats.find(c => c.id === chatId);
      if (chat && chat.messages) {
        const message = chat.messages.find(m => m.id === messageId);
        if (message) {
          message.status = status;
        }
      }
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const chatId = action.payload;
      const chat = state.chats.find(c => c.id === chatId);
      if (chat) {
        chat.unreadCount = 0;
      }
    },
  },
});

export const { 
  toggleFavorite, 
  setActiveChat, 
  addMessage, 
  updateMessageStatus, 
  markAsRead 
} = chatSlice.actions;

export default chatSlice.reducer;