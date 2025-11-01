<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Shift extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'shifts';

    protected $fillable = [
        'shift_name',
        'start_time',
        'end_time',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }
}
