import { createSlice } from '@reduxjs/toolkit';


// export const packageManage = createAsyncThunk('packageManage', async(data) => {

// })

export const packageManageSlice = createSlice({
  name: 'packageManageSlice',
  initialState:{
    loading: false,
    data: null,
    error: null,
  },
  reducers: {
    loadingPackage: (state) => {
        state.loading = true;
        state.data = null;
        state.error = null;
    },
    getPackage: (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
    },
    errorPackage: (state, action) => {
        console.log(action.payload);
        state.error(action.payload);
    },
  },
});

export const packageManageReducer = packageManageSlice.reducer;