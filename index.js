// require statements
const inquirer = require('inquirer');
const mysql = require('mysql');
const logo = require('asciiart-logo');
const { start } = require('repl');
const consoleTable = require('console.table');
const { allowedNodeEnvironmentFlags } = require('process');

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
    init();
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
            "Add a Role", "Add an Employee", "Add a Department", 
            "View Employees", "View Departments", "View all Roles", "Update Employee Role"
        ]
    })

    .then (answer => {
        // switch statement with required cases
        switch(answer.choice){
            case "View Employees":
                viewEmployees();
                break;

            case "View Departments":
                viewDepartments();
                break;

            case "View all Roles":
                viewRoles();
                break;

            case "Add a Role":
                addRole();
                break;

            case "Add a Department":
                addDepartment();
                break;

            case "Add an Employee":
                addEmployee();
                break;

            case "Update a Role":
                updateRole();
                break;
        }
    });
};

function addRole() {
    console.log('Please make a selection:')
    inquirer
    .prompt({
        type: 'list',
        name: 'addRole',
        message: 'Which role would you like to add?',
    })
    .then(answer => {
        connection.query("INSERT INTO role SET ?", 
        {name: answer.addRole}, function (err) {
            console.log("Successfully added a new Role")
            loadPrompts();
        })
    })
}

function addRole() {
    console.log('Please make a selection:')
    inquirer
    .prompt({
        type: 'list',
        name: 'addRole',
        message: 'Which role would you like to add?',
    })
    .then(answer => {
        connection.query("INSERT INTO role SET ?", 
        {name: answer.addRole}, function (err) {
            console.log("Successfully added a new Role")
            loadPrompts();
        })
    })
}
// DB.viewAllEmployees
// module.exports = connection;