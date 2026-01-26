import { useContext, useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router";
import { UserContext } from "./contexts/UserContext";

import NavBar from "./components/NavBar/NavBar";
import SignUpForm from "./components/SignUpForm/SignUpForm";
import SignInForm from "./components/SignInForm/SignInForm";
import Landing from "./components/Landing/Landing";
import Dashboard from "./components/Dashboard/Dashboard";

import DailyLogList from "./components/DailyLogList/DailyLogList";
import DailyLogDetails from "./components/DailyLogDetails/DailyLogDetails";
import DailyLogForm from "./components/DailyLogForm/DailyLogForm";

// NOTE: We only need dailyLogService in App to fetch/update local state.
import * as dailyLogService from "./services/dailyLogService";

const App = () => {
  const { user } = useContext(UserContext);

  const [dailyLogs, setDailyLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState("");

  const navigate = useNavigate();

  // Fetch logs whenever a user is logged in
  useEffect(() => {
    const fetchDailyLogs = async () => {
      // If logged out, clear logs state
      if (!user) {
        setDailyLogs([]);
        setLogsLoading(false);
        setLogsError("");
        return;
      }

      try {
        setLogsLoading(true);
        setLogsError("");

        const data = await dailyLogService.index();

        // Backend returns an array (per your controller)
        const normalized = Array.isArray(data) ? data : data?.dailyLogs || [];
        setDailyLogs(normalized);
      } catch (err) {
        console.error("Failed to fetch daily logs:", err);
        setDailyLogs([]);
        setLogsError(err?.message || "Failed to fetch daily logs.");
      } finally {
        setLogsLoading(false);
      }
    };

    fetchDailyLogs();
  }, [user]);

  // CREATE
  const handleAddDailyLog = async (dailyLogFormData) => {
    try {
      setLogsError("");

      const created = await dailyLogService.create(dailyLogFormData);

      // Put newest on top
      setDailyLogs((prev) => [created, ...prev]);

      navigate("/daily-logs");
    } catch (err) {
      console.error("Failed to create daily log:", err);
      setLogsError(err?.message || "Failed to create daily log.");
    }
  };

  // UPDATE
  const handleUpdateDailyLog = async (dailyLogId, dailyLogFormData) => {
    try {
      setLogsError("");

      const updated = await dailyLogService.updateDailyLog(
        dailyLogId,
        dailyLogFormData
      );

      setDailyLogs((prev) =>
        prev.map((log) => (log._id === dailyLogId ? updated : log))
      );

      navigate(`/daily-logs/${dailyLogId}`);
    } catch (err) {
      console.error("Failed to update daily log:", err);
      setLogsError(err?.message || "Failed to update daily log.");
    }
  };

  // DELETE
  const handleDeleteDailyLog = async (dailyLogId) => {
    try {
      setLogsError("");

      await dailyLogService.deleteDailyLog(dailyLogId);

      setDailyLogs((prev) => prev.filter((log) => log._id !== dailyLogId));

      navigate("/daily-logs");
    } catch (err) {
      console.error("Failed to delete daily log:", err);
      setLogsError(err?.message || "Failed to delete daily log.");
    }
  };

  return (
    <>
      <NavBar />

      <Routes>
        {/* Home */}
        <Route path="/" element={user ? <Dashboard /> : <Landing />} />

        {/* Auth */}
        <Route path="/sign-up" element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />

        {/* Daily Logs */}
        <Route
          path="/daily-logs"
          element={
            <DailyLogList
              dailyLogs={dailyLogs}
              loading={logsLoading}
              error={logsError}
            />
          }
        />

        <Route
          path="/daily-logs/new"
          element={
            <DailyLogForm
              handleAddDailyLog={handleAddDailyLog}
              handleUpdateDailyLog={handleUpdateDailyLog}
            />
          }
        />

        <Route
          path="/daily-logs/:dailyLogId"
          element={
            <DailyLogDetails handleDeleteDailyLog={handleDeleteDailyLog} />
          }
        />

        <Route
          path="/daily-logs/:dailyLogId/edit"
          element={
            <DailyLogForm
              handleAddDailyLog={handleAddDailyLog}
              handleUpdateDailyLog={handleUpdateDailyLog}
            />
          }
        />
      </Routes>
    </>
  );
};

export default App;


