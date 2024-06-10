import { createSlice } from '@reduxjs/toolkit';
import {
  createBaseGlobalStyles,
  createBaseTree,
} from '@/utils/TreeData';

const initialState = {
  name: '',
  normalize: false,
  curveType: 'step',
  angle: 360,
  width: 600,
  height: 600,
  globalStyles: createBaseGlobalStyles({}),
  tree: createBaseTree(),
};

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
