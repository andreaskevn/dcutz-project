<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ambil role "owner"
        $ownerRole = DB::table('roles')->where('role_name', 'owner')->first();
        // ambil shift pertama (misalnya shift 1)
        $shift = DB::table('shifts')->where('shift_name', 'shift 1')->first();

        if (!$ownerRole || !$shift) {
            $this->command->warn('⚠️ Pastikan Role "owner" dan Shift "shift 1" sudah di-seed sebelum menjalankan UserSeeder.');
            return;
        }

        DB::table('users')->insert([
            'id' => Str::uuid(),
            'name' => 'Admin Owner',
            'email' => 'owner@dcutz.com',
            'password' => Hash::make('password123'),
            'id_role' => $ownerRole->id,
            'id_shift' => $shift->id,
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
