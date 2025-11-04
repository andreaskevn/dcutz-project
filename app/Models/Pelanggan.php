<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pelanggan extends Model
{
    protected $table = 'pelanggans';

    protected $fillable = [
        'id',
        'nama_pelanggan',
        'nomor_telepon_pelanggan',
    ];

    protected $keyType = 'string';
    public $incrementing = false;

    public function reservasis()
    {
        return $this->hasMany(Reservasi::class);
    }
}
