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

    // Find today's log for the current user
    const todayLog = dailyLogs?.find((log) => {
        if (!log.date || !user) return false;
        const logUserId = log.userId?._id || log.userId;
        return String(logUserId) === String(user._id) && isSameCalendarDay(log.date, new Date());
    });

    return (
        <main className={styles.page}>
          <section className={styles.card}>
            <h1 className={styles.title}>Welcome to MindMetrics, {user.username}!</h1>
      
            <p className={styles.subtitle}>
              Start your day with a quick check-in. Track your mood, stress, focus, and
              habits — and see your progress over time.
            </p>
      
            <div className={styles.divider} />
      
            <div className={styles.actions}>
              {todayLog ? (
                <Link className={styles.btn} to={`/dailylogs/${todayLog._id}`}>
                  View Today’s Daily Log
                </Link>
              ) : (
                <Link className={styles.btn} to="/dailylogs/new">
                  Add Today’s Daily Log
                </Link>
              )}
      
              <Link className={styles.btn} to="/goals">
                View Goals
              </Link>
            </div>
      
            <p className={styles.hint}>
              Tip: Consistency beats intensity — even 1 minute a day builds momentum.
            </p>
          </section>
        </main>
      );
    }      

export default Home;

