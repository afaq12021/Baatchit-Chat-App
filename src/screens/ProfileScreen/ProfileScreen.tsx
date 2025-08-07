import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { spacing, typography, borderRadius } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { toggleTheme } from '../../redux/slices/themeSlice';
import { StorageService } from '../../utils/storage';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { colors, isDark } = useTheme();
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.theme.mode);

  const handleThemeToggle = async () => {
    dispatch(toggleTheme());
    await StorageService.saveThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };

  const handleEditProfile = () => {
    navigation.navigate('edit-profile' as never);
  };

  const profileOptions = [
    { icon: 'person-outline', title: 'Account', subtitle: 'Privacy, security, change number' },
    { icon: 'chatbubbles-outline', title: 'Chats', subtitle: 'Theme, wallpapers, chat history' },
    { icon: 'notifications-outline', title: 'Notifications', subtitle: 'Message, group & call tones' },
    { icon: 'storefront-outline', title: 'Storage and data', subtitle: 'Network usage, auto-download' },
    { icon: 'help-circle-outline', title: 'Help', subtitle: 'Help center, contact us, privacy policy' },
  ];

  const renderProfileOption = (option: any, index: number) => (
    <TouchableOpacity 
      key={index} 
      style={[styles.optionItem, { borderBottomColor: colors.border }]}
      activeOpacity={0.7}
    >
      <View style={[styles.optionIcon, { backgroundColor: colors.inputBackground }]}>
        <Ionicons name={option.icon} size={24} color={colors.primary} />
      </View>
      <View style={styles.optionContent}>
        <Text style={[styles.optionTitle, { color: colors.text }]}>{option.title}</Text>
        <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>{option.subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderThemeOption = () => (
    <View style={[styles.optionItem, { borderBottomColor: colors.border }]}>
      <View style={[styles.optionIcon, { backgroundColor: colors.inputBackground }]}>
        <Ionicons name={isDark ? 'moon' : 'sunny'} size={24} color={colors.primary} />
      </View>
      <View style={styles.optionContent}>
        <Text style={[styles.optionTitle, { color: colors.text }]}>Dark Mode</Text>
        <Text style={[styles.optionSubtitle, { color: colors.textSecondary }]}>
          Switch between light and dark themes
        </Text>
      </View>
      <Switch
        value={isDark}
        onValueChange={handleThemeToggle}
        trackColor={{ false: colors.inactive, true: colors.primary }}
        thumbColor={isDark ? colors.primary : colors.background}
        ios_backgroundColor={colors.inputBackground}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={[styles.profileCard, { borderBottomColor: colors.border }]}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatar}>👤</Text>
            <TouchableOpacity style={styles.cameraButton}>
              <Ionicons name="camera" size={16} color={colors.textLight} />
            </TouchableOpacity>
          </View>
          <Text style={[styles.profileName, { color: colors.text }]}>Afaq Ul Islam</Text>
          <Text style={[styles.profileStatus, { color: colors.textSecondary }]}>Available</Text>
          <TouchableOpacity 
            style={[styles.editButton, { backgroundColor: colors.inputBackground }]}
            onPress={handleEditProfile}
            activeOpacity={0.7}
          >
            <Ionicons name="pencil" size={16} color={colors.primary} />
            <Text style={[styles.editButtonText, { color: colors.primary }]}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Theme Option */}
        <View style={styles.optionsContainer}>
          {renderThemeOption()}
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {profileOptions.map(renderProfileOption)}
        </View>

                 {/* Logout Button */}
         <TouchableOpacity 
           style={[
             styles.logoutButton, 
             { 
               backgroundColor: colors.inputBackground,
               borderColor: colors.border 
             }
           ]}
           activeOpacity={0.7}
         >
           <Ionicons name="log-out-outline" size={24} color={colors.error} />
           <Text style={[styles.logoutText, { color: colors.error }]}>Logout</Text>
         </TouchableOpacity>

         {/* App Info */}
         <View style={styles.appInfo}>
           <Text style={[styles.appVersion, { color: colors.textSecondary }]}>Baatchit v1.0.0</Text>
         </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    ...typography.h2,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    fontSize: 60,
    width: 100,
    height: 100,
    textAlign: 'center',
    lineHeight: 100,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 16,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    backgroundColor: '#2196F3',
  },
  profileName: {
    ...typography.h3,
    marginBottom: 4,
    fontWeight: '600',
  },
  profileStatus: {
    ...typography.caption,
    marginBottom: spacing.md,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
  },
  editButtonText: {
    ...typography.caption,
    marginLeft: spacing.sm,
    fontWeight: '500',
  },
  optionsContainer: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.md,
    borderRadius: 0,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    ...typography.body,
    fontWeight: '500',
    marginBottom: 2,
  },
  optionSubtitle: {
    ...typography.small,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginHorizontal: spacing.md,
    marginTop: spacing.xl,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  logoutText: {
    ...typography.body,
    marginLeft: spacing.sm,
    fontWeight: '500',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    marginBottom: 100, // Extra space for bottom tab
  },
  appVersion: {
    ...typography.small,
  },
});

export default ProfileScreen;
