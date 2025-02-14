import { useState, useEffect } from "react";
import { useLoaderData } from "react-router";
import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";
import { createViewMonthGrid, createViewWeek } from "@schedule-x/calendar";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import "@schedule-x/theme-default/dist/index.css";
import { getDB } from "~/db/getDB";

// ✅ Loader function to fetch timesheets and employees
export async function loader() {
  const db = await getDB();
  const timesheetsAndEmployees = await db.all(
    "SELECT timesheets.*, employees.full_name, employees.id AS employee_id FROM timesheets JOIN employees ON timesheets.employee_id = employees.id"
  );

  return { timesheetsAndEmployees };
}

// ✅ TimesheetsPage Component
export default function TimesheetsPage() {
  // Get data from loader
  const { timesheetsAndEmployees } = useLoaderData();

  const [view, setView] = useState<"table" | "calendar">("table");

  // Function to format the time as "YYYY-MM-DD HH:mm"
  const formatToCustomDate = (time: string) => {
    const date = new Date(time);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`; // Format without 'T' or 'Z'
  };

  // ✅ Events Plugin for ScheduleX
  const [eventsService] = useState(() => createEventsServicePlugin());

  // ✅ Calendar Setup
  const calendar = useCalendarApp({
    views: [createViewWeek(), createViewMonthGrid()],
    events: timesheetsAndEmployees.map((t: any) => ({
      id: String(t.id),
      title: `Timesheet for ${t.full_name}`,
      start: t.start_time ? formatToCustomDate(t.start_time) : new Date().toISOString(),
      end: t.end_time ? formatToCustomDate(t.end_time) : new Date().toISOString(),
    })),
    plugins: [eventsService],
  });

  useEffect(() => {
    eventsService.getAll(); // Fetch events (optional)
  }, [eventsService]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Timesheets</h1>

      {/* Toggle Buttons */}
      <div className="mb-4 flex gap-2">
        <button
          className={`px-4 py-2 rounded ${view === "table" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setView("table")}
        >
          Table View
        </button>
        <button
          className={`px-4 py-2 rounded ${view === "calendar" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setView("calendar")}
        >
          Calendar View
        </button>
      </div>

      {/* Render Table or Calendar */}
      {view === "table" ? (
        <div>
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Timesheet ID</th>
                <th className="border px-4 py-2">Employee</th>
                <th className="border px-4 py-2">Start Time</th>
                <th className="border px-4 py-2">End Time</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {timesheetsAndEmployees.map((timesheet: any) => (
                <tr key={timesheet.id}>
                  <td className="border px-4 py-2">#{timesheet.id}</td>
                  <td className="border px-4 py-2">
                    {timesheet.full_name} (ID: {timesheet.employee_id})
                  </td>
                  <td className="border px-4 py-2">{formatToCustomDate(timesheet.start_time)}</td>
                  <td className="border px-4 py-2">{formatToCustomDate(timesheet.end_time)}</td>
                  <td className="border px-4 py-2">
                    <a href={`/timesheets/${timesheet.id}`} className="text-blue-500">Edit</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // ✅ Use Calendar App Here
        <ScheduleXCalendar calendarApp={calendar} />
      )}

      {/* Navigation Links */}
      <hr className="my-4" />
      <div className="flex gap-4">
        <a href="/timesheets/new" className="bg-green-500 text-white px-4 py-2 rounded">+ New Timesheet</a>
        <a href="/employees" className="bg-gray-500 text-white px-4 py-2 rounded">View Employees</a>
      </div>
    </div>
  );
}
