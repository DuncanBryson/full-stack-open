const blogRouter = require("express").Router();
const Blog = require("../models/blog");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);
  if (!blog.title) {
    response.status(400).json({ Error: "Missing title" });
  } else if (!blog.url) {
    response.status(400).json({ Error: "Missing url" });
  } else {
    const savedBlog = await blog.save();
    response.status(201).json(savedBlog);
  }
});

module.exports = blogRouter;
