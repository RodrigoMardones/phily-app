import { configureStore } from '@reduxjs/toolkit'
import TreeReducer from './tree/slice'
import FileReducer from './file/slice'
import ErrorReducer from './error/slice'
import SubMenuReducer from './submenu/slice'
import DashboardReducer from './dashboard/slice'

const store = configureStore({
  reducer: {
    tree: TreeReducer,
    file: FileReducer,
    error: ErrorReducer,
    submenu: SubMenuReducer,
    dashboard: DashboardReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
  })
});
export default store;
