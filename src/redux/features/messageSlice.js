import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  answers: [],
  questions: [],
};

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
  },
});

// Action creators are generated for each case reducer function
export const {
  setAnswers,
  setQuestions,
} = messageSlice.actions;

export default messageSlice.reducer;
