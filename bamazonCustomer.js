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

var searchPrompt = function() {
    inquirer.prompt([
        {
            type: "name",
            message: "What would you like to buy?: ",
            name: "product"
        },
        {
            type: "name",
            message: "Quantity: ",
            name: "quantity"
        }
    ]).then(function(user){
        customerPurchase(user.product, user.quantity);
    });
};

var customerPurchase = function(item, quantity) {
    connection.query('SELECT * FROM products WHERE product_name=?', [item], function(err, res) {
        if (err) throw err;
        if (res === undefined) {
            console.log("Sorry, I couldn't understand that product/quantity. Please try again.");
            customerSearch();
        }
        if (res[0].stock_quantity < quantity){
            console.log("Sorry, this product is currently unavailable in the specified quantity.");
            inquirer.prompt([
                {
                    type: "name",
                    message: "Would you like to purchase another item or try a different quantity?(y/n)",
                    name: "confirmation"
                }
            ]).then(function(confirmation) {
                if (confirmation.confirmation === "y") {
                    customerSearch();
                } else {
                    console.log ("Ok, see you next time!");
                    process.exit();
                }
            });
        }
        else {
            connection.query('UPDATE products SET stock_quantity = ? WHERE product_name =?', [(res[0].stock_quantity - quantity), item]);
            console.log("Congrats! You've just purchased " + quantity + " " + item);
            inquirer.prompt([
                {
                    type: "name",
                    message: "Would you like to make another purhcase?(y/n)",
                    name: "confirmation"
                }
            ]).then(function(confirmation) {
                if (confirmation.confirmation === "y") {
                    customerSearch();
                } else {
                    console.log("Ok, see you next time!");
                    process.exit();
                }
            });
        }
    });
};

var customerSearch = function(){
    connection.query('SELECT * FROM products', function(err,res) {
        if (err) throw err;
        var table = new Table({
            head: ['Product ID', 'Name', 'Department', 'Price'],
            colWidths: [15, 30, 30, 15]
        });

        for (var i=0; i<res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].department_name, res[i].price]
            );
        }
        console.log(table.toString());
        searchPrompt();
    });
};

customerSearch();
