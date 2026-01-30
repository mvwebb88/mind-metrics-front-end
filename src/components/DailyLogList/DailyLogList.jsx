import { Link } from "react-router";
import { useContext, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import styles from "./DailyLogList.module.css";

const DailyLogList = ({ dailyLogs }) => {
  const { user } = useContext(UserContext);

  // State for date filter
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Helper: convert date to YYYY-MM-DD string
  const toYMD = (date) => {
    const dt = new Date(date);
    const year = dt.getFullYear();
    const month = String(dt.getMonth() + 1).padStart(2, "0");
    const day = String(dt.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Only show logs belonging to the current user
  const userLogs = dailyLogs?.filter(
    (log) => String(log.userId?._id || log.userId) === String(user?._id)
  );

  // Sort logs by date (most recent first)
  const sortedLogs = [...(userLogs || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Filter logs by start/end date (only if both are set)
  const filteredLogs =
    startDate && endDate
      ? sortedLogs.filter((log) => {
          const logYMD = toYMD(log.date);
          return logYMD >= startDate && logYMD <= endDate;
        })
      : sortedLogs;

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

  // Helper function that return true as soon as one log matches
  const hasTodaysLog = userLogs?.some((log) => isSameDay(log.date, today));

  return (
    <main className={styles.page}>
      <header className={styles.headerRow}>
        <h1 className={styles.title}>Daily Logs</h1>

        <Link className={styles.primaryLink} to="/dailylogs/new">
          + New Daily Log
        </Link>
      </header>

      {/* Only show message if user has a log for today */}
      {user && hasTodaysLog && (
        <div className={styles.helperBox}>
          <p>You already have a daily log for today!</p>
        </div>
      )}

      <section className={styles.filterBar}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="startDate">
            Start Date
          </label>
          <input
            id="startDate"
            className={styles.input}
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="endDate">
            End Date
          </label>
          <input
            id="endDate"
            className={styles.input}
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </section>

      {filteredLogs.length === 0 ? (
        <p className={styles.empty}>No daily logs found for this period.</p>
      ) : (
        <section className={styles.list}>
          {filteredLogs.map((dailyLog) => (
            <Link
              key={dailyLog._id}
              className={styles.cardLink}
              to={`/dailylogs/${dailyLog._id}`}
            >
              <article className={styles.card}>
                <header className={styles.cardHeader}>
                  <h2 className={styles.mood}>{dailyLog.mood}</h2>
                  <p className={styles.meta}>
                    {new Date(dailyLog.date).toLocaleDateString()}
                  </p>
                </header>

                <p className={styles.stats}>
                  Stress: {dailyLog.stressLevel} | Focus: {dailyLog.focusLevel}
                </p>
              </article>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
};

export default DailyLogList;


