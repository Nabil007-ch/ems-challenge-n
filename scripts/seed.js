import sqlite3 from 'sqlite3';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbConfigPath = path.join(__dirname, '../database.yaml');
const dbConfig = yaml.load(fs.readFileSync(dbConfigPath, 'utf8'));

const {
  'sqlite_path': sqlitePath,
} = dbConfig;

const db = new sqlite3.Database(sqlitePath);

const employees = [
  {
    full_name: 'John Doe',
    email: 'john@example.com',
    phone: '123-456-7890',
    date_of_birth: '1990-05-15',
    job_title: 'Software Engineer',
    department: 'IT',
    salary: 60000,
    start_date: '2022-01-01',
    photo: 'uploads/john.jpg',
  },
  {
    full_name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '987-654-3210',
    date_of_birth: '1985-11-22',
    job_title: 'HR Manager',
    department: 'Human Resources',
    salary: 55000,
    start_date: '2020-06-15',
    photo: 'uploads/jane.jpg',
  },
  {
    full_name: 'Alice Johnson',
    email: 'alice@example.com',
    phone: '555-123-4567',
    date_of_birth: '1992-07-30',
    job_title: 'Marketing Specialist',
    department: 'Marketing',
    salary: 50000,
    start_date: '2021-09-01',
    photo: 'uploads/alice.jpg',
  },
];

let employeeIds = [];

const insertData = (table, data, callback) => {
  const columns = Object.keys(data[0]).join(', ');
  const placeholders = Object.keys(data[0]).map(() => '?').join(', ');

  const insertStmt = db.prepare(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`);

  data.forEach(row => {
    insertStmt.run(Object.values(row), function(err) {
      if (err) {
        console.error(`Error inserting into ${table}:`, err.message);
      } else if (table === 'employees') {
        employeeIds.push(this.lastID);
      }
    });
  });

  insertStmt.finalize(callback);
};

db.serialize(() => {
  insertData('employees', employees, () => {
    const timesheets = [
      {
        employee_id: employeeIds[0],
        start_time: '2025-02-10 08:00:00',
        end_time: '2025-02-10 17:00:00',
      },
      {
        employee_id: employeeIds[1],
        start_time: '2025-02-11 12:00:00',
        end_time: '2025-02-11 17:00:00',
      },
      {
        employee_id: employeeIds[2],
        start_time: '2025-02-12 07:00:00',
        end_time: '2025-02-12 16:00:00',
      },
    ];
    insertData('timesheets', timesheets);
  });
});



db.close(err => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Database seeded successfully.');
  }
});