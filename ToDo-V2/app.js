const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
// const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const req = require("express/lib/request");
const { json } = require("body-parser");
const { name } = require("ejs");

const app = express();

// ejs module
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// adding mongodb to project
mongoose.connect(
  "mongodb+srv://duck_trap_69:duck69trap@cluster0.dwlz9ap.mongodb.net/todolistdb"
);
const itemsSchema = {
  name: String,
};
const Item = mongoose.model("Item", itemsSchema);
const item1 = new Item({
  name: "Welcome to your todolist!",
});
const item2 = new Item({
  name: "Hit the + button to add a new item.",
});
const item3 = new Item({
  name: "<-- hit this to delte an item",
});
const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema],
};
const List = mongoose.model("List", listSchema);
// const tasks = ["buy cloth", "sell cloth", "get money"];
// const workItems = ["go to work", "do work", "return from work"];

app.get("/", function (req, res) {
  // const day = date.getdate();
  // to find data from database
  Item.find()
    .then((items) => {
      if (items.length === 0) {
        // to add data to database
        Item.insertMany(defaultItems)
          .then(() => {
            console.log("Items inserted successfully.");
          })
          .catch((err) => {
            console.log("Error occurred while inserting items:", err);
          });
        res.redirect("/");
      } else {
        // console.log(items);
        res.render("index", { listTitle: "Today", NewListItems: items });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName })
    .then((foundList) => {
      if (!foundList) {
        // create new list
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        // render old list
        res.render("index", {
          listTitle: foundList.name,
          NewListItems: foundList.items,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/", function (req, res) {
  const itemName = req.body.newTask;
  const listName = req.body.list;
  const item = new Item({
    name: itemName,
  });
  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }).then((foundList) => {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
  // if (req.body.list === "work") {
  //   workItems.push(task);
  //   res.redirect("/work");
  // } else {
  //   tasks.push(task);

  // }
});

app.post("/delete", function (req, res) {
  const checkedItemID = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemID)
      .then(() => {
        console.log("Deleted checked item");
      })
      .catch((err) => {
        console.log(err);
      });

    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemID } } }
    )
      .then((foundList) => {
        if (foundList) {
          res.redirect("/" + listName);
        } else {
          console.log("List not found");
        }
      })
      .catch((err) => {
        console.log(err);
        // Handle the error accordingly
      });
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
