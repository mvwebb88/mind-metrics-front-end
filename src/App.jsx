import { useContext, useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router';
import { UserContext } from './contexts/UserContext';

import NavBar from './components/NavBar/NavBar';
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import Home from './components/Home/Home';
// import DailyLogList from './components/DailyLogList/DailyLogList';
// import DailyLogDetails from './components/DailyLogDetails/DailyLogDetails';
// import DailyLogForm from './components/DailyLogForm/DailyLogForm';
import GoalList from './components/GoalList/GoalList';
import GoalDetails from './components/GoalDetails/GoalDetails';
import GoalForm from './components/GoalForm/GoalForm';
// import * as dailyLogService from './services/dailyLogService';
import * as goalService from './services/goalService';


const App = () => {

  const { user } = useContext(UserContext);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const fetchGoals = async () => {
      if (!user) return;
      const data = await goalService.index();
      setGoals(data);
    };
    fetchGoals();
  }, [user]);

//crear
  const handleAddGoal = async (goalFormData) => {
    const newGoal = await goalService.create(goalFormData);
    setGoals([newGoal, ...goals]);
  };
  
  const handleDeleteGoal = async (goalId) => {
    await goalService.deleteGoal(goalId);
    setGoals(goals.filter((g) => g._id !== goalId));
  };
//edit
  const handleUpdateGoal = async (goalId, goalFormData) => {
    const updatedGoal = await goalService.updateGoal(goalId, goalFormData);
    setGoals(goals.map((g) => (g._id === goalId ? updatedGoal : g)));
  };

  return (
    <>
      <NavBar />
      <Routes>
        {/* <Route path='/' element={user ? <Dashboard /> : <Landing /> } /> */}
        <Route path='/' element={user ? <Home /> : <Landing /> } /> 
        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path="/sign-in" element={<SignInForm />} />

        <Route path="/goals" element={<GoalList goals={goals} />} />
        <Route path="/goals/new"element={<GoalForm handleAddGoal={handleAddGoal} handleUpdateGoal={handleUpdateGoal} />} />
        <Route path="/goals/:goalId" element={<GoalDetails handleDeleteGoal={handleDeleteGoal} />} />
        <Route path="/goals/:goalId/edit"element={<GoalForm handleAddGoal={handleAddGoal} handleUpdateGoal={handleUpdateGoal} />} />


        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/sign-in" />} />
      </Routes>
    </>
  );
};

export default App;