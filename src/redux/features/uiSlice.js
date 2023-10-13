import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  breadCrumbs: [],
  // messageDuration: null,
  // if false is written to localStorage return false, else return true, initially, it will be null/unset, that will also return true
  openDeleteDialog: false,
  searchValue: "",
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setOpenDeleteDialog: (state, action) => {
      state.openDeleteDialog = action.payload;
    },
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setOpenDeleteDialog,
  setSearchValue,
} = uiSlice.actions;

export default uiSlice.reducer;
