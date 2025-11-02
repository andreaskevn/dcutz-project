<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetailReservasi extends Model
{
    protected $table = 'detail_reservasis';

    protected $fillable = [
        'id',
        'id_reservasi',
        'id_layanan',
        'created_at',
        'updated_at',
        'subtotal'
    ];

    public function reservasis()
    {
        return $this->belongsTo(Reservasi::class, 'id_reservasi');
    }

    public function layanans()
    {
        return $this->belongsTo(Layanan::class, 'id_layanan');
    }

    protected $keyType = 'string';
    public $incrementing = false;
}
