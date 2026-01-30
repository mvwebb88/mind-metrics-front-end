import { useState, useEffect } from "react";
import { useParams } from "react-router";

import * as dailyLogService from "../../services/dailyLogService";
import styles from "./DailyLogForm.module.css";

// Helper function to convert backend Date to local YYYY-MM-DD for input type="date"
const toLocalDateInput = (date) => {
  const dt = new Date(date);
  const year = dt.getFullYear();
  const month = String(dt.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(dt.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const MOODS = [
  "Happy",
  "Calm",
  "Confident",
  "Excited",
  "Motivated",
  "Sad",
  "Frustrated",
  "Stressed",
  "Anxious",
  "Emotional",
  "Angry",
  "Depressed",
];

const makeRange = (start, end, step = 1) => {
  const nums = [];
  for (let i = start; i <= end; i += step) nums.push(i);
  return nums;
};

const sleepHoursOptions = makeRange(0, 24, 1);
const stressFocusOptions = [1, 2, 3, 4, 5];
const waterCupsOptions = makeRange(0, 22, 1);
const screenWorkOptions = makeRange(0, 24, 1);
const dietScoreOptions = [1, 2, 3, 4, 5];

const initialState = {
  date: "",
  mood: "",
  stressLevel: "",
  focusLevel: "",
  sleepHours: "",
  exerciseMin: "",
  meditationMin: "",
  waterCups: "",
  dietScore: "",
  screenHours: "",
  workHours: "",
  hobbyMin: "",
  location: "",
  weather: "",
  notes: "",
};

const DailyLogForm = ({ handleAddDailyLog, handleUpdateDailyLog }) => {
  const { dailyLogId } = useParams();
  console.log("dailyLogId:", dailyLogId);

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (!dailyLogId) return;

    const fetchDailyLog = async () => {
      const dailyLogData = await dailyLogService.show(dailyLogId);

      // Convert Date to YYYY-MM-DD for date input
      const dateStr = dailyLogData?.date
        ? toLocalDateInput(dailyLogData.date)
        : "";

      setFormData({
        ...dailyLogData,
        date: dateStr,
      });
    };

    if (dailyLogId) fetchDailyLog();
  }, [dailyLogId]);

  // ✅ Needed because your JSX uses onChange={handleChange}
  // (This matches your original functionality: update form state from inputs)
  const handleChange = (evt) => {
    const { name, value } = evt.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    const payload = { ...formData };

    // don’t send userId back
    delete payload.userId;

    if (dailyLogId) {
      handleUpdateDailyLog(dailyLogId, payload);
    } else {
      handleAddDailyLog(payload);
    }
  };

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>
        {dailyLogId ? "Edit Daily Log" : "New Daily Log"}
      </h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <section className={styles.grid}>
          <div className={styles.row}>
            <label className={styles.label} htmlFor="date-input">
              Date
            </label>
            <input
              className={styles.control}
              required
              type="date"
              name="date"
              id="date-input"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div className={styles.row}>
            <label className={styles.label} htmlFor="mood-input">
              Mood
            </label>
            <select
              className={styles.control}
              required
              name="mood"
              id="mood-input"
              value={formData.mood}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select option
              </option>
              {MOODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.row}>
            <label className={styles.label} htmlFor="stressLevel-input">
              Stress Level
            </label>
            <select
              className={styles.control}
              required
              name="stressLevel"
              id="stressLevel-input"
              value={formData.stressLevel}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select option
              </option>
              {stressFocusOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.row}>
            <label className={styles.label} htmlFor="focusLevel-input">
              Focus Level
            </label>
            <select
              className={styles.control}
              required
              name="focusLevel"
              id="focusLevel-input"
              value={formData.focusLevel}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select option
              </option>
              {stressFocusOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.row}>
            <label className={styles.label} htmlFor="sleepHours-input">
              Sleep Hours
            </label>
            <select
              className={styles.control}
              required
              name="sleepHours"
              id="sleepHours-input"
              value={formData.sleepHours}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select option
              </option>
              {sleepHoursOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.row}>
            <label className={styles.label} htmlFor="exerciseMin-input">
              Exercise Minutes
            </label>
            <input
              className={styles.control}
              required
              type="number"
              name="exerciseMin"
              id="exerciseMin-input"
              value={formData.exerciseMin}
              min={0}
              onChange={handleChange}
            />
          </div>

          <div className={styles.row}>
            <label className={styles.label} htmlFor="meditationMin-input">
              Meditation Minutes
            </label>
            <input
              className={styles.control}
              required
              type="number"
              name="meditationMin"
              id="meditationMin-input"
              value={formData.meditationMin}
              min={0}
              onChange={handleChange}
            />
          </div>

          <div className={styles.row}>
            <label className={styles.label} htmlFor="waterCups-input">
              Water Cups
            </label>
            <select
              className={styles.control}
              required
              name="waterCups"
              id="waterCups-input"
              value={formData.waterCups}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select option
              </option>
              {waterCupsOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.row}>
            <label className={styles.label} htmlFor="dietScore-input">
              Diet Score
            </label>
            <select
              className={styles.control}
              required
              name="dietScore"
              id="dietScore-input"
              value={formData.dietScore}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select option
              </option>
              {dietScoreOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.row}>
            <label className={styles.label} htmlFor="screenHours-input">
              Screen Hours
            </label>
            <select
              className={styles.control}
              required
              name="screenHours"
              id="screenHours-input"
              value={formData.screenHours}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select option
              </option>
              {screenWorkOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.row}>
            <label className={styles.label} htmlFor="workHours-input">
              Work Hours
            </label>
            <select
              className={styles.control}
              required
              name="workHours"
              id="workHours-input"
              value={formData.workHours}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select option
              </option>
              {screenWorkOptions.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.row}>
            <label className={styles.label} htmlFor="hobbyMin-input">
              Hobby Minutes
            </label>
            <input
              className={styles.control}
              required
              type="number"
              name="hobbyMin"
              id="hobbyMin-input"
              value={formData.hobbyMin}
              min={0}
              onChange={handleChange}
            />
          </div>

          <div className={styles.row}>
            <label className={styles.label} htmlFor="location-input">
              Location
            </label>
            <input
              className={styles.control}
              required
              type="text"
              name="location"
              id="location-input"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className={styles.row}>
            <label className={styles.label} htmlFor="weather-input">
              Weather
            </label>
            <input
              className={styles.control}
              required
              type="text"
              name="weather"
              id="weather-input"
              value={formData.weather}
              onChange={handleChange}
            />
          </div>

          <div className={`${styles.row} ${styles.textareaRow}`}>
            <label className={styles.label} htmlFor="notes-input">
              Notes
            </label>
            <textarea
              className={`${styles.control} ${styles.textarea}`}
              required
              name="notes"
              id="notes-input"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
        </section>

        <div className={styles.actions}>
          <button className={styles.buttonPrimary} type="submit">
            Submit
          </button>
        </div>
      </form>
    </main>
  );
};

export default DailyLogForm;






