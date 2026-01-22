import { useEffect, useContext, useState } from 'react'; // useEffect is useful when getting information from database
import { UserContext } from '../../contexts/UserContext';
import * as dailyLogService from '../../services/dailyLogService';
import * as goalService from '../../services/goalService';

const Dashboard = () => {
    const { user } = useContext(UserContext);
    const [logs, setLogs] = useState([]);
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <main>
            <h1>{user.username}'s Analytics</h1>

            <section>
                <h2>Recent Daily Logs</h2>
                {logs.length ? (
                    logs.map(log => (
                        <div key={log._id}>
                            <p>Date: {new Date(log.date).toLocaleDateString()}</p>
                            <p>Stress: {log.stressLevel}</p>
                            <p>Focus: {log.focusLevel}</p>
                        </div>
                    ))
                ) : (
                    <p>No logs yet.</p>
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

