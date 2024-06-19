import { useSelector, useDispatch } from "react-redux";
import { addVote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

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
  const vote = (anecdote) => {
    dispatch(addVote(anecdote));
    dispatch(setNotification(`Voted for ${anecdote.content}`, 5));
  };
  return (
    <>
      {[...anecdotes]
        .sort((a, b) => (a.votes > b.votes ? -1 : 1))
        .map((anecdote) => (
          <Anecdote
            handleClick={() => vote(anecdote)}
            anecdote={anecdote}
            key={anecdote.id}
          />
        ))}
    </>
  );
};

export default AnecdoteList;
