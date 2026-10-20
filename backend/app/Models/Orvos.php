<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Orvos extends Model
{
    use HasFactory;

    protected $table = 'orvosok';

    protected $fillable = [
        'nev',
    ];

    public function vizsgalatok()
    {
        return $this->hasMany(Vizsgalat::class);
    }
}
