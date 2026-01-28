import { useParams } from "react-router";
import { useState, useEffect } from "react";
import * as goalService from "../../services/goalService";

const initialState = {
    title: "",
    description: "",
    targetMetric: "",
    targetValue: 0,
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
                startDate: goalData.startDate
                    ? goalData.startDate.slice(0, 10)
                    : "",
                endDate: goalData.endDate ? goalData.endDate.slice(0, 10) : "",
            });
        };

        if (goalId) fetchGoal();

        return () => setFormData(initialState);
    }, [goalId]);

    const handleChange = (evt) => {
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    };

    const handleSubmit = (evt) => {
        evt.preventDefault();

        const payload = {
            ...formData,
            status: formData.status || "Active",
            targetMetric: formData.targetMetric || "Water Cups",
            targetValue: Number(formData.targetValue),
        };

        if (goalId) {
            props.handleUpdateGoal(goalId, payload);
        } else {
            props.handleAddGoal(payload);
            setFormData(initialState);
        }
    };

    return (
        <main>
            <h1>{goalId ? "Edit Goal" : "New Goal"}</h1>

            <form onSubmit={handleSubmit}>
                <label htmlFor="title-input">Title</label>
                <input
                    required
                    type="text"
                    name="title"
                    id="title-input"
                    value={formData.title}
                    onChange={handleChange}
                />

                <label htmlFor="description-input">Description</label>
                <textarea
                    required
                    name="description"
                    id="description-input"
                    value={formData.description}
                    onChange={handleChange}
                />

                <label htmlFor="metric-input">Target Metric</label>
                <select
                    required
                    name="targetMetric"
                    id="metric-input"
                    value={formData.targetMetric}
                    onChange={handleChange}
                >
                    <option value="Sleep Hours">Sleep Hours</option>
                    <option value="Exercise Minutes">Exercise Minutes</option>
                    <option value="Meditation Minutes">Meditation Minutes</option>
                    <option value="Water Cups">Water Cups</option>
                    <option value="Diet Score">Diet Score</option>
                    <option value="Screen Hours">Screen Hours</option>
                    <option value="Work Hours">Work Hours</option>
                    <option value="Hobby Minutes">Hobby Minutes</option>
                </select>

                <label htmlFor="targetValue-input">Target Value</label>
                <input
                    required
                    type="number"
                    name="targetValue"
                    id="targetValue-input"
                    value={formData.targetValue}
                    onChange={handleChange}
                />

                <label htmlFor="startDate-input">Start Date</label>
                <input
                    required
                    type="date"
                    name="startDate"
                    id="startDate-input"
                    value={formData.startDate}
                    onChange={handleChange}
                />

                <label htmlFor="endDate-input">End Date</label>
                <input
                    required
                    type="date"
                    name="endDate"
                    id="endDate-input"
                    value={formData.endDate}
                    onChange={handleChange}
                />
                <label htmlFor="status-input">Status</label>

                <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>
                        Select status...
                    </option>
                    <option value="Active">Active</option>
                    <option value="Paused">Paused</option>
                    <option value="Completed">Completed</option>
                </select>

                <button type="submit">SUBMIT</button>
            </form>
        </main>
    );
};

export default GoalForm;
