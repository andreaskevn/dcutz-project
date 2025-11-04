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
        Schema::create('reservasis', function (Blueprint $table) {
            $table->uuid('id')->primary();
            // $table->string('nama_pelanggan');
            // $table->string('nomor_telepon_pelanggan');
            $table->uuid('id_pelanggan')->required();
            $table->string('status_reservasi');
            $table->string('jam_reservasi')->required();
            $table->string('tanggal_reservasi')->required();
            $table->integer('total_harga')->default(0);
            $table->uuid('id_user')->required();
            
            $table->foreign('id_user')->references('id')->on('users');
            $table->foreign('id_pelanggan')->references('id')->on('pelanggans');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservasis');
    }
};
