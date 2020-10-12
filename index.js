// require statements
const inquirer = require('inquirer');
const mysql = require('mysql');
const logo = require('asciiart-logo');
const { start } = require('repl');
const consoleTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
    // your port
    port: 3306,
    // your username
    user: "root",
    // your password
    password: "M1qu3tt314!",
    database: "employees",
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
        message: 'What would you like to do?',
        choice: [
            {
                name: 'Add a department, role or employee:',
                value: 'ADD_DEPARTMENT',
            },
            {
                name: 'View a department, role or employee:',
                value: 'VIEW_EMPLOYEE',

            },
            {
                name: 'Update employee role:',
                value: 'UPDATE_ROLE',
            },
        ]
    });
};

// // switch statement
// switch (choice) {
//     case "VIEW_EMPLOYEES":
//         return viewEmployees();
// };

function add() {
    console.log('Please make a selection:')
    inquirer
    .prompt({
        type: 'list',
        name: 'addQuery',
        message: 'Please select what you would like to add:',
        choices: ['Add a department', 'Add a role', 'Add an employee'],
    })
    .then(answer => {
        switch (answer.addQuery)
    })
}
// DB.viewAllEmployees
module.exports = connection;