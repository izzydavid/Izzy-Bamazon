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





//Function of when the user sees the showBamazon function and the user's options to Purchase, Post, Delete their product that they posted only, Exit.//
function firstPrompt() {
  inquirer
    .prompt({
      name: "start",
      type: "rawlist",
      pageSize: 50,
      message: "Welcome to Izzy's Bamazon! Top selling items from each department! Pick how you would like to shop or post on Bamazon!",
      choices: ["View Product Sales by Department", "Exit"]
    }) 
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.start === "View Product Sales by Department") {
        viewDepartment(); 
      }
      else if (answer.start === "Create New Department") { 
        createDepartment(); 
      }
      else{
        console.log("Thank you for coming to Bamazon!. Goodbye. If you are using nodemon and this was a mistake please type 'rs' and enter to come back");
        connection.end();

      }

    }); 


    function viewDepartment() {
        connection.query(
          "SELECT department_id, departments.department_name, over_head_costs, SUM(product_sales) AS total_sales, (SUM(product_sales) - over_head_costs) AS profit FROM departments RIGHT JOIN products ON products.department_name = departments.department_name GROUP BY department_id, department_name",
          (err, results) => {
            console.error(err);
            console.table(results);
          }
        );
      }
}
//Function for the user being able to post an item on Izzy's Bamazon, which department, price, and how many products he would like to post.//
function createDepartment() {
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
        }
      );
      firstPrompt();
      viewInventory(); 
    });
}; 

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

function songAndAlbumSearch() {
    inquirer
      .prompt({
        name: "artist",
        type: "input",
        message: "What artist would you like to search for?"
      })
      .then(function(answer) {
        var query = "SELECT top_albums.year, top_albums.album, top_albums.position, top5000.song, top5000.artist ";
        query += "FROM top_albums INNER JOIN top5000 ON (top_albums.artist = top5000.artist AND top_albums.year ";
        query += "= top5000.year) WHERE (top_albums.artist = ? AND top5000.artist = ?) ORDER BY top_albums.year, top_albums.position";
  
        connection.query(query, [answer.artist, answer.artist], function(err, res) {
          console.log(res.length + " matches found!");
          for (var i = 0; i < res.length; i++) {
            console.log(
              i+1 + ".) " +
                "Year: " +
                res[i].year +
                " Album Position: " +
                res[i].position +
                " || Artist: " +
                res[i].artist +
                " || Song: " +
                res[i].song +
                " || Album: " +
                res[i].album
            );
          }
  
          firstPrompt();
        });
      });
  }
  