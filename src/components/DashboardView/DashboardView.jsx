// Import chart components
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardView = ({
    user,
    period,
    setPeriod,
    stressAvg,
    focusAvg,
    chartData,
    selectedLogs,
    evaluatedGoals,
    recommendations,
    formatDate
}) => {
    return (
        <main>
            <h1>{user.username}'s Analytics</h1>

            {/* Set period */}
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

            {/* Stress & Focus Chart */}
            <section>
                <h2>Stress & Focus Trends</h2>
                {chartData.length ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 5]} />
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

            {/* Daily Logs */}
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

            {/* Goals */}
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
                                <p> Avg: {goal.value} / Target: {goal.targetValue} </p>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No active goals in this period.</p>
                )}
            </section>

            {/* Recommendations */}
            <section>
                <h2>Recommendations</h2>
                {recommendations.length ? (
                    <ul>
                        {recommendations.map((rec, idx) => (
                            <li key={idx}>{rec}</li>
                        ))}
                    </ul>
                ) : (
                    <p>Great job! No major recommendations at the moment.</p>
                )}
            </section>
        </main>
    );
};

export default DashboardView;
