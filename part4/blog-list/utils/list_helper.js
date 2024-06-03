const { log } = require("console");
const blog = require("../models/blog");

const dummy = (blogs) => 1;

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0);

module.exports = {
  dummy,
  totalLikes,
};
