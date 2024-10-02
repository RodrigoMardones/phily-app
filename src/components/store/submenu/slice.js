import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pointerX: 0,
  pointerY: 0,
  component: {
    data: {
      nodeStyle: {
        radius: 5,
        fill: '#000000',
      },
    },
  },
  typeElement: '',
  toggled: true,
};

const subMenuSlice = createSlice({
  name: 'submenu',
  initialState: initialState,
  reducers: {
    RESET: () => initialState,
    set: (state, action) => {
      state.component = action.payload.component;
      state.toggled = action.payload.toggled;
      state.pointerX = action.payload.pointerX;
      state.pointerY = action.payload.pointerY;
      state.typeElement = action.payload.typeElement;
    },
  },
});
export const getContextMenu = (state) => state.submenu;
export const { RESET, set } = subMenuSlice.actions;
export default subMenuSlice.reducer;
