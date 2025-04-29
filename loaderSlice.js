import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isLoading: false,
    loadingText: 'Loading...', // Optional loading message
};

export const loaderSlice = createSlice({
    name: 'loader',
    initialState,
    reducers: {
        showLoader: (state, action) => {
            state.isLoading = true;
            state.loadingText = action.payload?.loadingText || 'Loading...';
        },
        hideLoader: (state) => {
            state.isLoading = false;
            state.loadingText = 'Loading...';
        },
    },
});

export const { showLoader, hideLoader } = loaderSlice.actions;

export default loaderSlice.reducer;