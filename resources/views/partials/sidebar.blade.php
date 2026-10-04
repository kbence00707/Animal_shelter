<aside class="sidebar">
    <h2>Állatmenhely</h2>
    <p class="role_badge {{ $admin ? 'admin_badge' : '' }}">{{ $admin ? 'Vezetőségi fiók' : 'Dolgozói fiók' }}</p>
    <nav class="sidebar_nav" aria-label="Munkatársi navigáció">
        <button class="nav_btn active" onclick="showTab('appointments', this)">📅 Időpontok</button>
        <button class="nav_btn" onclick="showTab('animals', this)">🐾 Állatok</button>
        @if ($admin)
            <button class="nav_btn" onclick="showTab('employees', this)">👥 Dolgozók</button>
        @endif
        @include('partials.theme-toggle')
        <a href="{{ route('login') }}" class="nav_link logout">Kijelentkezés</a>
    </nav>
</aside>
