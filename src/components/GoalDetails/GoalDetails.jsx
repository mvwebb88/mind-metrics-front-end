import { useParams, Link, useNavigate } from "react-router";
import { useState, useEffect, useContext } from "react";
import * as goalService from "../../services/goalService";
import { UserContext } from "../../contexts/UserContext";
import styles from "./GoalDetails.module.css";

const GoalDetails = (props) => {
    const { goalId } = useParams();
    const navigate = useNavigate();
    const [goal, setGoal] = useState(null);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchGoal = async () => {
            const goalData = await goalService.show(goalId);
            setGoal(goalData);
        };
        fetchGoal();
    }, [goalId]);

    if (!goal) return <main className={styles.page}>Loading...</main>;

    if (goal.err) return <main className={styles.page}>{goal.err}</main>;

    const isOwner = goal.userId === user._id;

    const handleDelete = async () => {
        await props.handleDeleteGoal(goalId);
        navigate("/goals");
    };

    const badgeClass = () => {
        if (goal.status === "Active")
            return `${styles.badge} ${styles.badgeActive}`;
        if (goal.status === "Paused")
            return `${styles.badge} ${styles.badgePaused}`;
        if (goal.status === "Completed")
            return `${styles.badge} ${styles.badgeCompleted}`;
        return styles.badge;
    };

    return (
        <main className={styles.page}>
            <section className={styles.card}>
                <header className={styles.header}>
                    <div>
                        <h1 className={styles.title}>{goal.title}</h1>
                        <p className={styles.subtitle}>
                            Created on{" "}
                            {new Date(goal.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    <span className={badgeClass()}>{goal.status}</span>
                </header>

                <p className={styles.description}>{goal.description}</p>

                <section className={styles.section}>
                    <div className={styles.row}>
                        <div className={styles.label}>Metric</div>
                        <div className={styles.value}>{goal.targetMetric}</div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.label}>Target</div>
                        <div className={styles.value}>{goal.targetValue}</div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.label}>Start</div>
                        <div className={styles.value}>
                            {new Date(goal.startDate).toLocaleDateString()}
                        </div>
                    </div>
                    <div className={styles.row}>
                        <div className={styles.label}>End</div>
                        <div className={styles.value}>
                            {new Date(goal.endDate).toLocaleDateString()}
                        </div>
                    </div>
                </section>

                {isOwner && (
                    <div className={styles.actions}>
                    <Link className={styles.action} to={`/goals/${goalId}/edit`}>Edit</Link>
                    <Link className={styles.action} type="button" onClick={handleDelete}>Delete</Link>
                  </div>
                  
                )}
            </section>
        </main>
    );
};

export default GoalDetails;
