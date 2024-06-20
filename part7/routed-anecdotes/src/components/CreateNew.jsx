import { useNavigate } from "react-router-dom";
import { useField } from "../hooks";

const CreateNew = ({ addNew }) => {
  const content = useField("text");
  const author = useField("text");
  const info = useField("url");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0,
    });
    navigate("/");
  };
  const handleReset = () => {
    content.reset(""), author.reset(""), info.reset("");
  };
  const reset = null;
  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...{ ...content, reset }} />
        </div>
        <div>
          author
          <input {...{ ...author, reset }} />
        </div>
        <div>
          url for more info
          <input {...{ ...info, reset }} />
        </div>
        <button type="submit">create</button>
        <button type="reset" onClick={handleReset}>
          reset
        </button>
      </form>
    </div>
  );
};
export default CreateNew;
