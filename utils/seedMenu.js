const Menu = require("../models/Menu");


const menuItems = [
  {
    name: "Tiramisu",
    price: 1200,
    options: ["Classic", "Strawberry"],
  },
  {
    name: "Cheesecake",
    price: 1100,
    options: ["New York Style", "Blueberry", "Cherry"],
  },
  {
    name: "Lava Cake",
    price: 1300,
    options: ["Chocolate", "Caramel"],
  },
  {
    name: "Gelato",
    price: 900,
    options: ["Vanilla Bean", "Pistachio", "Chocolate"],
  },
  {
    name: "Apple Pie",
    price: 1000,
    options: ["with Ice Cream", "with Cream"],
  },
  {
    name: "Espresso",
    price: 600,
    options: ["Single", "Double"],
  },
  {
    name: "Latte",
    price: 800,
    options: ["Hot", "Iced"],
  },
  {
    name: "Cappuccino",
    price: 800,
    options: ["Wet", "Dry"],
  },
  {
    name: "Americano",
    price: 700,
    options: ["Hot", "Iced"],
  },
];

async function seed() {
  const count = await Menu.countDocuments();
  if (count === 0) {
    await Menu.insertMany(menuItems);
    console.log("Menu created!");
  } else console.log("Menu already exists");
}

module.exports = seed;
