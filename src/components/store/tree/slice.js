import { createSlice } from '@reduxjs/toolkit';
import {
  createTreeState
} from '@/lib/TreeData';

const initialState = createTreeState({name: ''})

const treeSlice = createSlice({
  name: 'tree',
  initialState: initialState,
  reducers: {
    RESET: () => initialState,
    set: (state, action) => {
      state.name = action.payload.name;
      state.normalize = action.payload.normalize;
      state.curveType = action.payload.curveType;
      state.tree = action.payload.tree;
      state.angle = action.payload.angle;
      state.width = action.payload.width;
      state.height = action.payload.height;
      state.globalStyles = action.payload.globalStyles;
    },
    setStyle: (state, action) => {
      state.globalStyles = action.payload.globalStyles;
    },
  },
});

export const getTree = (state) => state.tree;

export const { set, setStyle, RESET } = treeSlice.actions;

export default treeSlice.reducer;