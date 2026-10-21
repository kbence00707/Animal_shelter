<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orokbefogadas extends Model
{
    use HasFactory;

    protected $table = 'orokbefogadasok';

    protected $fillable = [
        'allat_id',
        'latogato_nev',
        'email',
        'telefonszam',
        'fogadas_datum',
        'statusz',
        'megjegyzes',
    ];

    protected $casts = [
        'fogadas_datum' => 'date:Y-m-d',
    ];

    protected static function boot()
    {
        parent::boot();

        static::updated(function ($orokbefogadas) {
            if (!$orokbefogadas->wasChanged('statusz') || !$orokbefogadas->allat) {
                return;
            }

            if ($orokbefogadas->statusz === 'elfogadva') {
                $orokbefogadas->allat->update(['allapot' => 'orokbefogadva']);

                // A többi függő örökbefogadási kérelmet ugyanarra az állatra elutasítjuk.
                static::where('allat_id', $orokbefogadas->allat_id)
                    ->where('id', '!=', $orokbefogadas->id)
                    ->where('statusz', 'fuggoben')
                    ->update(['statusz' => 'elutasitva']);
            } elseif ($orokbefogadas->getOriginal('statusz') === 'elfogadva') {
                $masElfogadott = static::where('allat_id', $orokbefogadas->allat_id)
                    ->where('id', '!=', $orokbefogadas->id)
                    ->where('statusz', 'elfogadva')
                    ->exists();

                if (!$masElfogadott) {
                    $orokbefogadas->allat->update(['allapot' => 'orokbefogadhato']);
                }
            }
        });
    }

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
}
