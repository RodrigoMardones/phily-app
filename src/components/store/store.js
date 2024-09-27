import { configureStore } from '@reduxjs/toolkit'
import TreeReducer from './tree/slice'
import FileReducer from './file/slice'
import ErrorReducer from './error/slice'

const store = configureStore({
  reducer: {
    tree: TreeReducer,
    file: FileReducer,
    error: ErrorReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
  })
});
export default store;
