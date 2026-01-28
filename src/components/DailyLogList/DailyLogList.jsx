import { Link } from "react-router";
import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";

const DailyLogList = ({ dailyLogs }) => {
  const { user } = useContext(UserContext);

  // State for date filter
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Check if the current user has a log for today
  const today = new Date();
  const isSameDay = (d1, d2) => {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const hasTodaysLog = dailyLogs?.some(
    (log) =>
      String(log.userId?._id || log.userId) === String(user?._id) &&
      isSameDay(log.date, today)
  );

  // Sort logs by date (most recent first)
  const sortedLogs = [...dailyLogs].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Helper: convert date to YYYY-MM-DD string
  const toYMD = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Filter logs by start/end date (only if both are set)
  const filteredLogs =
    startDate && endDate
      ? sortedLogs.filter((log) => {
        const logYMD = toYMD(log.date);
        return logYMD >= startDate && logYMD <= endDate;
      })
      : sortedLogs;

  return (
    <main>
      <h1>Daily Logs</h1>

      {/* Add today's log or show message to add previos logs, if any */}
      {user && (
        <>
          {!hasTodaysLog ? (
            <Link to="/dailylogs/new">Add Daily Log</Link>
          ) : (
            <div>
              <p>
                You already have a log for today! If you missed logging any
                previous days, you can do it here:
              </p>
              <Link to="/dailylogs/new?date=past">Add Daily Log</Link>
            </div>
          )}
        </>
      )}

      {/* Date range filter */}
      <div style={{ margin: "20px 0" }}>
        <label>
          Start Date:{" "}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label style={{ marginLeft: "10px" }}>
          End Date:{" "}
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
      </div>

      {/* List logs */}
      {filteredLogs.length === 0 ? (
        <p>No daily logs found for this period.</p>
      ) : (
        filteredLogs.map((dailyLog) => (
          <Link key={dailyLog._id} to={`/dailylogs/${dailyLog._id}`}>
            <article>
              <header>
                <h2>{dailyLog.mood}</h2>
                <p>
                  Logged on {new Date(dailyLog.date).toLocaleDateString()}`
                </p>
              </header>
              <p>
                Stress: {dailyLog.stressLevel} | Focus: {dailyLog.focusLevel}
              </p>
            </article>
          </Link>
        ))
      )}
    </main>
  );
};

export default DailyLogList;

