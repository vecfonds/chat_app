import { createSlice } from "@reduxjs/toolkit";

const setNameSlice = createSlice({
  name: "setName",
  initialState: {
    value: "",
  },
  reducers: {
    addName: (state, action) => {
      state.value = action.payload
    },
  },
});

export const { addName } = setNameSlice.actions;

export default setNameSlice