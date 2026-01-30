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

const moodCategories = {
    positive: ["Happy", "Calm", "Confident", "Excited", "Motivated"],
    negative: ["Sad", "Frustrated", "Stressed", "Anxious", "Angry", "Depressed", "Emotional"],
};

const recommendationRules = [
    {
        field: "stressLevel",
        condition: value => value > 3.5,
        message: "Your stress levels have been high recently. Try relaxation techniques or meditation!"
    },
    {
        field: "focusLevel",
        condition: value => value < 3,
        message: "Your focus has been low. Consider minimizing distractions and taking short breaks!"
    },
    {
        field: "sleepHours",
        condition: value => value < 7,
        message: "You're not getting enough sleep. Aim for 7-9 hours per night!"
    },
    {
        field: "exerciseMin",
        condition: value => value < 20,
        message: "Your exercise has been low. Try to be active at least 20 minutes daily!"
    },
    {
        field: "waterCups",
        condition: value => value < 6,
        message: "Remember to stay hydrated! Drink at least 6 cups of water per day!"
    },
    {
        field: "screenHours",
        condition: value => value > 4,
        message: "Screen time is high. Take breaks from your devices to rest your eyes!"
    },
    {
        field: "workHours",
        condition: value => value > 9,
        message: "You've been overworking. Try to keep a better worklife balance!"
    },
    {
        field: "dietScore",
        condition: value => value < 3,
        message: "Your diet hasn't been great. Try to opt for more healthy and fresh meals!"
    },
    {
        field: "hobbyMin",
        condition: value => value < 15,
        message: "You haven't spent much time on hobbies. Try to make more time for yourself!"
    },
    {
        field: "meditationMin",
        condition: value => value < 10,
        message: "You haven't meditated much. Try spending at least 10 minutes on mindfulness or meditation!"
    }
];

const weatherCategories = {
    good: ["Sunny", "Clear", "Partly cloudy"],
    neutral: ["Cloudy", "Overcast", "Mist", "Fog", "Freezing fog"],
    rain: [
        "Patchy rain possible", "Patchy light rain", "Light rain",
        "Moderate rain", "Heavy rain", "Light rain shower",
        "Moderate or heavy rain shower", "Torrential rain shower",
        "Patchy light rain with thunder", "Moderate or heavy rain with thunder"
    ],
    snow: [
        "Patchy snow possible", "Light snow", "Moderate snow", "Heavy snow",
        "Blizzard", "Ice pellets", "Light sleet", "Moderate or heavy sleet",
        "Patchy light snow", "Patchy moderate snow", "Patchy heavy snow",
        "Light snow showers", "Moderate or heavy snow showers"
    ],
    extreme: [
        "Thundery outbreaks possible",
        "Freezing drizzle",
        "Moderate or heavy freezing rain",
        "Heavy freezing drizzle",
        "Blowing snow"
    ]
};

const weatherInsights = {
    good: [
        "The weather looks great today 🌞 Perfect time to get outside!",
        "Beautiful weather today! Take advantage of it!",
        "Clear skies ahead. A great day to move your body or relax outdoors."
    ],
    neutral: [
        "The weather is calm and mild today.",
        "A quiet weather day. Perfect for staying focused!",
        "Not too exciting out there, but great for productivity."
    ],
    rain: [
        "Looks rainy today ☔ Maybe a good day for indoor activities.",
        "Rainy weather. Stay cozy and take care!",
        "You might want an umbrella today!"
    ],
    snow: [
        "Snowy conditions today ❄️ Stay warm and be careful outside.",
        "Winter vibes today. Dress warmly!",
        "Snow is in the air. Take it slow out there."
    ],
    extreme: [
        "Severe weather conditions today ⚠️ Best to stay indoors if possible.",
        "Weather looks rough. Prioritize safety today.",
        "Challenging weather conditions. Take extra care!"
    ]
};

