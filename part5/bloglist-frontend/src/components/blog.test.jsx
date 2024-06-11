import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Blog from "./Blog";

describe("Blogs rendering correctly", async () => {
  let container;
  const user = { username: "username" };
  const blog = {
    title: "render title",
    author: "render author",
    url: "render url",
    likes: "render likes",
    username: "username",
    user: user,
  };
  beforeEach(() => {
    container = render(<Blog blog={blog} user={user} />).container;
  });

  test("Title and author render", async () => {
    const title = await screen.getByText("render title");
    const author = await screen.getByText("render author");
    expect(title).toBeDefined();
    expect(author).toBeDefined();
  });
  test("URL and likes are hidden by default", async () => {
    const hidden = container.querySelector(".hidden");
    expect(hidden).toHaveStyle("display:none");
  });

  test("Button shows URL and likes", async () => {
    const interaction = userEvent.setup();
    const button = screen.getByText("view");
    await interaction.click(button);
    const hidden = container.querySelector(".hidden");

    expect(hidden).not.toHaveStyle("display:none");
  });
});
