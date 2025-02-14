import { Form, redirect, type ActionFunction } from "react-router";
import { getDB } from "~/db/getDB";

// ✅ Handle form submission (Create a new timesheet)
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const employee_id = formData.get("employee_id");
  const start_time = formData.get("start_time");
  const end_time = formData.get("end_time");

  const db = await getDB();
  await db.run(
    "INSERT INTO timesheets (employee_id, start_time, end_time) VALUES (?, ?, ?)",
    [employee_id, start_time, end_time]
  );

  return redirect("/timesheets");
};

export default function NewTimesheetPage() {
  return (
    <div>
      <h1>Create New Timesheet</h1>
      <Form method="post">
        <div>
          <label htmlFor="employee_id">Employee ID</label>
          <input type="number" name="employee_id" id="employee_id" required />
        </div>
        <div>
          <label htmlFor="start_time">Start Time</label>
          <input type="datetime-local" name="start_time" id="start_time" required />
        </div>
        <div>
          <label htmlFor="end_time">End Time</label>
          <input type="datetime-local" name="end_time" id="end_time" required />
        </div>
        <button type="submit">Create Timesheet</button>
      </Form>

      <hr />
      <a href="/timesheets">Back to Timesheet List</a>
    </div>
  );
}
