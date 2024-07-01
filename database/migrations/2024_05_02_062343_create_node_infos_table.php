<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNodeInfosTable extends Migration
{
    public function up()
    {
        Schema::create('node_infos', function (Blueprint $table) {
            $table->id();
            $table->string('project_id');
            $table->string('region');
            $table->string('company_name');
            $table->string('cloud_plan');
            $table->string('project_url');
            $table->string('environment');
            $table->string('locale');
            $table->string('commerce_version');
            $table->string('ece_tools');
            $table->string('front_url');
            $table->string('admin_url');
            $table->string('two_factor_auth')->nullable(); // new field added on 05 june
            $table->string('two_factor_provider')->nullable();// new field added on 05 june
            $table->string('mariadb_version')->nullable();// new field added on 05 june
            $table->string('customer_type')->nullable();// new field added on 14 june
            $table->timestamp('utc_time');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('node_infos');
    }
}
