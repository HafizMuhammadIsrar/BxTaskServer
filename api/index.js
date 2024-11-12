const serverless = require("serverless-http");
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

let isConnected;

const connectToDatabase = async () => {
  if (isConnected) return; // Return if already connected

  try {
    await mongoose.connect(CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = mongoose.connection.readyState; // Set connection state
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
  }
};

// Middleware to ensure DB connection for each request
app.use(async (req, res, next) => {
  await connectToDatabase();
  next();
});

app.use("/api/books", route);

module.exports.handler = serverless(app);
