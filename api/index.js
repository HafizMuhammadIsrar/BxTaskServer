const serverless = require("serverless-http");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const route = require("./routes/booksRoute"); // Adjusted path

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

const CONNECTION_URL = `mongodb+srv://misrark414:Vwe4mtiZGLSkJYc2@cluster0.ocf8e.mongodb.net/`;

mongoose
  .connect(CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected successfully"))
  .catch((error) =>
    console.error("Error connecting to the database:", error.message)
  );

app.use("/api/books", route);

module.exports.handler = serverless(app);
