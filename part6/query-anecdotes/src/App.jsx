import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { getAnecdotes } from "./requests";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const App = () => {
  const queryClient = useQueryClient();
  const handleVote = (anecdote) => {
    console.log("vote");
  };

  const fetchAnecdotes = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  console.log(JSON.parse(JSON.stringify(fetchAnecdotes)));
  if (fetchAnecdotes.isLoading) return <div>Anecdotes Loading...</div>;
  if (fetchAnecdotes.isError)
    return (
      console.log("Error: ", fetchAnecdotes.error.message),
      (<div>Anecdote service not available due to server problems</div>)
    );

  const anecdotes = fetchAnecdotes.data;
  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default App;
