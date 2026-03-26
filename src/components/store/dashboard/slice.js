import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isHamburgerMenuActive: false,
    findNodeName: null,
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
        setFindNodeName: (state, action) => {
            state.findNodeName = action.payload;
        },
        clearFindNodeName: (state) => {
            state.findNodeName = null;
        },
    },
});

export const getHamburgerMenuActive = (state) => state.dashboard.isHamburgerMenuActive;
export const getFindNodeName = (state) => state.dashboard.findNodeName;
export const { toggleHamburgerMenu, setHamburgerMenuActive, setFindNodeName, clearFindNodeName } = dashboardSlice.actions;

export default dashboardSlice.reducer;