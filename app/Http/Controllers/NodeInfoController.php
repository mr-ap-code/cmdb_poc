<?php

namespace App\Http\Controllers;

use App\Models\NodeInfo;
use Illuminate\Http\Request;

class NodeInfoController extends Controller
{
    public function index()
    {
        $projects = NodeInfo::select('project_id', 'company_name')->distinct()->get();

        return response()->json($projects);
    }

    public function show($project_id, $environment)
    {
        $config = NodeInfo::where('project_id', $project_id)
            ->where('environment', $environment)
            ->orderByDesc('created_at')
            ->first();

        return response()->json($config);
    }

    public function compare($project_id, $environment, Request $request)
    {
        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        $configs = NodeInfo::where('project_id', $project_id)
            ->where('environment', $environment)
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        // Compare the configs and return the differences...

        return response()->json($configs);
    }

    public function store(Request $request)
    {
        $nodeInfo = NodeInfo::create($request->all());

        return response()->json($nodeInfo, 201);
    }

    public function getLastSevenResults($project_id, $environment)
    {
        $results = NodeInfo::where('project_id', $project_id)
            ->where('environment', $environment)
            ->orderByDesc('created_at')
            ->take(7)
            ->get();

        return response()->json($results);
    }

    public function showProjectsAndEnvironments()
    {
        $projects = NodeInfo::select('project_id', 'company_name')->distinct()->get();
        $environments = NodeInfo::select('environment')->distinct()->get();

        return view('projects', ['projects' => $projects, 'environments' => $environments]);
    }
}
