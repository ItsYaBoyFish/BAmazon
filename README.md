# BAmazon
A CLI application that allows users to purchase product from a store powered by mysql

# Prepping The Application For Use
First Install all packages. 
``` console
npm install
```

Next You will want to add a .env file and a keys.js file.
``` console
.env
```
``` console
keys.js
```

Now You will put the following in your markdown file 
``` 
HOST=YOURHOST
USER=YOURUSER
PASSWORD=PASSWORDHERE
DATABASE=YOURDATABASENAME
```

*** Do Not Put Commas After Each Line.

Inside Your Keys.js File, Put the following:
``` javascript
module.exports = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
}
```
Your File Is Setup And Ready To Run.

# Using The App As A Customer
in the console type 
``` console
node bamazonCustomer.js
```
It will then prompt you to input the item_id as well as how many of that item you would like to purchase.

# Using The App As A Manager
in the console type:
``` console
node bamazonManager.js
```

It will then give you a list of items to choose from.

Simply follow the prompts to do what you want to do. 

** Please Note: If you are checking for records with low inventory and all products currently have good stock numbers, it will return a small table that just has a index as a header and a blank cell. 

# Using The App As A Supervisor
This functionality I didn't get too unfornately.