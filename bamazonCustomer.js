var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "127.0.0.1",
  // Your port; if not 3306
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "password",
  //Your database
  database: "bamazon_db"
});

//Function to show the existing table/database of products listed on Bamazon, product data came from the top selling products from each department on Amazon. Shorten name of products.//
function viewInventory() {
  connection.query('SELECT * FROM products ORDER BY item_id', function (err, results) {
    if (err) throw err;
    console.table(results);
    firstPrompt();
  });
}

//Function to invoke the viewInventory function//
connection.connect(function (err) {
  if (err) throw err;
  viewInventory()
});

//Function of when the user sees the viewInventory function and the user's options to Purchase, Post, Delete their product that they posted only, Exit.//
function firstPrompt() {
  inquirer
    .prompt({
      name: "start",
      type: "rawlist",
      pageSize: 50,
      message: "Welcome to Izzy's Bamazon! Top selling items from each department! Pick how you would like to shop or post on Bamazon!",
      choices: ["Purchase", "Post", "View Inventory", "Exit"] 
    })
    .then(function (answer) {
      if (answer.start === "Purchase") {
        productPurchase();
      } else if (answer.start === "Post") {
        postItem();
      } else if (answer.start === "View Inventory") { 
        viewInventory(); 
      } else {
      (answer.start === "Exit") 
      console.log("Thank you for coming to Bamazon!. Goodbye. If you are using nodemon and this was a mistake please type 'rs' and enter to come back");
      connection.end();
      }
    });
}


//Function for the product search/purchase, providing options on what product_name, department, budget, and quanity//
function productPurchase() {
  connection.query("SELECT * FROM products", function (err, results) {
    inquirer
      .prompt([{
          name: "choice",
          type: "rawlist",
          choices: function () {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].product_name);
            }
            return choiceArray;
          },
          message: "What product would you like to purchase?",
          pageSize: 50
        },
        {
          name: "stock",
          type: "input",
          message: "How many would you like to purchase?",
          pageSize: 50,
          validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
      ])
      .then(function (answer) {
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].product_name === answer.choice) {
            chosenItem = results[i];
          }
        }

        if (parseInt(answer.stock) <= chosenItem.stock_quantity) {
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [{
                stock_quantity: chosenItem.stock_quantity - parseInt(answer.stock)
              },
              {
                item_id: chosenItem.item_id
              },
            ]
          )
          console.log("Your order of " + (answer.stock), (chosenItem.product_name) + " was placed successfully!");
          console.log("Your total cost is: $" + (chosenItem.price * answer.stock) + ". Have a Great Bamazon Day!");
          viewInventory();
        } else {
          console.log("Sorry there aren't enough", (chosenItem.product_name) + " in stock to fullfill this order...");
          viewInventory();

        }
      });
  });
}

//Function for the user being able to post an item on Izzy's Bamazon, which department, price, and how many products he would like to post.//
function postItem() {
  connection.query("SELECT * FROM products", function (results) {

    inquirer
      .prompt([{
          name: "name",
          type: "input",
          message: "What is the item you would like to submit?",
          pageSize: 50,
        },
        {
          name: "department",
          type: "input",
          message: "What department would you like to place your product in?",
          pageSize: 50
        },
        {
          name: "price",
          type: "input",
          message: "What is the price of your product?",
          pageSize: 50,
          validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        },
        {
          name: "quantity",
          type: "input",
          message: "How many products would you like to post on Bamazon?",
          pageSize: 50,
          validate: function (value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
        }
      ])
      .then(function (answer) {
        connection.query("SELECT * FROM products", function (err, results) {
          if (err) throw (err);
          //This is the portion defines how a user cannot post the same product onto Bamazon more than once.//
          let chosenItem;
          for (let i = 0; i < results.length; i++) {
              chosenItem = results[i].product_name;
          }
          if (answer.name !== chosenItem) {
            if (err) throw (err);
            connection.query("INSERT INTO products SET ?", {
              product_name: answer.name,
              department_name: answer.department,
              price: answer.price || 0,
              stock_quantity: answer.quantity,
            });
            console.table(answer);
            console.log("You successfully posted your " + (answer.quantity), (answer.name) + " products onto Izzy's Bamazon!");
            console.log("Your total cost is: $" + (answer.price * answer.quantity) + ". Have a Great Bamazon Day!");
            viewInventory();
          } else {
            if (err) throw (err);
            console.log("Sorry the " + (answer.name), "has already been posted on Izzy's Bamazon!");
            console.table(answer);
            viewInventory();
          };
        });
      });
  });
};