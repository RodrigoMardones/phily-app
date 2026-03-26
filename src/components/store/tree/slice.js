import { createSlice } from '@reduxjs/toolkit';
import {
  createTreeState,
  modifyEspecificNodeStyle,
  modifyEspecificLabelStyle,
  modifyEspecificPathStyle,
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
    setNodeStyleById: (state, action) => {
      const { id, nodeStyle } = action.payload;
      modifyEspecificNodeStyle(state.tree, nodeStyle, id);
    },
    setLabelStyleById: (state, action) => {
      const { id, labelStyle } = action.payload;
      modifyEspecificLabelStyle(state.tree, labelStyle, id);
    },
    setPathStyleById: (state, action) => {
      const { id, pathStyle } = action.payload;
      modifyEspecificPathStyle(state.tree, pathStyle, id);
    },
  },
});

export const getTree = (state) => state.tree;

export const { set, setStyle, setNodeStyleById, setLabelStyleById, setPathStyleById, RESET } = treeSlice.actions;

export default treeSlice.reducer;