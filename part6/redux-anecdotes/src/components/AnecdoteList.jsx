import { useSelector, useDispatch } from "react-redux";
import { addVote } from "../reducers/anecdoteReducer";

const Anecdote = ({ anecdote, handleClick }) => (
  <div>
    <div>{anecdote.content}</div>
    <div>
      has {anecdote.votes}
      <button onClick={handleClick}>vote</button>
    </div>
  </div>
);
const AnecdoteList = () => {
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    if (filter === "") return anecdotes;
    return anecdotes.filter((a) =>
      a.content.toLowerCase().includes(filter.toLowerCase())
    );
  });

  const dispatch = useDispatch();
  const vote = (id) => {
    dispatch(addVote(id));
  };
  return (
    <>
      {anecdotes
        .sort((a, b) => (a.votes > b.votes ? -1 : 1))
        .map((anecdote) => (
          <Anecdote
            handleClick={() => vote(anecdote.id)}
            anecdote={anecdote}
            key={anecdote.id}
          />
        ))}
    </>
  );
};

export default AnecdoteList;
