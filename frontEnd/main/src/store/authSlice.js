import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import URL from "../Constant";

// Redux action to get user
export const fetchUser = createAsyncThunk("fetchUser", async (data) => {
  const { email, password } = data;
  
  const config = {
    headers: { "content-type": "application/json" },
  };

  const response = await axios.post(
    `${URL}/api/admin/admin-login`,
    { email, password },
    config
  );
  
  return response.data;
});

export const logout = createAsyncThunk("logout", async () => {
  localStorage.removeItem('userInfo');
});

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.pending = true;
      state.userInfo = null;
      state.error = false;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.pending = true;
      state.userInfo = action.payload;
      state.error = false;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      console.log("Error", action.payload);
      state.error = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.userInfo = null
    });
  },
});

export default authSlice.reducer;
