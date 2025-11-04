<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class PelangganSeeder extends Seeder
{
    /**
     * Jalankan seeder.
     */
    public function run(): void
    {
        $pelanggans = [
            [
                'id' => Str::uuid(),
                'nama_pelanggan' => 'Andi Pratama',
                'nomor_telepon_pelanggan' => '081234567890',
            ],
            [
                'id' => Str::uuid(),
                'nama_pelanggan' => 'Budi Santoso',
                'nomor_telepon_pelanggan' => '081223344556',
            ],
            [
                'id' => Str::uuid(),
                'nama_pelanggan' => 'Citra Lestari',
                'nomor_telepon_pelanggan' => '081987654321',
            ],
            [
                'id' => Str::uuid(),
                'nama_pelanggan' => 'Dewi Anjani',
                'nomor_telepon_pelanggan' => '082112223334',
            ],
            [
                'id' => Str::uuid(),
                'nama_pelanggan' => 'Eko Purnomo',
                'nomor_telepon_pelanggan' => '083345678901',
            ],
        ];

        DB::table('pelanggans')->insert($pelanggans);
    }
}
