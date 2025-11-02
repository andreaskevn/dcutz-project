<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservasi extends Model
{
    protected $table = 'reservasis';

    protected $fillable = [
        'id',
        'nama_pelanggan',
        'nomor_telepon_pelanggan',
        'status_reservasi',
        'jam_reservasi',
        'tanggal_reservasi',
        'created_at',
        'updated_at',
        'total_harga',
    ];

    public function detail_reservasis()
    {
        return $this->hasMany(DetailReservasi::class, 'id_reservasi');
    }

    protected $keyType = 'string';
    public $incrementing = false;
}
