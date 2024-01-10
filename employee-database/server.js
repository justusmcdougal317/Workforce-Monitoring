// REQUIRED MODULE PACKAGES
const inquirer = require("inquirer");
const mysql = require("mysql");
const consoleTable = require("console.table");


// MYSQL DATABASE CONNECTION
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Armoredtruck7!",
  database: "workforce_db",
});

//CONNECTION CONSOLE LOG
connection.connect((err) => {
  if (err) throw err;
  console.log("You are connected to the EmployBase.");
  startTracker();
});



//INQUIRE FUNCTION TO START EMPLOYEE TRACKER
function startTracker() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all roles",
        "View all employees",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
        "Exit",
      ],
    })

    //THEN FUNCTION - PASS THE USERS INPUT AS ANSWERS
    .then((answer) => {
      switch (answer.action) {
        case "View all departments":
          viewAllDepartments();
          break;
        case "View all roles":
          viewAllRoles();
          break;
        case "View all employees":
          viewAllEmployees();
          break;
        case "Add a department":
          addDepartment();
          break;
        case "Add a role":
          addRole();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Update an employee role":
          updateEmployeeRole();
          break;
        case "Exit":
          connection.end();
          break;
        default:
          console.log("Invalid. Please try again.");
          startTracker();
      }
    });
}

//FUNCTION TO VIEW ALL THE DEPARTMENTS IN DATABASE
function viewAllDepartments() {
  connection.query("SELECT * FROM department", (err, res) => {

    //IF STATEMENT IF THERE ARE ANY ERRORS 
    if (err) throw err;
    console.table(res);
    startTracker();
  });
}

//FUNCTION TO VIEW ALL THE ROLES IN DATABASE
function viewAllRoles() {
  connection.query(
    "SELECT roles.id, roles.title, roles.salary, department.name AS department FROM roles INNER JOIN department ON roles.department_id = department.id",
    (err, res) => {

      //IF STATEMENT IF THERE ARE ANY ERRORS  
      if (err) throw err;
      console.table(res);
      startTracker();
    }
  );
}

//FUNCTION TO VIEW ALL THE EMPLOYEES IN THE DATABASE
function viewAllEmployees() {
  connection.query(
    'SELECT employees.id, employees.first_name, employees.last_name, roles.title, department.name AS department, roles.salary, CONCAT(manager.first_name, " ", manager.last_name) AS manager FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN department ON roles.department_id = department.id LEFT JOIN employees AS manager ON employees.manager_id = manager.id',
    (err, res) => {

      //IF STATEMENT IF THERE ARE ANY ERRORS 
      if (err) throw err;
      console.table(res);
      startTracker();
    }
  );
}

//FUNCTION TO ADD A DEPARTMENT TO THE DATABASE
function addDepartment() {
  inquirer
    .prompt({
      name: "department",
      type: "input",
      message: "Enter the name of the department:",
    })
    .then((answer) => {
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.department,
        },
        (err) => {
          if (err) throw err;
          console.log("Department added successfully!");
          startTracker();
        }
      );
    });
}

//FUNCTION TO ADD A ROLE TO THE DATABASE
function addRole() {

  //GET THE LIST OF DEPARTMENTS FROM DATABASE
  connection.query("SELECT * FROM department", (err, departments) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "Enter Role's Title:",
        },
        {
          name: "salary",
          type: "input",
          message: "Enter Role's Salary:",
          validate: (value) => {
            if (isNaN(value) === false) {
              return true;
            }
            return "Invalid. Please re-enter role's salary.";
          },
        },
        {
          name: "department",
          type: "list",
          message: "Select the Role's Department:",
          choices: departments.map((department) => department.name),
        },
      ])
      .then((answers) => {
        const selectedDepartment = departments.find(
          (department) => department.name === answers.department
        );

        connection.query(
          "INSERT INTO roles SET ?",
          {
            title: answers.title,
            salary: answers.salary,
            department_id: selectedDepartment.id,
          },
          (err) => {
            if (err) throw err;
            console.log("Role added successfully!");
            startTracker();
          }
        );
      });
  });
}

//FUNCTION TO ADD AN EMPLOYEE TO THE DATABASE
function addEmployee() {

  // GET THE LIST OF ROLES FROM DATABASE
  connection.query("SELECT * FROM roles", (err, roles) => {
    if (err) throw err;

    // GET THE LIST OF EMPLOYEES FROM DATABASE
    connection.query("SELECT * FROM employees", (err, employees) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: "firstName",
            type: "input",
            message: "Enter the employee's first name:",
          },
          {
            name: "lastName",
            type: "input",
            message: "Enter the employee's last name:",
          },
          {
            name: "role",
            type: "list",
            message: "Select the employee's role:",
            choices: roles.map((role) => role.title),
          },
          {
            name: "manager",
            type: "list",
            message: "Select the employee's manager:",
            choices: [
              "None",
              ...employees.map(
                (employees) => `${employees.first_name} ${employees.last_name}`
              ),
            ],
          },
        ])
        .then((answers) => {
          const selectedRole = roles.find(
            (roles) => roles.title === answers.role
          );

          let managerId = null;
          if (answers.manager !== "None") {
            const selectedManager = employees.find(
              (employees) =>
                `${employees.first_name} ${employees.last_name}` ===
                answers.manager
            );
            managerId = selectedManager.id;
          }

          connection.query(
            "INSERT INTO employees SET ?",
            {
              first_name: answers.firstName,
              last_name: answers.lastName,
              role_id: selectedRole.id,
              manager_id: managerId,
            },
            (err) => {
              if (err) throw err;
              console.log("You have added a New Employee!");
              startTracker();
            }
          );
        });
    });
  });
}

//FUNCTION TO UPDATE THE ROLE OF AN EMPLOYEE
function updateEmployeeRole() {

  //GET THE LIST OF EMPLOYEES FROM DATABASE
  connection.query("SELECT * FROM employees", (err, employees) => {
    if (err) throw err;

    //GET THE LIST OF ROLES FROM DATABASE
    connection.query("SELECT * FROM roles", (err, roles) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: "employees",
            type: "list",
            message: "Select the employee to update:",
            choices: employees.map(
              (employees) => `${employees.first_name} ${employees.last_name}`
            ),
          },
          {
            name: "role",
            type: "list",
            message: "What is the new role of the employee:",
            choices: roles.map((role) => role.title),
          },
        ])
        .then((answers) => {
          const selectedEmployees = employees.find(
            (employees) =>
              `${employees.first_name} ${employees.last_name}` ===
              answers.employees
          );
          const selectedRole = roles.find(
            (role) => role.title === answers.role
          );

          connection.query(
            "UPDATE employees SET role_id = ? WHERE id = ?",
            [selectedRole.id, selectedEmployees.id],
            (err) => {
              if (err) throw err;
              console.log("Employee role has been updated!");
              startTracker();
            }
          );
        });
    });
  });
}
  