import { Form, redirect, type ActionFunction } from "react-router";
import { getDB } from "~/db/getDB";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  // ✅ Extract form values
  const full_name = formData.get("full_name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const date_of_birth = formData.get("date_of_birth");
  const job_title = formData.get("job_title");
  const department = formData.get("department");
  const salary = parseFloat(formData.get("salary") as string);
  const start_date = formData.get("start_date");

  // ✅ Validate required fields
  if (!full_name || !email || !phone || !job_title || !department || isNaN (salary)) {
    return { error: "All fields are required!" };
  }

  // ✅ Insert new employee into the database
  const db = await getDB();
  await db.run(
    `INSERT INTO employees (full_name, email, phone, date_of_birth, job_title, department, salary, start_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [full_name, email, phone, date_of_birth, job_title, department, salary, start_date]
  );

  return redirect("/employees"); // ✅ Redirect after adding
};

export default function NewEmployeePage() {
  return (
    <div>
      <h1>Create New Employee</h1>
      <Form method="post">
        <div>
          <label htmlFor="full_name">Full Name</label>
          <input type="text" name="full_name" id="full_name" required />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" id="email" required />
        </div>

        <div>
          <label htmlFor="phone">Phone</label>
          <input type="text" name="phone" id="phone" required />
        </div>

        <div>
          <label htmlFor="date_of_birth">Date of Birth</label>
          <input type="date" name="date_of_birth" id="date_of_birth" required />
        </div>

        <div>
          <label htmlFor="job_title">Job Title</label>
          <input type="text" name="job_title" id="job_title" required />
        </div>

        <div>
          <label htmlFor="department">Department</label>
          <select name="department" id="department" required>
            <option value="">Select Department</option>
            <option value="IT">IT</option>
            <option value="HR">HR</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>

        <div>
          <label htmlFor="salary">Salary</label>
          <input type="number" name="salary" id="salary" required min="0" />
        </div>

        <div>
          <label htmlFor="start_date">Start Date</label>
          <input type="date" name="start_date" id="start_date" required />
        </div>

        <button type="submit">Create Employee</button>
      </Form>

      <hr />
      <ul>
        <li><a href="/employees">Employees</a></li>
        <li><a href="/timesheets">Timesheets</a></li>
      </ul>
    </div>
  );
}
