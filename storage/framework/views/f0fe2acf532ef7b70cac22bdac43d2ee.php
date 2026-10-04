<?php $__env->startSection('title', 'Állatmenhely'); ?>

<?php $__env->startSection('content'); ?>
    <?php echo $__env->make('partials.header', ['home' => true], array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>

    <main>
        <section class="intro">
            <div class="intro-content">
                <div class="intro-text">
                    <span class="maintitle">Adj nekik egy új esélyt!</span>
                    <h1>Találd meg nálunk új társad!</h1>
                    <p>Böngéssz gazdira váró állataink között, és ha megtaláltad az igazit, foglalj bátran időpontot, hogy személyesen is megismerkedhessetek!</p>
                    <a class="button" href="#animal">Állatok megtekintése</a>
                </div>
                <div class="intro_img">
                    <img src="<?php echo e(asset('pictures/kutya.jpg')); ?>" alt="Kutya">
                </div>
            </div>
        </section>

        <section id="animal" class="animals">
            <div class="animals_container">
                <div class="container_title">
                    <div>
                        <span class="animals_container_header">Örökbefogadás</span>
                        <h2>Gazdira váró állatok</h2>
                    </div>
                    <div class="filter">
                        <input class="search" type="search" placeholder="Keresés">
                        <select id="typefilter">
                            <option value="all">Minden faj</option>
                            <option value="dogs">Kutyák</option>
                            <option value="cats">Macskák</option>
                            <option value="other">Kiskedvencek</option>
                        </select>
                        <select id="sortfilter">
                            <option value="" disabled selected hidden>Rendezés...</option>
                            <option value="species">Faj szerint</option>
                            <option value="birth_asc">Születési év (legfiatalabb)</option>
                            <option value="birth_desc">Születési év (legidősebb)</option>
                            <option value="name_asc">Név (A-Z)</option>
                            <option value="name_desc">Név (Z-A)</option>
                        </select>
                    </div>
                </div>
                
                <div class="slider_wrapper">
                    <button id="slider_prev" class="slider_btn prev">&#10094;</button>
                    
                    <div id="animals_grid" class="animals_slider_track">
                        <div class="animal_card" data-name="Bodri" data-species="dogs" data-birth="2021">
                            <img src="<?php echo e(asset('pictures/dog.jpg')); ?>" alt="Bodri">
                            <div class="animal_card_text">
                                <h3>Bodri</h3>
                                <p><strong>Faj:</strong> Kutya</p>
                                <p><strong>Születési év:</strong> 2021</p>
                                <p>Barátságos, játékos kutyus, aki imád nagyokat sétálni és nagyon várja új gazdiját.</p>
                            </div>
                        </div>
                        <div class="animal_card" data-name="Cirmi" data-species="cats" data-birth="2023">
                            <img src="<?php echo e(asset('pictures/cat.jpg')); ?>" alt="Cirmi">
                            <div class="animal_card_text">
                                <h3>Cirmi</h3>
                                <p><strong>Faj:</strong> Macska</p>
                                <p><strong>Születési év:</strong> 2023</p>
                                <p>Bújós, dorombolós kiscica. Lakásban tartásra kiválóan alkalmas, nyugodt természetű.</p>
                            </div>
                        </div>
                        <div class="animal_card" data-name="Tapsi" data-species="other" data-birth="2024">
                            <img src="<?php echo e(asset('pictures/rabbit.png')); ?>" alt="Tapsi">
                            <div class="animal_card_text">
                                <h3>Tapsi</h3>
                                <p><strong>Faj:</strong> Kiskedvenc</p>
                                <p><strong>Születési év:</strong> 2024</p>
                                <p>Félénk, de nagyon kíváncsi törpenyúl. Csendes és szerető környezetet keres magának.</p>
                            </div>
                        </div>
                        <div class="animal_card" data-name="Rex" data-species="dogs" data-birth="2018">
                            <img src="<?php echo e(asset('pictures/dog2.jpg')); ?>" alt="Rex">
                            <div class="animal_card_text">
                                <h3>Rex</h3>
                                <p><strong>Faj:</strong> Kutya</p>
                                <p><strong>Születési év:</strong> 2018</p>
                                <p>Hűséges, intelligens németjuhász keverék. Kiváló házőrző, aki szereti a szabályokat.</p>
                            </div>
                        </div>
                        <div class="animal_card" data-name="Mici" data-species="cats" data-birth="2024">
                            <img src="<?php echo e(asset('pictures/cat2.jpg')); ?>" alt="Mici">
                            <div class="animal_card_text">
                                <h3>Mici</h3>
                                <p><strong>Faj:</strong> Macska</p>
                                <p><strong>Születési év:</strong> 2024</p>
                                <p>Nagyon fiatal, játékos és energiával teli kiscica. Imád mindent, ami mozog.</p>
                            </div>
                        </div>
                        <div class="animal_card" data-name="Golyó" data-species="other" data-birth="2022">
                            <img src="<?php echo e(asset('pictures/tengeri_malac.jpg')); ?>" alt="Golyó">
                            <div class="animal_card_text">
                                <h3>Golyó</h3>
                                <p><strong>Faj:</strong> Kiskedvenc</p>
                                <p><strong>Születési év:</strong> 2022</p>
                                <p>Gömbölyded tengerimalac, aki hangos füttyögéssel jelzi, ha éhes. Nagyon szelíd.</p>
                            </div>
                        </div>
                    </div>
                    
                    <button id="slider_next" class="slider_btn next">&#10095;</button>
                </div>
            </div>
        </section>

        <section id="time" class="time_container_light">
            <div class="time_container_layout">
                <div class="meeting_text">
                    <span class="meeting_title">Személyes találkozó</span>
                    <h2>Időpontfoglalás</h2>
                    <p>Válaszd ki a számodra megfelelő időpontot és azt a kiskedvencet, akivel szeretnél találkozni. A foglalás elküldése után munkatársaink rögzítik a kérést, és szeretettel várnak a megbeszélt időpontban!</p>
                </div>
                <form id="booking" class="booking_form">
                    <label>Név <input id="visitor_name" type="text" placeholder="pl. Kiss János" required></label>
                    <label>E-mail cím <input id="visitor_email" type="email" placeholder="pl. pelda@email.hu" required></label>
                    <label>Telefonszám <input id="visitor_phone" type="tel" placeholder="pl. +36 30 123 4567" required></label>
                    <label>Választott állat 
                        <select id="animalselect" required> 
                            <option value="">Válassz állatot</option>
                        </select>
                    </label>
                    <div class="column_two">
                        <label>Dátum <input id="booking_date" type="date" required></label>
                        <label>Időpont <input id="booking_time" type="time" required></label>
                    </div>
                    <button class="button" type="submit">Időpont lefoglalása</button>
                    <p id="booking_message" class="message" role="status"></p>
                </form>
            </div>
        </section>
    </main>

    <?php echo $__env->make('partials.footer', ['home' => true], array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\Users\Viktor\Documents\GitHub\Animal_shelter\resources\views/home.blade.php ENDPATH**/ ?>