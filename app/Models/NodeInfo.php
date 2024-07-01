<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NodeInfo extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'region',
        'company_name',
        'cloud_plan',
        'project_url',
        'environment',
        'locale',
        'commerce_version',
        'ece_tools',
        'front_url',
        'admin_url',
        'utc_time',
        'two_factor_auth', // new field added on 05 june
        'two_factor_provider', // new field added on 05 june
        'mariadb_version', // new field added on 05 june
        'customer_type',  // new field added on 15 june
    ];
}
