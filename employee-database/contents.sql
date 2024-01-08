-- DEPARTMENT NAMES
INSERT INTO department
    (id, name)
VALUES
    (1, 'Public Relations'),
    (2, 'Accounting'),
    (3, 'Tech'),
    (4, 'Legal');

-- ROLE IDS
INSERT INTO roles
    (id, title, salary, department_id)
VALUES
    (1, 'PR Manager', 120000, 1),
    (2, 'Accounts Manager', 90000, 2),
    (3, 'Software Engineer', 180000, 3),
    (4, 'Accountant', 100000, 2),
    (5, 'Sr Engineer', 230000, 3),
    (6, 'Lawyer', 90000, 4),
    (7, 'Legal Manager', 80000, 4);



-- EMPLOYEE NAMES
INSERT INTO employees
    (id, first_name, last_name, role_id, manager_id)
VALUES
    (1, 'Amir', 'Jefferson', 1, NULL),
    (2, 'Randal', 'Johnson', 2, 1),
    (3, 'Justin', 'Jackson', 3, 1),
    (4, 'Elizabith', 'Smith', 4, 3),
    (5, 'John', 'Doe', 5, 4),
    (6, 'Justus', 'McDougal', 6, 4);