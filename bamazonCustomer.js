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
      // console.log(userInput);
      var id = parseInt(userInput.idSelected);
      var itemQty = parseInt(userInput.quantityWantingToPurchase)
      var dbStockLevel = results[id - 1].stock_quantity;
      totalPrice = results[id - 1].price * itemQty;
      // console.log(`ID: ${id}`);
      // console.log(`itemQty: ${itemQty}`);
      // console.log(`dbStockLevel: ${dbStockLevel}`);
      evaluateStockingQuantities(dbStockLevel,itemQty,id, totalPrice);
    });
  }
});



function evaluateStockingQuantities(yourDatabaseStockLevel, AmountWantedToPurchase, itemAttemptingToPurchaseID, totalPriceOfPurchase) {
  var itemsSold;
  if (AmountWantedToPurchase > yourDatabaseStockLevel) {
    console.log('Insufficient Quantity!');
    itemsSold = false;
  } else {
    db.query(`UPDATE products SET stock_quantity=${yourDatabaseStockLevel-AmountWantedToPurchase} WHERE item_id=${itemAttemptingToPurchaseID}`)
    itemsSold = true;
  } 
  if (itemsSold === true) {
    console.log(`Thanks For Shopping With Us! Your Total Is: $${totalPriceOfPurchase}`);
  } else {
    console.log('Sorry For The Inconvenience, Please Check Back In A Couple Of Days!');
  }
};