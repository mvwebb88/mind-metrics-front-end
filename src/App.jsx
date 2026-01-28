import { useContext, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router';
import { UserContext } from './contexts/UserContext';

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import Home from './components/Home/Home';
import DailyLogList from './components/DailyLogList/DailyLogList';
import DailyLogDetails from './components/DailyLogDetails/DailyLogDetails';
import DailyLogForm from './components/DailyLogForm/DailyLogForm';
import GoalList from './components/GoalList/GoalList';
import GoalDetails from './components/GoalDetails/GoalDetails';
import GoalForm from './components/GoalForm/GoalForm';
import * as dailyLogService from './services/dailyLogService';
import * as goalService from './services/goalService';

const App = () => {

  const { user } = useContext(UserContext);

  const [dailyLogs, setDailyLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState("");

  const [goals, setGoals] = useState([]);

  const navigate = useNavigate();

  // Fetch daily logs and goals whenever a user is logged in
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

    const fetchGoals = async () => {
      if (!user) return;
      const data = await goalService.index();
      setGoals(data);
    };

    fetchDailyLogs();
    fetchGoals();
  }, [user]);

  // CREATE daily log
  const handleAddDailyLog = async (dailyLogFormData) => {
    try {
      setLogsError("");

      // Convert the date string from form to UTC Date
      const payload = { ...dailyLogFormData };
      if (payload.date) {
        const [year, month, day] = payload.date.split("-");
        payload.date = new Date(year, month - 1, day);
      }

      const created = await dailyLogService.create(payload);

      // Put newest on top
      setDailyLogs((prev) => [created, ...prev]);

      navigate("/dailylogs");
    } catch (err) {
      console.error("Failed to create daily log:", err);
      setLogsError(err?.message || "Failed to create daily log.");
    }
  };

  // UPDATE daily log
  const handleUpdateDailyLog = async (dailyLogId, dailyLogFormData) => {
    try {
      setLogsError("");

      // Convert the date string from form to UTC Date
      const payload = { ...dailyLogFormData };
      if (payload.date) {
        const [year, month, day] = payload.date.split("-");
        payload.date = new Date(year, month - 1, day);
      }

      const updated = await dailyLogService.updateDailyLog(
        dailyLogId,
        payload
      );

      setDailyLogs((prev) =>
        prev.map((log) => (log._id === dailyLogId ? updated : log))
      );

      navigate(`/dailylogs/${dailyLogId}`);
    } catch (err) {
      console.error("Failed to update daily log:", err);
      setLogsError(err?.message || "Failed to update daily log.");
    }
  };

  // DELETE daily log
  const handleDeleteDailyLog = async (dailyLogId) => {
    try {
      setLogsError("");

      await dailyLogService.deleteDailyLog(dailyLogId);

      setDailyLogs((prev) => prev.filter((log) => log._id !== dailyLogId));

      navigate("/dailylogs");
    } catch (err) {
      console.error("Failed to delete daily log:", err);
      setLogsError(err?.message || "Failed to delete daily log.");
    }
  };

  // CREATE goal
  const handleAddGoal = async (goalFormData) => {
    const newGoal = await goalService.create(goalFormData);
    setGoals([newGoal, ...goals]);
    navigate('/goals');
  };

  // DELETE goal
  const handleDeleteGoal = async (goalId) => {
    await goalService.deleteGoal(goalId);
    setGoals(goals.filter((g) => g._id !== goalId));
    navigate('/goals');
  };

  // UPDATE goal
  const handleUpdateGoal = async (goalId, goalFormData) => {
    const updatedGoal = await goalService.updateGoal(goalId, goalFormData);
    setGoals(goals.map((g) => (g._id === goalId ? updatedGoal : g)));
    navigate(`/goals/${goalId}`);
  };

  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={user ? <Home dailyLogs={dailyLogs}/> : <Landing />} />
        {user ? (
          <>
            {/* Protected routes (available only to signed-in users) */}

            {/* Goal routes */}
            <Route path="/goals" element={<GoalList goals={goals} />} />
            <Route path="/goals/new" element={<GoalForm handleAddGoal={handleAddGoal} handleUpdateGoal={handleUpdateGoal} />} />
            <Route path="/goals/:goalId" element={<GoalDetails handleDeleteGoal={handleDeleteGoal} />} />
            <Route path="/goals/:goalId/edit" element={<GoalForm handleAddGoal={handleAddGoal} handleUpdateGoal={handleUpdateGoal} />} />
            {/* Daily log routes */}
            <Route path="/dailylogs" element={<DailyLogList dailyLogs={dailyLogs} loading={logsLoading} error={logsError} />} />
            <Route path="/dailylogs/new" element={<DailyLogForm handleAddDailyLog={handleAddDailyLog} handleUpdateDailyLog={handleUpdateDailyLog} />} />
            <Route path="/dailylogs/:dailyLogId" element={<DailyLogDetails handleDeleteDailyLog={handleDeleteDailyLog} />} />
            <Route path="/dailylogs/:dailyLogId/edit" element={<DailyLogForm handleAddDailyLog={handleAddDailyLog} handleUpdateDailyLog={handleUpdateDailyLog} />} />
            {/* Dashboard route */}
            <Route path="/dashboard" element={<Dashboard />} />
          </>
        ) : (
          <>
            {/* Non-user routes (Auth) */}
            <Route path='/sign-up' element={<SignUpForm />} />
            <Route path="/sign-in" element={<SignInForm />} />
          </>
        )}
      </Routes>
    </>
  );
};

export default App;