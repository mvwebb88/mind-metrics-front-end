import { useParams, Link } from "react-router";
import { useState, useEffect } from "react";
import * as goalService from "../../services/goalService";
import styles from "./GoalForm.module.css";

const initialState = {
  title: "",
  description: "",
  targetMetric: "",
  targetValue: "",
  startDate: "",
  endDate: "",
  status: "",
};

const GoalForm = (props) => {
  const { goalId } = useParams();
  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    const fetchGoal = async () => {
      const goalData = await goalService.show(goalId);
      if (goalData?.err) return;

      setFormData({
        ...goalData,
        startDate: goalData.startDate ? goalData.startDate.slice(0, 10) : "",
        endDate: goalData.endDate ? goalData.endDate.slice(0, 10) : "",
      });
    };

    if (goalId) fetchGoal();
    return () => setFormData(initialState);
  }, [goalId]);

  const handleChange = (evt) => {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    const payload = {
      ...formData,
      targetValue: Number(formData.targetValue),
    };

    if (goalId) {
      await props.handleUpdateGoal(goalId, payload);
    } else {
      await props.handleAddGoal(payload);
      setFormData(initialState);
    }
  };

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <header className={styles.header}>
          <h1 className={styles.title}>{goalId ? "Edit Goal" : "New Goal"}</h1>
          <p className={styles.subtitle}>Fill out the details below and submit.</p>
        </header>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="title-input">
              Title
            </label>
            <input
              className={styles.input}
              required
              type="text"
              name="title"
              id="title-input"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="description-input">
              Description
            </label>
            <textarea
              className={styles.textarea}
              required
              name="description"
              id="description-input"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="metric-input">
              Target Metric
            </label>
            <select
              className={styles.select}
              required
              name="targetMetric"
              id="metric-input"
              value={formData.targetMetric}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select option
              </option>
              <option value="Sleep Hours">Sleep Hours</option>
              <option value="Exercise Minutes">Exercise Minutes</option>
              <option value="Meditation Minutes">Meditation Minutes</option>
              <option value="Water Cups">Water Cups</option>
              <option value="Diet Score">Diet Score</option>
              <option value="Screen Minutes">Screen Minutes</option>
              <option value="Work Hours">Work Hours</option>
              <option value="Hobby Minutes">Hobby Minutes</option>
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="targetValue-input">
              Target Value
            </label>
            <input
              className={styles.input}
              required
              type="number"
              name="targetValue"
              id="targetValue-input"
              value={formData.targetValue}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="startDate-input">
              Start Date
            </label>
            <input
              className={styles.input}
              required
              type="date"
              name="startDate"
              id="startDate-input"
              value={formData.startDate}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="endDate-input">
              End Date
            </label>
            <input
              className={styles.input}
              required
              type="date"
              name="endDate"
              id="endDate-input"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="status-input">
              Status
            </label>
            <select
              className={styles.select}
              required
              name="status"
              id="status-input"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select option
              </option>
              <option value="Active">Active</option>
              <option value="Paused">Paused</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className={styles.actions}>
            <button className={styles.action} type="submit">
              Submit
            </button>

            <Link className={styles.action} to="/goals">
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
};

export default GoalForm;
