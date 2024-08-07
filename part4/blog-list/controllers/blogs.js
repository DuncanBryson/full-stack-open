const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const { userExtractor, errorHandler } = require("../utils/middleware");
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

blogRouter.delete("/:id", userExtractor, async (request, response) => {
  const user = request.user;
  const blog = await Blog.findById(request.params.id);
  if (!blog) return response.status(204).end();
  if (blog.user.toString() !== user._id.toString()) {
    return response
      .status(401)
      .json({ error: "Token does not match blog poster" });
  }
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogRouter.post("/", userExtractor, async (request, response) => {
  const { author, title, url, likes } = request.body;
  const user = request.user;

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id,
  });

  if (!blog.title) {
    response.status(400).json({ error: "Missing title" });
  } else if (!blog.url) {
    response.status(400).json({ error: "Missing url" });
  } else {
    const savedBlog = await blog.save();
    user.blogs = user.blogs.concat(savedBlog._id);
    await user.save();
    response.status(201).json(savedBlog);
  }
});

blogRouter.post("/:id/comments", async (request, response) => {
  const { comment } = request.body;
  const blog = await Blog.findById(request.params.id);
  if (blog) {
    const comments = [...blog.comments];
    comments.push(comment);
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, {
      comments,
    });
    response.status(201).json(updatedBlog);
  } else {
    response.status(404).end();
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
blogRouter.use(errorHandler);
module.exports = blogRouter;
