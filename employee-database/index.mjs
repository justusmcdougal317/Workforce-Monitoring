import inquirer from 'inquirer';
import mysql from 'mysql'
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Armoredtruck7!',
    database: 'employee_db',
    authPlugins: {
      mysql_clear_password: () => Buffer.from('your_password')
    }
  });
  
  connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
    startApp();
  });
  
  async function startApp() {
    const answer = await inquirer.prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all employees',
        'View all roles',
        'View all departments',
        'Add employee',
        'Add role',
        'Add department',
        'Exit',
      ],
    });
  
    switch (answer.action) {
      case 'View all employees':
        viewAllEmployees();
        break;
  
      case 'View all roles':
        viewAllRoles();
        break;
  
      case 'View all departments':
        viewAllDepartments();
        break;
  
      case 'Add employee':
        addEmployee();
        break;
  
      case 'Add role':
        addRole();
        break;
  
      case 'Add department':
        addDepartment();
        break;
  
      case 'Exit':
        connection.end();
        break;
  
      default:
        break;
    }
  }
  
  function viewAllEmployees() {
    // Implement logic to query and display all employees
  }
  
  function viewAllRoles() {
    // Implement logic to query and display all roles
  }
  
  function viewAllDepartments() {
    // Implement logic to query and display all departments
  }
  
  function addEmployee() {
    // Implement logic to add a new employee
  }
  
  function addRole() {
    // Implement logic to add a new role
  }
  
  function addDepartment() {
    // Implement logic to add a new department
  }