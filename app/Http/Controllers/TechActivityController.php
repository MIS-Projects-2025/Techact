<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\DataTableService;
use Illuminate\Support\Facades\DB;

class TechActivityController extends Controller
{
    protected $datatable;

    public function __construct(DataTableService $datatable)
    {
        $this->datatable = $datatable;
    }

    public function index(Request $request)
    {
        // Kung walang sort params, mag-set ng default
        if (!$request->has('sortBy')) {
            $request->merge(['sortBy' => 'id']);
        }
        if (!$request->has('sortDirection')) {
            $request->merge(['sortDirection' => 'desc']);
        }

        $result = $this->datatable->handle(
            $request,
            'mysql',
            'my_activity_list',
            [
                'searchColumns' => ['emp_name', 'shift', 'my_activity', 'machine', 'log_time', 'time_out', 'status', 'note'],
                'exportColumns' => ['emp_name', 'shift', 'my_activity', 'machine', 'log_time', 'time_out', 'duration', 'status', 'note'],
            ]
        );

        if ($result instanceof \Symfony\Component\HttpFoundation\StreamedResponse) {
            return $result;
        }

        return Inertia::render('Tech/Activity', [
            'tableData' => $result['data'],
            'tableFilters' => $request->only([
                'search',
                'perPage',
                'sortBy',
                'sortDirection',
                'start',
                'end',
                'dropdownSearchValue',
                'dropdownFields',
            ]),
        ]);
    }
}
