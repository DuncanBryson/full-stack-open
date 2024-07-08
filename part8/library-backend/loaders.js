const Book = require("./models/book");
const bookLoader = async (authorIds) => {
  console.log("data loading");
  const books = await Book.find({});

  const bookCounts = books.reduce((bookCounts, book) => {
    const id = String(book.author);
    bookCounts[id] = (bookCounts[id] || 0) + 1;
    return bookCounts;
  }, {});

  return authorIds.map((id) => bookCounts[String(id)] || 0);
};

module.exports = { bookLoader };
