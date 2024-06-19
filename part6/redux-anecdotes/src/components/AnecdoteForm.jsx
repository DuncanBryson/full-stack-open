import { useDispatch } from "react-redux";
import { createAnecdote } from "../reducers/anecdoteReducer";
import { createNotification } from "../reducers/notificationReducer";

const AnecdoteForm = () => {
  const dispatch = useDispatch();
  const handleSubmit = (event) => {
    event.preventDefault();
    const newAnecdote = event.target.newAnecdote.value;
    dispatch(createAnecdote(newAnecdote));
    dispatch(createNotification(`Added anecdote ${newAnecdote}`));
    event.target.newAnecdote.value = "";
  };
  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleSubmit} name="create-anecdote">
        <div>
          <input name="newAnecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};
export default AnecdoteForm;
