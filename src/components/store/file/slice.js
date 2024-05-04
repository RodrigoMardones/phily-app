const { createSlice } = require("@reduxjs/toolkit");

const file = createSlice({
    name: 'file',
    initialState: {
        name: '',
        content: ''
    },
    reducers : {
        RESET: () => ({
            name: '',
            content: ''
        }),
        setFile: (state, action) => {
            state.name = action.payload.name;
            state.content = action.payload.content;
        }
        
    }
});

export const getFile = (state) => state.file;
export const { setFile, RESET } = file.actions;
export default file.reducer;