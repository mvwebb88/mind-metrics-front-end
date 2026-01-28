import { Link } from "react-router";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext";

const DailyLogList = ({ dailyLogs }) => {

  const { user } = useContext(UserContext);

  const today = new Date();

  // Compare two dates ignoring time
  const isSameCalendarDay = (d1, d2) => {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Check if the current user has a daily log for today
  const hasTodaysLog = dailyLogs?.some(
    (log) => String(log.userId?._id || log.userId) === String(user?._id) &&
      isSameCalendarDay(log.date, today)
  );

  // Show the most recent logs by input date on top
  const sortedLogs = [...dailyLogs].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <main>
      <h1>Daily Logs</h1>

      {user && (
        <>
          {!hasTodaysLog ? (
            // No log for today: allow adding today’s log
            <Link to="/dailylogs/new">Add Daily Log</Link>
          ) : (
            // Already has log for today: allow adding daily logs and add message to user
            <div>
              <p>
                You already have a log for today! If you missed logging any previous days, you can do it here:
              </p>
              <Link to="/dailylogs/new?date=past">Add Daily Log</Link>
            </div>
          )}
        </>
      )}

      {sortedLogs.map((dailyLog) => (
        <Link key={dailyLog._id} to={`/dailylogs/${dailyLog._id}`}>
          <article>
            <header>
              <h2>{dailyLog.mood}</h2>
              <p>
                {`${dailyLog.userId.username} logged on
                ${new Date(dailyLog.date).toLocaleDateString()}`}
              </p>
            </header>
            <p>
              Stress: {dailyLog.stressLevel} | Focus: {dailyLog.focusLevel}
            </p>
          </article>
        </Link>
      ))}
    </main>
  );
};

export default DailyLogList;






