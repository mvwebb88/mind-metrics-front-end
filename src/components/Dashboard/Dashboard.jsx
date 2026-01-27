import { useEffect, useContext, useState } from 'react'; // useEffect is useful when getting information from database
import { UserContext } from '../../contexts/UserContext';
import * as dailyLogService from '../../services/dailyLogService';
import * as goalService from '../../services/goalService';

// Import chart components
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const goalRules = {
    sleepHours: "gte",
    exerciseMin: "gte",
    meditationMin: "gte",
    waterCups: "gte",
    dietScore: "gte",
    hobbyMin: "gte",
    workHours: "lte",
    screenHours: "lte",
};

// const fieldLabels = {
//     sleepHours: "Sleep Hours",
//     exerciseMin: "Exercise Minutes",
//     meditationMin: "Meditation Minutes",
//     waterCups: "Water Cups",
//     dietScore: "Diet Score",
//     hobbyMin: "Hobby Minutes",
//     workHours: "Work Hours",
//     screenHours: "Screen Minutes",
// };

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
    const checkDate = (value) => (value instanceof Date ? value : new Date(value));

    // Format a date as MM/DD/YYYY in UTC    
    const formatDate = (date) => {
        const dt = checkDate(date);
        const month = String(dt.getUTCMonth() + 1).padStart(2, '0'); // months are 0-based
        const day = String(dt.getUTCDate()).padStart(2, '0');
        const year = dt.getUTCFullYear();
        return `${month}/${day}/${year}`;
    };

    // Calculate seleted logs for period
    const selectedLogs = [...logs]
        .sort((a, b) => checkDate(b.date) - checkDate(a.date))
        .slice(0, period);

    // Compute averages for stress and focus 
    const stressAvg = selectedLogs.reduce((sum, log) => sum + log.stressLevel, 0) / (selectedLogs.length || 1);
    const focusAvg = selectedLogs.reduce((sum, log) => sum + log.focusLevel, 0) / (selectedLogs.length || 1);

    // Compute averages for all goal fields
    const goalAvgs = {};

    selectedLogs.forEach(log => {
        Object.keys(goalRules).forEach((field) => {
            if (typeof log[field] === "number") {
                if (!goalAvgs[field]) {
                    goalAvgs[field] = { sum: 0, count: 0 };
                }
                goalAvgs[field].sum += log[field];
                goalAvgs[field].count += 1;
            }
        });
    });

    Object.keys(goalAvgs).forEach(field => {
        goalAvgs[field] = goalAvgs[field].count > 0 ? goalAvgs[field].sum / goalAvgs[field].count : null;
    });

    // Filter active goals that overlap with selected period

    if (!selectedLogs.length) {
        return <p>No logs in the selected period.</p>;
    }

    const periodStartDate = checkDate(selectedLogs[selectedLogs.length - 1].date);
    const periodEndDate = checkDate(selectedLogs[0].date);

    const activeGoals = goals.filter((goal) => {
        if (goal.status !== "Active") return false;

        const goalStart = checkDate(goal.startDate);
        const goalEnd = checkDate(goal.endDate);

        return goalStart <= periodEndDate && goalEnd >= periodStartDate;
    });

    // Evaluate goals
    const evaluatedGoals = activeGoals
        .map((goal) => {
            const comparison = goalRules[goal.targetMetric];
            if (!comparison) return null;

            const value = goalAvgs[goal.targetMetric];

            if (value === undefined || value === null) {
                return { ...goal, value: null, met: null }; // Not enough data 
            }

            const met = comparison === "gte" ? value >= goal.targetValue : value <= goal.targetValue;

            return { ...goal, value: Number(value.toFixed(1)), met };
        })
        .filter(Boolean);

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
                {evaluatedGoals.length ? (
                    evaluatedGoals.map(goal => (
                        <div key={goal._id}>
                            <p><strong>{goal.title}</strong></p>

                            {goal.met === null ? (
                                <span> Not enough data</span>
                            ) : goal.met ? (
                                <span> Met</span>
                            ) : (
                                <span> Not met</span>
                            )}

                            {goal.value !== null && (
                                <p>
                                    Avg: {goal.value} / Target: {goal.targetValue}
                                </p>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No active goals in this period.</p>
                )}
            </section>
        </main>
    );
};

export default Dashboard;