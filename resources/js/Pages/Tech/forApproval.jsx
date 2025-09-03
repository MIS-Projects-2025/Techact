import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react"; // ✅ dagdag usePage para sa flash messages
import DataTable from "@/Components/DataTable";
import { router } from "@inertiajs/react";
import toast from "react-hot-toast";



function calculateDuration(row) {
  const { log_time, time_out, status } = row;
  const start = new Date(log_time);
  const end = status === "Complete" && time_out ? new Date(time_out) : new Date();
  if (isNaN(start) || isNaN(end)) return "-";
  const diffMs = end - start;
  if (diffMs < 0) return "-";
  const diffMinutes = Math.floor(diffMs / 60000);
  if (diffMinutes > 0) return `${diffMinutes} min`;
  const diffSeconds = Math.floor(diffMs / 1000);
  return `${diffSeconds} secs`;
}

function getShiftBadge(row) {
  let shift = row.shift || "";
  let badgeClass = "badge bg-secondary";
  if (!shift) {
    const logDate = new Date(row.log_time);
    if (!isNaN(logDate)) {
      const hours = logDate.getHours();
      const minutes = logDate.getMinutes();
      const totalMinutes = hours * 60 + minutes;
      if (totalMinutes >= 7 * 60 + 1 && totalMinutes <= 19 * 60) {
        shift = "A-Shift";
        badgeClass = "badge bg-primary text-black";
      } else {
        shift = "C-Shift";
        badgeClass = "badge bg-warning text-black";
      }
    } else {
      shift = "Unknown";
      badgeClass = "badge bg-secondary text-black";
    }
  } else {
    if (shift === "A-Shift") badgeClass = "badge bg-primary  text-black";
    else if (shift === "C-Shift") badgeClass = "badge bg-warning  text-black";
  }
  return <span className={badgeClass}>{shift}</span>;
}

function getStatusBadge(status) {
  if (!status) return <span className="badge bg-secondary text-black">Unknown</span>;
  const lower = status.toLowerCase();
  if (lower.startsWith("ongoing") || lower === "on-going")
    return <span className="badge bg-info text-black">{status}</span>;
  if (lower === "complete")
    return <span className="badge bg-success text-black">{status}</span>;
  if (lower.startsWith("for engineer approval"))
    return <span className="badge bg-primary text-black">{status}</span>;
  return <span className="badge bg-secondary text-black">{status}</span>;
}

export default function Activity({
  tableData,
  tableFilters,
  auth,
  empData,
}) {

  
  const { flash } = usePage().props; // ✅ kunin flash messages galing backend
    // console.log(usePage().props); // ✅ Here!
  const [alertVisible, setAlertVisible] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const empId = empData?.emp_id || "";
  const empName = empData?.emp_name || "";

  

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    emp_id: empId,
    emp_name: empName,
    shift: "",
    my_activity: "",
    machine: "",
    note: "",
  });

