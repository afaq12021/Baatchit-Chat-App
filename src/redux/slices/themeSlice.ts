import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
    },
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
      state.isSystemTheme = false;
    },
    setSystemTheme: (state, action: PayloadAction<boolean>) => {
      state.isSystemTheme = action.payload;
    },
  },
});

export const { setThemeMode, toggleTheme, setSystemTheme } = themeSlice.actions;
export default themeSlice.reducer;