const express = require("express");
const createBook = require("../../controller/booksController.js").createBook;
const getBook = require("../../controller/booksController.js").getBook;
const deleteBook = require("../../controller/booksController.js").deleteBook;
const updateBook = require("../../controller/booksController.js").updateBook;
const getBookById = require("../../controller/booksController.js").getBookById;

const router = express.Router();

router.get("/fetch", getBook);
router.post("/post", createBook);
router.delete("/delete/:id", deleteBook);
router.put("/update/:id", updateBook);
router.get("/fetch/:id", getBookById);
module.exports = router;
