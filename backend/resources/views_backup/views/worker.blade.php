@extends('layouts.app')

@section('title', 'Dolgozói Felület - Állatmenhely')
@section('body-class', 'dashboard_body')

@section('content')
    <div class="dashboard_wrapper">
        @include('partials.sidebar', ['admin' => false])

        <main class="dashboard_content">
            <section id="appointments" class="tab_content active_tab">
                <div class="content_header">
                    <h2>Lefoglalt Időpontok</h2>
                </div>
                <table class="data_table">
                    <thead>
                        <tr>
                            <th>Név</th>
                            <th>E-mail</th>
                            <th>Telefon</th>
                            <th>Állat</th>
                            <th>Dátum & Idő</th>
                            <th>Státusz</th>
                            <th>Művelet</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Nagy Péter</td>
                            <td>peter@email.hu</td>
                            <td>+36 30 111 2222</td>
                            <td>Bodri</td>
                            <td>2026.10.12. 10:00</td>
                            <td><span class="status pending">Függőben</span></td>
                            <td>
                                <button class="btn_small btn_green">Elfogad</button>
                                <button class="btn_small btn_red">Elutasít</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <section id="animals" class="tab_content">
                <div class="content_header">
                    <h2>Állomány Kezelése</h2>
                    <button class="button btn_new_animal">+ Új állat</button>
                </div>
                <div style="overflow-x: auto;">
                    <table class="data_table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Név</th>
                                <th>Faj</th>
                                <th>Fajta</th>
                                <th>Szül. dátum</th>
                                <th>Súly (kg)</th>
                                <th>Mag. (cm)</th>
                                <th>Chip</th>
                                <th>Státusz</th>
                                <th>Művelet</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr data-nem="him" data-allapot="orokbefogadhato" data-leiras="Barátságos, szereti a gyerekeket.">
                                <td>#001</td>
                                <td>Bodri</td>
                                <td>Kutya</td>
                                <td>Keverék</td>
                                <td>2021-05-10</td>
                                <td>18.5</td>
                                <td>50</td>
                                <td>Igen</td>
                                <td><span class="status active">Gazdira vár</span></td>
                                <td><button class="btn_small btn_blue">Szerkesztés</button></td>
                            </tr>
                            <tr data-nem="nosteny" data-allapot="orokbefogadhato" data-leiras="Bújós, dorombolós cica.">
                                <td>#002</td>
                                <td>Cirmi</td>
                                <td>Macska</td>
                                <td>Európai rövidszőrű</td>
                                <td>2023-08-15</td>
                                <td>3.8</td>
                                <td>25</td>
                                <td>Nem</td>
                                <td><span class="status active">Gazdira vár</span></td>
                                <td><button class="btn_small btn_blue">Szerkesztés</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </main>
    </div>
@endsection
