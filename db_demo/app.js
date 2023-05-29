const mongoose = require("mongoose");
mongoose.connect("mongodb://0.0.0.0:27017/fruitsDB");

const fruitSchema = mongoose.Schema({
  name: String,
  rating: Number,
  review: String,
});

const Fruit = mongoose.model("Fruit", fruitSchema);

const fruit = new Fruit({
  name: "apple",
  rating: 8,
  review: "preety good keeps doctar away",
});

const personSchema = mongoose.Schema({
  name: String,
  age: Number,
});

const Person = mongoose.model("person", personSchema);

const person = new Person({
  name: "Ram Kumar",
  age: 18,
});

Fruit.find()
  .then(function (fruits) {
    fruits.forEach(function (fruit) {
      console.log(fruit.name);
      mongoose.connection.close();
    });
  })
  .catch(function (err) {
    console.log(err);
  });

//fruit.save();


// Item.insertMany(defaultItems)
//   .then(() => {
//     console.log("Items inserted successfully.");
//   })
//   .catch((err) => {
//     console.log("Error occurred while inserting items:", err);
//   });
