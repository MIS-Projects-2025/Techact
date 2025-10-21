<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $empData = session('emp_data');
        $empName = $empData['emp_name'] ?? null;

        // 🔹 Total counts technician
        $totalActivities = DB::table('my_activity_list')
            ->where('emp_name', $empName)
            ->count();

        $completedActivities = DB::table('my_activity_list')
            ->where('emp_name', $empName)
            ->where('status', 'complete')
            ->count();

        $ongoingActivities = DB::table('my_activity_list')
            ->where('emp_name', $empName)
            ->where('status', 'ongoing', 'on going')
            ->count();

        // 🔹 Total counts admin
        $totalActivitiesAdmin = DB::table('my_activity_list')
            ->count();

        $completedActivitiesAdmin = DB::table('my_activity_list')
            ->where('status', 'complete')
            ->count();

        $ongoingActivitiesAdmin = DB::table('my_activity_list')
            ->where('status', 'ongoing', 'on going')
            ->count();

        // 🔹 Today's total count (as before)
        $totalActivitiesTodayAdmin = DB::table('my_activity_list')
            ->whereRaw("STR_TO_DATE(log_time, '%b/%d/%Y %H:%i:%s') BETWEEN ? AND ?", [
                Carbon::now()->startOfDay()->format('Y-m-d H:i:s'),
                Carbon::now()->endOfDay()->format('Y-m-d H:i:s'),
            ])
            ->count();

        // 🔹 Today's total count (as before)
        $totalActivitiesToday = DB::table('my_activity_list')
            ->where('emp_name', $empName)
            ->whereRaw("STR_TO_DATE(log_time, '%b/%d/%Y %H:%i:%s') BETWEEN ? AND ?", [
                Carbon::now()->startOfDay()->format('Y-m-d H:i:s'),
                Carbon::now()->endOfDay()->format('Y-m-d H:i:s'),
            ])
            ->count();

        $myActivitiesToday = DB::table('my_activity_list')
            ->where('emp_name', $empName)
            ->whereRaw("STR_TO_DATE(log_time, '%b/%d/%Y %H:%i:%s') BETWEEN ? AND ?", [
                Carbon::now()->startOfDay()->format('Y-m-d H:i:s'),
                Carbon::now()->endOfDay()->format('Y-m-d H:i:s'),
            ])
            ->pluck('my_activity');




        // 🔹 Breakdown by status for bar chart (today only)
        $todayStatuses = ['complete', 'ongoing', 'on going'];
        $statusCounts = [];

        foreach ($todayStatuses as $status) {
            $count = DB::table('my_activity_list')
                ->where('emp_name', $empName)
                ->where('status', $status)
                ->whereRaw("STR_TO_DATE(log_time, '%b/%d/%Y %H:%i:%s') BETWEEN ? AND ?", [
                    Carbon::now()->startOfDay()->format('Y-m-d H:i:s'),
                    Carbon::now()->endOfDay()->format('Y-m-d H:i:s'),
                ])
                ->count();

            $statusCounts[$status] = $count;
        }

        // 🔹 Prepare data for stacked bar chart
        $barChartData = [
            'labels' => $myActivitiesToday,
            'datasets' => [
                [
                    'label' => 'Completed',
                    'data' => [$statusCounts['complete']],
                    'backgroundColor' => '#34D399', // blue
                ],
                [
                    'label' => 'Ongoing',
                    'data' => [$statusCounts['ongoing']],
                    'backgroundColor' => '#60A5FA', // green
                ],
                [
                    'label' => 'On Going',
                    'data' => [$statusCounts['ongoing']],
                    'backgroundColor' => '#60A5FA', // green
                ],
            ],
        ];


        $todayStart = Carbon::now()->startOfDay()->format('Y-m-d H:i:s');
        $todayEnd   = Carbon::now()->endOfDay()->format('Y-m-d H:i:s');

        // 🔹 Kunin lahat ng employee name (labels)
        $myActivitiesTodayAdmin = DB::table('my_activity_list')
            ->whereRaw("STR_TO_DATE(log_time, '%b/%d/%Y %H:%i:%s') BETWEEN ? AND ?", [$todayStart, $todayEnd])
            ->pluck('emp_name')
            ->unique()
            ->values()
            ->toArray();

        // 🔹 Breakdown by status
        $todayStatusesAdmin = ['complete', 'ongoing'];
        $statusCountsAdmin = [];

        foreach ($todayStatusesAdmin as $statusAdmin) {
            $countAdmin = DB::table('my_activity_list')
                ->where('status', $statusAdmin)
                ->whereRaw("STR_TO_DATE(log_time, '%b/%d/%Y %H:%i:%s') BETWEEN ? AND ?", [$todayStart, $todayEnd])
                ->count();

            $statusCountsAdmin[$statusAdmin] = $countAdmin;
        }

        // 🔹 Prepare valid data for Chart.js
        // 🔹 Prepare valid data for Chart.js (correct per technician count)
        $barChartDataAdmin = [
            'labels' => $myActivitiesTodayAdmin, // list of employee names
            'datasets' => [
                [
                    'label' => 'Completed',
                    'data' => array_map(function ($emp) use ($todayStart, $todayEnd) {
                        return DB::table('my_activity_list')
                            ->where('emp_name', $emp)
                            ->where('status', 'complete')
                            ->whereRaw("STR_TO_DATE(log_time, '%b/%d/%Y %H:%i:%s') BETWEEN ? AND ?", [$todayStart, $todayEnd])
                            ->count();
                    }, $myActivitiesTodayAdmin),
                    'backgroundColor' => '#34D399',
                ],
                [
                    'label' => 'Ongoing',
                    'data' => array_map(function ($emp) use ($todayStart, $todayEnd) {
                        return DB::table('my_activity_list')
                            ->where('emp_name', $emp)
                            ->where('status', 'ongoing')
                            ->whereRaw("STR_TO_DATE(log_time, '%b/%d/%Y %H:%i:%s') BETWEEN ? AND ?", [$todayStart, $todayEnd])
                            ->count();
                    }, $myActivitiesTodayAdmin),
                    'backgroundColor' => '#60A5FA',
                ],
            ],
        ];


        $todayStartPerTechnician = Carbon::now()->startOfDay()->format('Y-m-d H:i:s');
        $todayEndPerTechnician   = Carbon::now()->endOfDay()->format('Y-m-d H:i:s');

        // 🔹 Get all technicians (X-axis labels)
        $myActivitiesTodayAdminPerTechnician = DB::table('my_activity_list')
            ->whereRaw("STR_TO_DATE(log_time, '%b/%d/%Y %H:%i:%s') BETWEEN ? AND ?", [
                $todayStartPerTechnician,
                $todayEndPerTechnician
            ])
            ->pluck('emp_name')
            ->unique()
            ->values()
            ->toArray();

        // 🔹 Get all distinct activities
        $activitiesList = DB::table('my_activity_list')
            ->whereRaw("STR_TO_DATE(log_time, '%b/%d/%Y %H:%i:%s') BETWEEN ? AND ?", [
                $todayStartPerTechnician,
                $todayEndPerTechnician
            ])
            ->pluck('my_activity')
            ->unique()
            ->values()
            ->toArray();

        // 🔹 Get total minutes per technician per activity
        $rawData = DB::table('my_activity_list')
            ->select(
                'emp_name',
                'my_activity',
                DB::raw("
            SUM(
                TIMESTAMPDIFF(
                    MINUTE,
                    STR_TO_DATE(log_time, '%b/%d/%Y %H:%i:%s'),
                    STR_TO_DATE(time_out, '%b/%d/%Y %H:%i:%s')
                )
            ) AS total_minutes
        ")
            )
            ->whereRaw("STR_TO_DATE(log_time, '%b/%d/%Y %H:%i:%s') BETWEEN ? AND ?", [
                $todayStartPerTechnician,
                $todayEndPerTechnician
            ])
            ->groupBy('emp_name', 'my_activity')
            ->get();


        // 🔹 Generate random color function
        function randomColor()
        {
            return sprintf('#%06X', mt_rand(0, 0xFFFFFF));
        }

        // 🔹 Build datasets per activity with auto random colors
        $datasets = [];
        foreach ($activitiesList as $activity) {
            $datasets[] = [
                'label' => $activity,
                'backgroundColor' => randomColor(),
                'data' => array_map(function ($tech) use ($rawData, $activity) {
                    $match = $rawData->firstWhere(fn($r) => $r->emp_name === $tech && $r->my_activity === $activity);
                    return $match ? round($match->total_minutes / 60, 2) : 0;
                }, $myActivitiesTodayAdminPerTechnician),
            ];
        }

        // 🔹 I-pass mo pa rin sa inertia or blade
        $barChartDataAdminPerTechnician = [
            'labels' => $myActivitiesTodayAdminPerTechnician,
            'datasets' => $datasets,
        ];



        // 🔹 Final chart data for Chart.js
        $barChartDataAdminPerTechnician = [
            'labels' => $myActivitiesTodayAdminPerTechnician,
            'datasets' => $datasets,
        ];




        return Inertia::render('Dashboard', [
            'emp_data' => $empData,
            'totalActivities' => $totalActivities,
            'completedActivities' => $completedActivities,
            'ongoingActivities' => $ongoingActivities,
            'totalActivitiesAdmin' => $totalActivitiesAdmin,
            'completedActivitiesAdmin' => $completedActivitiesAdmin,
            'ongoingActivitiesAdmin' => $ongoingActivitiesAdmin,
            'totalActivitiesTodayAdmin' => $totalActivitiesTodayAdmin,
            'totalActivitiesToday' => $totalActivitiesToday,
            'barChartData' => $barChartData,
            'barChartDataAdmin' => $barChartDataAdmin,
            'barChartDataAdminPerTechnician' => $barChartDataAdminPerTechnician,
        ]);
    }
}
