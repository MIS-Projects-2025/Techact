import { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white shadow rounded-xl p-4 flex items-center">
      <span className="bg-gray-600 p-3 rounded-full mr-3">{icon}</span>
      <div className="flex-1">
        <p className="text-md text-gray-600 font-bold">{label}</p>
        <p className="text-xl font-semibold text-black">{value}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const {
    empData: rawEmpData,
    stats,
    globalStats,
    chart1,
    chart2,
    chart2Activities, // ✅ make sure you pass this from Laravel
  } = usePage().props;

  const getShift = (hour) => {
  // hour is 0-23
  if (hour >= 7 && hour <= 18) return "A-Shift";
  return "C-Shift"; // 19:00-23:59 OR 0:00-6:59
};

// Example usage:
const now = new Date();
const currentHour = now.getHours();
const currentShift = getShift(currentHour);


  // ensure array
  const empData = Array.isArray(rawEmpData) ? rawEmpData : [];

  // ✅ Status color mapping
  const statusColors = {
    Complete: "#4CAF50",
    Ongoing: "#2196F3",
    "On-Going": "#2196F3",
    "For Engineer Approval": "#64B5F6",
    Default: "#da2020",
  };

  // ✅ Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // ✅ Handle bar click for chart1 (all statuses)
  const handleBarClick = (emp_name, status) => {
    if (!emp_name || !status) return;
    setModalTitle(`${status} - ${emp_name}`);
    const filtered = empData.filter(
      (row) => row.emp_name === emp_name && row.status === status
    );
    setFilteredData(filtered);
    setModalOpen(true);
  };

  // ✅ Handle bar click for chart2 (completed only)
 const handleBarClickComplete = (emp_name) => {
  if (!emp_name) return;

  // ✅ Ensure chart2Activities is an array
  const activities = Array.isArray(chart2Activities) ? chart2Activities : [];

  const filtered = activities.filter(
  (row) => row.emp_name?.trim().toLowerCase() === emp_name.trim().toLowerCase()
);


  setModalTitle(`Completed Activities - ${emp_name}`);
  setFilteredData(filtered);
  setModalOpen(true);
};


  return (
    <>
      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Count of Activity"
          value={stats.total}
          
          icon={<span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-10">
                <path fill-rule="evenodd" d="M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z" clip-rule="evenodd" />
                <path fill-rule="evenodd" d="M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3Z" clip-rule="evenodd" />
            </svg>
            </span>}
        />
        <StatCard label="Complete" value={stats.complete} icon={<span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-10">
  <path fill-rule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
</svg>

        </span>} />
        <StatCard label="Ongoing" value={stats.ongoing} icon={<span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-10">
  <path fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clip-rule="evenodd" />
</svg>

        </span>} />
        <StatCard
          label="Approved Count"
          value={globalStats.approved}
          icon={<span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-10">
  <path fill-rule="evenodd" d="M8.603 3.799A4.49 4.49 0 0 1 12 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 0 1 3.498 1.307 4.491 4.491 0 0 1 1.307 3.497A4.49 4.49 0 0 1 21.75 12a4.49 4.49 0 0 1-1.549 3.397 4.491 4.491 0 0 1-1.307 3.497 4.491 4.491 0 0 1-3.497 1.307A4.49 4.49 0 0 1 12 21.75a4.49 4.49 0 0 1-3.397-1.549 4.49 4.49 0 0 1-3.498-1.306 4.491 4.491 0 0 1-1.307-3.498A4.49 4.49 0 0 1 2.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 0 1 1.307-3.497 4.49 4.49 0 0 1 3.497-1.307Zm7.007 6.387a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" />
</svg>

          </span>}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-200 shadow rounded-xl p-6 text-gray-700 mt-6">
            {/* Chart 1: All Statuses */}
            <div className="bg-white shadow rounded-xl p-6 text-gray-700 mt-6">
        <h2 className="text-xl font-bold mb-6 text-center">
          Activity Status Distribution Today {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "2-digit" }).replace(",", "")}
        </h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chart1}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="emp_name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="Complete"
              stackId="a"
              fill={statusColors.Complete}
              onClick={(data) => handleBarClick(data.emp_name, "Complete")}
            />
            <Bar
              dataKey="Ongoing"
              stackId="a"
              fill={statusColors.Ongoing}
              onClick={(data) => handleBarClick(data.emp_name, "Ongoing")}
            />
            <Bar
              dataKey="On-Going"
              stackId="a"
              fill={statusColors["On-Going"]}
              onClick={(data) => handleBarClick(data.emp_name, "On-Going")}
            />
            <Bar
              dataKey="For Engineer Approval"
              stackId="a"
              fill={statusColors["For Engineer Approval"]}
              onClick={(data) =>
                handleBarClick(data.emp_name, "For Engineer Approval")
              }
            />
          </BarChart>
        </ResponsiveContainer>
            </div>
        </div>
        <div className="bg-gray-200 shadow rounded-xl p-6 text-gray-700 mt-6">
            {/* Chart 2: Completed Only */}
           <div className="bg-white shadow rounded-xl p-6 text-gray-700 mt-6">
            <div className="flex flex-col items-center">
          <h1
  className={`text-3xl font-bold mb-6 text-center cursor-pointer ${
    currentShift === "A-Shift" ? "text-blue-600" : "text-yellow-600"
  }`}
  onClick={() => {
    // Ensure chart2Activities is always an array
    const activities = Array.isArray(chart2Activities) ? chart2Activities : [];

    // Filter activities based on currentShift
    const filtered = activities.filter((row) => {
      if (!row.log_time) return false; // skip if log_time is missing
      const logHour = new Date(row.log_time).getHours();
if (currentShift === "A-Shift") return logHour >= 7 && logHour <= 18;
else return logHour >= 19 || logHour <= 6;

    });

    setModalTitle(`${currentShift} Activities`);
    setFilteredData(filtered);
    setModalOpen(true);
  }}
