import { createSlice } from '@reduxjs/toolkit'
import { createBaseTree } from '@/utils/TreeData'

const treeSlice = createSlice({
  name: 'tree',
  initialState: {
    name: '',
    normalize: false,
    curveType: 'step',
    tree: createBaseTree(),
  },
  reducers: {
    RESET: () => ({
      name: '',
      normalize: false,
    curveType: 'step',
      tree: createBaseTree(),
    }),
    set: (state, action) => {
      state.name = action.payload.name
      state.normalize = action.payload.normalize
      state.curveType = action.payload.curveType
      state.tree = action.payload.tree 
    }
  },
})

export const getTree = (state) => state.tree

export const { set, RESET } = treeSlice.actions

export default treeSlice.reducer
