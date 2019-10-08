require('dotenv').config();
const keys = require('./keys.js');
const inquirer = require('inquirer');
const mysql = require('mysql');

// Database Setup ============================================

var db = mysql.createConnection({
  host: keys.host,
  user: keys.user,
  password: keys.password,
  database: keys.database
});

db.connect(function(err) {
  if (err) {
    console.log(err);
  }
});

db.query("SELECT * FROM products;", function(err, results) {
  if (err) {
    console.log(err);
  } else {
    var totalPrice;
    console.table(results);
    userPrompts(results);
  }
});



function evaluateStockingQuantities(yourDatabaseStockLevel, AmountWantedToPurchase, itemAttemptingToPurchaseID, totalPriceOfPurchase) {
  var itemsSold;
  if (AmountWantedToPurchase > yourDatabaseStockLevel) {
    console.log('Insufficient Quantity!');
    itemsSold = false;
  } else {
    db.query(`UPDATE products SET stock_quantity=${yourDatabaseStockLevel-AmountWantedToPurchase} WHERE item_id=${itemAttemptingToPurchaseID}`);
    // Updating the product_cost column here.
    db.query(`UPDATE products SET product_sales=${totalPriceOfPurchase} WHERE item_id=${itemAttemptingToPurchaseID}`);
    itemsSold = true;
  } 
  if (itemsSold === true) {
    console.log(`Thanks For Shopping With Us! Your Total Is: $${totalPriceOfPurchase}`);
  } else {
    console.log('Sorry For The Inconvenience, Please Check Back In A Couple Of Days!');
  }
};

function userPrompts(resultsFromTheDBQuery) {
  inquirer.prompt(
    [
      {
        type: 'text',
        message: 'What is the item_id of the item you would like to purchase?',
        name: 'idSelected'
      },
      {
        type: 'text',
        message: 'How many would you like to purchase?',
        name: 'quantityWantingToPurchase'
      }
    ]
  ).then(function(userInput) {
    // if (userInput.idSelected > resultsFromTheDBQuery.length) {
      if (1 === 2) {
      console.log('Please Enter A Valid item_id!');
      userPrompts(resultsFromTheDBQuery);
    } else {
    // console.log(userInput);
    var id = parseInt(userInput.idSelected);
    var itemQty = parseInt(userInput.quantityWantingToPurchase)
    // Used to have a minus 1 for the id here. and total price.
    var dbStockLevel = resultsFromTheDBQuery[id - 1].stock_quantity;
    totalPrice = resultsFromTheDBQuery[id - 1].price * itemQty;
    // console.log(`ID: ${id}`);
    // console.log(`itemQty: ${itemQty}`);
    // console.log(`dbStockLevel: ${dbStockLevel}`);
    evaluateStockingQuantities(dbStockLevel,itemQty,id, totalPrice);
    userPrompts();
    } 
  });
};