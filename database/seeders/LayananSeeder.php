<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class LayananSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $layanans = [
            [
                'id' => Str::uuid(),
                'nama_layanan' => 'Regular Cut (haircut, hair consultation, hair wash, hot towel, styling, free soft drink)',
                'harga_layanan' => 55000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'nama_layanan' => 'Female Haircut (haircut, hair consultation, hair wash, hot towel, styling, free soft drink)',
                'harga_layanan' => 70000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'nama_layanan' => 'Haircut',
                'harga_layanan' => 60000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'nama_layanan' => 'Hairmask + haircut',
                'harga_layanan' => 100000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'nama_layanan' => 'Smoothing',
                'harga_layanan' => 300000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'nama_layanan' => 'Cornrow',
                'harga_layanan' => 300000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'nama_layanan' => 'Design Cornrow',
                'harga_layanan' => 300000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'nama_layanan' => 'Dreadlocks Extensions',
                'harga_layanan' => 35000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'nama_layanan' => 'Hair Colour - Basic Colour',
                'harga_layanan' => 75000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'nama_layanan' => 'Hair Colour - Highlight',
                'harga_layanan' => 300000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'nama_layanan' => 'Hair Colour - Fashion Colour',
                'harga_layanan' => 350000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'nama_layanan' => 'Hair Colour - Neon Colour',
                'harga_layanan' => 400000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'nama_layanan' => 'Hair Perming',
                'harga_layanan' => 300000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'nama_layanan' => 'Down Perm',
                'harga_layanan' => 250000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'nama_layanan' => 'Design Perm',
                'harga_layanan' => 350000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => Str::uuid(),
                'nama_layanan' => 'Root Lift',
                'harga_layanan' => 150000,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('layanans')->insert($layanans);
    }
}
