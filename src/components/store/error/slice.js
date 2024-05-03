import { createSlice } from '@reduxjs/toolkit';

const errorSlice = createSlice({
    name: 'error',
    initialState: {
        message: '',
        open: false
    },
    reducers: {
        RESET: () => ({
            message: '',
            open: false
        }),
        setError: (state, action) => {
            state.message = action.payload.message;
            state.open = action.payload.open;
        }
    }
})

export const getError = (state) => state.error;
export const { setError, RESET } = errorSlice.actions;
export default errorSlice.reducer;