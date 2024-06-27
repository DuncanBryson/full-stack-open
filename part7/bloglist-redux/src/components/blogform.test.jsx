import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test("BlogForm submits with correct details", async () => {
  const addBlog = vi.fn();
  const interaction = userEvent.setup();

  const container = render(<BlogForm {...{ addBlog }} />).container;
  const title = container.querySelector("#title");
  const author = container.querySelector("#author");
  const url = container.querySelector("#url");
  const submit = screen.getByText("Add Blog");

  await interaction.type(title, "New title");
  await interaction.type(author, "New author");
  await interaction.type(url, "http://www.notawebsite.com");
  await userEvent.click(submit);

  expect(addBlog.mock.calls).toHaveLength(1);
  expect(addBlog.mock.calls[0][0]).toStrictEqual({
    title: "New title",
    author: "New author",
    url: "http://www.notawebsite.com",
  });
});
