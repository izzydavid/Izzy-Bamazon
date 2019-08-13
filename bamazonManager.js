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

//Function to show the existing table/database of products listed on Bamazon, product data came from the top selling products from each department on Amazon. Shorten name of products.//
  var showBamazon =  function(){
    connection.query("SELECT * FROM products ORDER BY item_id", (err, results) => {
    if(err) throw err;
    console.table(results);
  }); 
}

//Function that let's the user see the current inventory in Bamazon.//
function viewInventory(){
  connection.query('SELECT * FROM products', function (err, results) {
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


//Function of when the user sees the showBamazon function and the user's options to Purchase, Post, Delete their product that they posted only, Exit.//
function firstPrompt() {
  inquirer
    .prompt({
      name: "start",
      type: "rawlist",
      pageSize: 50,
      message: "Welcome to Izzy's Bamazon! Top selling items from each department! Pick how you would like to shop or post on Bamazon!",
      choices: ["View products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Delete", "Exit"]
    }) 
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
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
      else if (answer.start === "Delete") { 
        deleteItem(); 
      }
      else{
        connection.end();
        console.log("Thank you for coming to Bamazon!. Goodbye. If you are using nodemon and this was a mistake please type 'rs' and enter to come back");
      }

    }); 

}


//Function for the product search/purchase, providing options on what product_name, department, budget, and quanity//
// function productSearch() {
//   connection.query("SELECT * FROM products", function(err, results) {
//     inquirer
//       .prompt([
//         {
//           name: "choice", 
//           type: "rawlist",
//           choices: function() {
//             var choiceArray = [];
//             for (var i = 0; i < results.length; i++) {
//               choiceArray.push(results[i].product_name);
//             }
//             return choiceArray ;
//           },
//           message: "What product would you like to purchase?",
//           pageSize: 50
//         },
//         {
//           name: "stock",
//           type: "input",
//           message: "How many would you like to purchase?",
//           pageSize: 50,
//           validate: function(value) {
//             if (isNaN(value) === false) {
//               return true;
//             }
//             return false;
//           }
//         },
//       ])
//       .then(function(answer) {
//         var chosenItem;
//         for (var i = 0; i < results.length; i++) {
//           if (results[i].product_name === answer.choice) {
//             chosenItem = results[i];
//           }
//         }
//         showBamazon(); 

//         if (parseInt (answer.stock) <= chosenItem.stock_quantity) {
//           connection.query(
//             "UPDATE products SET ? WHERE ?",
//             [{
//                 stock_quantity: chosenItem.stock_quantity - answer.stock
//               }, {
//                 item_id: chosenItem.item_id
//               }
              
//             ])
//           console.log("Your order was placed successfully!");
//           console.log("Your total cost is: $" + (chosenItem.price * answer.stock) + ".  Have a Great Bamazon Day!");

//         }
//         else {
//           console.log("Sorry there aren't enough in stock to fullfill this order...");
          
//         }

//       });
//   });
// }

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
          console.log("Your product was successfully posted on Bamazon!");
      showBamazon(); 

        }
      );
      firstPrompt();

    });
}; 
function addInventory() {
  inquirer
    .prompt([
      {
        name: "product",
        type: "input",
        message: "What is the product you would like to add?",
        pageSize: 50
      },
      {
        name: "department",
        type: "input",
        message: "What department would you like to add your product in?",
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
       message: "How many of this product would you like to add on Bamazon?",
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
      connection.query(
        "UPDATE products SET ? WHERE ?",
        {
          product_name: answer.product,
          department_name: answer.department,
          price: answer.price || 0,
          stock_quantity: answer.quantity, 
        },
        function(err) {
          if (err) throw err;
          console.log("Your product was successfully posted on Bamazon!");
      showBamazon(); 

        }
      );
      firstPrompt();

    });
}; 

function deleteItem () { 
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
          message: "What product would you like to remove from stock?",
          pageSize: 50
        },
        {
          name: "stock",
          type: "input",
          message: "How many products would you like to remove?",
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
        if (parseInt (answer.stock) === chosenItem.stock_quantity) {
          connection.query(
            "DELETE FROM products WHERE stock = 'chosenItem.stock_quantity'"); 
           
              
            
          console.log("Your successfully deleted ") + (chosenItem.product_name) + ("If you want to add the product back, please post the product");
          console.log("Your deleted " + (chosenItem.product_name) + ". From the Bamazon stock. Have a Great Bamazon Day!");
          showBamazon();
          firstPrompt(); 
        }
        else {
          console.log("Sorry you need to delete more in stock to remove the product...");
          showBamazon();
          firstPrompt(); 

        }
      });
  
  });
}
