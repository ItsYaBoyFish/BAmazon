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
      message: 'Please Select From The Menu Options Below',
      choices: ['View Product Sales by Department', 'Create New Department'],
      name: 'menu'
    }
  ]
).then(function(result, err) {
  if (err) {
    console.log(err);
  } else {
    // console.log(result);
    switchEvaluation(result.menu);
  }
});

function productSalesQuery() {
  // var groupQuery = `SELECT department_name FROM products GROUP BY department_name;`;
  // var groupQuery = `SELECT * FROM products WHERE department_name='Tech';`;
  var groupQuery = `SELECT products.department_name, products.product_sales FROM products GROUP BY department_name;`;
  var productSalesTotal = 0;
  db.query(groupQuery, function(err, results) {
    if (err) {
      console.log(err);
    } else {
      console.log('Results Are Back!');
      console.table(results);
      // for (var i = 0; i < results.length; i++) {
      //   productSalesTotal += parseInt(results[i].product_sales)
      // }

    }
  });
  // db.query('SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales FROM departments INNER JOIN products ON department_id=products.product_')
}

function switchEvaluation(dataFromUser) {
  switch(dataFromUser) {
    case 'View Product Sales by Department':
      productSalesQuery();
      break;
    case 'Create New Department':
      break;
  }
}