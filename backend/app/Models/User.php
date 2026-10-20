<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nev',
        'email',
        'jelszo',
        'telefonszam',
        'lakhely',
        'jogosultsag',
    ];

    protected $hidden = [
        'jelszo',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'jelszo' => 'hashed',
    ];

    public function getAuthPassword()
    {
        return $this->jelszo;
    }

    public function isAdmin(): bool
    {
        return $this->jogosultsag === 'admin';
    }
}
