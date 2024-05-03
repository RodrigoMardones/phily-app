import { createSlice } from '@reduxjs/toolkit'
import { createBaseTree } from '@/utils/TreeData'

const treeSlice = createSlice({
  name: 'tree',
  initialState: {
    name: '',
    tree: createBaseTree(),
  },
  reducers: {
    RESET: () => ({
      name: '',
      tree: createBaseTree(),
    }),
    set: (state, action) => ({...state, tree: action.payload.tree, name : action.payload.treeName }),
  },
})

export const getTree = (state) => state.tree.tree

export const { set, RESET } = treeSlice.actions

export default treeSlice.reducer
