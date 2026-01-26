import { Link } from "react-router";

const GoalList = ({ goals = [] }) => {
    return (
        <main>
            <h1>Goals</h1>

            <Link to="/goals/new">Add New Goal</Link>

            <h2>Goal List</h2>

            {goals.length === 0 ? (
                <p>You dont have goals yet</p>
            ) : (
                goals.map((goal) => (
                    <article key={goal._id}>
                        <h2>
                            <Link to={`/goals/${goal._id}`}>{goal.title}</Link>
                        </h2>
                    </article>
                ))
            )}
        </main>
    );
};

export default GoalList;
