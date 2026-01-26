// src/services/dailyLogService.js

const API_URL = import.meta.env.VITE_API_URL; // ✅ matches your .env
const BASE_URL = `${API_URL}/dailylogs`;

function getToken() {
  return localStorage.getItem("token");
}

// Safe JSON parsing so HTML/empty responses don't crash your app
async function safeJson(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { err: text || "Invalid JSON response from server" };
  }
}

async function request(url, options = {}) {
  const res = await fetch(url, options);
  const data = await safeJson(res);

  if (!res.ok) {
    const message =
      data?.err || data?.message || `Request failed: ${res.status}`;
    throw new Error(message);
  }

  return data;
}

// GET /dailylogs
function index() {
  return request(BASE_URL, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

// GET /dailylogs/:logId
function show(logId) {
  return request(`${BASE_URL}/${logId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

// POST /dailylogs
function create(dailyLogFormData) {
  return request(BASE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dailyLogFormData),
  });
}

// DELETE /dailylogs/:logId
function remove(logId) {
  return request(`${BASE_URL}/${logId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

// PUT /dailylogs/:logId
function update(logId, dailyLogFormData) {
  return request(`${BASE_URL}/${logId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dailyLogFormData),
  });
}

export { index, show, create, remove, update };
