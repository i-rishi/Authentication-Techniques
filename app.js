require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
  const password = req.body.password;

  User.findOne({ email: username }, (err, foundOne) => {
    if (err) {
      console.log(err);
    } else {
      if (foundOne) {
        bcrypt.compare(password, foundOne.password, (err, result) => {
          if (result) {
            res.render("secrets");
          } else {
            console.log(err);
          }
        });
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
  const password = req.body.password;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    const data = new User({
      email: email,
      password: hash,
    });

    data.save((err) => {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });
});

// port for server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
