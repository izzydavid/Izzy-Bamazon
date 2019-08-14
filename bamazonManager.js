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

//Function that gives the user the firstPrompt options function when connecting to the server.//
connection.connect(function(err) {
  if (err) throw err;
  firstPrompt(); 
});


//Function of when the user sees the firstprompt function and the user's options are to View products for Sale, View Low Inventory, Add to Inventory, Add New Product, and Exit.//
function firstPrompt() {
  inquirer
    .prompt({
      name: "start",
      type: "rawlist",
      pageSize: 50,
      message: "Welcome to Izzy's Bamazon! Top selling items from each department! Pick how you would like to shop or post on Bamazon!",
      choices: ["View products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
    }) 
    .then(function(answer) {
      if (answer.start === "View products for Sale") {
        viewInventory(); 
      }
      else if (answer.start === "View Low Inventory") { 
        ViewLowInventory(); 
      }
      else if (answer.start === "Add to Inventory") { 
        addInventory(); 
      }
      else if (answer.start === "Add New Product") {
        addProduct();
      } 
      else{
        connection.end();
        console.log("Thank you for coming to Bamazon!. Goodbye. If you are using nodemon and this was a mistake please type 'rs' and enter to come back");
      }

    }); 

}

//Function that let's the user see the current inventory in Bamazon.//
function viewInventory(){
  connection.query('SELECT * FROM products ORDER BY item_item', function (err, results) {
    if (err) throw err;
    console.table(results);
    firstPrompt(); 
  }); 
}

//Function that allows a user to see Bamazon products that have a stock count of less than 5.//
function ViewLowInventory(){
  connection.query('SELECT * FROM products WHERE stock_quantity < 5', function (err, results) {
    if (err) throw err;
    console.table(results);
    firstPrompt(); 
  }); 
}

//Function that allows a user to add onto the stock_quantity for the products up for sale.//
function addInventory() {
  connection.query("SELECT * FROM products", function(err, results) {

    inquirer
      .prompt([
        {
          name: "choice", 
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < results.length; i++) {
              choiceArray.push(results[i].product_name);
            }
            return choiceArray ;
          },
          message: "What product do you need to restock?",
          pageSize: 50
        },
        {
          name: "stock",
          type: "input",
          message: "How many would you like to purchase?",
          pageSize: 50,
          validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            return false;
          }
          
        },
      ])
      .then(function(answer) {
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].product_name === answer.choice) {
            chosenItem = results[i]; 
          }
        }

        if ((chosenItem !== chosenItem)) {
          console.log("Sorry this product does not exist in Bamazon, if you want to add ") + (chosenItem) + ( " to the Bamazon store, press 4...");
          viewInventory();   
        }
          else  { 
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [{
                stock_quantity: chosenItem.stock_quantity + parseInt(answer.stock)
              },
              {
                item_id: chosenItem.item_id
              },

            ])
          console.log("Your order of " + (chosenItem.product_name) + " was placed successfully!");
          console.log("Your total cost is: $" + (chosenItem.price * answer.stock) + ".Have a Great Bamazon Day!");
          viewInventory();      
        }
      {
      }
      });

  });
}

//Function for the user being able to post an item on Izzy's Bamazon, which department, price, and how many products he would like to post.//
function addProduct() {
  inquirer
    .prompt([
      {
        name: "product",
        type: "input",
        message: "What is the item you would like to submit?",
        pageSize: 50
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
        validate: function(value) {
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
       validate: function(value) {
        if (isNaN(value) === false) {
          return true;
        }
        return false;
      }
      }
    ])
    .then(function(answer) {
      var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].product_name === answer.choice) {
            chosenItem = results[i];
          }
        }
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answer.product,
          department_name: answer.department,
          price: answer.price || 0,
          stock_quantity: answer.quantity, 
        },
        function(err) {
          if (err) throw err;
          console.log("Your total cost is: $" + (answer.price * answer.quantity) + " .Have a Great Bamazon Day!");
          console.log("Your order of " + (chosenItem.product_name) + " was placed successfully!");


        }

      );
      viewInventory();      

    }
    );
}; 
