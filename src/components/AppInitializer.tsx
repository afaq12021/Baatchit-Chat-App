import React, { useEffect } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { loadTheme } from '../redux/slices/themeSlice';
import { useNotificationPermission } from '../hooks/useNotificationPermission';
import notifee, { EventType } from '@notifee/react-native';
import AppNavigation from '../navigations/AppNavigation';

const AppInitializer = () => {
  const dispatch = useAppDispatch();
  const { requestPermission } = useNotificationPermission();

  useEffect(() => {
    // Load saved theme
    dispatch(loadTheme());
    // Request notification permissions when app starts
    requestPermission();

    // Set up notification listeners
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      switch (type) {
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          // Handle notification press
          break;
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
      }
    });

    // Clean up listener
    return () => unsubscribe();
  }, [dispatch, requestPermission]);

  return <AppNavigation />;
};

export default AppInitializer;