import { useNotificationDispatch } from "./NotificationContext";
import AnecdoteForm from "./components/AnecdoteForm";
import Notification from "./components/Notification";
import { getAnecdotes, createAnecdote, updateAnecdote } from "./requests";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const App = () => {
  const queryClient = useQueryClient();
  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(
        ["anecdotes"],
        anecdotes.map((a) =>
          a.id === updatedAnecdote.id ? updatedAnecdote : a
        )
      );
    },
  });
  const dispatchNotification = useNotificationDispatch();
  const handleVote = (anecdote) => {
    updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
    dispatchNotification({
      type: "CREATE",
      payload: `Voted for ${anecdote.content}`,
    });
  };

  const fetchAnecdotes = useQuery({
    queryKey: ["anecdotes"],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  console.log(JSON.parse(JSON.stringify(fetchAnecdotes)));

  const anecdotes = fetchAnecdotes.data;

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(["anecdotes"]);
      queryClient.setQueryData(["anecdotes"], anecdotes.concat(newAnecdote));
    },
    onError: (error) => {
      dispatchNotification({
        type: "CREATE",
        payload: error.response.data.error,
      });
    },
  });
  const handleAdd = (content) => {
    newAnecdoteMutation.mutate({ content, votes: 0 });
    dispatchNotification({
      type: "CREATE",
      payload: `Added ${content}`,
    });
  };
  if (fetchAnecdotes.isLoading) return <div>Anecdotes Loading...</div>;
  if (fetchAnecdotes.isError)
    return (
      console.log("Error: ", fetchAnecdotes.error.message),
      (<div>Anecdote service not available due to server problems</div>)
    );
  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm {...{ handleAdd }} />

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
