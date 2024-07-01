<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CronLog extends Model
{
    use HasFactory;

    protected $table = 'cron_logs';

    protected $fillable = ['command', 'output', 'status', 'error_message', 'run_at'];
}
