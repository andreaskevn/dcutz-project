<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Presensi extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'presensis';

    protected $fillable = [
        'id',
        'id_user',
        'waktu_presensi',
    ];

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function detailPresensis()
    {
        return $this->hasMany(DetailPresensi::class, 'id_presensi');
    }

    public function user()
    {   
        return $this->belongsTo(User::class, 'id_user');
    }

    public function shift()
    {
        return $this->belongsTo(Shift::class, 'id_shift');
    }
}
