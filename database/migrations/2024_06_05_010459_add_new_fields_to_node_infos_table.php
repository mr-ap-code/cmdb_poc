<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNewFieldsToNodeInfosTable extends Migration
{
    public function up()
    {
        Schema::table('node_infos', function (Blueprint $table) {
            $table->string('two_factor_auth')->nullable()->after('utc_time');
            $table->string('two_factor_provider')->nullable()->after('two_factor_auth');
            $table->string('mariadb_version')->nullable()->after('two_factor_provider');
        });
    }

    public function down()
    {
        Schema::table('node_infos', function (Blueprint $table) {
            $table->dropColumn('two_factor_auth');
            $table->dropColumn('two_factor_provider');
            $table->dropColumn('mariadb_version');
        });
    }
}
