import { createSlice } from '@reduxjs/toolkit'

const fileSlice = createSlice({
    name: 'file',
    initialState: {
        name: '',
        content: '',
        extension: ''
    },
    reducers : {
        RESET: () => ({
            name: '',
            content: '',
            extension: ''
        }),
        setFile: (state, action) => {
            state.name = action.payload.name;
            state.content = action.payload.content;
            state.extension = action.payload.extension;
        }
    }
});

export const getFile = (state) => state.file;
export const { setFile, RESET } = fileSlice.actions;
export default fileSlice.reducer;