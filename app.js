require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// setting up database using mongoose
mongoose.set("strictQuery", true);
mongoose.connect(
  "mongodb://127.0.0.1:27017/userDB",
  { useNewUrlParser: true },
  () => {
    console.log("Database connected successfully");
  }
);

// creating schemas
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);
// get request for home route
app.get("/", (req, res) => {
  res.render("Home");
});

//request for login page
app.get("/login", (req, res) => {
  res.render("Login");
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = md5(req.body.password);

  User.findOne({ email: username }, (err, foundOne) => {
    if (err) {
      console.log(err);
    } else {
      if (foundOne) {
        if (foundOne.password === password) {
          res.render("secrets");
        } else {
          res.send("Wrong username and password entered.");
        }
      }
    }
  });
});

//requests for register page
app.get("/register", (req, res) => {
  res.render("Register");
});

app.post("/register", (req, res) => {
  const email = req.body.username;
  const password = md5(req.body.password);
  const data = new User({
    email: email,
    password: password,
  });

  data.save((err) => {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
  });
});

// port for server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
