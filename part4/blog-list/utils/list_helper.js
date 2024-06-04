const blog = require("../models/blog");
const _ = require("lodash");
const dummy = (blogs) => 1;

const totalLikes = (blogs) => blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favoriteBlog = (blogs) => {
  const sortedBlogs = blogs.slice();
  sortedBlogs.sort((a, b) => b.likes - a.likes);
  return sortedBlogs[0];
};

const mostBlogs = (blogs) => {
  const authors = _.countBy(blogs, "author");
  const mostBlogs = _.maxBy(_.toPairs(authors, ([, count]) => count));
  return { author: mostBlogs[0], blogs: mostBlogs[1] };
};

const mostLikes = (blogs) => {
  const sortedAuthors = _.chain(blogs)
    // extract author and likes for each blog
    .map((blog) => ({
      author: blog.author,
      likes: blog.likes,
    }))
    //reduces to authors + total likes
    .transform((result, blog) => {
      result[blog.author] = (result[blog.author] || 0) + blog.likes;
    }, [])
    // sorts, then returns array of objects with {author, likes}
    .toPairs()
    .sortBy(([, likes]) => -likes)
    .map(([author, likes]) => ({
      author,
      likes,
    }))
    .value();
  return sortedAuthors[0];
};
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
