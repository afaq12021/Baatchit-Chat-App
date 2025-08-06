import { useEffect, useState } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import notifee, { AuthorizationStatus } from '@notifee/react-native';

export const useNotificationPermission = () => {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const permission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          setHasPermission(permission === PermissionsAndroid.RESULTS.GRANTED);
        } else {
          setHasPermission(true);
        }
      } else {
        const settings = await notifee.requestPermission();
        setHasPermission(settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED);
      }
    } catch (error) {
      console.error('Error checking notification permission:', error);
      setHasPermission(false);
    }
  };

  const requestPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version >= 33) {
          const permission = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          setHasPermission(permission === PermissionsAndroid.RESULTS.GRANTED);
          return permission === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
      } else {
        const settings = await notifee.requestPermission({
          alert: true,
          badge: true,
          sound: true,
        });
        setHasPermission(settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED);
        return settings.authorizationStatus >= AuthorizationStatus.AUTHORIZED;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      setHasPermission(false);
      return false;
    }
  };

  return {
    hasPermission,
    requestPermission,
    checkPermission,
  };
};