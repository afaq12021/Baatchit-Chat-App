export const lightColors = {
  primary: '#2196F3', // Blue
  primaryLight: '#64B5F6',
  primaryDark: '#1976D2',
  secondary: '#607D8B', // Blue Grey
  background: '#FFFFFF',
  surface: '#F5F5F5',
  surfaceVariant: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  textLight: '#FFFFFF',
  textInvert: '#000000',
  border: '#E0E0E0',
  accent: '#FF4081',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  inactive: '#9E9E9E',
  chatBubbleUser: '#2196F3',
  chatBubbleOther: '#E3F2FD',
  shadow: '#000000',
  inputBackground: '#F5F5F5',
  cardBackground: '#FFFFFF',
};

export const darkColors = {
  primary: '#64B5F6', // Lighter blue for dark mode
  primaryLight: '#90CAF9',
  primaryDark: '#1976D2',
  secondary: '#78909C', // Lighter blue grey
  background: '#121212',
  surface: '#1E1E1E',
  surfaceVariant: '#2C2C2C',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textLight: '#FFFFFF',
  textInvert: '#FFFFFF',
  border: '#333333',
  accent: '#FF4081',
  success: '#66BB6A',
  warning: '#FFA726',
  error: '#EF5350',
  inactive: '#666666',
  chatBubbleUser: '#1976D2',
  chatBubbleOther: '#2C2C2C',
  shadow: '#000000',
  inputBackground: '#2C2C2C',
  cardBackground: '#1E1E1E',
};

export const colors = lightColors; // Default export for backward compatibility

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 50,
};

export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
  },
};