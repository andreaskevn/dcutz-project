<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ShiftSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $shifts = [
            [
                'shift_name'   => 'Shift 1',
                'start_time'   => '10:00',
                'end_time'     => '18:00',
                'shift_number' => '1',
            ],
            [
                'shift_name'   => 'Shift 2',
                'start_time'   => '14:00',
                'end_time'     => '22:00',
                'shift_number' => '2',
            ],
        ];

        foreach ($shifts as $shift) {
            DB::table('shifts')->insert([
                'id'           => Str::uuid(),
                'shift_name'   => $shift['shift_name'],
                'start_time'   => $shift['start_time'],
                'end_time'     => $shift['end_time'],
                'shift_number' => $shift['shift_number'],
                'created_at'   => now(),
                'updated_at'   => now(),
            ]);
        }
    }
}