const Dashboard = () => {
    const { user } = useContext(UserContext);
    const [logs, setLogs] = useState([]);
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState(3); // dafault period: last 3 days
    // State variables for weather API
    const [latestLog, setLatestLog] = useState(null);
    const [weather, setWeather] = useState(null);

    useEffect(() => {

        if (!user) return;

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

        // Weather API
        const fetchLatest = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACK_END_SERVER_URL}/dashboard/latest`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await res.json();
                console.log({ data })
                setLatestLog(data.latestLog);
                setWeather(data.weather);
            } catch (err) {
                console.error("Failed to fetch dashboard:", err);
            }
        };

        fetchData();
        fetchLatest();

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

    // Show only the logged-in user's data
    const userLogs = logs.filter((log) => String(log.userId?._id || log.userId) === String(user._id));
    const userGoals = goals.filter((goal) => String(goal.userId?._id || goal.userId) === String(user._id));

    if (!userLogs.length) return <p>No dashboard data available yet. Start by adding a daily log!</p>;

    // Calculate seleted logs for period
    const selectedLogs = [...userLogs]
        .sort((a, b) => checkDate(b.date) - checkDate(a.date))
        .slice(0, period);

    if (!selectedLogs.length) {
        return <p>No daily logs in the selected period.</p>;
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

    // Recommendations based on selected daily logs
    const recommendations = [];
    recommendationRules.forEach(rule => {
        let value;
        if (rule.field === "stressLevel") value = stressAvg;
        else if (rule.field === "focusLevel") value = focusAvg;
        else value = goalAvgs[rule.field]; // daily habits

        if (value !== null && value !== undefined && rule.condition(value)) {
            recommendations.push(rule.message);
        }
    });

    // Mood-based insights
    const moodCounts = selectedLogs.reduce(
        (acc, log) => {
            if (moodCategories.positive.includes(log.mood)) acc.positive += 1;
            else if (moodCategories.negative.includes(log.mood)) acc.negative += 1;
            return acc;
        },
        { positive: 0, negative: 0 }
    );
    const totalMoods = selectedLogs.length;
    const moodPercents = {
        positive: (moodCounts.positive / totalMoods) * 100,
        negative: (moodCounts.negative / totalMoods) * 100,
    };

    const moodInsights = [];
    if (moodPercents.negative > 50) {
        moodInsights.push("Your moods have been mostly negative recently. Take a moment to review your daily habits to see what might improve your mood!");
    } else if (moodPercents.positive > 50) {
        moodInsights.push("You've been feeling mostly positive. Keep up the good mood!");
    }
    recommendations.push(...moodInsights);

    // Filter active goals for the selected period
    const periodStartDate = checkDate(selectedLogs[selectedLogs.length - 1].date);
    const periodEndDate = checkDate(selectedLogs[0].date);

    const activeGoals = userGoals.filter((goal) => {
        if (goal.status !== "Active") return false;

        const goalStart = checkDate(goal.startDate);
        const goalEnd = checkDate(goal.endDate);

        return goalStart <= periodEndDate && goalEnd >= periodStartDate;
    });

    // Evaluate goals
    const evaluatedGoals = activeGoals.map((goal) => {
        const rule = goalRules[goal.targetMetric];
        if (!rule) return null;

        const { field, comparison } = rule;
        const value = goalAvgs[field];

        if (value === undefined || value === null) return { ...goal, value: null, met: null }; // Not enough data 

        const met = comparison === "gte" ? value >= goal.targetValue : value <= goal.targetValue;

        return { ...goal, value: Number(value.toFixed(1)), met };
    })
        .filter(Boolean);

    // Chart data for selected logs    
    const chartData = selectedLogs.map(log => ({
        date: formatDate(log.date),
        Stress: log.stressLevel,
        Focus: log.focusLevel,
    }))
        .reverse(); // chronological order


    // Weather Insights
    const getWeatherInsight = (condition) => {
        if (!condition) return null;

        const normalized = condition.trim().toLowerCase();

        const category = Object.entries(weatherCategories)
            .find(([_, conditions]) =>
                conditions.some(c => c.toLowerCase() === normalized)
            )?.[0];

        if (!category) return "Weather conditions are a bit unusual today.";

        const messages = weatherInsights[category];
        return messages[Math.floor(Math.random() * messages.length)];
    };

    // Weather message
    const weatherMessage = weather?.condition
        ? getWeatherInsight(weather.condition)
        : null;

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
            latestLog={latestLog} // for weather API
            weather={weather} // for weather API
            weatherMessage={weatherMessage} 
        />
    );
};

export default Dashboard;