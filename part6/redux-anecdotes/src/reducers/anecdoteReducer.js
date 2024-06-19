import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    addVote(state, action) {
      const id = action.payload;
      const votedAnecdote = state.find((a) => a.id === id);
      const updatedAnecdote = {
        ...votedAnecdote,
        votes: votedAnecdote.votes + 1,
      };
      return state.map((a) => (a.id === id ? updatedAnecdote : a));
    },
    createAnecdote(state, action) {
      const content = action.payload;
      state.push(content);
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});
export const { addVote, createAnecdote, setAnecdotes } = anecdoteSlice.actions;

export const initializeAnecdotes = async () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export default anecdoteSlice.reducer;
