const { initial } = require("lodash");
const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "test test",
    author: "tester",
    url: "google.ca",
    likes: 0,
  },
  {
    title: "The best search engine",
    author: "Microsoft",
    url: "bing.com",
    likes: -1000,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const getVoidID = async () => {
  const tempBlog = new Blog({
    title: "Existence is pain",
    author: "Short-lived",
    url: "...",
  });
  await tempBlog.save();
  await tempBlog.deleteOne();

  return tempBlog.id;
};

module.exports = { initialBlogs, blogsInDb, getVoidID };
