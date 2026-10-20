<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vizsgalat extends Model
{
    use HasFactory;

    protected $table = 'vizsgalatok';

    protected $fillable = [
        'allat_id',
        'orvos_id',
        'orvosi_ido',
        'betegseg',
        'oltas',
        'megjegyzes',
    ];

    protected $casts = [
        'orvosi_ido' => 'date:Y-m-d',
    ];

    public function allat()
    {
        return $this->belongsTo(Allat::class);
    }

    public function orvos()
    {
        return $this->belongsTo(Orvos::class);
    }
}
