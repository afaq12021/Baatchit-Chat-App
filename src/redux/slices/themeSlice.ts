import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { StorageService } from '../../utils/storage';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
  isSystemTheme: boolean;
}

const initialState: ThemeState = {
  mode: 'light',
  isSystemTheme: true,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      state.isSystemTheme = false;
      // Save theme mode when it changes
      StorageService.setItem(StorageService.STORAGE_KEYS.THEME_MODE, action.payload)
        .catch(error => console.error('Error saving theme mode:', error));
    },
    toggleTheme: (state) => {
      const newMode = state.mode === 'light' ? 'dark' : 'light';
      state.mode = newMode;
      state.isSystemTheme = false;
      // Save theme mode when it's toggled
      StorageService.setItem(StorageService.STORAGE_KEYS.THEME_MODE, newMode)
        .catch(error => console.error('Error saving theme mode:', error));
    },
    setSystemTheme: (state, action: PayloadAction<boolean>) => {
      state.isSystemTheme = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadTheme.fulfilled, (state, action) => {
        state.mode = action.payload;
      })
      .addCase(saveTheme.fulfilled, (state, action) => {
        state.mode = action.payload;
      });
  },
});

// Async thunks for loading and saving theme
export const loadTheme = createAsyncThunk(
  'theme/loadTheme',
  async () => {
    try {
      const savedMode = await StorageService.getThemeMode();
      return savedMode || 'light';
    } catch (error) {
      console.error('Failed to load saved theme:', error);
      return 'light';
    }
  }
);

export const saveTheme = createAsyncThunk(
  'theme/saveTheme',
  async (mode: ThemeMode) => {
    try {
      await StorageService.saveThemeMode(mode);
      return mode;
    } catch (error) {
      console.error('Failed to save theme:', error);
      throw error;
    }
  }
);

export const { setThemeMode, toggleTheme, setSystemTheme } = themeSlice.actions;
export default themeSlice.reducer;