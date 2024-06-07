const Blog = require("../models/blog");
const User = require("../models/user");

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

const initialUsers = [
  {
    username: "Duncan",
    name: "Duncan",
    passwordHash:
      "$2b$10$zNIcPZGVWL/wOIOsia5qiOSdw93lfznuhjPZs9F8YIqxyXZ0x4oAS",
  },
  {
    username: "Dave",
    name: "Dave",
    passwordHash:
      "$2b$10$Br4k/7wgC3uVr8pAXLsrye2H4aVxceVKQX0fVp6oZn11o283Aq1VO",
  },
];

const usersInDB = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

module.exports = {
  initialBlogs,
  blogsInDb,
  getVoidID,
  initialUsers,
  usersInDB,
};
