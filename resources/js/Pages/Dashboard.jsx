import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useRef } from "react";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard({
  totalActivities,
  completedActivities,
  ongoingActivities,
  totalActivitiesToday,
  totalActivitiesAdmin,
  completedActivitiesAdmin,
  ongoingActivitiesAdmin,
  totalActivitiesTodayAdmin,
  emp_data,
  barChartData,
  barChartDataAdmin,
  barChartDataAdminPerTechnician,
}) {
  const role = emp_data?.emp_system_role;

  // 🟢 Add references for your charts
  const adminPerTechChartRef = useRef(null);

  // 🔹 Chart Options
const options = {
  responsive: true,
  plugins: {
    legend: { position: "bottom" },
    title: {
      display: true,
      text: "Daily Activities Summary (Per Technician)",
      font: { size: 16 },
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const hoursDecimal = context.raw;
          const totalMinutes = Math.round(hoursDecimal * 60);
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          const timeLabel =
            minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
          return `${context.dataset.label}: ${timeLabel}`;
        },
      },
    },
  },
  scales: {
    x: { stacked: true },
    y: {
      stacked: true,
      beginAtZero: true,
      title: {
        display: true,
        text: "Duration (hours)",
      },
      ticks: {
        callback: function (value) {
          const totalMinutes = Math.round(value * 60);
          const hours = Math.floor(totalMinutes / 60);
          const minutes = totalMinutes % 60;
          return minutes === 0 ? `${hours}h` : `${hours}h ${minutes}m`;
        },
      },
    },
  },
};


  const optionsAdmin = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: {
        display: true,
        text: "Daily Activity Duration per Technician",
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const hoursDecimal = context.raw;
            const totalMinutes = Math.round(hoursDecimal * 60);
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return `${context.dataset.label}: ${hours}h ${minutes}m`;
          },
        },
      },
    },
    scales: {
      x: { stacked: true },
      y: {
        stacked: true,
        beginAtZero: true,
        title: { display: true, text: "Duration (hours)" },
        ticks: {
          callback: function (value) {
            const totalMinutes = Math.round(value * 60);
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            if (minutes === 0) return `${hours}h`;
            return `${hours}h ${minutes}m`;
          },
        },
      },
    },
  };

  // 🕒 Auto-change bar colors every 10 seconds
  useEffect(() => {
    const chart = adminPerTechChartRef.current;
    if (!chart) return;

    const interval = setInterval(() => {
      chart.data.datasets.forEach((dataset) => {
        dataset.backgroundColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      });
      chart.update();
    }, 3000); // 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <AuthenticatedLayout>
      <Head title="Dashboard" />
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {["superadmin", "admin", "approver"].includes(role) ? (
        <div>
          <p className="text-gray-600 mb-4">
            Welcome back, {emp_data?.emp_firstname}!
          </p>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <SummaryCard title="Total Activities" value={totalActivitiesAdmin} color="bg-cyan-200" />
            <SummaryCard title="Completed" value={completedActivitiesAdmin} color="bg-sky-200" />
            <SummaryCard title="Ongoing" value={ongoingActivitiesAdmin} color="bg-emerald-200" />
            <SummaryCard title="Total Activities Today" value={totalActivitiesTodayAdmin} color="bg-blue-200" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-white rounded-lg shadow text-gray-700 md:grid-cols-1">
              <Bar ref={adminPerTechChartRef} data={barChartDataAdmin} options={options} />
            </div>
            <div className="p-4 bg-white rounded-lg shadow text-gray-700 md:grid-cols-1">
              <Bar ref={adminPerTechChartRef} data={barChartDataAdminPerTechnician} options={optionsAdmin} />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">
            Welcome back, {emp_data?.emp_firstname}! Here are your activities.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <SummaryCard title="Total Activities" value={totalActivities} color="bg-cyan-200" />
            <SummaryCard title="Completed" value={completedActivities} color="bg-sky-200" />
            <SummaryCard title="Ongoing" value={ongoingActivities} color="bg-emerald-200" />
            <SummaryCard title="Total Activities Today" value={totalActivitiesToday} color="bg-blue-200" />
          </div>

          <div className="p-4 bg-white rounded-lg shadow text-gray-700">
            <Bar data={barChartData} options={options} />
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}

// 🟢 Reusable Summary Card component
function SummaryCard({ title, value, color }) {
  return (
    <div className={`p-4 ${color} rounded-lg shadow text-gray-700`}>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-3xl font-bold flex justify-end">{value}</p>
    </div>
  );
}
