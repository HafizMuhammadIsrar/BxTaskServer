const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const route = require("./routes/booksRoute.js");

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const CONNECTION_URL = `mongodb+srv://misrark414:Vwe4mtiZGLSkJYc2@cluster0.ocf8e.mongodb.net/`;

const PORT = process.env.PORT || 5000;

mongoose
  .connect(CONNECTION_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port : ${PORT}`));
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error.message);
  });

app.use("/api/books", route); // Ensure the correct route path
