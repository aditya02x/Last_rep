import axios  from 'axios';

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