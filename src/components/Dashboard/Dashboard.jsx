import { useEffect, useContext, useState } from 'react'; // useEffect is useful when getting information from database
import { UserContext } from '../../contexts/UserContext';
import * as dailyLogService from '../../services/dailyLogService';
import * as goalService from '../../services/goalService';
import DashboardView from '../DashboardView/DashboardView';

const goalRules = {
    "Sleep Hours": { field: "sleepHours", comparison: "gte" },
    "Exercise Minutes": { field: "exerciseMin", comparison: "gte" },
    "Meditation Minutes": { field: "meditationMin", comparison: "gte" },
    "Water Cups": { field: "waterCups", comparison: "gte" },
    "Diet Score": { field: "dietScore", comparison: "gte" },
    "Hobby Minutes": { field: "hobbyMin", comparison: "gte" },
    "Work Hours": { field: "workHours", comparison: "lte" },
    "Screen Minutes": { field: "screenHours", comparison: "lte" },
};

const recommendationRules = [
    {
        field: "stressLevel",
        condition: value => value > 3.5,
        message: "Your stress levels have been high recently. Try relaxation techniques or meditation."
    },
    {
        field: "focusLevel",
        condition: value => value < 3,
        message: "Your focus has been low. Consider minimizing distractions and taking short breaks."
    },
    {
        field: "sleepHours",
        condition: value => value < 7,
        message: "You're not getting enough sleep. Aim for 7-9 hours per night."
    },
    {
        field: "exerciseMin",
        condition: value => value < 20,
        message: "Your exercise has been low. Try to be active at least 20 minutes daily."
    },
    {
        field: "waterCups",
        condition: value => value < 6,
        message: "Remember to stay hydrated! Drink at least 6 cups of water per day."
    },
    {
        field: "screenHours",
        condition: value => value > 4,
        message: "Screen time is high. Take breaks from your devices to rest your eyes."
    },
];

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

    if (!selectedLogs.length) {
        return <p>No logs in the selected period.</p>;
    }

    // Compute stress and focus averages
    const stressAvg = selectedLogs.reduce((sum, log) => sum + log.stressLevel, 0) / (selectedLogs.length || 1);
    const focusAvg = selectedLogs.reduce((sum, log) => sum + log.focusLevel, 0) / (selectedLogs.length || 1);

    // Compute averages for all goal fields
    const goalAvgs = {};

    selectedLogs.forEach(log => {
        Object.values(goalRules).forEach(({ field }) => {
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

    // Recommendations based on recent daily logs
    const recommendations = [];
    recommendationRules.forEach(rule => {
        let value;
        if (rule.field === "stressLevel") value = stressAvg;
        else if (rule.field === "focusLevel") value = focusAvg;
        else value = goalAvgs[rule.field]; // sleep, exercise, water, screen

        if (value !== null && value !== undefined && rule.condition(value)) {
            recommendations.push(rule.message);
        }
    });

    // Filter active goals for the selected period
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
            const rule = goalRules[goal.targetMetric];
            if (!rule) return null;

            const { field, comparison } = rule;
            const value = goalAvgs[field];

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
        <DashboardView
            user={user}
            period={period}
            setPeriod={setPeriod}
            stressAvg={stressAvg}
            focusAvg={focusAvg}
            chartData={chartData}
            selectedLogs={selectedLogs}
            evaluatedGoals={evaluatedGoals}
            recommendations={recommendations}
            formatDate={formatDate}
        />
    );
};

export default Dashboard;