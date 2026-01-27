import { useContext } from "react";
import { Link } from "react-router";
import { UserContext } from "../../contexts/UserContext";

const Home = ({ dailyLogs }) => {
  const { user } = useContext(UserContext);

  // Helper function: check if two dates are the same day
  const isSameDay = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Find today's log for the current user
  const todayLog = dailyLogs?.find(
    (log) => log.userId === user?._id && isSameDay(log.date, new Date())
  );

  return (
    <main>
      <h1>Welcome to MindMetrics!</h1>

      {user && (
        <>
          {todayLog ? (
            <Link to={`/dailylogs/${todayLog._id}`}>View Today's Daily Log</Link>
          ) : (
            <Link to="/dailylogs/new">Add Daily Log</Link>
          )}
        </>
      )}
    </main>
  );
};

export default Home;
