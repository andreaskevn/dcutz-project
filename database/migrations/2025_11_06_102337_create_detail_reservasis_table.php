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
        Schema::create('detail_reservasis', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('id_reservasi')->required();
            $table->uuid('id_layanan')->required();
            $table->integer('subtotal')->required();
            $table->timestamps();

            $table->foreign('id_reservasi')->references('id')->on('reservasis');
            $table->foreign('id_layanan')->references('id')->on('layanans');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('detail_reservasis');
    }
};
