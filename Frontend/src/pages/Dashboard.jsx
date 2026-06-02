import { useEffect } from "react";
import { getDashboard } from "../services/dashboardService";

function Dashboard() {
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await getDashboard();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      <h1 className="text-3xl font-bold">
        Dashboard
      </h1>
    </div>
  );
}

export default Dashboard;