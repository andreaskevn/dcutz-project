<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservasi extends Model
{
    protected $table = 'reservasis';

    protected $fillable = [
        'id',
        'id_pelanggan',
        'status_reservasi',
        'jam_reservasi',
        'tanggal_reservasi',
        'created_at',
        'updated_at',
        'total_harga',
        'id_user',
    ];

    public function detail_reservasis()
    {
        return $this->hasMany(DetailReservasi::class, 'id_reservasi');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'id_user')->withTrashed();
    }

    public function pelanggan()
    {
        return $this->belongsTo(Pelanggan::class, 'id_pelanggan');
    }

    protected $keyType = 'string';
    public $incrementing = false;
}
