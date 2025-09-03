import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend);

export default function Dashboardu() {
    const { stats, empData, activities } = usePage().props; 
    // ✅ `activities` should be passed from Laravel controller
    // Example: activities: DB::table("my_activity_list")->get()

    const chartRef = useRef(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [filteredData, setFilteredData] = useState([]);

    console.log(filteredData);

    useEffect(() => {
        if (chartRef.current) {
            const ctx = chartRef.current.getContext("2d");

            const labels = [];
            const data = [];
            const colors = [];

            if (stats.ongoing > 0) {
                labels.push("Ongoing");
                data.push(stats.ongoing);
                colors.push("rgba(54, 162, 235, 0.7)");
            }

            if (stats.for_engineer_approval > 0) {
                labels.push("For Engineer Approval");
                data.push(stats.for_engineer_approval);
                colors.push("rgba(13, 60, 189, 0.7)");
            }

            if (stats.complete > 0) {
                labels.push("Complete");
                data.push(stats.complete);
                colors.push("rgba(18, 170, 107, 1)");
            }

            const chart = new ChartJS(ctx, {
                type: "bar",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: "Count",
                            data: data,
                            backgroundColor: colors,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        title: { display: true, text: "Activity Status Breakdown" },
                    },
                    onClick: (evt, elements) => {
                        if (elements.length > 0) {
                            const index = elements[0].index;
                            const clickedStatus = labels[index];

                            // filter activities by clicked status
                            const rows = activities.filter(
                                (a) => a.status === clickedStatus
                            );

                            setModalTitle(clickedStatus);
                            setFilteredData(rows);
                            setModalOpen(true);
                        }
                    },
                    scales: {
                        x: { title: { display: true, text: "Status" } },
                        y: { beginAtZero: true, title: { display: true, text: "Count" } },
                    },
                },
            });

            return () => chart.destroy();
        }
    }, [stats, activities]);

    return (
        <AuthenticatedLayout>
            <p className="mb-4 font-semibold font-timestamp text-[15pt] text-green-300">
                Welcome,{" "}
                <span className="font-semibold text-green-300">
                    {empData?.emp_name} Here's your dashboard
                </span>
            </p>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {/* Total */}
                <div className="bg-white shadow rounded-xl p-4 flex items-center">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-9 text-gray-600">
                     <path d="M3 1.25a.75.75 0 0 0 0 1.5h.25v2.5a.75.75 0 0 0 1.5 0V2A.75.75 0 0 0 4 1.25H3ZM2.97 8.654a3.5 3.5 0 0 1 1.524-.12.034.034 0 0 1-.012.012L2.415 9.579A.75.75 0 0 0 2 10.25v1c0 .414.336.75.75.75h2.5a.75.75 0 0 0 0-1.5H3.927l1.225-.613c.52-.26.848-.79.848-1.371 0-.647-.429-1.327-1.193-1.451a5.03 5.03 0 0 0-2.277.155.75.75 0 0 0 .44 1.434ZM7.75 3a.75.75 0 0 0 0 1.5h9.5a.75.75 0 0 0 0-1.5h-9.5ZM7.75 9.25a.75.75 0 0 0 0 1.5h9.5a.75.75 0 0 0 0-1.5h-9.5ZM7.75 15.5a.75.75 0 0 0 0 1.5h9.5a.75.75 0 0 0 0-1.5h-9.5ZM2.625 13.875a.75.75 0 0 0 0 1.5h1.5a.125.125 0 0 1 0 .25H3.5a.75.75 0 0 0 0 1.5h.625a.125.125 0 0 1 0 .25h-1.5a.75.75 0 0 0 0 1.5h1.5a1.625 1.625 0 0 0 1.37-2.5 1.625 1.625 0 0 0-1.37-2.5h-1.5Z" />
                    </svg>
                    <div className="flex-1 text-right">
                        <p className="text-md text-gray-600">Total Count of Activity</p>
                        <p className="text-xl font-semibold text-black">{stats.total}</p>
                    </div>
                </div>

                {/* Complete */}
                <div className="bg-white shadow rounded-xl p-4 flex items-center">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-9 text-gray-600">
                    <path fill-rule="evenodd" d="M18 5.25a2.25 2.25 0 0 0-2.012-2.238A2.25 2.25 0 0 0 13.75 1h-1.5a2.25 2.25 0 0 0-2.238 2.012c-.875.092-1.6.686-1.884 1.488H11A2.5 2.5 0 0 1 13.5 7v7h2.25A2.25 2.25 0 0 0 18 11.75v-6.5ZM12.25 2.5a.75.75 0 0 0-.75.75v.25h3v-.25a.75.75 0 0 0-.75-.75h-1.5Z" clip-rule="evenodd" />
                    <path fill-rule="evenodd" d="M3 6a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H3Zm6.874 4.166a.75.75 0 1 0-1.248-.832l-2.493 3.739-.853-.853a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.154-.114l3-4.5Z" clip-rule="evenodd" />
                    </svg>
                    <div className="flex-1 text-right">
                        <p className="text-md text-gray-600">Complete</p>
                        <p className="text-xl font-semibold text-black">{stats.complete}</p>
                    </div>
                </div>

                {/* Ongoing */}
                <div className="bg-white shadow rounded-xl p-4 flex items-center">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-9 text-gray-600">
                    <path fill-rule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z" clip-rule="evenodd" />
                    </svg>
                    <div className="flex-1 text-right">
                        <p className="text-md text-gray-600">Ongoing</p>
                        <p className="text-xl font-semibold text-black">{stats.ongoing}</p>
                    </div>
                </div>
            </div>

            {/* Bar Chart */}
            <div className="mt-8 bg-white shadow rounded-xl p-6">
                <canvas ref={chartRef} height="100"  className="cursor-pointer"></canvas>
            </div>

            {/* Modal */}
           {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl w-2/4 max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center border-b bg-gradient-to-r from-black to-gray-400 p-6">
                            <div className="flex items-center space-x-2 ">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-8 text-white">
                            <path fill-rule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875ZM9.75 17.25a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-.75Zm2.25-3a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75Zm3.75-1.5a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0v-5.25Z" clip-rule="evenodd" />
                            <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" />
                          </svg>
                            <h2 className="text-xl font-semibold text-white text-3xl">{modalTitle} Activities</h2>
                            </div>
                            <button
                                className="hover:text-2xl text-red-600 hover:text-red-800 hover:cursor-pointer hover:text-bold"
                                onClick={() => setModalOpen(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-4">
                            <table className="w-full border-collapse table-auto border-solid-black border-4 striped-table">
                                <thead>
                                    <tr className="text-center text-white bg-gradient-to-r from-black to-gray-400">
                                        <th className="p-2 border">My Activity</th>
                                        <th className="p-2 border">Log Time</th>
                                        <th className="p-2 border">Status</th>
                                        <th className="p-2 border">Note</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData.map((row, idx) => (
                                        <tr key={idx}  className="hover:bg-gray-500 hover:text-white text-center text-black hover:bg-gradient-to-r from-black to-gray-400">
                                            <td className="p-2 border">{row.my_activity}</td>
                                            <td className="p-2 border">{row.log_time}</td>
                                            <td className="p-2 border">{row.status}</td>
                                            <td className="p-2 border">{row.note}</td>
                                        </tr>
                                    ))}
                                    {filteredData.length === 0 && (
                                        <tr>
                                            <td
                                                className="p-4 text-center text-gray-500"
                                                colSpan={4}
                                            >
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
        </AuthenticatedLayout>
    );
}
