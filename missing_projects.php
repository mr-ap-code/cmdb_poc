<?php

// 1. Read the filtered_active_ams_all.csv file and store all the project IDs in an array
$csvFile = fopen('filtered_active_ams_all.csv', 'r');
fgetcsv($csvFile); // Skip the header
$allData = [];
while (($row = fgetcsv($csvFile)) !== false) {
    $allData[$row[1]] = $row[0]; // Store the name as the value and the project_id as the key
}
fclose($csvFile);

// 2. Read the AMS_inserted_results.csv file and store all the project IDs in another array
$csvFile = fopen('AMS_inserted_results.csv', 'r');
fgetcsv($csvFile); // Skip the header
$insertedData = [];
while (($row = fgetcsv($csvFile)) !== false) {
    $insertedData[$row[1]] = $row[0]; // Store the name as the value and the project_id as the key
}
fclose($csvFile);

// 3. Compare the two arrays to find the missing project IDs
$missingData = array_diff_key($allData, $insertedData);

// 4. Write the missing project IDs and their corresponding names to a new CSV file
$missingFile = fopen('missing_projects.csv', 'w');
fputcsv($missingFile, ['name', 'project_id']); // Write the header
foreach ($missingData as $projectId => $name) {
    fputcsv($missingFile, [$name, $projectId]);
}
fclose($missingFile);
