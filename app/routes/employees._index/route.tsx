import { useLoaderData } from "react-router"; // Keeping react-router for loading data
import { getDB } from "~/db/getDB";

// Fetch employees from the database
export async function loader() {
  const db = await getDB();
  const employees = await db.all("SELECT * FROM employees;"); // Fetch all employees
 
  return { employees };
}

export default function EmployeesPage() {
  const { employees } = useLoaderData(); //  Get employees from loader

  return (
    <div>
      <h1>Employee Management</h1>

      {/* Navigation Links (Reloads Page) */}
      <nav>
        <ul>
          <li><a href="/employees/new">New Employee</a></li>  {/* Full page reload */}
          <li><a href="/timesheets/">Timesheets</a></li>      {/* Full page reload */}
        </ul>
      </nav>

      <hr />

      {/*  Display Employees in a Table */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Job Title</th>
            <th>Department</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((employee: any) => (
              <tr key={employee.id}>
                <td>{employee.id}</td>
                <td>{employee.full_name}</td>
                <td>{employee.job_title}</td>
                <td>{employee.department}</td>
                <td>${employee.salary.toLocaleString()}</td>
                <td>
  <a href={`/employees/${employee.id}`} key={employee.id}>View</a>
</td>
              </tr>
            ))
          ) : (
            <tr>
              <td  style={{ textAlign: "center" }}>No employees found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
