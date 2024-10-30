const express = require("express");
const app = express();
const connectDB = require("./config/database");
const mainRoutes = require("./routes/main");

// Use environment variables
require("dotenv").config();

// Connect to database
connectDB();

// Use EJS for views
app.set("view engine", "ejs");

// Handle static assets
app.use(express.static("public"));

// Parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/", mainRoutes);

// Run server
app.listen(process.env.PORT, () =>
  console.log(`Listening on PORT ${process.env.PORT}`)
);
