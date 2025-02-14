import { Form, useLoaderData } from "react-router";
import { getDB } from "~/db/getDB";

//  Fetch a single timesheet by ID
export async function loader({ params }: { params: { timesheetId: string } }) {
  const db = await getDB();
  const timesheet = await db.get("SELECT * FROM timesheets WHERE id = ?", [params.timesheetId]);

  if (!timesheet) {
    throw new Response("Timesheet Not Found", { status: 404 });
  }

  console.log(" Loaded Timesheet:", timesheet);

  return { timesheet };
}

export default function TimesheetPage() {
  const { timesheet } = useLoaderData();

  return (
    <div>
      <h1>Timesheet Details</h1>

      <table>
        <tbody>
          <tr>
            <td><strong>Employee ID:</strong></td>
            <td>{timesheet.employee_id}</td>
          </tr>
          <tr>
            <td><strong>Start Time:</strong></td>
            <td>{timesheet.start_time}</td>
          </tr>
          <tr>
            <td><strong>End Time:</strong></td>
            <td>{timesheet.end_time}</td>
          </tr>
        </tbody>
      </table>

      <hr />
      <a href="/timesheets">Back to Timesheet List</a>
    </div>
  );
}
