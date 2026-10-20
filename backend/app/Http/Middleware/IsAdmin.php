<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->isAdmin()) {
            return response()->json(['hiba' => 'Nincs megfelelő jogosultság.'], 403, [], JSON_UNESCAPED_UNICODE);
        }

        return $next($request);
    }
}
