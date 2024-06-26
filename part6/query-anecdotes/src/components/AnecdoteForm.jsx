const AnecdoteForm = ({ handleAdd }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
    const content = event.target.anecdote.value;
    event.target.anecdote.value = "";
    handleAdd(content);
  };

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={handleSubmit}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
