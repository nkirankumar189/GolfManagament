import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    members: [],
    bookvisitMembers: [],
    visitors: [],
    userProfile: []
};

export const masterSlice = createSlice({
    name: 'master',
    initialState,
    reducers: {
        setMembers: (state, action) => {
            state.members = action.payload;
        },
        setBookvisitMembers: (state, action) => {
            state.bookvisitMembers = action.payload;
        },
        setVisitors: (state, action) => {
            state.visitors = action.payload;
        },
        setUserProfile: (state, action) => {
            state.userProfile = action.payload;
        }
    },
});

export const { setMembers, setBookvisitMembers, setVisitors,setUserProfile } = masterSlice.actions;

export default masterSlice.reducer;