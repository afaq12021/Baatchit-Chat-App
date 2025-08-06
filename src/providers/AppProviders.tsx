import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '../redux/store';
import { StorageService } from '../utils/storage';
import { useAppDispatch } from '../redux/hooks';
import { setThemeMode } from '../redux/slices/themeSlice';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

// Theme initializer component
const ThemeInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeTheme = async () => {
      try {
        const savedTheme = await StorageService.getThemeMode();
        if (savedTheme) {
          dispatch(setThemeMode(savedTheme));
        }
      } catch (error) {
        console.error('Failed to load saved theme:', error);
      }
    };

    initializeTheme();
  }, [dispatch]);

  return <>{children}</>;
};

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeInitializer>
          {children}
        </ThemeInitializer>
      </QueryClientProvider>
    </Provider>
  );
};

export default AppProviders;