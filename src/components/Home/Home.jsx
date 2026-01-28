import { useContext } from "react";
import { Link } from "react-router";
import { UserContext } from "../../contexts/UserContext";


const Home = ({ dailyLogs }) => {
    const { user } = useContext(UserContext);

    // Format a date for comparison (YYYY-MM-DD)
    const formatYMD = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    // Format a date for display (m/d/y)
    const formatMDY = (date) => {
        const d = new Date(date);
        const month = d.getMonth() + 1;
        const day = d.getDate();
        const year = d.getFullYear();
        return `${month}/${day}/${year}`;
    };

    const today = formatYMD(new Date());


    const todayLog = dailyLogs?.find((log) => {
        if (!log.date || !user) return false;

        const logUserId = log.userId?._id || log.userId;
        const logDateYMD = formatYMD(log.date);
        console.log({ logDateYMD });
        console.log({ today });

        return String(logUserId) === String(user._id) && logDateYMD === today;
    });

    return (
        <main>
            <h1>Welcome to MindMetrics!</h1>

            {user && (
                <>
                    {todayLog ? (
                        <Link to={`/dailylogs/${todayLog._id}`}>
                            View Today's Daily Log ({formatMDY(todayLog.date)})
                        </Link>
                    ) : (
                        <Link to="/dailylogs/new">Add Daily Log</Link>
                    )}
                </>
            )}
        </main>
    );
};

export default Home;
