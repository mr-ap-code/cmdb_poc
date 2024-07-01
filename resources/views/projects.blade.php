

@section('content')
    <h1>Projects</h1>

    <select id="project-select">
        @foreach ($projects as $project)
            <option value="{{ $project->project_id }}">{{ $project->company_name }}</option>
        @endforeach
    </select>

    <h1>Environments</h1>

    <select id="environment-select">
        @foreach ($environments as $environment)
            <option value="{{ $environment }}">{{ $environment }}</option>
        @endforeach
    </select>

    <!-- Add more HTML and JavaScript here for the date picker, the configuration data table, etc. -->
@endsection
