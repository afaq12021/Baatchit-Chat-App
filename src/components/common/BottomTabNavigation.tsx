import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  GestureResponderEvent,
  Text,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, spacing, typography, borderRadius } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';

const { width, height } = Dimensions.get('window');

type TabConfig = {
  name: string;
  icon: string;
  label: string;
};

const tabConfigs: { [key: string]: TabConfig } = {
  chats: { name: 'chats', icon: 'chatbubbles', label: 'Chats' },
  posts: { name: 'posts', icon: 'grid', label: 'Posts' },
  profile: { name: 'profile', icon: 'person', label: 'Profile' },
};

const BottomtabNavigation: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { colors: themeColors } = useTheme();
  
  return (
    <View style={[styles.main, { backgroundColor: themeColors.background, borderTopColor: themeColors.border }]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const tabConfig = tabConfigs[route.name];

        if (!tabConfig) return null;

        const onPress = (event: GestureResponderEvent) => {
          const eventObject = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !eventObject.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={[
              styles.tabButton,
              isFocused && styles.activeTab
            ]}>
            <View style={styles.iconContainer}>
              <Ionicons
                name={tabConfig.icon}
                size={24}
                color={isFocused ? themeColors.primary : themeColors.inactive}
              />
              {isFocused && <View style={[styles.activeIndicator, { backgroundColor: themeColors.primary }]} />}
            </View>
            <Text style={[
              styles.tabLabel,
              { color: isFocused ? themeColors.primary : themeColors.inactive }
            ]}>
              {tabConfig.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    backgroundColor: colors.background,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    height: height * 0.09,
    borderTopLeftRadius: borderRadius.xxl,
    borderTopRightRadius: borderRadius.xxl,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    minWidth: 70,
    flex: 1,
  },
  activeTab: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 4,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  tabLabel: {
    ...typography.small,
    fontWeight: '500',
    marginTop: 2,
  },
});

export default BottomtabNavigation;