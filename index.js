// require statements
const inquirer = require("inquirer");
const mysql = require("mysql");
const logo = require("asciiart-logo");
const util = require("util");
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

connection.queryPromise = util.promisify(connection.query);

// function to kick off program (initialize or init)
function init() {
  const logoText = logo({ name: "Employee Manager" }).render();
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
      choices: [
        "Add a Role",
        "Add an Employee",
        "Add a Department",
        "View Employees",
        "View Departments",
        "View all Roles",
        "Update Employee Role",
        "End",
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

        case "Update Employee Role":
          updateRole();
          break;

        case "End":
          connection.end();
      }
    });
}

function addRole() {
  console.log("Add Role");
  connection
    .queryPromise("SELECT * FROM department")
    .then((departments) => {
      departments = departments.map((department) => {
        return {
          value: department.id,
          name: department.name,
        };
      });
      return inquirer.prompt([
        {
          type: "input",
          name: "addRole",
          message: "Which role would you like to add?",
        },
        {
          type: "list",
          name: "departments",
          choices: departments,
          message: "Choose a department:",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary for the role are you adding?",
        },
      ]);
    })
    .then((answer) => {
      console.log(answer.departments);
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
  var employee1 = [];
  var role2 = [];
  var managers = [];
  connection
    .queryPromise(
      "SELECT * FROM employee WHERE manager_id = 1 or manager_id = 3 or manager_id = 5 or manager_id = 7"
    )
    .then((employees) => {
      //    global variable 1 =
      employee1 = employees.map((employee) => {
        return {
          value: employee.manager_id,
          name: employee.first_name + " " + employee.last_name,
        };
      });
      return connection.queryPromise("SELECT * FROM role");
    })
    .then((roles) => {
      role2 = roles.map((role) => {
        return {
          value: role.id,
          name: role.title,
        };
      });
    })
    .then(() => {
      return inquirer.prompt([
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
          type: "list",
          name: "role_id",
          message: "Choose a role:",
          choices: role2,
        },
        {
          type: "list",
          name: "manager_id",
          choices: employee1,
          message: "Choose manager ID:",
        },
      ]);
    })
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
  var query = "SELECT id, first_name, last_name, role_id, manager_id";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    loadPrompts();
  });
}

function viewDepartments() {
  var query = "SELECT name FROM department";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    loadPrompts();
  });
}

function viewRoles() {
  var query = "SELECT title FROM role";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    loadPrompts();
  });
}
// Function to update the role
function updateRole() {
  let updateEmpID = "";
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    console.table(res);

    inquirer
      .prompt({
        type: "input",
        name: "empList",
        message: "Please enter the employee ID to be updated",
      })
      .then((answer) => {
        updateEmpID = answer.empList;
        connection.query(
          "SELECT * FROM employee WHERE id = ? ",
          [updateEmpID],
          function (err, res) {
            if (err) throw err;
            console.table(res);
            //query database for roles
            //update the local array to have the roles from the role db
            //push those roles to the choices array
            const roleArr = [];
            connection.query("SELECT * FROM role", function (err, res) {
              res.forEach((element) => {
                roleArr.push(element.title);
              });
              inquirer
                .prompt({
                  type: "list",
                  name: "updateRole",
                  message: "Please select a role ID number for this employee",
                  choices: roleArr,
                })
                .then((answer) => {
                  connection.query(
                    "SELECT * FROM role WHERE title = ?",
                    [answer.updateRole],
                    function (err, res) {
                      if (err) throw err;
                      console.table(res);
                      connection.query(
                        "UPDATE employee SET role_id = ? WHERE id = ?",
                        [res[0].id, updateEmpID],
                        function (err, result) {
                          if (err) throw err;
                          loadPrompts();
                        }
                      );
                    }
                  );
                });
            });
          }
        );
      });
  });
}
// diplays all roles, salaries, and departments
function viewRoles() {
  connection
    .queryPromise(
      "SELECT role.title, role.salary, department.name FROM role INNER JOIN department ON role.department_id=department.id"
    )
    .then((roles) => {
      console.table(roles);
      loadPrompts();
    });
}
