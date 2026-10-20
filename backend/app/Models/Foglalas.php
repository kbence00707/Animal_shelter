<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Foglalas extends Model
{
    use HasFactory;

    protected $table = 'foglalasok';

    protected $fillable = [
        'latogato_nev',
        'email',
        'telefonszam',
        'allat_id',
        'datum',
        'idopont',
        'statusz',
    ];

    protected $casts = [
        'datum' => 'date:Y-m-d',
    ];

    public function allat()
    {
        return $this->belongsTo(Allat::class);
    }

    public function scopeFuggoben($query)
    {
        return $query->where('statusz', 'fuggoben');
    }

    public function scopeElfogadva($query)
    {
        return $query->where('statusz', 'elfogadva');
    }

    public function scopeElutasitva($query)
    {
        return $query->where('statusz', 'elutasitva');
    }

    public function scopeDatumSzerint($query)
    {
        return $query->orderBy('datum')->orderBy('idopont');
    }
}
