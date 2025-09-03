import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import Dashboard from "./Dashboard";
import Dashboards from "./Dashboards";


export default function mainDashboard() {
    const { empData, stats } = usePage().props;
     const { emp_data } = usePage().props;
       const isAdmin = emp_data?.emp_system_role === null ?   false :  true;

    return (
        <AuthenticatedLayout>
           {isAdmin ?<Dashboard tableData={empData} tableFilters={stats} /> : <Dashboards tableData={empData} tableFilters={stats} />}
        </AuthenticatedLayout>
    );
}
