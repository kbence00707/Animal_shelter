@extends('layouts.app')

@section('title', 'Bejelentkezés - Állatmenhely')
@section('body-class', 'login_page')

@section('content')
    @include('partials.header')

    <main class="login_main">
        <div class="login_card">
            <h2>Munkatársi Bejelentkezés</h2>
            <p>Kérjük, add meg a belépési adataidat!</p>
            <form data-admin-url="{{ route('admin') }}" data-worker-url="{{ route('worker') }}" id="login_form" class="booking_form">
                <label>E-mail cím 
                    <input id="login_email" type="email" placeholder="pl. nev@mihalyimenhely.hu" required>
                </label>
                <label>Jelszó 
                    <input id="login_password" type="password" placeholder="Jelszó megadása" required>
                </label>
                <button class="button" type="submit">Belépés</button>
            </form>
        </div>
    </main>

    @include('partials.footer')
@endsection
