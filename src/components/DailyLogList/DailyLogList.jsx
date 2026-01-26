import { Link } from "react-router";

const DailyLogList = ({ dailyLogs }) => {
  return (
    <main>
      {dailyLogs.map((dailyLog) => (
        <Link key={dailyLog._id} to={`/daily-logs/${dailyLog._id}`}>
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

            <p>
              Sleep: {dailyLog.sleepHours}h • Work: {dailyLog.workHours}h • Screen:{" "}
              {dailyLog.screenHours}h
            </p>

            <p>Location: {dailyLog.location}</p>
          </article>
        </Link>
      ))}
    </main>
  );
};

export default DailyLogList;






