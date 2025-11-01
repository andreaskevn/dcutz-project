<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('detail_presensis', function (Blueprint $table) {
            $table->uuid('id')->primary();

            $table->uuid('id_presensi')->required();
            $table->uuid('id_user')->required();
            $table->string('status_presensi')->default('Absen');
            $table->timestamps();

            $table->foreign('id_presensi')->references('id')->on('presensis');
            $table->foreign('id_user')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_presensis');
    }
};
