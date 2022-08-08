import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import config from "../../../config";
var axios = require("axios");

export const loadRoomMessage = createAsyncThunk(
  "chat/loadRoomMessage",
  async (data, thunkAPI) => {
    var config_API = {
      method: "GET",
      url: `${config.API_URL}/messages/${data.roomId}`,
      headers: {
        Authorization: `Bearer ${data.accessToken}`,
      },
    };

    try {
      const response = await axios(config_API);
      return response.data.data;
    } catch (e) {
      console.log("Error", e.response);
      return thunkAPI.rejectWithValue(e.response);
    }
  }
);

const initialState = {
  roomMessage: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: null,
  roomIdSelected: "",
  notification: {},
  oldRoomId: "",
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,

  reducers: {
    clearState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
      return state;
    },
    changeRoomIdSelected: (state, action) => {
      state.roomIdSelected = action.payload;
      state.notification[action.payload] = 0;
      // state.notification[action.payload] = false;
    },

    changeOldRoom: (state) => {
      state.oldRoomId = state.roomIdSelected;
    },

    clearData: (state) => {
      state.roomIdSelected = "";
      state.roomMessage = [];
      return state;
    },

    addNotification: (state, action) => {
      if (state.roomIdSelected !== action.payload.chatGroupID) {
        state.notification[action.payload.chatGroupID] = true;
        // if (state.notification[action.payload.chatGroupID]) {
        //   state.notification[action.payload.chatGroupID] =
        //     state.notification[action.payload.chatGroupID] + 1;
        // } else {
        //   state.notification[action.payload.chatGroupID] = 1;
        // }
      }
    },
    loadMessageRoom: (state, action) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.roomMessage = action.payload;
    },
  },

  extraReducers: {
    [loadRoomMessage.pending]: (state) => {
      state.isFetching = true;
    },

    [loadRoomMessage.fulfilled]: (state, action) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.roomMessage = action.payload.messgages;
    },

    [loadRoomMessage.rejected]: (state, action) => {
      state.isFetching = false;
      state.isError = true;
      state.message = action.payload?.message;
    },
  },
});

export const {
  clearState,
  changeRoomIdSelected,
  clearData,
  addNotification,
  loadMessageRoom,
  changeOldRoom,
} = chatSlice.actions;

export const chatSelector = (state) => state.chat;
