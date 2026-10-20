<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Allat extends Model
{
    use HasFactory;

    protected $table = 'allatok';

    protected $fillable = [
        'nev',
        'faj',
        'fajta',
        'nem',
        'szuletesi_datum',
        'suly_kg',
        'magassag_cm',
        'leiras',
        'kep',
        'allapot',
        'bekerules_datuma',
        'chip',
    ];

    protected $casts = [
        'szuletesi_datum' => 'date:Y-m-d',
        'bekerules_datuma' => 'date:Y-m-d',
        'suly_kg' => 'decimal:2',
        'chip' => 'boolean',
    ];

    public function foglalasok()
    {
        return $this->hasMany(Foglalas::class);
    }

    public function orokbefogadasok()
    {
        return $this->hasMany(Orokbefogadas::class);
    }

    public function vizsgalatok()
    {
        return $this->hasMany(Vizsgalat::class);
    }

    public function scopeOrokbefogadhato($query)
    {
        return $query->where('allapot', 'orokbefogadhato');
    }

    public function scopeKezelesAlatt($query)
    {
        return $query->where('allapot', 'kezeles_alatt');
    }

    public function scopeOrokbefogadva($query)
    {
        return $query->where('allapot', 'orokbefogadva');
    }
}
