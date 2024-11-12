const serverless = require("serverless-http");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const route = require("./routes/booksRoute.js");

const app = express();

// Environment variables should be used in production
const CONNECTION_URL = `mongodb+srv://misrark414:Vwe4mtiZGLSkJYc2@cluster0.ocf8e.mongodb.net/`;
const CONNECTION_TIMEOUT = 10000; // 10 seconds timeout

// Configure middleware
app.use(bodyParser.json({ limit: "10mb", extended: true })); // Reduced limit
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());

// Singleton connection management
let cachedDb = null;

const connectToDatabase = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log("Using cached database connection");
    return cachedDb;
  }

  try {
    const db = await mongoose.connect(CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: CONNECTION_TIMEOUT,
      connectTimeoutMS: CONNECTION_TIMEOUT,
      socketTimeoutMS: CONNECTION_TIMEOUT,
      // Add connection pool settings
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
    });

    cachedDb = db;
    console.log("New database connection established");
    return db;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

// Middleware to ensure DB connection with timeout handling
app.use(async (req, res, next) => {
  try {
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Database connection timeout"));
      }, CONNECTION_TIMEOUT);
    });

    await Promise.race([connectToDatabase(), timeoutPromise]);

    next();
  } catch (error) {
    console.error("Middleware error:", error);
    res.status(503).json({
      error: "Database connection failed",
      message: "Service temporarily unavailable",
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);
  res.status(500).json({
    error: "Internal server error",
    message: error.message,
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

app.use("/api/books", route);

// Cleanup function for database connection
const cleanup = async () => {
  if (cachedDb) {
    await mongoose.connection.close();
    cachedDb = null;
    console.log("Database connection closed");
  }
};

// Handle serverless function cleanup
process.on("SIGTERM", cleanup);
process.on("SIGINT", cleanup);

// Export handler with configuration
module.exports.handler = serverless(app, {
  callbackWaitsForEmptyEventLoop: false,
});
