import { Link } from "react-router";
import { useState } from "react";
import styles from "./GoalList.module.css";


const GoalList = ({ goals = [] }) => {

  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredGoals =
    statusFilter === "ALL"
      ? goals
      : goals.filter((goal) => goal.status === statusFilter);

      return (
        <main className={styles.page}>
          <header className={styles.header}>
            <div>
              <h1 className={styles.title}>Goals</h1>
            </div>
    
            <Link className={styles.buttonPrimary} to="/goals/new">
              + New Goal
            </Link>
          </header>
    
          <section className={styles.toolbar}>
            <div className={styles.filterGroup}>
              <label className={styles.label} htmlFor="status-filter">
                Filter by status
              </label>
    
              <select
                className={styles.select}
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="ALL">All</option>
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </section>
    
    
          {filteredGoals.length === 0 ? (
            <p className={styles.empty}>No goals found.</p>
          ) : (
            <section className={styles.grid}>
              {filteredGoals.map((goal) => (
                <article className={styles.card} key={goal._id}>
                  <h3 className={styles.cardTitle}>
                    <Link className={styles.link} to={`/goals/${goal._id}`}>
                      {goal.title}
                    </Link>
                  </h3>
    
                  <p className={styles.meta}>
                    {goal.targetMetric} → <strong>{goal.targetValue}</strong> |{" "}
                    {goal.status}
                  </p>
                </article>
              ))}
            </section>
          )}
        </main>
      );
    };

export default GoalList;
