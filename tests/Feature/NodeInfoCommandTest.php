<?php

namespace Tests\Feature;

use Symfony\Component\Process\Process;
use Tests\TestCase;
use App\Models\NodeInfo;

class NodeInfoCommandTest extends TestCase
{
    public function testNodeInfoCommand()
    {
        // Create a new Process instance
        $process = new Process(['./fetch_commerce_details.sh', '-p', '4pybmzyqfvfu6', '-e', 'production']);
        // Set the timeout to 120 seconds
        $process->setTimeout(120);

        // Run the process
        $process->run();

        // Assert the process exited with a zero exit code, indicating success
        $this->assertEquals(0, $process->getExitCode());

        $processOutput = $process->getOutput();

        $hostnameStart = strpos($processOutput, 'Hostname : ') + strlen('Hostname : ');
        $hostnameEnd = strpos($processOutput, "\n", $hostnameStart);
        $hostname = substr($processOutput, $hostnameStart, $hostnameEnd - $hostnameStart);

        $diskUsageStart = strpos($processOutput, 'Disk Usage on /data:');
        $diskUsageEnd = strpos($processOutput, "\n", $diskUsageStart);
        $diskUsageLine = substr($processOutput, $diskUsageStart, $diskUsageEnd - $diskUsageStart);

        $diskUsageParts = explode(':', $diskUsageLine);
        $diskUsage = trim(end($diskUsageParts));

        $data = [
            'hostname' => $hostname,
            'disk_usage' => $diskUsage,
        ];

        if ($data === null) {
            echo "Process output: " . $process->getOutput();
            $this->fail("Failed to parse process output");
        }

        // Rest of your code...

        // Assert that the data is stored in the database
        $this->assertDatabaseHas('node_infos', [
            'hostname' => $data['hostname'],
            'disk_usage' => $data['disk_usage'],
        ]);
    }
}
