// require statements
const inquirer = require('inquirer');
const mysql = require('mysql');
const logo = require('asciiart-logo');
const { start } = require('repl');

var connection = mysql.createConnection({
    host: "localhost",
    // your port
    port: 3306,
    // your username
    user: "root",
    // your password
    password: "M1qu3tt314!",
    database: "employee_DB",
});

connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});

// function to kick off program (initialize or init)
function init() {
    const logoText = log({ name: "Employee Manager" }).render();
    console.log(logoText);
    // load our prompts
    loadPrompts();
};

function loadPrompts() {
    inquirer.prompt({
        type: 'list',
        name: 'choice',
        message: 'message to user',
        choice: [{
            name: 'veiw all employees',
            value: 'VIEW_EMPLOYEES',
        }];
    });
};

// switch statement
switch (choice) {
    case "VIEW_EMPLOYEES":
        return viewEmployees();
};

DB.viewAllEmployees