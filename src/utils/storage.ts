import AsyncStorage from '@react-native-async-storage/async-storage';

export class StorageService {
  static readonly STORAGE_KEYS = {
    THEME_MODE: '@theme_mode',
    CHAT_FAVORITES: '@chat_favorites',
    USER_SETTINGS: '@user_settings',
  };
  static async setItem(key: string, value: any): Promise<void> {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error storing data:', error);
    }
  }

  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
    }
  }

  static async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  // Theme specific methods
  static async saveThemeMode(mode: 'light' | 'dark'): Promise<void> {
    await this.setItem(StorageService.STORAGE_KEYS.THEME_MODE, mode);
  }

  static async getThemeMode(): Promise<'light' | 'dark' | null> {
    return await this.getItem<'light' | 'dark'>(StorageService.STORAGE_KEYS.THEME_MODE);
  }

  // Favorites specific methods
  static async saveFavorites(favorites: string[]): Promise<void> {
    await this.setItem(StorageService.STORAGE_KEYS.CHAT_FAVORITES, favorites);
  }

  static async getFavorites(): Promise<string[]> {
    const favorites = await this.getItem<string[]>(StorageService.STORAGE_KEYS.CHAT_FAVORITES);
    return favorites || [];
  }

  // User settings methods
  static async saveUserSettings(settings: any): Promise<void> {
    await this.setItem(StorageService.STORAGE_KEYS.USER_SETTINGS, settings);
  }

  static async getUserSettings(): Promise<any | null> {
    return await this.getItem(StorageService.STORAGE_KEYS.USER_SETTINGS);
  }
}