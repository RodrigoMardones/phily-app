import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isHamburgerMenuActive: false,
    findNodeName: null,
    highlightedNodeName: null,
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
        setHighlightedNodeName: (state, action) => {
            state.highlightedNodeName = action.payload;
        },
        clearHighlightedNodeName: (state) => {
            state.highlightedNodeName = null;
        },
    },
});

export const getHamburgerMenuActive = (state) => state.dashboard.isHamburgerMenuActive;
export const getFindNodeName = (state) => state.dashboard.findNodeName;
export const getHighlightedNodeName = (state) => state.dashboard.highlightedNodeName;
export const { toggleHamburgerMenu, setHamburgerMenuActive, setFindNodeName, clearFindNodeName, setHighlightedNodeName, clearHighlightedNodeName } = dashboardSlice.actions;

export default dashboardSlice.reducer;