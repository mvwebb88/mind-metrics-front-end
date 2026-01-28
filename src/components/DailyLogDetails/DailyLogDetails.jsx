import { useParams, Link } from "react-router";
import { useState, useEffect, useContext } from "react";

import * as dailyLogService from "../../services/dailyLogService";
import { UserContext } from "../../contexts/UserContext";

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
    <main>
      <section>
        <header>
          <h1>Daily Log</h1>
          <p>
            {`${dailyLog.userId.username} logged on
            ${new Date(dailyLog.date).toLocaleDateString()}`}
          </p>

          {ownerId === user?._id && (
            <>
              <Link to={`/dailylogs/${dailyLogId}/edit`}>Edit</Link>
              <button onClick={() => handleDeleteDailyLog(dailyLogId)}>
                Delete
              </button>
            </>
          )}
        </header>

        <p>{dailyLog.mood.toUpperCase()}</p>

        <p>
          <strong>Stress Level:</strong> {dailyLog.stressLevel}
        </p>
        <p>
          <strong>Focus Level:</strong> {dailyLog.focusLevel}
        </p>
        <p>
          <strong>Sleep Hours:</strong> {dailyLog.sleepHours}
        </p>
        <p>
          <strong>Exercise Minutes:</strong> {dailyLog.exerciseMin}
        </p>
        <p>
          <strong>Meditation Minutes:</strong> {dailyLog.meditationMin}
        </p>
        <p>
          <strong>Water Cups:</strong> {dailyLog.waterCups}
        </p>
        <p>
          <strong>Diet Score:</strong> {dailyLog.dietScore}
        </p>
        <p>
          <strong>Screen Hours:</strong> {dailyLog.screenHours}
        </p>
        <p>
          <strong>Work Hours:</strong> {dailyLog.workHours}
        </p>
        <p>
          <strong>Hobby Minutes:</strong> {dailyLog.hobbyMin}
        </p>
        <p>
          <strong>Location:</strong> {dailyLog.location}
        </p>
        <p>
          <strong>Weather:</strong> {dailyLog.weather}
        </p>
        <p>
          <strong>Notes:</strong> {dailyLog.notes}
        </p>
      </section>

      <section>
        <Link to="/dailylogs">← Back to Daily Logs</Link>
      </section>
    </main>
  );
};

export default DailyLogDetails;





