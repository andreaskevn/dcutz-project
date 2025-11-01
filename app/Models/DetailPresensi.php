<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailPresensi extends Model
{
    protected $table = 'detail_presensis';

    protected $fillable = [
        'id',
        'id_presensi',
        'id_user',
        'status_presensi',
    ];

    public function presensi()
    {
        return $this->belongsTo(Presensi::class, 'id_presensi');
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
