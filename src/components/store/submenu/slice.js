import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    pointerX: 0,
    pointerY: 0,
    component: null,
    toggled: true
}

const subMenuSlice = createSlice({
    name: 'submenu',
    initialState: initialState,
    reducers: {
        RESET: () => initialState,
        set: (state, action) => {
            state.component = action.payload.component,
            state.toggled = action.payload.toggled,
            state.pointerX = action.payload.pointerX,
            state.pointerY = action.payload.pointerY 
        }
    }
});
export const getContextMenu = (state) => state.submenu;
export const { RESET, set } = subMenuSlice.actions;
export default subMenuSlice.reducer;