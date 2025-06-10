import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import { MMKV } from 'react-native-mmkv';

// Reducers
import authReducer from './authSlice';
import userReducer from './userSlice';
import postsReducer from './postsSlice';
import eventsReducer from './eventsSlice';

// Create MMKV storage instance
const storage = new MMKV();

// Custom storage adapter for redux-persist
const mmkvStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return Promise.resolve(value);
  },
  removeItem: (key: string) => {
    storage.delete(key);
    return Promise.resolve();
  },
};

// Persist configuration
const persistConfig = {
  key: 'root',
  storage: mmkvStorage,
  whitelist: ['auth'], // Only persist auth state
};

const authPersistConfig = {
  key: 'auth',
  storage: mmkvStorage,
  blacklist: ['isLoading'], // Don't persist loading state
};

// Create the store
export const store = configureStore({
  reducer: {
    auth: persistReducer(authPersistConfig, authReducer),
    user: userReducer,
    posts: postsReducer,
    events: eventsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: __DEV__,
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;