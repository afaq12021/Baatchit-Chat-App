import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { StorageService } from '../../utils/storage';

export interface UserSettings {
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  language: string;
  fontSize: 'small' | 'medium' | 'large';
  chatBackgroundColor: string;
}

const initialState: UserSettings = {
  notificationsEnabled: true,
  soundEnabled: true,
  language: 'en',
  fontSize: 'medium',
  chatBackgroundColor: '#FFFFFF',
};

// Async thunks
export const loadUserSettings = createAsyncThunk(
  'userSettings/load',
  async () => {
    const settings = await StorageService.getItem<UserSettings>(StorageService.STORAGE_KEYS.USER_SETTINGS);
    return settings || initialState;
  }
);

export const saveUserSettings = createAsyncThunk(
  'userSettings/save',
  async (settings: UserSettings) => {
    await StorageService.setItem(StorageService.STORAGE_KEYS.USER_SETTINGS, settings);
    return settings;
  }
);

const userSettingsSlice = createSlice({
  name: 'userSettings',
  initialState,
  reducers: {
    updateSettings: (state, action: PayloadAction<Partial<UserSettings>>) => {
      return { ...state, ...action.payload };
    },
    resetSettings: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserSettings.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(saveUserSettings.fulfilled, (state, action) => {
        return action.payload;
      });
  },
});

export const { updateSettings, resetSettings } = userSettingsSlice.actions;
export default userSettingsSlice.reducer;