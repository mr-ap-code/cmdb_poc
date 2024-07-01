<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        Commands\FetchCommerceDetails::class,
    ];

    protected function schedule(Schedule $schedule)
    {
        #$schedule->command('fetch:commerce_details')->dailyAt('11:00');
        $schedule->command('fetch:commerce_details')->everyMinute();
    }

    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
