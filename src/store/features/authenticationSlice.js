import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../../config";

var axios = require("axios");

export const signupUser = createAsyncThunk(
  "authentication/signupUser",
  async ({ fullname, email, password }, thunkAPI) => {
    try {
      const response = await fetch(
        `${config.API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullname,
            email,
            password,
          }),
        }
      );

      let data = await response.json();
      if (response.status === 201) {
        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export const loginUser = createAsyncThunk(
  "authentication/login",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await fetch(
        `${config.API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      let data = await response.json();

      if (response.status === 200) {
        await AsyncStorage.setItem("accessToken", data.accessToken);

        await AsyncStorage.setItem("refreshToken", data.refreshToken);

        return data;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

const initialState = {
  isFetching: false,
  isSuccess: false,
  isError: false,
  message: "",
};

export const authenticationSlice = createSlice({
  name: "authentication",
  initialState,
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
    [signupUser.pending]: (state) => {
      state.isFetching = true;
    },

    [signupUser.fulfilled]: (state, action) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.message = action.payload.message;
    },

    [signupUser.rejected]: (state, action) => {
      state.isFetching = false;
      state.isError = true;
      state.message = action.payload.message;
    },

    [loginUser.pending]: (state) => {
      state.isFetching = true;
    },

    [loginUser.fulfilled]: (state, action) => {
      state.isFetching = false;
      state.isSuccess = true;
    },

    [loginUser.rejected]: (state, action) => {
      state.isFetching = false;
      state.isError = true;
      state.message = action.payload.message;
    },
  },
});

export const { clearState } = authenticationSlice.actions;

export const authenticationSelector = (state) => state.authentication;
