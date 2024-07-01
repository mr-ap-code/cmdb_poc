<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;
use App\Models\NodeInfo;
use Illuminate\Support\Facades\Log;
use App\Exceptions\InvalidDataException;
use App\Models\CronLog;

class FetchCommerceDetails extends Command
{
    protected $signature = 'fetch:commerce_details {environment=production}';

    protected $description = 'Fetch commerce details using the fetch_commerce_details.sh script';

    public function handle()
    {
        $environment = $this->argument('environment');
        try {
//          $projectIds = file('project_ids.txt', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            $handle = fopen('paid_customers_ultimate_all.csv', 'r');
            $projectIds = [];

            if ($handle !== false) {
                $lineNumber = 0;
                while (($data = fgetcsv($handle, 1000, ",")) !== false) {
                    if ($lineNumber === 0) {
                        $lineNumber++;
                        continue;
                    }
                    $projectIds[] = $data[1];
                    $lineNumber++;
                }
                fclose($handle);
            }

            // Read the last processed project ID from the file
            $lastProcessedProjectId = trim(file_get_contents('last_processed_project_id.txt'));

            $nextProject = false;

            $startProcessing = empty($lastProcessedProjectId);

            foreach ($projectIds as $projectId) {
                // Write the last processed project ID to the file
                file_put_contents('last_processed_project_id.txt', $projectId);

                if (!$startProcessing && $projectId === $lastProcessedProjectId) {
                    $startProcessing = true;
                }

                if (!$startProcessing) {
                    continue;
                }
                try {

                    Log::info('Checking status for project: ' . $projectId);

                    // Check project status
                    $statusProcess = new Process(['magento-cloud', 'subscription:info', 'status', '-p', $projectId]);
                    $statusProcess->mustRun();
                    if (!$statusProcess->isSuccessful()) {
                        throw new ProcessFailedException($statusProcess);
                    }
                    $statusOutput = trim($statusProcess->getOutput());

                    // If status is not active, skip this project
                    if ($statusOutput !== 'active') {
                        Log::info('Skipping project ' . $projectId . ' due to inactive status.');
                        continue;
                    }
                    Log::info('Environment is in ' . $statusOutput . ' status.');

                    // Check default branch
//                     $projectPlan = new Process(['magento-cloud', 'subscription:info', 'plan', '-p', $projectId]);
//                     $projectPlan->run();
//                     if (!$projectPlan->isSuccessful()) {
//                         throw new ProcessFailedException($projectPlan);
//                     }
//                     $planOutput = trim($projectPlan->getOutput());
//                     Log::info('Environment plan is ' . $planOutput . ' status.');
//
//                      // If default branch is master, set environment to default_branch
//                     if (strpos($planOutput, 'starter') !== false) {
//                         $environment = 'master';
//                     }else{
//                         //$environment = 'master';
//                         $environment = $this->argument('environment');
//                     }

                    $command = "magento-cloud environment:list -p $projectId | awk '/" . $environment . "/ && /Active/ {print $2}'";
                    $process = Process::fromShellCommandline($command);
                    $process->run();

                    if (!$process->isSuccessful()) {
                        throw new ProcessFailedException($process);
                    }

                    $default_environment = trim($process->getOutput());
                    $lines = explode("\n", $default_environment);
                    $environment_branch = $lines[0];

                    Log::info('Branch set as : ' . $environment_branch);
                    Log::info('Fetching commerce details for project: ' . $projectId);

                    // Execute the shell script and get the output
                    $process = new Process(['./fetch_commerce_details.sh', '-p', $projectId, '-e', $environment_branch]);
                    $process->setTimeout(120);
                    $process->run();
                    if (!$process->isSuccessful()) {
                        throw new ProcessFailedException($process);
                    }

                    $output = $process->getOutput();

                    // Log the output
                    Log::info('Raw Output from script: ', [$output]);

                    // Parse the output and store it in the database
                    $data = json_decode($output, true);

                    if (!isset($data['project_id'])) {
                        throw new InvalidDataException('The data fetched does not contain a project_id');
                    }

                    // Check if cloud_plan contains "magento/pro"
//                     if (strpos($data['cloud_plan'], 'magento/pro') === false) {
//                         continue; // Skip this iteration if cloud_plan does not contain "magento/pro"
//                     }

                    NodeInfo::create([
                        'project_id' => $data['project_id'],
                        'region' => $data['region'],
                        'company_name' => $data['company_name'],
                        'cloud_plan' => $data['cloud_plan'],
                        'project_url' => $data['project_url'],
                        'environment' => $data['environment'],
                        'locale' => $data['locale'],
                        'commerce_version' => $data['commerce_version'],
                        'ece_tools' => $data['ece_tools'],
                        'front_url' => $data['front_url'],
                        'admin_url' => $data['admin_url'],
                        'utc_time' => $data['utc_time'],
                        'two_factor_auth' => $data['two_factor_auth'], // new field added on 05 june
                        'two_factor_provider' => $data['two_factor_provider'], // new field added on 05 june
                        'mariadb_version' => $data['mariadb_version'],
                        'customer_type' => 'Ultimate/Elite',// new field added on 05 june
                    ]);


    //              $this->info('Commerce details for project ' . $projectId . ' fetched successfully!');
                    $this->info('Commerce details for ' . $data['company_name'] . ' fetched successfully!');

                    CronLog::create([
                        'command' => 'fetch:commerce_details',
                        'output' => $projectId,
                        'status' => 'success',
                        'run_at' => now(),
                    ]);

                   // If this is the last project in the list, reset the last processed project ID
                    if ($projectId === end($projectIds)) {
                        file_put_contents('last_processed_project_id.txt', '');
                    }
                }
                catch (ProcessFailedException $e) {
                    if (strpos($e->getMessage(), 'Specified project not found') !== false) {
                        // Skip this iteration if the project is not found
                        Log::info('Skipping project ' . $projectId . ' as project is not found.');
                        continue;
                    } else {
                        // If the error is something else, rethrow the exception
                        throw $e;
                    }
                }
            }
        } catch (\Exception $exception) {
            CronLog::create([
                'command' => 'fetch:commerce_details',
                'output' => isset($projectId) ? $projectId : 'N/A',
                'status' => 'failure',
                'error_message' => $exception->getMessage(),
                'run_at' => now(),
            ]);

            throw $exception;
        }
    }
}
