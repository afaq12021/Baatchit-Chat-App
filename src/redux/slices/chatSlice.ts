import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { StorageService } from '../../utils/storage';

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
  chats: [],
  activeChat: null,
  favorites: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setFavorites: (state, action: PayloadAction<string[]>) => {
      state.favorites = action.payload;
      state.chats.forEach(chat => {
        chat.isFavorite = state.favorites.includes(chat.id);
      });
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const chatId = action.payload;
      if (state.favorites.includes(chatId)) {
        state.favorites = state.favorites.filter(id => id !== chatId);
      } else {
        state.favorites.push(chatId);
      }
      // Update isFavorite in chats array if chat exists
      const chat = state.chats.find(c => c.id === chatId);
      if (chat) {
        chat.isFavorite = state.favorites.includes(chatId);
      }
    },
    setActiveChat: (state, action: PayloadAction<Chat>) => {
      state.activeChat = action.payload;
      // Add chat to chats array if it doesn't exist
      if (!state.chats.find(chat => chat.id === action.payload.id)) {
        state.chats.push(action.payload);
      }
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
  extraReducers: (builder) => {
    builder
      .addCase(loadFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
        state.chats.forEach(chat => {
          chat.isFavorite = state.favorites.includes(chat.id);
        });
      })
      .addCase(saveFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
      });
  },
});

// Async thunks for loading and saving favorites
export const loadFavorites = createAsyncThunk(
  'chat/loadFavorites',
  async () => {
    const favorites = await StorageService.getFavorites();
    return favorites;
  }
);

export const saveFavorites = createAsyncThunk(
  'chat/saveFavorites',
  async (favorites: string[]) => {
    await StorageService.saveFavorites(favorites);
    return favorites;
  }
);

// Async thunk for toggling favorite with persistence
export const toggleFavoriteWithPersist = createAsyncThunk(
  'chat/toggleFavoriteWithPersist',
  async (chatId: string, { dispatch, getState }) => {
    try {
      dispatch(toggleFavorite(chatId));
      const state = getState() as { chat: ChatState };
      await StorageService.saveFavorites(state.chat.favorites);
      return chatId;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  }
);

export const { 
  toggleFavorite, 
  setActiveChat, 
  addMessage, 
  updateMessageStatus, 
  markAsRead 
} = chatSlice.actions;

export default chatSlice.reducer;