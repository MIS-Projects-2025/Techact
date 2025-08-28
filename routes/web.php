<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DemoController;
use App\Http\Controllers\General\OngoingController;
use App\Http\Controllers\OngoingActivityController;
use App\Http\Controllers\TechActivityController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

$app_name = env('APP_NAME', '');

// Authentication routes
require __DIR__ . '/auth.php';

// General routes
require __DIR__ . '/general.php';

Route::get("/demo", [DemoController::class, 'index'])->name('demo');

Route::get('/techact/tech-activity', [TechActivityController::class, 'index'])->name('tech.activity');

Route::get('/techact/ongoing-activity', [OngoingActivityController::class, 'index'])->name('tech.ongoing');

Route::get('/techact/doneActivity', [OngoingActivityController::class, 'doneActivities'])->name('tech.doneActivities');

// ADD route
Route::post('/techact/ongoing/add', [OngoingActivityController::class, 'addActivity'])->name('ongoing.add');

// UPDATE route (new)
Route::put('/techact/ongoing/update/{id}', [OngoingActivityController::class, 'updateActivity'])->name('ongoing.update');

Route::get('/techact/activity', [OngoingController::class, 'index'])->name('activity');

Route::get('/techact/forApproval', [OngoingActivityController::class, 'forApproval'])->name('tech.forApproval');

Route::put('/techact/forApproval/approve/{id}', [OngoingActivityController::class, 'forApprovalActivity'])->name('ongoing.approve');

Route::get('/techact/dashboard', [DashboardController::class, 'index'])->name('dashboard');

Route::get('/techact', [DashboardController::class, 'index'])->name('dashboards');

Route::get('/dashboards', [DashboardController::class, 'dashboards'])->name('dashboards');


Route::fallback(function () {
    return Inertia::render('404');
})->name('404');
