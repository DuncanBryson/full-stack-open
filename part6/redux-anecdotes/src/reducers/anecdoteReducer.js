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
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});
export const { addVote, setAnecdotes, appendAnecdote } = anecdoteSlice.actions;

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll();
    dispatch(setAnecdotes(anecdotes));
  };
};

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const anecdote = await anecdoteService.createNew(content);
    dispatch(appendAnecdote(anecdote));
  };
};

export default anecdoteSlice.reducer;
