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
        $ownerRole = DB::table('roles')->where('role_name', 'owner')->first();
        $capsterRole = DB::table('roles')->where('role_name', 'capster')->first();
        $shifts = DB::table('shifts')->get();

        if (!$ownerRole || !$capsterRole || $shifts->isEmpty()) {
            $this->command->warn('⚠️ Pastikan Role "owner" dan "capster" serta data shift sudah di-seed sebelum menjalankan UserSeeder.');
            return;
        }

        DB::table('users')->insert([
            'id' => Str::uuid(),
            'name' => 'Admin Owner',
            'email' => 'owner@dcutz.com',
            'password' => Hash::make('password123'),
            'id_role' => $ownerRole->id,
            'id_shift' => $shifts->first()->id,
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $capsters = [
            'Agis',
            'Heru',
            'Akbar',
            'Rohman',
            'Jack'
        ];

        foreach ($capsters as $name) {
            DB::table('users')->insert([
                'id' => Str::uuid(),
                'name' => $name,
                'email' => null,
                'password' => null,
                'id_role' => $capsterRole->id,
                'id_shift' => $shifts->random()->id,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
