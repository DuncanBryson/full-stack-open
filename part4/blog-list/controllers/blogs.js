const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require("../models/user");
const middleware = require("../utils/middleware");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
});

blogRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogRouter.post("/", async (request, response) => {
  let { author, title, url, likes } = request.body;

  const users = await User.find({});
  const randomId = Math.floor(Math.random() * users.length);
  const user = users[randomId];
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id,
  });

  if (!blog.title) {
    response.status(400).json({ Error: "Missing title" });
  } else if (!blog.url) {
    response.status(400).json({ Error: "Missing url" });
  } else {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
  }
});

blogRouter.put("/:id", async (request, response) => {
  const { title, author, url, likes } = request.body;
  const updatedBlog = { title, author, url, likes };
  await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {
    new: true,
    runValidators: true,
    context: "query",
  });

  if (!updatedBlog) {
    return response.status(404).json({ error: "Blog not found" }).end();
  } else response.status(200).json(updatedBlog);
});
blogRouter.use(middleware.errorHandler);
module.exports = blogRouter;
