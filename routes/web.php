<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\NodeInfoController;

Route::get('/db-test', function () {
    try {
        DB::connection()->getPdo();
        return "Database connection is working!";
    } catch (\Exception $e) {
        return "Failed to connect to the database. Please check your configuration. Error: " . $e->getMessage();
    }
});

Route::get('/', function () {
    return view('welcome');
});

Route::get('/projects', [NodeInfoController::class, 'showProjectsAndEnvironments']);
