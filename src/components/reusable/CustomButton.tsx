import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { spacing, typography, borderRadius } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  leftIcon?: string;
  rightIcon?: string;
  loading?: boolean;
  disabled?: boolean;
  containerStyle?: object;
  textStyle?: object;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  variant = 'primary',
  size = 'medium',
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  containerStyle,
  textStyle,
  ...touchableOpacityProps
}) => {
  const { colors } = useTheme();

  const getButtonStyles = () => {
    const baseStyle = {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderWidth: 0,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: colors.inputBackground,
        };
      case 'outline':
        return {
          ...baseStyle,
          borderColor: colors.primary,
          borderWidth: 1,
        };
      case 'text':
        return baseStyle;
      default:
        return baseStyle;
    }
  };

  const getTextStyles = () => {
    const baseTextStyle = {
      color: colors.text,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseTextStyle,
          color: '#FFFFFF',
        };
      case 'secondary':
        return {
          ...baseTextStyle,
          color: colors.text,
        };
      case 'outline':
        return {
          ...baseTextStyle,
          color: colors.primary,
        };
      case 'text':
        return {
          ...baseTextStyle,
          color: colors.primary,
        };
      default:
        return baseTextStyle;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
        };
      case 'medium':
        return {
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
        };
      case 'large':
        return {
          paddingVertical: spacing.lg,
          paddingHorizontal: spacing.xl,
        };
      default:
        return {
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
        };
    }
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyles(),
        getSizeStyles(),
        {
          opacity: isDisabled ? 0.6 : 1,
        },
        containerStyle,
      ]}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...touchableOpacityProps}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={variant === 'primary' ? '#FFFFFF' : colors.primary}
            style={styles.loader}
          />
        ) : (
          <>
            {leftIcon && (
              <Ionicons
                name={leftIcon}
                size={20}
                color={getTextStyles().color}
                style={styles.leftIcon}
              />
            )}
            
            <Text
              style={[
                styles.text,
                getTextStyles(),
                textStyle,
              ]}
            >
              {title}
            </Text>
            
            {rightIcon && (
              <Ionicons
                name={rightIcon}
                size={20}
                color={getTextStyles().color}
                style={styles.rightIcon}
              />
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    ...typography.body,
    fontWeight: '600',
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  rightIcon: {
    marginLeft: spacing.sm,
  },
  loader: {
    marginRight: spacing.sm,
  },
});

export default CustomButton;