import { createSlice } from "@reduxjs/toolkit";
import anecdoteService from "../services/anecdotes";

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    updateAnecdote(state, action) {
      const anecdote = action.payload;
      return state.map((a) => (a.id === anecdote.id ? anecdote : a));
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});
export const { updateAnecdote, setAnecdotes, appendAnecdote } =
  anecdoteSlice.actions;

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

export const addVote = (anecdote) => {
  const votedAnecdote = { ...anecdote, votes: anecdote.votes + 1 };
  return async (dispatch) => {
    await anecdoteService.update(votedAnecdote);
    dispatch(updateAnecdote(votedAnecdote));
  };
};

export default anecdoteSlice.reducer;
