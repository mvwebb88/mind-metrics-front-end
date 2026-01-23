import { Link } from "react-router";
import GoalForm from "../GoalForm/GoalForm";

const GoalList = ({ goals = [], handleAddGoal, handleUpdateGoal }) => {
  return (
    <main>
      <h1>Goals</h1>

      {/* New Goal FORM inside the list page */}
      <GoalForm
        handleAddGoal={handleAddGoal}
        handleUpdateGoal={handleUpdateGoal}
      />

      <hr />

      {/* Goals list */}
      {goals.length === 0 ? (
        <p>No goals yet.</p>
      ) : (
        goals.map((goal) => (
          <article key={goal._id}>
            <header>
              {/* Click title -> details */}
              <h2>
                <Link to={`/goals/${goal._id}`}>{goal.title}</Link>
              </h2>

              <p>{`${goal.targetMetric} → ${goal.targetValue} | ${goal.status}`}</p>
              <p>{`Created on ${new Date(goal.createdAt).toLocaleDateString()}`}</p>
            </header>

            <p>{goal.description}</p>
          </article>
        ))
      )}
    </main>
  );
};

export default GoalList;

