import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Reducers
import authReducer from './authSlice';
import userReducer from './userSlice';
import postsReducer from './postsSlice';
import eventsReducer from './eventsSlice';
import notificationsReducer from './notificationsSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // Only persist auth state
};

const authPersistConfig = {
  key: 'auth',
  storage,
  blacklist: ['isLoading'], // Don't persist loading state
};

// Create the store
export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    user: userReducer,
    posts: postsReducer,
    events: eventsReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV === 'development',
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;