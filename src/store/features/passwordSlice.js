import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../../config";
var axios = require("axios");

export const forgotPassword = createAsyncThunk(
  "password/forgotpassword",
  async (data, thunkAPI) => {
    var config_API = {
      method: "POST",
      url: `${config.API_URL}/users/forgot-password`,
      headers: {},
      data: data,
    };

    try {
      const response = await axios(config_API);
      await AsyncStorage.setItem("resetToken", response.data.resetToken);
      return response.data;
    } catch (e) {
      console.log("Error", e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "password/resetpassword",
  async (data, thunkAPI) => {
    const resetToken = await AsyncStorage.getItem("resetToken");
    var config_API = {
      method: "PATCH",
      url: `${config.API_URL}/users/reset-password/${resetToken}`,
      headers: {},
      data: data,
    };

    try {
      const response = await axios(config_API);
      return response.data;
    } catch (e) {
      console.log("Error", e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export const changePassword = createAsyncThunk(
  "password/changepassword",
  async ({ data }, thunkAPI) => {
    const accessToken = await AsyncStorage.getItem("accessToken");
    var config_API = {
      method: "PATCH",
      url: `${config.API_URL}/users/change-password`,
      // url: "http://192.168.21.103:5000/api/v1/users/change-password",

      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: data,
    };

    try {
      const response = await axios(config_API);

      return response.data;
    } catch (e) {
      console.log("Error", e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export const passwordSlice = createSlice({
  name: "password",
  initialState: {
    isFetching: false,
    isSuccess: false,
    isError: false,
    message: "",
  },

  reducers: {
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;
      state.message = "";
      return state;
    },
  },

  extraReducers: {
    [forgotPassword.pending]: (state) => {
      state.isFetching = true;
    },

    [forgotPassword.fulfilled]: (state, action) => {
      state.isFetching = false;
      state.isSuccess = true;
    },

    [forgotPassword.rejected]: (state, action) => {
      state.isFetching = false;
      state.isError = true;
      state.message = action.payload.message;
    },

    [resetPassword.pending]: (state) => {
      state.isFetching = true;
    },

    [resetPassword.fulfilled]: (state, action) => {
      state.isFetching = false;
      state.isSuccess = true;
    },

    [resetPassword.rejected]: (state, action) => {
      state.isFetching = false;
      state.isError = true;
      state.message = action.payload.message;
    },

    [changePassword.pending]: (state) => {
      state.isFetching = true;
    },

    [changePassword.fulfilled]: (state, action) => {
      state.isFetching = false;
      state.isSuccess = true;
    },

    [changePassword.rejected]: (state, action) => {
      state.isFetching = false;
      state.isError = true;
      state.message = action.payload.message;
    },
  },
});

export const { clearState } = passwordSlice.actions;

export const passwordSelector = (state) => state.password;