// auto update kapag machine nagbago
useEffect(() => {
  if (form.machine === "N/A" && form.status !== "Ongoing") {
    setForm((prev) => ({ ...prev, status: "Ongoing" }));
  } else if (form.machine && form.machine !== "N/A" && form.status !== "On-Going") {
    setForm((prev) => ({ ...prev, status: "On-Going" }));
  }
}, [form.machine, form.status]);



  // ✅ Auto compute shift on mount
  useEffect(() => {
    const now = new Date();
    const totalMinutes = now.getHours() * 60 + now.getMinutes();
    const shift =
      totalMinutes >= 7 * 60 + 1 && totalMinutes <= 19 * 60
        ? "A-Shift"
        : "C-Shift";
    setForm((prev) => ({ ...prev, shift }));
  }, []);

  // ✅ Auto-hide alerts after 3 seconds
  useEffect(() => {
    if (flash.success || flash.error) {
      setAlertVisible(true);
      const timer = setTimeout(() => setAlertVisible(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };



  const filteredData = tableData?.data || [];

  // ✅ Check if current user has ongoing activity
  const hasOngoing = filteredData.some(
    (row) =>
      row.emp_id === empId &&
      (row.status?.toLowerCase() === "for engineer approval")
  );

  const dataWithBadgesAndDuration = filteredData.map((row, index) => {
    const enhancedRow = {
      ...row,
      i: index + 1,
      duration: calculateDuration(row),
      shift: getShiftBadge(row),
      shiftText: row.shift || "", // plain text for modal
      status: getStatusBadge(row.status),
      statusText: row.status || "Unknown", // plain text for modal
    };

    return {
      ...enhancedRow,
      viewDetails:
      // enhancedRow.statusText === "for engineer approval" ? null : (
      (
        <button
          className="px-3 py-2 bg-gray-500 text-white rounded-md"
          onClick={() => {
            setSelectedActivity(enhancedRow); // ✅ now passing enhanced row
            setModalOpen(true);
          }}
        >
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            &nbsp;View
          </div>
        </button>
      ),
    };
  });

  return (
    <AuthenticatedLayout>
      <Head title="For Approval Activities" />
      <div className="p-6">
       

        <h1 className="text-2xl font-bold mb-4">For Approval Activities</h1>
        <DataTable
          columns={[
            { key: "emp_name", label: "Technician" },
            { key: "shift", label: "Shift" },
            { key: "my_activity", label: "Activity" },
            { key: "machine", label: "Machine" },
            { key: "log_time", label: "Date Log" },
            // { key: "time_out", label: "Done Date" },
            { key: "duration", label: "Time Duration" },
            { key: "status", label: "Status" },
            { key: "note", label: "Comment" },
            { key: "viewDetails", label: "Action" },
          ]}
          data={dataWithBadgesAndDuration}
          meta={{
            from: tableData?.from,
            to: tableData?.to,
            total: tableData?.total,
            links: tableData?.links,
            currentPage: tableData?.current_page,
            lastPage: tableData?.last_page,
          }}
          routeName={route("tech.forApproval")}
          filters={tableFilters}
          rowKey="id"
          sortBy="id"
          sortOrder="desc"
        />

         {/* Modal */}
{modalOpen && selectedActivity && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
    <div className="bg-gray-800 p-6 rounded shadow-lg w-1/3">
      <h2 className="text-xl font-bold mb-4 text-gray-200">
        <div className="flex items-center bg-gradient-to-r from-black to-gray-400 p-2 rounded text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
          </svg>&nbsp;
          For Approval Activity Details
        </div>
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();

          router.put(`/techact/forApproval/approve/${selectedActivity.id}`, {
  approver_id: form.emp_id,
  approver_name: form.emp_name,
  approve_date: new Date().toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }),
  my_activity: selectedActivity.my_activity,
  machine: selectedActivity.machine,
  note: selectedActivity.note,
  remarks: form.remarks,   // ✅ ito na
  status: selectedActivity.statusText,
}, {
  onSuccess: () => {
    toast.success("Activity approved successfully!");
    setModalOpen(false);
    setSelectedActivity(null);
    window.location.reload();
  },
  onError: () => {
    toast.error("Failed to approve activity. Please try again.");
  }
});

        }}
      >
        <input
          name="approver_id"
          value={form.emp_id}
          className="border p-2 text-gray-700 bg-gray-200 w-full mb-2"
          hidden
        />
        <input
          name="approver_name"
          value={form.emp_name}
          className="border p-2 text-gray-700 bg-gray-200 w-full mb-2"
          hidden
        />
        <input
          name="approve_date"
          value={new Date().toLocaleString()}
          className="border p-2 text-gray-700 bg-gray-200 w-full mb-2"
          hidden
        />

        <div className="mb-4">
          <label className="block text-white mb-1">Activity</label>
          <input
            type="text"
            value={selectedActivity.my_activity}
            className="w-full p-2 rounded border bg-gray-600 text-white"
            readOnly
          />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-1">Machine</label>
          <input
            type="text"
            value={selectedActivity.machine}
            className="w-full p-2 rounded border bg-gray-600 text-white"
            readOnly
          />
        </div>
            
        <div className="mb-4">
          <label className="block text-white mb-1">Status</label>
          <input
            type="text"
            value={selectedActivity.statusText}
            style={{ textTransform: "capitalize" }}
            className="w-full p-2 rounded border bg-blue-500 text-white"
            readOnly
          />
        </div>

        <div className="mb-4">
          <label className="block text-white mb-1">Note</label>
          <textarea
            value={selectedActivity.note || ""}
            className="w-full p-3 rounded border text-white bg-gray-600"
            readOnly
          />
        </div>

         <div className="mb-4">
          <label className="block text-white mb-1">Approver Remarks</label>
         <textarea
  value={form.remarks || ""}
  onChange={(e) =>
    setForm((prev) => ({ ...prev, remarks: e.target.value }))
  }
  className="w-full p-3 rounded border text-gray-700 bg-white"
  placeholder="Enter your remarks here..."
  required
/>

        </div>

        <div className="flex justify-between">
         

          <button
            type="button"
            onClick={() => {
              setModalOpen(false);
              setSelectedActivity(null);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded flex items-center"
          >
            ❌ Close
          </button>

           <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded flex items-center">
            ✔️ Approve
          </button>
        </div>
      </form>
    </div>
  </div>
)}



      </div>
    </AuthenticatedLayout>
  );
}
