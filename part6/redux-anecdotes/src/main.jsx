import ReactDOM from "react-dom/client";
import { createStore, combineReducers } from "redux";
import { Provider } from "react-redux";
import App from "./App";

import anecdotes from "./reducers/anecdoteReducer";
import filter from "./reducers/filterReducer";

const reducer = combineReducers({
  anecdotes,
  filter,
});

const store = createStore(reducer);
store.subscribe(() => console.log(store.getState()));

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
