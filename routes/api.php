<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\NodeInfoController;

Route::get('/fetch_commerce_details', [NodeInfoController::class, 'index']);
Route::get('/node_infos/{project_id}/{environment}', [NodeInfoController::class, 'getLastSevenResults']);
Route::get('/projects', 'NodeInfoController@showProjectsAndEnvironments');
Route::get('/projects/{project_id}/environments/{environment}', [NodeInfoController::class, 'show']);
Route::get('/projects/{project_id}/environments/{environment}/compare', [NodeInfoController::class, 'compare']);
