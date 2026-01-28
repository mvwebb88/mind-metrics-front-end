import { useState, useEffect } from "react";
import { useParams } from "react-router";

import * as dailyLogService from "../../services/dailyLogService";

// Converts backend Date to local YYYY-MM-DD for input type="date"
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
  mood: "Happy",
  stressLevel: 1,
  focusLevel: 1,
  sleepHours: 0,
  exerciseMin: 0,
  meditationMin: 0,
  waterCups: 0,
  dietScore: 1,
  screenHours: 0,
  workHours: 0,
  hobbyMin: 0,
  location: "",
  weather: "",
  notes: "",
}

const DailyLogForm = ({ handleAddDailyLog, handleUpdateDailyLog }) => {
  const { dailyLogId } = useParams();
  console.log("dailyLogId:", dailyLogId);

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (!dailyLogId) return;

    const fetchDailyLog = async () => {
      const dailyLogData = await dailyLogService.show(dailyLogId);

      // Convert Date to YYYY-MM-DD for date input
      const dateStr = dailyLogData?.date ? toLocalDateInput(dailyLogData.date) : "";

      setFormData({
        ...dailyLogData,
        date: dateStr,
      });
    };

    if (dailyLogId) fetchDailyLog();

    return () =>
      setFormData(initialState);
  }, [dailyLogId]);

  const handleChange = (evt) => {
    const { name, value } = evt.target;

    // Convert numeric selects to Numbers so Mongoose enum validation passes
    const numericFields = new Set([
      "stressLevel",
      "focusLevel",
      "sleepHours",
      "exerciseMin",
      "meditationMin",
      "waterCups",
      "dietScore",
      "screenHours",
      "workHours",
      "hobbyMin",
    ]);

    setFormData({
      ...formData,
      [name]: numericFields.has(name)
        ? (value === "" ? "" : Number(value)) // allow empty string temporarily
        : value,
    });

  };

  const handleSubmit = (evt) => {
    evt.preventDefault();

    // IMPORTANT: backend assigns userId from token; do not send userId from client
    const payload = { ...formData };
    delete payload.userId;

    if (dailyLogId) {
      handleUpdateDailyLog(dailyLogId, payload);
    } else {
      handleAddDailyLog(payload);
    }
  };

  return (
    <main>
      <h1>{dailyLogId ? "Edit Daily Log" : "New Daily Log"}</h1>

      <form onSubmit={handleSubmit}>
        <label htmlFor="date-input">Date</label>
        <input
          required
          type="date"
          name="date"
          id="date-input"
          value={formData.date}
          onChange={handleChange}
        />

        <label htmlFor="mood-input">Mood</label>
        <select
          required
          name="mood"
          id="mood-input"
          value={formData.mood}
          onChange={handleChange}
        >
          {MOODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <label htmlFor="stressLevel-input">Stress Level</label>
        <select
          required
          name="stressLevel"
          id="stressLevel-input"
          value={formData.stressLevel}
          onChange={handleChange}
        >
          {stressFocusOptions.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <label htmlFor="focusLevel-input">Focus Level</label>
        <select
          required
          name="focusLevel"
          id="focusLevel-input"
          value={formData.focusLevel}
          onChange={handleChange}
        >
          {stressFocusOptions.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <label htmlFor="sleepHours-input">Sleep Hours</label>
        <select
          required
          name="sleepHours"
          id="sleepHours-input"
          value={formData.sleepHours}
          onChange={handleChange}
        >
          {sleepHoursOptions.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <label htmlFor="exerciseMin-input">Exercise Minutes</label>
        <input
          required
          type="number"
          name="exerciseMin"
          id="exerciseMin-input"
          value={formData.exerciseMin}
          min={0}
          onChange={handleChange}
        />

        <label htmlFor="meditationMin-input">Meditation Minutes</label>
        <input
          required
          type="number"
          name="meditationMin"
          id="meditationMin-input"
          value={formData.meditationMin}
          min={0}
          onChange={handleChange}
        />

        <label htmlFor="waterCups-input">Water Cups</label>
        <select
          required
          name="waterCups"
          id="waterCups-input"
          value={formData.waterCups}
          onChange={handleChange}
        >
          {waterCupsOptions.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <label htmlFor="dietScore-input">Diet Score</label>
        <select
          required
          name="dietScore"
          id="dietScore-input"
          value={formData.dietScore}
          onChange={handleChange}
        >
          {dietScoreOptions.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <label htmlFor="screenHours-input">Screen Hours</label>
        <select
          required
          name="screenHours"
          id="screenHours-input"
          value={formData.screenHours}
          onChange={handleChange}
        >
          {screenWorkOptions.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <label htmlFor="workHours-input">Work Hours</label>
        <select
          required
          name="workHours"
          id="workHours-input"
          value={formData.workHours}
          onChange={handleChange}
        >
          {screenWorkOptions.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <label htmlFor="hobbyMin-input">Hobby Minutes</label>
        <input
          required
          type="number"
          name="hobbyMin"
          id="hobbyMin-input"
          value={formData.hobbyMin}
          min={0}
          onChange={handleChange}
        />

        <label htmlFor="location-input">Location</label>
        <input
          required
          type="text"
          name="location"
          id="location-input"
          value={formData.location}
          onChange={handleChange}
        />

        <label htmlFor="weather-input">Weather</label>
        <input
          required
          type="text"
          name="weather"
          id="weather-input"
          value={formData.weather}
          onChange={handleChange}
        />

        <label htmlFor="notes-input">Notes</label>
        <textarea
          required
          name="notes"
          id="notes-input"
          value={formData.notes}
          onChange={handleChange}
        />

        <button type="submit">SUBMIT</button>
      </form>
    </main>
  );
};

export default DailyLogForm;





