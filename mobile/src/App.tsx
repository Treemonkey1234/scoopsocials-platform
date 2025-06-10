import React, { useEffect } from 'react';
import { StatusBar, LogBox, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { NotifierWrapper } from 'react-native-notifier';

// Navigation
import AppNavigator from './navigation/AppNavigator';

// Store
import { store } from './store/store';

// Services
import { setupAxiosInterceptors } from './services/api';

// Utils
import { initializeApp } from './utils/initialization';

// Types
import { toastConfig } from './utils/toastConfig';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Ignore specific warnings in development
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'Sending `onAnimatedValueUpdate` with no listeners registered',
]);

const App: React.FC = () => {
  useEffect(() => {
    // Initialize the app
    initializeApp();
    
    // Setup Axios interceptors
    setupAxiosInterceptors();
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <NotifierWrapper>
          <NavigationContainer>
            {/* Status Bar Configuration */}
            <StatusBar
              barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
              backgroundColor={Platform.OS === 'android' ? '#1f2937' : undefined}
              translucent={Platform.OS === 'android'}
            />
            
            {/* Main App Navigator */}
            <AppNavigator />
            
            {/* Toast Messages */}
            <Toast config={toastConfig} />
          </NavigationContainer>
        </NotifierWrapper>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;