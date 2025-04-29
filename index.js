import { configureStore } from '@reduxjs/toolkit';
import loaderReducer from '../Slices/loaderSlice';
import userReducer from '../Slices/userSlice'; // Import your user slice
import masterReducer from '../Slices/masterSlice';

export const store = configureStore({
  reducer: {
    loader: loaderReducer,
    user: userReducer, // Add the user reducer
    master:masterReducer
    // other reducers...
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false // This helps with AsyncStorage operations
    })
});