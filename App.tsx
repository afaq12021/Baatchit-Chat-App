import React, { useEffect } from 'react';
import AppNavigation from './src/navigations/AppNavigation';
import { useNotificationPermission } from './src/hooks/useNotificationPermission';
import notifee, { EventType } from '@notifee/react-native';
import AppProviders from './src/providers/AppProviders';

const App = () => {
  const { requestPermission } = useNotificationPermission();

  useEffect(() => {
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
  }, []);

  return (
    <AppProviders>
      <AppNavigation />
    </AppProviders>
  );
};

export default App;
