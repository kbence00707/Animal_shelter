<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(web: __DIR__.'/../routes/web.php', api: __DIR__.'/../routes/api.php')
    ->withMiddleware(function (Middleware $middleware): void {
        // A Laravel alapértelmezett web middleware-jeit használjuk.
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // A Laravel alapértelmezett hibakezelését használjuk.
    })
    ->create();
