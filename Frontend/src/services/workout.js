import API from "./api";

// Interceptor handles embedding authorization headers automatically
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const getWorkouts = async () => {
    const response = await API.get("workouts");
    return response.data;
};

export const createWorkout = async (workoutData) => {
    const response = await API.post("workouts", workoutData);
    return response.data;
};

export const getWorkoutById = async (id) => {
    const response = await API.get(`workouts/${id}`);
    return response.data;
};

export const getWorkoutLastSession = async (exerciseName) => {
    const response = await API.get(`workouts/last-session/${encodeURIComponent(exerciseName)}`);
    return response.data;
};

export const updateWorkout = async (id, workoutData) => {
    const response = await API.put(`workouts/${id}`, workoutData);
    return response.data;
};

export const deleteWorkout = async (id) => {
    const response = await API.delete(`workouts/${id}`);
    return response.data;
};