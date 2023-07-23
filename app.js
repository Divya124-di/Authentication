//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { log } = require("console");
const encrypt = require("mongoose-encryption");


const app = express();

console.log(process.env.SECRET_KEY);
app.use(express.static("public"));

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose
  .connect("mongodb://127.0.0.1:27017/userDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

 const userSchema = new mongoose.Schema({
    email: String,
    password:String
 });


 userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });
 const User = mongoose.model("User", userSchema);


app.get("/", function(req, res){
    res.render("home");
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/register", function(req, res){
    const newUser = new User({
        email: req.body.username,
        password : req.body.password
    });

   newUser
     .save()
     .then(() => {
       res.render("secrets");
     })
     .catch((err) => {
       console.log(err);
     });


});

app.post("/login", function(req, res){
  const userName = req.body.username;
  const passWord = req.body.password;
  //check if the username and pasword are correct
  User.findOne({ email: userName }).then(function(found){
    if(found.password === passWord){
      res.render("secrets");
    }
    }).catch(function(err){
      console.log(err);
    });
  });


//TODO

app.listen(3000, function () {
  console.log("Server started on port 3000");
});