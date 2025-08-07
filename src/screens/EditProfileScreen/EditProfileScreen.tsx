import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { spacing, typography, borderRadius } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';
import CustomInput from '../../components/reusable/CustomInput';
import CustomButton from '../../components/reusable/CustomButton';

// Define types for form data and errors
interface FormData {
  name: string;
  email: string;
  phone: string;
  status: string;
  bio: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  bio?: string;
}

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: 'Afaq Ul Islam',
    email: 'afaq@example.com',
    phone: '+92 300 1234567',
    status: 'Available',
    bio: 'Hey there! I am using Baatchit.',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success',
        'Profile updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeAvatar = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => console.log('Camera selected') },
        { text: 'Gallery', onPress: () => console.log('Gallery selected') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Avatar Section */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatar}>👤</Text>
              <TouchableOpacity 
                style={[styles.cameraButton, { backgroundColor: colors.primary }]}
                onPress={handleChangeAvatar}
                activeOpacity={0.7}
              >
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              onPress={handleChangeAvatar}
              activeOpacity={0.7}
            >
              <Text style={[styles.changeAvatarText, { color: colors.primary }]}>
                Change Profile Picture
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <CustomInput
              label="Full Name"
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
              placeholder="Enter your full name"
              leftIcon="person-outline"
              error={errors.name}
              autoCapitalize="words"
            />

            <CustomInput
              label="Email Address"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              placeholder="Enter your email"
              leftIcon="mail-outline"
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <CustomInput
              label="Phone Number"
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              placeholder="Enter your phone number"
              leftIcon="call-outline"
              error={errors.phone}
              keyboardType="phone-pad"
            />

            <CustomInput
              label="Status"
              value={formData.status}
              onChangeText={(text) => handleInputChange('status', text)}
              placeholder="Enter your status"
              leftIcon="information-circle-outline"
              maxLength={50}
            />

            <CustomInput
              label="Bio"
              value={formData.bio}
              onChangeText={(text) => handleInputChange('bio', text)}
              placeholder="Tell us about yourself"
              leftIcon="document-text-outline"
              multiline={true}
              height={100}
              maxLength={150}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonSection}>
            <CustomButton
              title="Save Changes"
              variant="primary"
              loading={loading}
              onPress={handleSave}
              containerStyle={styles.saveButton}
            />

            <CustomButton
              title="Cancel"
              variant="outline"
              onPress={() => navigation.goBack()}
              containerStyle={styles.cancelButton}
            />
          </View>

          {/* Bottom Spacing */}
          <View style={styles.bottomSpacing} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 0.5,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.h3,
    fontWeight: '600',
  },
  placeholder: {
    width: 32, // Same width as back button for centering
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  avatar: {
    fontSize: 80,
    width: 120,
    height: 120,
    textAlign: 'center',
    lineHeight: 120,
    borderRadius: 60,
    overflow: 'hidden',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  changeAvatarText: {
    ...typography.body,
    fontWeight: '500',
  },
  formSection: {
    paddingHorizontal: spacing.lg,
  },
  buttonSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  saveButton: {
    marginBottom: spacing.md,
  },
  cancelButton: {
    marginBottom: spacing.sm,
  },
  bottomSpacing: {
    height: 50,
  },
});

export default EditProfileScreen;