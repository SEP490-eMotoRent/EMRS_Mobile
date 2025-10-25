import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';

// ✅ FIXED: Persist the entire auth slice
const persistConfig = {
  key: "root", // ✅ Changed from "auth" to "root"
  storage: AsyncStorage,
  whitelist: ["auth"], // ✅ Whitelist the auth slice itself
};

const rootReducer = combineReducers({
  auth: authReducer, // ✅ Don't wrap individual reducers
});

// ✅ Wrap the ROOT reducer with persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer, // ✅ Use the persisted reducer
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;