require('dotenv').config();
const mysql = require('mysql');
const inquirer = require('inquirer');
const keys = require('./keys.js');

const db = mysql.createConnection({
  host: keys.host,
  user: keys.user,
  password: keys.password,
  database: keys.database
})

db.connect(function(err) {
  if (err) {
    console.log(err);
  }
});


  inquirer.prompt(
    [
      {
        type: 'list',
        message: 'Please Select An Option Below?',
        name: 'Menu',
        choices: ['View Products For Sale', 'View Low Inventory', 'Add To Inventory', 'Add New Product']
      }
    ]
  ).then(function(result, err) {
    switchEvaluation(result);
  })


function switchEvaluation(userInput) {
  switch(userInput.Menu) {
    case 'View Products For Sale':
      db.query(`SELECT * FROM products`, function(err, dbResponse) {
        if (err) {
            console.log(err);
        } else {
            console.table(dbResponse);
            menuOptions();
        };
      });
      break;
    case 'View Low Inventory':
      db.query(`SELECT * FROM products WHERE stock_quantity < 6`, function(err, dbResponse) {
        if (err) {
          console.log(err);
        } else {
          console.table(dbResponse);
          menuOptions();
        }
      })
      break;
    case 'Add To Inventory':
        db.query(`SELECT * FROM products;`, function(err, dbResponse) {
          if (err) {
              console.log(err);
          } else {
              console.table(dbResponse);
              addToInventory(dbResponse);
          };
        });
      break;
    case 'Add New Product':
      inquirer.prompt(
        [
          {
            type: 'text',
            message: 'What is the name of the item you want to add?',
            name: 'productName'
          },
          {
            type: 'list',
            message: 'Select a Department',
            choices: ['Tech', 'Entertainment'],
            name: 'department'
          },
          {
            type: 'text',
            message: 'Type in a Price. (Do Not Include The $ Sign.)',
            name: 'price'
          },
          {
            type: 'text',
            message: 'Type in the quantity you have on hand.',
            name: 'stock'
          }
        ]
      ).then(function(result, err) {
        var insert = `INSERT INTO products (product_name,department_name,price,stock_quantity)`
        var values = `values (${result.productName}, ${result.department}, ${result.price}, ${result.stock})`

        console.log(`${insert} ${values}`);
        db.query(`INSERT INTO products (product_name, department_name, price, stock_quantity) values ('${result.productName}', '${result.department}', '${result.price}', '${result.stock}');`, function(err, dataFromDatabase, fields) {
          if (err) {
            console.log(err);
          } else {
            console.log('Successfully Added An Item!');
            menuOptions();
          }
        });
      });
      break;
  }
}

function menuOptions() {
  inquirer.prompt(
    [
      {
        type: 'list',
        message: 'Please Select An Option Below?',
        name: 'Menu',
        choices: ['View Products For Sale', 'View Low Inventory', 'Add To Inventory', 'Add New Product']
      }
    ]
  ).then(function(result, err) {
    switchEvaluation(result);
  })
};

function addToInventory(dataFromADatabase) {
  inquirer.prompt(
    [
      {
        type: 'text',
        message: 'Please enter the item_id you wish to add more stock too.',
        name: 'idSelected'
      },
      {
        type: 'text',
        message: 'Please enter the amount of stock added.',
        name: 'qtyAdded'
      }
    ]
  ).then(function(result, err) {
    var id = parseInt(result.idSelected);
    var qty = parseInt(result.qtyAdded);
    db.query(`UPDATE products SET stock_quantity=${qty + dataFromADatabase[id - 1].stock_quantity} WHERE item_id=${id};`, function(err, data) {
      if (err) {
        console.log(err)
      } else {
        console.log('Record Has Been Updated!');
        menuOptions();
      }
    });
  });
};