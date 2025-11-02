<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Layanan extends Model
{
    protected $table = 'layanans';

    protected $fillable = [
        'id',
        'nama_layanan',
        'harga_layanan',
    ];

    protected $keyType = 'string';
    public $incrementing = false;
}
