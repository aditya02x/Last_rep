import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:3000/api/',
})

export const getWorkouts = async () => {
    const token = localStorage.getItem('token');
    const response = await API.get("/workouts", {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

export const createWorkout = async (workoutData) => {
    const token = localStorage.getItem('token');
    const response = await API.post("/workouts", workoutData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

export const getWorkoutById = async (id) => {
    const token = localStorage.getItem('token');
    const response = await API.get(`/workouts/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

// ✅ ADD THIS
export const getWorkoutLastSession = async (exerciseName) => {
    const token = localStorage.getItem('token');
    const response = await API.get(`/workouts/last-session/${encodeURIComponent(exerciseName)}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}

export const updateWorkout = async (id, workoutData) => {
    const token = localStorage.getItem('token');
    const response = await API.put(`/workouts/${id}`, workoutData, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
}