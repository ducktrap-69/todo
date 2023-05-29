const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const date = require(__dirname + "/date.js");

const req = require("express/lib/request");
const { json } = require("body-parser");

const app = express();

// ejs module
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

const tasks = ["buy cloth", "sell cloth", "get money"];
const workItems = ["go to work", "do work", "return from work"];

app.get("/", function (req, res) {
  const day = date.getdate();
  res.render("index", { listTitle: day, NewListItems: tasks });
});

app.post("/", function (req, res) {
  const task = req.body.newTask;
  if (req.body.list === "work") {
    workItems.push(task);
    res.redirect("/work");
  } else {
    tasks.push(task);
    res.redirect("/");
  }
});
app.get("/work", function (req, res) {
  res.render("index", { listTitle: "work list", NewListItems: workItems });
});
app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("server active comander");
});
