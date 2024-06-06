const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  console.log(blog);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end();
  }
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
blogRouter.use(middleware.errorHandler);
module.exports = blogRouter;
