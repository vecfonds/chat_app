import { configureStore } from "@reduxjs/toolkit";
import { passwordSlice } from "./features/passwordSlice";
import { userSlice } from "./features/userSlice";
import { chatSlice } from "./features/chatSlice";
import { allUsersSlice } from "./features/allUsersSlice";
import { authenticationSlice } from "./features/authenticationSlice";

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    password: passwordSlice.reducer,
    chat: chatSlice.reducer,
    allUsers: allUsersSlice.reducer,
    authentication: authenticationSlice.reducer
  },
});

export default store;
