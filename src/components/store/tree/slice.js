import { createSlice } from '@reduxjs/toolkit'
import { createBaseTree } from '@/utils/TreeData'

const initialState = {
  name: '',
  normalize: false,
  curveType: 'step',
  angle: 0,
  tree: createBaseTree(),
}	

const treeSlice = createSlice({
  name: 'tree',
  initialState: initialState,
  reducers: {
    RESET: () => (initialState),
    set: (state, action) => {
      state.name = action.payload.name
      state.normalize = action.payload.normalize
      state.curveType = action.payload.curveType
      state.tree = action.payload.tree 
      state.angle = action.payload.angle
    }
  },
})

export const getTree = (state) => state.tree

export const { set, RESET } = treeSlice.actions

export default treeSlice.reducer
