import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isHamburgerMenuActive: false,
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        toggleHamburgerMenu: (state) => {
            state.isHamburgerMenuActive = !state.isHamburgerMenuActive;
        },
        setHamburgerMenuActive: (state, action) => {
            state.isHamburgerMenuActive = action.payload;
        },
    },
});

export const getHamburgerMenuActive = (state) => state.dashboard.isHamburgerMenuActive;
export const { toggleHamburgerMenu, setHamburgerMenuActive } = dashboardSlice.actions;

export default dashboardSlice.reducer;