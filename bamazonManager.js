var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

var viewProductList = function() {

    connection.query('SELECT * FROM products', function(err,res) {
        if (err) throw err;
        var table = new Table({
            head: ['Product ID', 'Name', 'Department', 'Price', 'Stock Quantity'],
            colWidths: [15, 30, 30, 15, 20]
        });

        for (var i=0; i<res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            );
        }
        console.log(table.toString());
        searchPrompt();
    });

};

var viewLowInventory = function() {

    connection.query('SELECT * FROM products WHERE stock_quantity<=?', [250], function(err,res) {

        if (err) throw err;
        var table = new Table({
            head: ['Product ID', 'Name', 'Department', 'Price', 'Stock Quantity'],
            colWidths: [15, 30, 30, 15, 20]
        });

        for (var i=0; i<res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]
            );
        }

        console.log(table.toString());
        searchPrompt();

    });

};

var addToInventory = function() {

    inquirer.prompt([

        {
            type: "name",
            message: "What product would you like to restock?: ",
            name: "product"
        },
        {
            type: "name",
            message: "Amount to add: ",
            name: "amount"
        }
    ]).then(function(user) {

        var amount = parseInt(user.amount);

        connection.query('SELECT * FROM products WHERE product_name=?',[user.product], function(err,res) {

            if (err) throw err;
            connection.query('UPDATE products SET stock_quantity = ? WHERE product_name =?', [(res[0].stock_quantity + amount), user.product]);

            console.log(user.amount + " " + user.product + " have been added!");
            searchPrompt();

        });

    });

};

var addNewProduct = function() {

    inquirer.prompt([

        {
            type: "name",
            message: "Product ID: ",
            name: "id"
        },
        {
            type: "name",
            message: "Product description: ",
            name: "product_name"
        },
        {
            type: "name",
            message: "Department: ",
            name: "department"
        },
        {
            type: "name",
            message: "Price: ",
            name: "price"
        },
        {
            type: "name",
            message: "Stock Quantity",
            name: "stock_quantity"
        }

    ]).then(function(user){

        var product_id = parseInt(user.id);
        var price = parseInt(user.price);
        var quantity = parseInt(user.stock_quantity);

        connection.query('INSERT INTO products (item_id, product_name, department_name, price, stock_quantity) VALUES (?,?,?,?,?)', [product_id, user.product_name, user.department, price, quantity]);

            console.log(user.product_name + " have been added to the store database!");

            searchPrompt();

    });

};

var searchPrompt = function() {

    inquirer.prompt([
        {
            type: "list",
            name: "choice",
            message: "Choose an option: ",
            choices: ["View Product List", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        }
    ]).then(function(user){
        console.log(user.choice);
        if (user.choice === "View Product List") {
            viewProductList();
        }
        else if (user.choice === "View Low Inventory") {
            viewLowInventory();
        }
        else if (user.choice === "Add to Inventory") {
            addToInventory();
        }
        else if (user.choice === "Add New Product") {
            addNewProduct();
        }
        else if (user.choice === "Exit") {
            process.exit();
        }
    });

};

searchPrompt();
