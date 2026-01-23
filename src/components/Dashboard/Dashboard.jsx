import { useEffect, useContext, useState } from 'react'; // useEffect is useful when getting information from database
import { UserContext } from '../../contexts/UserContext';
import * as dailyLogService from '../../services/dailyLogService';
import * as goalService from '../../services/goalService';

// Import chart components
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { RechartsDevtools } from '@recharts/devtools';

const Dashboard = () => {
    const { user } = useContext(UserContext);
    const [logs, setLogs] = useState([]);
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState(7); // dafault period: last 7 days

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Use Promise.all to fetch multiple pieces of data at once
                const [logData, goalData] = await Promise.all([
                    dailyLogService.index(),
                    goalService.index(),
                ]);

                setLogs(logData);
                setGoals(goalData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchData();
    }, [user]);

    if (!user) return null;
    if (loading) return <p>Loading dashboard...</p>;

    // Calculate start date based on selected period
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    // Filter logs for selected period
    const selectedLogs = logs
        .filter(log => new Date(log.date) >= startDate)
        .sort((a, b) => new Date(b.date) - new Date(a.date)); // show the most recent first

    // Compute averages
    const stressAvg =
        selectedLogs.reduce((sum, log) => sum + log.stressLevel, 0) / (selectedLogs.length || 1);

    const focusAvg =
        selectedLogs.reduce((sum, log) => sum + log.focusLevel, 0) / (selectedLogs.length || 1);

    // Chart data for selected logs    
    const chartData = selectedLogs
        .map(log => ({
            date: new Date(log.date).toLocaleDateString(), // or just day number
            Stress: log.stressLevel,
            Focus: log.focusLevel,
        }))
        .reverse(); // chronological order

    return (
        <main>
            <h1>{user.username}'s Analytics</h1>

            <section>
                <label>
                    Show logs from last{' '}
                    <select value={period} onChange={evt => setPeriod(Number(evt.target.value))}>
                        <option value={3}>3 Days</option>
                        <option value={7}>7 Days</option>
                        <option value={14}>14 Days</option>
                        <option value={30}>30 Days</option>
                    </select>
                </label>
            </section>

            {/* Show averages */}
            <p>Average Stress: {stressAvg.toFixed(1)}</p>
            <p>Average Focus: {focusAvg.toFixed(1)}</p>

            {/* Show stress and focus chart */}
            <section>
                <h2>Stress & Focus Trends</h2>
                {chartData.length ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 5]} /> {/* stress/focus between 0-5 */}
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="Stress" stroke="#FF4C4C" />
                            <Line type="monotone" dataKey="Focus" stroke="#4C9AFF" />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <p>No logs to display in chart.</p>
                )}
            </section>

            <section>
                <h2>Daily Logs</h2>
                {selectedLogs.length ? (
                    logs.map(log => (
                        <div key={log._id}>
                            <p>Date: {new Date(log.date).toLocaleDateString()}</p>
                            <p>Mood: {log.mood}</p>
                            <p>Stress: {log.stressLevel}</p>
                            <p>Focus: {log.focusLevel}</p>
                        </div>
                    ))
                ) : (
                    <p>No logs in the selected period.</p>
                )}
            </section>

            <section>
                <h2>Your Goals</h2>
                {goals.length ? (
                    goals.map(goal => (
                        <p key={goal._id}>{goal.title}</p>
                    ))
                ) : (
                    <p>No goals yet.</p>
                )}
            </section>
        </main>
    );
};

export default Dashboard;

