import { useContext } from "react";
import { Link } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import styles from "./Home.module.css";

const Home = ({ dailyLogs }) => {
    const { user } = useContext(UserContext);

    // Compare two dates, ignoring hours/minutes/seconds
    const isSameCalendarDay = (d1, d2) => {
        const date1 = new Date(d1);
        const date2 = new Date(d2);
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    };

    // Format a date for display as m/d/y
    const formatMDY = (date) => {
        const dt = new Date(date);
        const month = dt.getMonth() + 1;
        const day = dt.getDate();
        const year = dt.getFullYear();
        return `${month}/${day}/${year}`;
    };

    // Find today's log for the current user
    const todayLog = dailyLogs?.find((log) => {
        if (!log.date || !user) return false;
        const logUserId = log.userId?._id || log.userId;
        return String(logUserId) === String(user._id) && isSameCalendarDay(log.date, new Date());
    });

    return (
        <main className={styles.page}>
          <section className={styles.card}>
            <h1 className={styles.title}>Welcome to MindMetrics, {user?.username}!</h1>
    
            <p className={styles.subtitle}>
              Quick check: log your day and keep building healthy habits.
            </p>
    
            {user && (
              <div className={styles.actions}>
                {todayLog ? (
                  <Link className={styles.btn} to={`/dailylogs/${todayLog._id}`}>
                    View Today&apos;s Daily Log ({formatMDY(todayLog.date)})
                  </Link>
                ) : (
                  <Link className={styles.btn} to="/dailylogs/new">
                    Add Daily Log
                  </Link>
                )}
              </div>
            )}
    
            <p className={styles.helper}>
              Tip: one daily log per day helps you spot patterns faster.
            </p>
          </section>
        </main>
      );
    };

export default Home;

