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

const US_STATES = [
  { abbr: "AL", name: "Alabama" },
  { abbr: "AK", name: "Alaska" },
  { abbr: "AZ", name: "Arizona" },
  { abbr: "AR", name: "Arkansas" },
  { abbr: "CA", name: "California" },
  { abbr: "CO", name: "Colorado" },
  { abbr: "CT", name: "Connecticut" },
  { abbr: "DE", name: "Delaware" },
  { abbr: "FL", name: "Florida" },
  { abbr: "GA", name: "Georgia" },
  { abbr: "HI", name: "Hawaii" },
  { abbr: "ID", name: "Idaho" },
  { abbr: "IL", name: "Illinois" },
  { abbr: "IN", name: "Indiana" },
  { abbr: "IA", name: "Iowa" },
  { abbr: "KS", name: "Kansas" },
  { abbr: "KY", name: "Kentucky" },
  { abbr: "LA", name: "Louisiana" },
  { abbr: "ME", name: "Maine" },
  { abbr: "MD", name: "Maryland" },
  { abbr: "MA", name: "Massachusetts" },
  { abbr: "MI", name: "Michigan" },
  { abbr: "MN", name: "Minnesota" },
  { abbr: "MS", name: "Mississippi" },
  { abbr: "MO", name: "Missouri" },
  { abbr: "MT", name: "Montana" },
  { abbr: "NE", name: "Nebraska" },
  { abbr: "NV", name: "Nevada" },
  { abbr: "NH", name: "New Hampshire" },
  { abbr: "NJ", name: "New Jersey" },
  { abbr: "NM", name: "New Mexico" },
  { abbr: "NY", name: "New York" },
  { abbr: "NC", name: "North Carolina" },
  { abbr: "ND", name: "North Dakota" },
  { abbr: "OH", name: "Ohio" },
  { abbr: "OK", name: "Oklahoma" },
  { abbr: "OR", name: "Oregon" },
  { abbr: "PA", name: "Pennsylvania" },
  { abbr: "RI", name: "Rhode Island" },
  { abbr: "SC", name: "South Carolina" },
  { abbr: "SD", name: "South Dakota" },
  { abbr: "TN", name: "Tennessee" },
  { abbr: "TX", name: "Texas" },
  { abbr: "UT", name: "Utah" },
  { abbr: "VT", name: "Vermont" },
  { abbr: "VA", name: "Virginia" },
  { abbr: "WA", name: "Washington" },
  { abbr: "WV", name: "West Virginia" },
  { abbr: "WI", name: "Wisconsin" },
  { abbr: "WY", name: "Wyoming" },
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
  state: "",
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
              State
            </label>
            <select
              className={styles.control}
              required
              name="state"
              id="state-input"
              value={formData.state}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select an option
              </option>

              {US_STATES.map(({ abbr, name }) => (
                <option key={abbr} value={abbr}>
                  {name} - {abbr}
                </option>
              ))}
            </select>
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






