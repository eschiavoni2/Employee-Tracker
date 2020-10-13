// require statements
const inquirer = require("inquirer");
const mysql = require("mysql");
const logo = require("asciiart-logo");
const { start } = require("repl");
const consoleTable = require("console.table");
const { allowedNodeEnvironmentFlags } = require("process");

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
}

function loadPrompts() {
  inquirer
    .prompt({
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choice: [
        "Add a Role",
        "Add an Employee",
        "Add a Department",
        "View Employees",
        "View Departments",
        "View all Roles",
        "Update Employee Role",
      ],
    })

    .then((answer) => {
      // switch statement with required cases
      switch (answer.choice) {
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
}

function addRole() {
  console.log("Add Role");
  inquirer
    .prompt([
      {
        type: "index",
        name: "addRole",
        message: "Which role would you like to add?",
      },
      {
        type: "number",
        name: "department",
        message: "Which department id will this role be in?",
      },
      {
        type: "number",
        name: "salary",
        message: "What is the salary for the role are you adding?",
      },
    ])

    .then((answer) => {
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: answer.addRole,
          salary: answer.salary,
          department: answer.department_id,
        },
        function (err) {
          console.log("Successfully added a new Role");
          loadPrompts();
        }
      );
    });
}

function addDepartment() {
  console.log("Add Department");
  inquirer
    .prompt({
      type: "index",
      name: "addDepartment",
      message: "Which department would you like to add?",
    })
    .then((answer) => {
      connection.query(
        "INSERT INTO department SET ?",
        { name: answer.addDepartment },
        function (err) {
          console.log("Successfully added a new Department");
          loadPrompts();
        }
      );
    });
}

function addEmployee() {
  console.log("Add Employee");
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is the first name of your employee?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the last name of your employee?",
      },
      {
        type: "number",
        name: "role_id",
        message: "What is the ID for this role?",
      },
      {
        type: "number",
        name: "manager_id",
        message: "What is the ID for employee manager?",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.role_id,
          manager_id: answer.manager_id,
        },
        function (err) {
          console.log("Successfully added a new Employee");
          loadPrompts();
        }
      );
    });
}

function viewEmployees() {
    var query = "SELECT id, first_name, last_name, role_id, manager_id"
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        loadPrompts();
    })
}
// DB.viewAllEmployees
// module.exports = connection;
