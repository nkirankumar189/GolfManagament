import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper function to save user to AsyncStorage
const saveUserToStorage = async (user) => {
  try {
    const jsonValue = JSON.stringify(user);
    await AsyncStorage.setItem('@user_data', jsonValue);
  } catch (e) {
    console.error('Failed to save user data', e);
  }
};

// Helper function to load user from AsyncStorage
const loadUserFromStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@user_data');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Failed to load user data', e);
    return null;
  }
};

// Initial state
const initialState = {
  user: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.status = 'succeeded';
      // Save to AsyncStorage whenever user changes
      saveUserToStorage(action.payload);
    },
    clearUser: (state) => {
      state.user = null;
      state.status = 'idle';
      // Remove from AsyncStorage when logging out
      AsyncStorage.removeItem('@user_data');
    },
    setLoading: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.status = 'failed';
    }
  }
});

// Export actions
export const { setUser, clearUser, setLoading, setError } = userSlice.actions;

// Thunk to load user from AsyncStorage
export const loadUser = () => async (dispatch) => {
  dispatch(setLoading('loading'));
  try {
    const user = await loadUserFromStorage();
    if (user) {
      dispatch(setUser(user));
    } else {
      dispatch(setLoading('idle'));
    }
  } catch (error) {
    dispatch(setError(error.message));
  }
};

// Selectors
export const selectUser = (state) => state.user.user;
export const selectUserStatus = (state) => state.user.status;
export const selectUserError = (state) => state.user.error;

export default userSlice.reducer;