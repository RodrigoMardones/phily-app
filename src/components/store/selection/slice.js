import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedIds: [],
};

const selectionSlice = createSlice({
  name: 'selection',
  initialState,
  reducers: {
    RESET: () => initialState,
    toggleId: (state, action) => {
      const id = action.payload;
      const idx = state.selectedIds.indexOf(id);
      if (idx === -1) {
        state.selectedIds.push(id);
      } else {
        state.selectedIds.splice(idx, 1);
      }
    },
    addIds: (state, action) => {
      const ids = action.payload;
      const current = new Set(state.selectedIds);
      for (const id of ids) {
        if (!current.has(id)) {
          state.selectedIds.push(id);
        }
      }
    },
    removeIds: (state, action) => {
      const idsToRemove = new Set(action.payload);
      state.selectedIds = state.selectedIds.filter((id) => !idsToRemove.has(id));
    },
    clearSelection: () => initialState,
  },
});

export const getSelectedIds = (state) => state.selection.selectedIds;
export const { toggleId, addIds, removeIds, clearSelection, RESET } = selectionSlice.actions;
export default selectionSlice.reducer;
