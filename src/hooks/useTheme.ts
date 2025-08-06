import { useAppSelector } from '../redux/hooks';
import { lightColors, darkColors } from '../styles/theme';

export const useTheme = () => {
  const themeMode = useAppSelector((state) => state.theme.mode);
  
  const colors = themeMode === 'dark' ? darkColors : lightColors;
  
  return {
    colors,
    isDark: themeMode === 'dark',
    isLight: themeMode === 'light',
  };
};