>
  {currentShift}
        </h1>


  <h2 className="text-xl font-bold mb-6 text-gray-700 text-center">
    Completed Activity Today{" "}
    {new Date()
      .toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "2-digit",
      })
      .replace(",", "")}
  </h2>
</div>
  <ResponsiveContainer width="100%" height={400}>
    <BarChart data={chart2 || []}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="emp_name" />

      {/* Format Y-axis in hours + minutes */}
      <YAxis
        tickFormatter={(minutes) => {
          const h = Math.floor(minutes / 60);
          const m = minutes % 60;
          return `${h}h ${m}mins`;
        }}
      />

      {/* Tooltip formatting */}
      <Tooltip
        formatter={(value, name) => {
          const h = Math.floor(value / 60);
          const m = value % 60;
          return [`${h}h ${m}mins`, name];
        }}
      />
      <Legend />

      {Array.isArray(chart2) && chart2.length > 0 ? (
        Object.keys(chart2[0])
          .filter((key) => key !== "emp_name")
          .map((activity, idx) => (
            <Bar
              key={activity}
              dataKey={activity}
              stackId="a"
              fill={`hsl(${(idx * 60) % 360}, 70%, 50%)`}
              onClick={(data) => handleBarClickComplete(data.emp_name, activity)}
            />
          ))
      ) : (
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-gray-400"
        >
          No records found
        </text>
      )}
    </BarChart>
  </ResponsiveContainer>
            </div>
        </div>
      </div>


      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-3/4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b bg-gradient-to-r from-black to-gray-400 p-6">
              <h2 className="text-2xl font-semibold text-white">
                {modalTitle}
              </h2>
              <button
                className="text-red-600 hover:text-red-800 text-2xl"
                onClick={() => setModalOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <table className="w-full border-collapse table-auto border-2">
                <thead>
                  <tr className="text-center text-white bg-gradient-to-r from-black to-gray-400">
                    <th className="p-2 border">Technician</th>
                    <th className="p-2 border">My Activity</th>
                    <th className="p-2 border">Log Time</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-gray-500 hover:text-white text-center text-black hover:bg-gradient-to-r from-black to-gray-400"
                    >
                      <td className="p-2 border">{row.emp_name}</td>
                      <td className="p-2 border">{row.my_activity}</td>
                      <td className="p-2 border">{row.log_time}</td>
                      <td className="p-2 border">{row.status}</td>
                      <td className="p-2 border">{row.note}</td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td className="p-4 text-center text-gray-500" colSpan={5}>
                        No records found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
