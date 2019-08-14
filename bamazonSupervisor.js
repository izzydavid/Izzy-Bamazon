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
connection.connect(function (err) {
  if (err) throw err;
  firstPrompt();
});

//Function to show the existing table/database of products listed on Bamazon, product data came from the top selling products from each department on Amazon. Shorten name of products.//
var showBamazon = function () {
  connection.query("SELECT * FROM products ORDER BY item_id", (err, results) => {
    if (err) throw err;
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
    .then(function (answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.start === "View Product Sales by Department") {
        viewDepartment();
      } else if (answer.start === "Create New Department") {
        createDepartment();
      } else {
        console.log("Thank you for coming to Bamazon!. Goodbye. If you are using nodemon and this was a mistake please type 'rs' and enter to come back");
        connection.end();
      }
    });
}

function viewDepartment() {
  var query = "select * from products p inner join departments d on p.department_name = d.department_name"
  connection.query(query, function (error, results) {
    if (error) throw error;
    results.forEach(row => {
      var totalProfit = row.product_sales - parseInt(row.over_head_costs)
      console.table(results)

    });
      connection.end()
  })
}

function createDepartment() {
  inquirer.prompt([{
      message: "Please type in the name of the department you would like to add.",
      type: "input",
      name: "deptName"
    },
    {
      message: "what is the overhead for this department?",
      type: "input",
      name: "overHeadCost"
    }
  ]).then(function (ans) {
    var query = "insert into departments (department_name, over_head_costs) values(?, ?)"
    connection.query(query, [ans.deptName, parseInt(ans.overHeadCost)], function (error, res) {
      if (error) throw error;
      console.log(res);
      connection.end()
    })
  })
}
