<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            'Kasir',
            'Manajer Lapangan',
            'Owner',
            'Capster',
        ];

        foreach ($roles as $roleName) {
            DB::table('roles')->insert([
                'id' => Str::uuid(),
                'role_name' => $roleName,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
