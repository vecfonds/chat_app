import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import config from "../../../config";
var axios = require("axios");

export const getAllUsers = createAsyncThunk(
  "allUsers/getAllUsers",
  async (data, thunkAPI) => {
    const accessToken = await AsyncStorage.getItem("accessToken");

    try {
      var config_API = {
        method: "GET",
        url: `${config.API_URL}/users`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axios(config_API);

      return response.data.data.users;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

const initialState = {
  isFetching: false,
  isSuccess: false,
  isError: false,
  message: "",
  allUsers: [],
};

export const allUsersSlice = createSlice({
  name: "allUsers",
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
    [getAllUsers.pending]: (state) => {
      state.isFetching = true;
    },

    [getAllUsers.fulfilled]: (state, action) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.allUsers = action.payload;
    },

    [getAllUsers.rejected]: (state, action) => {
      state.isFetching = false;
      state.isError = true;
      state.message = action.payload.message;
    },
  },
});

export const { clearState } = allUsersSlice.actions;

export const allUsersSelector = (state) => state.allUsers;
