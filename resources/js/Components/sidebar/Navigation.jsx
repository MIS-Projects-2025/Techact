import Dropdown from "@/Components/sidebar/Dropdown";
import SidebarLink from "@/Components/sidebar/SidebarLink";
import { usePage } from "@inertiajs/react";

export default function NavLinks() {
    const { emp_data, forApprovalCount } = usePage().props;

    const role = emp_data?.emp_system_role;

    return (
        <nav
            className="flex flex-col flex-grow space-y-1 overflow-y-auto"
            style={{ scrollbarWidth: "none" }}
        >
            {/* Dashboard - Admin only */}
            {["superadmin", "admin", "moderator", "approver"].includes(role) && (
                <SidebarLink
                    href={route("dashboard")}
                    label="Dashboard"
                    icon={
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 13.125C3 12.504 3.504 12 
                                4.125 12h2.25c.621 0 1.125.504 
                                1.125 1.125v6.75C7.5 20.496 6.996 
                                21 6.375 21h-2.25A1.125 1.125 
                                0 0 1 3 19.875v-6.75ZM9.75 
                                8.625c0-.621.504-1.125 
                                1.125-1.125h2.25c.621 0 1.125.504 
                                1.125 1.125v11.25c0 .621-.504 
                                1.125-1.125 1.125h-2.25a1.125 
                                1.125 0 0 1-1.125-1.125V8.625ZM16.5 
                                4.125c0-.621.504-1.125 
                                1.125-1.125h2.25C20.496 3 21 
                                3.504 21 4.125v15.75c0 
                                .621-.504 1.125-1.125 
                                1.125h-2.25a1.125 1.125 
                                0 0 1-1.125-1.125V4.125Z"
                            />
                        </svg>
                    }
                />
            )}

            {/* User Dashboard */}
            {!["superadmin", "admin", "moderator", "approver"].includes(role) && (
                <SidebarLink
                    href={route("dashboardu")}
                    label="Dashboard"
                    icon={
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 
                                20.25h12A2.25 2.25 0 0 0 
                                20.25 18V6A2.25 2.25 0 0 0 
                                18 3.75H6A2.25 2.25 0 0 0 
                                3.75 6v12A2.25 2.25 0 0 0 
                                6 20.25Z"
                            />
                        </svg>
                    }
                />
            )}

            {/* My Activities - User only */}
            {!["superadmin", "admin", "moderator"].includes(role) && (
                <Dropdown
                    label="My Activities"
                    icon={
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 12h16.5m-16.5 
                                3.75h16.5M3.75 19.5h16.5M5.625 
                                4.5h12.75a1.875 1.875 0 0 1 
                                0 3.75H5.625a1.875 1.875 0 0 
                                1 0-3.75Z"
                            />
                        </svg>
                    }
                    links={[
                        { href: route("tech.ongoing"), label: "Ongoing" },
                        { href: route("tech.doneActivities"), label: "Done Activities" },
                    ]}
                />
            )}

            {/* All Activities - Admin only */}
            {["superadmin", "admin", "moderator", "approver"].includes(role) && (
                <SidebarLink
                    href={route("tech.activity")}
                    label="All Activities"
                    icon={
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M8.25 6.75h12M8.25 12h12m-12 
                                5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 
                                0a.375.375 0 1 1-.75 0 .375.375 
                                0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 
                                0a.375.375 0 1 1-.75 0 .375.375 
                                0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 
                                0a.375.375 0 1 1-.75 0 .375.375 
                                0 0 1 .75 0Z"
                            />
                        </svg>
                    }
                />
            )}

            {/* For Approval - Admin & Approver */}
            {["superadmin", "admin", "approver"].includes(role) && (
                <SidebarLink
                    href={route("tech.forApproval")}
                    label="For Approval"
                    icon={
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M11.35 3.836c-.065.21-.1.433-.1.664 
                                0 .414.336.75.75.75h4.5a.75.75 
                                0 0 0 .75-.75 2.25 2.25 0 
                                0 0-.1-.664m-5.8 0A2.251 
                                2.251 0 0 1 13.5 2.25H15c1.012 
                                0 1.867.668 2.15 1.586m-5.8 
                                0c-.376.023-.75.05-1.124.08C9.095 
                                4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 
                                1.124.08 1.131.094 1.976 1.057 
                                1.976 2.192V16.5A2.25 2.25 0 
                                0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 
                                0-1.125.504-1.125 1.125v11.25c0 
                                .621.504 1.125 1.125 1.125h9.75c.621 
                                0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 
                                0 1.125.504 1.125 1.125v9.375m-8.25-3 
                                1.5 1.5 3-3.75"
                            />
                        </svg>
                    }
                    notifications={forApprovalCount}
                />
            )}

            {/* Administrators - Admin only */}
            {["superadmin", "admin"].includes(role) && (
                <SidebarLink
                    href={route("admin")}
                    label="Administrators"
                    icon={
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
</svg>


                    }
                />
            )}
        </nav>
    );
}
