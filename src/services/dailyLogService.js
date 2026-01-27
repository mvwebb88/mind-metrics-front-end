const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/dailylogs`;

// Fetch logs
const index = async () => {
    try {
        const res = await fetch(BASE_URL, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
};

// Fetch a single log
const show = async (logId) => {
    try {
        const res = await fetch(`${BASE_URL}/${logId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
};

// Create a daily log
const create = async (dailyLogFormData) => {
    try {
        const res = await fetch(`${BASE_URL}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dailyLogFormData),
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
};

// Delete a daily log
const deleteDailyLog = async (logId) => {
    try {
        const res = await fetch(`${BASE_URL}/${logId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
};

// Update a daily log
const updateDailyLog = async (logId, dailyLogFormData) => {
    try {
        const res = await fetch(`${BASE_URL}/${logId}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dailyLogFormData),
        });
        return res.json();
    } catch (error) {
        console.log(error);
    }
}

export {
    index,
    show,
    create,
    deleteDailyLog,
    updateDailyLog,
};
