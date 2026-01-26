import { useEffect, useContext, useState } from 'react'; // useEffect is useful when getting information from database
import { UserContext } from '../../contexts/UserContext';
import * as dailyLogService from '../../services/dailyLogService';
import * as goalService from '../../services/goalService';

// Import chart components
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

    // Check if the input date is type Date or type String
    // The type is set to Date in the schema, but this check is good for inputs via Postman
    const checkDate = (value) => {
        return value instanceof Date ? value : new Date(value);
    };

    // Format a date as MM/DD/YYYY in UTC    
    const formatDate = (date) => {
        const d = checkDate(date);
        const month = String(d.getUTCMonth() + 1).padStart(2, '0'); // months are 0-based
        const day = String(d.getUTCDate()).padStart(2, '0');
        const year = d.getUTCFullYear();
        return `${month}/${day}/${year}`;
    };

    // Get UTC start date for filtering logs by period
    const getStartDateUTC = (period) => {
        const today = new Date();
        return new Date(Date.UTC(
            today.getUTCFullYear(),
            today.getUTCMonth(),
            today.getUTCDate() - period + 1 // +1 includes today
        ));
    };

    // Calculate start date in UTC
    const startDate = getStartDateUTC(period);

    // Filter logs for selected period
    const selectedLogs = logs
        .filter(log => {
            const logDate = checkDate(log.date);
            return logDate >= startDate;
        })
        .sort((a, b) => checkDate(b.date) - checkDate(a.date));

    // Compute averages
    const stressAvg = selectedLogs.reduce((sum, log) => sum + log.stressLevel, 0) / (selectedLogs.length || 1);
    const focusAvg = selectedLogs.reduce((sum, log) => sum + log.focusLevel, 0) / (selectedLogs.length || 1);

    // Chart data for selected logs    
    const chartData = selectedLogs
        .map(log => ({
            date: formatDate(log.date),
            Stress: log.stressLevel,
            Focus: log.focusLevel,
        }))
        .reverse(); // chronological order

    return (
        <main>
            <h1>{user.username}'s Analytics</h1>

            {/* Set period for analytics */}
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

            {/* Show stress and focus chart to identify trends during selected period */}
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

            {/* Show selected daily logs */}
            <section>
                <h2>Daily Logs</h2>
                {selectedLogs.length ? (
                    selectedLogs.map(log => (
                        <div key={log._id}>
                            <p>Date: {formatDate(log.date)}</p>
                            <p>Mood: {log.mood}</p>
                            <p>Stress: {log.stressLevel}</p>
                            <p>Focus: {log.focusLevel}</p>
                        </div>
                    ))
                ) : (
                    <p>No logs in the selected period.</p>
                )}
            </section>

            {/* Show goals */}
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

