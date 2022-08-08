import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Moment from "moment";
import config from "../../../config";
var axios = require("axios");

export const fetchUserBytoken = createAsyncThunk(
  "user/fetchUserByToken",
  async (thunkAPI) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      const response = await fetch(
        `${config.API_URL}/users/me`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      let data = await response.json();

      if (response.status === 200) {
        return data.data.user;
      } else {
        return thunkAPI.rejectWithValue(data);
      }
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export const editUser = createAsyncThunk(
  "user/editUser",
  async ({ accessToken, data }, thunkAPI) => {
    try {
      var config_API = {
        method: "patch",
        url: `${config.API_URL}/users/me`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: data,
      };
      const response = await axios(config_API);
      return response.data.data.user;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

const createFormData = (photo, body = {}) => {
  const data = new FormData();

  data.append("photo", {
    name: photo.fileName,
    type: photo.type,
    uri: Platform.OS === "ios" ? photo.uri.replace("file://", "") : photo.uri,
  });

  Object.keys(body).forEach((key) => {
    data.append(key, body[key]);
  });

  return data;
};

export const uploadAvatar = createAsyncThunk(
  "user/uploadAvatar",
  async (photo, thunkAPI) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      var config_API = {
        method: "POST",
        url: `${config.API_URL}/users/uploadAvatar`,

        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
        // data,
        body: createFormData(photo, { userId: "123" }),
      };
      const response = await axios(config_API);

      return response.data;
    } catch (e) {
      console.log("Error", e.response.data);
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

export const addMemberGroup = createAsyncThunk(
  "user/addMemberGroup",
  async (data, thunkAPI) => {
    try {
      const accessToken = await AsyncStorage.getItem("accessToken");
      var config_API = {
        method: "patch",
        url: `${config.API_URL}/users/add-member-to-group`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data,
      };
      const response = await axios(config_API);
      return response;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

const initialState = {
  _id: "",
  email: "",
  password: "",
  phoneNumber: "",
  fullname: "",
  birthDay: "",
  avatar:
    "http://res.cloudinary.com/master-dev/image/upload/v1657251169/ChatApp/uploads/avatar/default-avatar_glrb8q.png",
  __v: 0,
  chatgroups: [],
  isFetching: false,
  isSuccess: false,
  isError: false,
  isUploadSuccess: false,
  message: "",
  lastSeen: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isFetching = false;
      state.message = "";
      state.isUploadSuccess = false;
      return state;
    },
    clearData: (state) => {
      state = { ...initialState };
      return state;
    },
    updateLastMessage: (state, action) => {
      state.chatgroups.filter(
        (item) => item._id === action.payload.chatGroupID
      )[0].lastMessage = {
        ...action.payload,
      };

      state.chatgroups.sort(function (a, b) {
        return (
          new Date(b.lastMessage?.createdAt || b.createAt) -
          new Date(a.lastMessage?.createdAt || a.createAt)
        );
      });
    },
    addRoomChat: (state, action) => {
      state.chatgroups = [action.payload, ...state.chatgroups];
      return state;
    },
    updateLastSeen: (state, action) => {
      const prevLastSeen = state.lastSeen.filter(
        (i) => i.chatGroupID === action.payload
      );

      if (prevLastSeen.length) {
        state.lastSeen.filter((i) => i.chatGroupID === action.payload)[0].time =
          Moment(new Date()).toISOString();
        // prevLastSeen[0].time = new Date();
      } else {
        state.lastSeen.push({
          chatGroupID: action.payload,
          time: Moment(new Date()).toISOString(),
        });
      }
    },
  },

  extraReducers: {
    [fetchUserBytoken.pending]: (state) => {
      state.isFetching = true;
    },

    [fetchUserBytoken.fulfilled]: (state, action) => {
      state._id = action.payload._id;
      state.email = action.payload.email;
      state.password = action.payload.password;
      if (action.payload.avatar) {
        state.avatar = action.payload.avatar;
      }
      state.phoneNumber = action.payload.phoneNumber;
      state.fullname = action.payload.fullname;
      state.birthDay = action.payload.birthDay;
      state.__v = action.payload.__v;
      state.chatgroups = action.payload.chatgroups.map((item) => {
        if (item.lastMessage) {
          return {
            ...item,
            lastMessage: {
              _id: item.lastMessage._id,
              createdAt: item.lastMessage.createAt,
              user: item.lastMessage.author,
              text: item.lastMessage.body,
              image: item.lastMessage.image,
            },
          };
        }
        return item;
      });
      state.chatgroups.sort(function (a, b) {
        return (
          new Date(b.lastMessage?.createdAt || b.createAt) -
          new Date(a.lastMessage?.createdAt || a.createAt)
        );
      });
      state.isFetching = false;
      state.isSuccess = true;
      state.lastSeen = action.payload.lastSeen;
    },

    [fetchUserBytoken.rejected]: (state) => {
      state.isFetching = false;
      state.isError = true;
    },

    [editUser.pending]: (state) => {
      state.isFetching = true;
    },

    [editUser.fulfilled]: (state, action) => {
      state.phoneNumber = action.payload.phoneNumber;
      state.fullname = action.payload.fullname;
      state.birthDay = action.payload.birthDay;
      state.isFetching = false;
      state.isSuccess = true;
    },

    [editUser.rejected]: (state, action) => {
      state.isFetching = false;
      state.isError = true;
      state.message = action.payload.message;
    },

    [uploadAvatar.pending]: (state) => {
      state.isFetching = true;
    },

    [uploadAvatar.fulfilled]: (state, action) => {
      state.avatar = action.payload.avatar;
      state.isFetching = false;
      state.isUploadSuccess = true;
    },

    [uploadAvatar.rejected]: (state, action) => {
      state.isFetching = false;
      state.isError = true;
      state.message = action.payload.message;
    },

    [addMemberGroup.pending]: (state) => {
      state.isFetching = true;
    },

    [addMemberGroup.fulfilled]: (state, action) => {
      state.isFetching = false;
      state.isSuccess = true;
      state.chatgroups.filter((i) => i._id === action.payload._id)[0].members =
        [...action.payload];
    },

    [addMemberGroup.rejected]: (state, action) => {
      state.isFetching = false;
      state.isError = true;
      state.message = action.payload.message;
    },
  },
});

export const {
  clearState,
  clearData,
  updateLastMessage,
  addRoomChat,
  updateLastSeen,
} = userSlice.actions;

export const userSelector = (state) => state.user;
