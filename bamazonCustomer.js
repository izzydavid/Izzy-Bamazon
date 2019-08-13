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
  var showBamazon =  function(){

  connection.query("SELECT * FROM products ORDER BY item_id", (err, res) => {
    if(err) throw err;
    console.table(res);
    firstPrompt()
 })
}


//Function to invoke the showBamazon function//
  connection.connect(function(err) {
  if (err) throw err;
  showBamazon()
});

//Function of when the user sees the showBamazon function and the user's options to Purchase, Post, Delete their product that they posted only, Exit.//
function firstPrompt() {
  inquirer
    .prompt({
      name: "start",
      type: "rawlist",
      pageSize: 50,
      message: "Welcome to Izzy's Bamazon! Top selling items from each department! Pick how you would like to shop or post on Bamazon!",
      choices: ["Purchase", "Post", "Delete", "Exit"]
    }) 
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.start === "Purchase") {
        productSearch();
      }
      else if (answer.start === "Post") {
        postItem();
      } 
      else if (answer.start === "Delete") { 
        deleteItem()
      }
      else{
        connection.end();
        console.log("Thank you for coming to Bamazon!. Goodbye. If you are using nodemon and this was a mistake please type 'rs' and enter to come back");
      }
    }); 
}

//Function for the product search/purchase, providing options on what product_name, department, budget, and quanity//
function productSearch() {
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
          message: "What product would you like to purchase?",
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
        showBamazon(); 

        if (parseInt (answer.stock) <= chosenItem.stock_quantity) {
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [{
                stock_quantity: chosenItem.stock_quantity - answer.stock
              }, {
                item_id: chosenItem.item_id
              }
              
            ])
          console.log("Your order was placed successfully!");
          console.log("Your total cost is: $" + (chosenItem.price * answer.stock) + ".  Have a Great Bamazon Day!");

        }
        else {
          console.log("Sorry there aren't enough in stock to fullfill this order...");
          
        }

      });
  });
}

//Function for the user being able to post an item on Izzy's Bamazon, which department, price, and how many products he would like to post.//
function postItem() {
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




// .then(function(answer) {
//   switch (answer.start) {
//   case "What product would you like to purchase today?":
//     productSearch();
//     break;

//   case "What product would you like to post today?":
//     postSearch(); 
//     break; 

//   case "What Department would you like to purchase from?":
//     departmentSearch();
//     break;

//   case "What is your budget?":
//     priceSearch();
//     break;

//   case "How many do you need?":
//     quantitySearch();
//     break;

//   case "exit":
//     connection.end();
//     break;
//   }
// });

// function departmentSearch() {
//   inquirer
//   .prompt({
//     name: "department",
//     type: "rawlist",
//     message: "What department would you like to shop?"
//   })
//   .then(function(answer) {
//   var query = "SELECT department_name FROM products GROUP BY department_name ORDER BY department_name";
//   connection.query(query,{ Department: answer.department }, function(err, res) {
//     for (var i = 0; i < res.length; i++) {
//       console.log("Department: " + res[i].department);
//       showBamazon(department_name)
//     }
//   });
// });
// }
// function priceSearch() {
//   inquirer
//     .prompt([
//       {
//         name: "start",
//         type: "input",
//         message: "Enter starting position: ",
//         validate: function(value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         }
//       },
//       {
//         name: "end",
//         type: "input",
//         message: "Enter ending position: ",
//         validate: function(value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         }
//       }
//     ])
//     .then(function(answer) {
//       var query = "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
//       connection.query(query, [answer.start, answer.end], function(err, res) {
//         for (var i = 0; i < res.length; i++) {
//           console.log(
//             "Position: " +
//               res[i].position +
//               " || Song: " +
//               res[i].song +
//               " || Artist: " +
//               res[i].artist +
//               " || Year: " +
//               res[i].year
//           );
//         }
//         runSearch();
//       });
//     });
// }

// function quantitySearch() {
//   inquirer
//     .prompt({
//       name: "song",
//       type: "input",
//       message: "What song would you like to look for?"
//     })
//     .then(function(answer) {
//       console.log(answer.song);
//       connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function(err, res) {
//         console.log(
//           "Position: " +
//             res[0].position +
//             " || Song: " +
//             res[0].song +
//             " || Artist: " +
//             res[0].artist +
//             " || Year: " +
//             res[0].year
//         );
//         runSearch();
//       });
//     });
// }

// //    
