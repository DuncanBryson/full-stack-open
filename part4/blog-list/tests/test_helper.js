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

module.exports = { initialBlogs, blogsInDb };
