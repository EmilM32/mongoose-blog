//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const test = "Jakiś testowy napisik";
const content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const app = express();
mongoose.connect("mongodb://localhost:27017/blogNew", {
  useNewUrlParser: true
});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res) {
  Post.find({}, function(err, posts) {
    res.render("home", {
      test: test,
      content: content,
      posts: posts
    });
  });
});
app.get("/about", function(req, res) {
  res.render("about", {
    aboutContent: content
  });
});

app.get("/contact", function(req, res) {
  res.render("contact", {
    contactContent: content
  });
});

app.get("/add", function(req, res) {
  res.render("add");
});

app.post("/add", function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save(function(err) {
    if (!err) {
      res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;

    Post.findOne({_id: requestedPostId}, function(err, post) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    });

  });


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
