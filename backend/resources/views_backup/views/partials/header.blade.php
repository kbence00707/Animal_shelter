<header>
    <div class="navigation">
        <div class="brandname">
            <span>Állatmenhely</span>
        </div>
        <nav aria-label="Fő navigáció">
            @if ($home ?? false)
                <a href="#animal">Állatok</a>
                <a href="#time">Időpontfoglalás</a>
                <a href="#contact">Kapcsolat</a>
                <a href="{{ route('login') }}">Bejelentkezés</a>
            @else
                <a href="{{ route('home') }}">Vissza a főoldalra</a>
            @endif
            @include('partials.theme-toggle')
        </nav>
    </div>
</header>
