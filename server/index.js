import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import userRoutes from './routes/userRoutes.js'

/* CONFIGURATIONS */
dotenv.config();

const app = express();
app.use(express.json());
// Middleware to parse JSON data
app.use(bodyParser.json());  // Handles application/json
// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true })); // Handles application/x-www-form-urlencoded

// Configure CORS
const corsOptions = {
  origin: "http://localhost:5173", // Allow requests from this origin
  methods: "GET,POST,PUT,DELETE", // Allowed HTTP methods
  allowedHeaders: "Content-Type,Authorization", // Allowed headers
  credentials: true, // Allow credentials (cookies, auth headers, etc.)
};
app.use(cors(corsOptions));

/* ROUTES */
app.use("/user", userRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;

mongoose
  .connect(process.env.MONGO_URL) // Removed deprecated options
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on Port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Database connection error: ${error}`);
  });
