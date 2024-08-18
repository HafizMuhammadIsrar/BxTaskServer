const mongoose = require("mongoose");

const booksSchema = mongoose.Schema({
  title: String,
  author: String,
  no_of_pages: Number,
  published_at: Date,
});

const PostBook = mongoose.model("PostBook", booksSchema);

module.exports = PostBook;
