const PostBook = require("../booksModel/booksModel.js");

const getBook = async (req, res) => {
  try {
    const getBooks = await PostBook.find();
    console.log(getBooks);
    console.log("hello world");
    res.status(200).json(getBooks);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await PostBook.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBook = async (req, res) => {
  console.log("hello world");
  const book = req.body;
  const newBook = new PostBook(book);

  try {
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const deleteBook = async (req, res) => {
  console.log("Request parameters:", req.params);
  const { id } = req.params;
  console.log("Extracted ID:", id);
  try {
    if (!id) {
      return res.status(400).json({ message: "ID parameter is missing." });
    }
    await PostBook.findByIdAndDelete(id);
    res.status(200).json({ message: "Book deleted successfully." });
    console.log("Book deleted successfully.");
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

const updateBook = async (req, res) => {
  console.log("Request parameters:", req.params);
  const { id } = req.params;
  console.log("Extracted ID:", id);
  const { title, author, no_of_pages, published_at } = req.body;

  try {
    if (!title && !author && !no_of_pages && !published_at) {
      return res
        .status(400)
        .json({ message: "No fields provided for update." });
    }

    const updatedBook = await PostBook.findByIdAndUpdate(
      id,
      { title, author, no_of_pages, published_at },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found." });
    }

    res
      .status(200)
      .json({ message: "Book updated successfully.", updatedBook });
    console.log("Book updated successfully.");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBook, deleteBook, createBook, updateBook, getBookById };
