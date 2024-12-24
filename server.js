const express = require("express");
const app = express();
const connectDB = require("./config/database");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const flash = require("express-flash");
const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/posts");
const methodOverride = require("method-override");

// Use environment variables
require("dotenv").config();

// Initialize Passport config
require("./config/passport")(passport);

// Connect to database
connectDB();

// Use EJS for views
app.set("view engine", "ejs");

// Handle static assets
app.use(express.static("public"));

// Parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use forms for put / delete
app.use(methodOverride("_method"));

// Setup sessions - stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't save session until something stored
    store: MongoStore.create({ mongoUrl: process.env.DB_STR }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware to handle flash messages for errors, info, etc.
app.use(flash());

// Routes
app.use("/", mainRoutes);
app.use("/post", postRoutes);

// Run server
app.listen(process.env.PORT || 3000, () =>
  console.log(`Listening on PORT ${process.env.PORT}`)
);
