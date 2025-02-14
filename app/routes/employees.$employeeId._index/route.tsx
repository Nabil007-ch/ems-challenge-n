import { useLoaderData } from "react-router";
import { getDB } from "~/db/getDB";

// ✅ Fetch a single employee by ID
export async function loader({ params }: { params: { employeeId: string } }) {
  const db = await getDB();
  const employee = await db.get("SELECT * FROM employees WHERE id = ?", [params.employeeId]);

  if (!employee) {
    throw new Response("Employee Not Found", { status: 404 });
  }

  console.log("✅ Loaded Employee:", employee); // Debugging

  return { employee };
}

export default function EmployeePage() {
  const { employee } = useLoaderData(); // ✅ Get employee data

  return (
    <div>
      <h1>Employee Details</h1>

      <table>
        <tbody>
          <tr>
            <td><strong>Full Name:</strong></td>
            <td>{employee.full_name}</td>
          </tr>
          <tr>
            <td><strong>Email:</strong></td>
            <td>{employee.email}</td>
          </tr>
          <tr>
            <td><strong>Phone:</strong></td>
            <td>{employee.phone}</td>
          </tr>
          <tr>
            <td><strong>Job Title:</strong></td>
            <td>{employee.job_title}</td>
          </tr>
          <tr>
            <td><strong>Department:</strong></td>
            <td>{employee.department}</td>
          </tr>
          <tr>
            <td><strong>Salary:</strong></td>
            <td>${employee.salary.toLocaleString()}</td>
          </tr>
          <tr>
            <td><strong>Start Date:</strong></td>
            <td>{employee.start_date}</td>
          </tr>
        </tbody>
      </table>

      <hr />
      <a href="/employees">Back to Employee List</a>
    </div>
  );
}
