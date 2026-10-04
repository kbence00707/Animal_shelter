@extends('layouts.app')

@section('title', 'Vezetőségi Felület - Állatmenhely')
@section('body-class', 'dashboard_body')

@section('content')
    <div class="dashboard_wrapper">
        @include('partials.sidebar', ['admin' => true])

        <main class="dashboard_content">
            <section id="appointments" class="tab_content active_tab">
                <div class="content_header">
                    <h2>Lefoglalt Időpontok</h2>
                </div>
                <table class="data_table">
                    <thead>
                        <tr>
                            <th>Név</th>
                            <th>Dátum</th>
                            <th>Státusz</th>
                            <th>Művelet</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Nagy Péter</td>
                            <td>2026.10.12. 10:00</td>
                            <td><span class="status pending">Függőben</span></td>
                            <td><button class="btn_small btn_green">Elfogad</button></td>
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
                            <tr data-nem="him" data-allapot="orokbefogadhato" data-leiras="Barátságos kutyus.">
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
                        </tbody>
                    </table>
                </div>
            </section>

            <section id="employees" class="tab_content">
                <div class="content_header">
                    <h2>Dolgozók Kezelése</h2>
                    <button class="button btn_new_employee">+ Új dolgozó</button>
                </div>
                <table class="data_table">
                    <thead>
                        <tr>
                            <th>Név</th>
                            <th>E-mail</th>
                            <th>Telefon</th>
                            <th>Lakhely</th>
                            <th>Jogosultság</th>
                            <th>Művelet</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Kovács Anna</td>
                            <td>anna@mihalyimenhely.hu</td>
                            <td>+36 30 999 8888</td>
                            <td>9342 Mihályi, Fő utca 5.</td>
                            <td>Dolgozó</td>
                            <td>
                                <button class="btn_small btn_blue">Szerkesztés</button>
                                <button class="btn_small btn_red">Törlés</button>
                            </td>
                        </tr>
                        <tr>
                            <td>Kiss János</td>
                            <td>janos.admin@mihalyimenhely.hu</td>
                            <td>+36 20 123 4567</td>
                            <td>9300 Csorna, Petőfi tér 2.</td>
                            <td>Vezetőség</td>
                            <td>
                                <button class="btn_small btn_blue">Szerkesztés</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </main>
    </div>
@endsection
