import { useParams, Link } from "react-router";
import { useState, useEffect, useContext } from "react";

import * as dailyLogService from "../../services/dailyLogService";
import { UserContext } from "../../contexts/UserContext";
import styles from "./DailyLogDetails.module.css";

const DailyLogDetails = ({ handleDeleteDailyLog }) => {
  const { dailyLogId } = useParams();
  const [dailyLog, setDailyLog] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchDailyLog = async () => {
      const dailyLogData = await dailyLogService.show(dailyLogId);
      setDailyLog(dailyLogData);
    };

    fetchDailyLog();
  }, [dailyLogId]);

  if (!dailyLog) return <main>Loading...</main>;

  // dailyLog.userId is populated on the backend (username available)
  const ownerId = dailyLog?.userId?._id || dailyLog?.userId;

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>{dailyLog.mood}</h1>
          <p className={styles.date}>
            <strong>Tracking Date:</strong>{" "}
            {new Date(dailyLog.date).toLocaleDateString()}
          </p>
        </header>

        <div className={styles.list}>
          <p className={styles.item}>
            <strong>Stress Level:</strong> {dailyLog.stressLevel}
          </p>
          <p className={styles.item}>
            <strong>Focus Level:</strong> {dailyLog.focusLevel}
          </p>
          <p className={styles.item}>
            <strong>Sleep Hours:</strong> {dailyLog.sleepHours}
          </p>
          <p className={styles.item}>
            <strong>Exercise Minutes:</strong> {dailyLog.exerciseMin}
          </p>
          <p className={styles.item}>
            <strong>Meditation Minutes:</strong> {dailyLog.meditationMin}
          </p>
          <p className={styles.item}>
            <strong>Water Cups:</strong> {dailyLog.waterCups}
          </p>
          <p className={styles.item}>
            <strong>Diet Score:</strong> {dailyLog.dietScore}
          </p>
          <p className={styles.item}>
            <strong>Screen Hours:</strong> {dailyLog.screenHours}
          </p>
          <p className={styles.item}>
            <strong>Work Hours:</strong> {dailyLog.workHours}
          </p>
          <p className={styles.item}>
            <strong>Hobby Minutes:</strong> {dailyLog.hobbyMin}
          </p>
          <p className={styles.item}>
            <strong>Location:</strong> {dailyLog.location}
          </p>
          <p className={styles.item}>
            <strong>Weather:</strong> {dailyLog.weather}
          </p>

          <p className={`${styles.item} ${styles.notes}`}>
            <strong>Notes:</strong> {dailyLog.notes}
          </p>
        </div>

        {ownerId === user?._id && (
          <div className={styles.actions}>
            <Link className={styles.editLink} to={`/dailylogs/${dailyLogId}/edit`}>
              Edit
            </Link>

            <button
              className={styles.deleteButton}
              onClick={() => handleDeleteDailyLog(dailyLogId)}
              type="button"
            >
              Delete
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

export default DailyLogDetails;



