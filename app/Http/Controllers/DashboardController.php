<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{



    public function index(Request $request)
    {
        $empData = session('emp_data') ?? [];
        $empId   = $empData['emp_id'] ?? null;
        $empName = $empData['emp_name'] ?? null;
        $role    = $empData['emp_system_role'] ?? null;

        if ($role === null) {
            $empId   = session('emp_data')['emp_id'] ?? null;
            $empName = session('emp_data')['emp_name'] ?? null;

            $stats = [
                'total' => DB::table('my_activity_list')
                    ->where('emp_name', $empName)
                    ->count(),

                'complete' => DB::table('my_activity_list')
                    ->where('status', 'Complete')
                    ->where('emp_name', $empName)
                    ->count(),

                'ongoing' => DB::table('my_activity_list')
                    ->whereIn('status', ['Ongoing', 'On Going'])
                    ->where('emp_name', $empName)
                    ->count(),

                'for_engineer_approval' => DB::table('my_activity_list')
                    ->where('status', 'For Engineer Approval')
                    ->where('emp_name', $empName)
                    ->count(),
            ];
            $activities = DB::table('my_activity_list')
                ->where('emp_name', $empName)
                ->orderByDesc('id')
                ->get();

            $globalStats = [
                'approved' => 0,
            ];

            return Inertia::render('DashboardU', [
                'stats'   => $stats,
                'empData' => [
                    'emp_id'   => $empId,
                    'emp_name' => $empName,
                ],
                'activities' => $activities, // ✅ idagdag
            ]);
        } else {
            // ✅ Admin/Manager view: lahat ng activities
            $stats = [
                'total' => DB::table('my_activity_list')->count(),
                'complete' => DB::table('my_activity_list')
                    ->whereIn('status', ['Complete', 'Reject'])
                    ->count(),
                'ongoing' => DB::table('my_activity_list')
                    ->whereIn('status', ['Ongoing', 'On Going'])
                    ->count(),
                'for_engineer_approval' => DB::table('my_activity_list')
                    ->where('status', 'For Engineer Approval')
                    ->count(),
            ];

            $activities = DB::table('my_activity_list')
                ->orderByDesc('id')
                ->get();

            $globalStats = [
                'approved' => DB::table('my_activity_list')
                    ->where(function ($q) use ($empId) {
                        $q->whereNotNull('approver_id')
                            ->where('approver_id', $empId);
                    })
                    ->orWhere(function ($q) use ($empId) {
                        $q->whereNotNull('rejector_id')
                            ->where('rejector_id', $empId);
                    })
                    ->count(),
            ];


            // dd($globalStats);

            // ✅ Chart 1: Stacked per technician (today only)
            $validStatuses = ["Ongoing", "On-Going", "For Engineer Approval", "Complete"];
            $today = now()->format('Y-m-d');
            $currentHour = now()->format('H'); // 24-hour format

            // Kunin raw data per emp_name + status
            $chart1Raw = DB::table('my_activity_list')
                ->select('emp_name', 'status', DB::raw('COUNT(*) as count'))
                ->whereIn('status', $validStatuses)
                ->whereRaw("DATE(STR_TO_DATE(log_time, '%b/%d/%Y %H:%i:%s')) = ?", [$today])
                ->groupBy('emp_name', 'status')
                ->get();

            // ✅ for modal (raw activities per technician)
            $empData = DB::table('my_activity_list')
                ->select('emp_name', 'my_activity', 'log_time', 'status', 'note')
                ->whereIn('status', $validStatuses)
                ->whereRaw("DATE(STR_TO_DATE(log_time, '%b/%d/%Y %H:%i:%s')) = ?", [$today])
                ->get();


            // Transform into grouped structure
            $grouped = [];
            foreach ($chart1Raw as $row) {
                if (!isset($grouped[$row->emp_name])) {
                    $grouped[$row->emp_name] = [
                        'emp_name' => $row->emp_name,
                        'Complete' => 0,
                        'Ongoing' => 0,
                        'On-Going' => 0,
                        'For Engineer Approval' => 0,
                    ];
                }
                $grouped[$row->emp_name][$row->status] = $row->count;
            }

            $chart1 = array_values($grouped);



            $chart2Raw = DB::table('my_activity_list')
                ->select(
                    'emp_name',
                    'my_activity',
                    'log_time',
                    'status',
                    'note',
                    DB::raw('SUM(TIMESTAMPDIFF(MINUTE, STR_TO_DATE(log_time, "%b/%d/%Y %H:%i:%s"), STR_TO_DATE(time_out, "%b/%d/%Y %H:%i:%s"))) as duration')
                )
                ->where('status', 'Complete')
                ->whereRaw("DATE(STR_TO_DATE(log_time, '%b/%d/%Y %H:%i:%s')) = ?", [$today])
                // ✅ Filter by shift
                ->where(function ($q) use ($currentHour) {
                    if ($currentHour >= 7 && $currentHour <= 18) {
                        // A-Shift: 07:00 - 18:59
                        $q->whereRaw('HOUR(STR_TO_DATE(log_time, "%b/%d/%Y %H:%i:%s")) BETWEEN 7 AND 18');
                    } else {
                        // C-Shift: 19:00 - 06:59
                        $q->whereRaw('HOUR(STR_TO_DATE(log_time, "%b/%d/%Y %H:%i:%s")) >= 19 OR HOUR(STR_TO_DATE(log_time, "%b/%d/%Y %H:%i:%s")) <= 6');
                    }
                })
                ->groupBy('emp_name', 'my_activity', 'log_time', 'status', 'note')
                ->get();

            // List of all unique activities (for consistent columns)
            $activities = $chart2Raw->pluck('my_activity')->unique()->values()->all();

            // Transform into stacked format
            $grouped = [];
            foreach ($chart2Raw as $row) {
                if (!isset($grouped[$row->emp_name])) {
                    $grouped[$row->emp_name] = ['emp_name' => $row->emp_name];
                    foreach ($activities as $act) {
                        $grouped[$row->emp_name][$act] = 0;
                    }
                }
                $grouped[$row->emp_name][$row->my_activity] = (int) $row->duration;
            }

            $chart2 = array_values($grouped);

            return Inertia::render('mainDashboard', [
                'stats'       => $stats,
                'globalStats' => $globalStats,
                'empData'     => [
                    'emp_id'   => $empId,
                    'emp_name' => $empName,
                    'emp_system_role' => $role,
                ],
                'activities'  => $activities,
                'chart1'      => $chart1,
                'chart2'      => $chart2,
                'chart2Activities' => $chart2Raw, // make sure this is not empty
                'empData'     => $empData

            ]);
        }
    }





    public function dashboardu()
    {
        $empId   = session('emp_data')['emp_id'] ?? null;
        $empName = session('emp_data')['emp_name'] ?? null;

        $stats = [
            'total' => DB::table('my_activity_list')
                ->where('emp_name', $empName)
                ->count(),

            'complete' => DB::table('my_activity_list')
                ->where('status', 'Complete')
                ->where('emp_name', $empName)
                ->count(),

            'ongoing' => DB::table('my_activity_list')
                ->whereIn('status', ['Ongoing', 'On Going'])
                ->where('emp_name', $empName)
                ->count(),

            'for_engineer_approval' => DB::table('my_activity_list')
                ->where('status', 'For Engineer Approval')
                ->where('emp_name', $empName)
                ->count(),
        ];
        $activities = DB::table('my_activity_list')
            ->where('emp_name', $empName)
            ->orderByDesc('id')
            ->get();

        return Inertia::render('DashboardU', [
            'stats'   => $stats,
            'empData' => [
                'emp_id'   => $empId,
                'emp_name' => $empName,
            ],
            'activities' => $activities, // ✅ idagdag
        ]);
    }
}
