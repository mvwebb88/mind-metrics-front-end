import { Link } from "react-router";

const DailyLogList = ({ dailyLogs }) => {
  const sortedLogs = [...dailyLogs].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  return (
    <main>
      <h1>Daily Logs</h1>

      <Link to="/dailylogs/new">Add New Daily Log</Link>

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






