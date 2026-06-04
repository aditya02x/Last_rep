import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

import WorkoutDay from "./pages/WorkoutDay";
import WorkoutLogPage from "./components/Workout/WorkoutLogPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workouts" element={<WorkoutDay />} />
        <Route path="/workouts/:id/log" element={<WorkoutLogPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;