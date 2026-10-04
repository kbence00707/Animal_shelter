<?php $__env->startSection('title', 'Bejelentkezés - Állatmenhely'); ?>
<?php $__env->startSection('body-class', 'login_page'); ?>

<?php $__env->startSection('content'); ?>
    <?php echo $__env->make('partials.header', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>

    <main class="login_main">
        <div class="login_card">
            <h2>Munkatársi Bejelentkezés</h2>
            <p>Kérjük, add meg a belépési adataidat!</p>
            <form data-admin-url="<?php echo e(route('admin')); ?>" data-worker-url="<?php echo e(route('worker')); ?>" id="login_form" class="booking_form">
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

    <?php echo $__env->make('partials.footer', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.app', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\Users\Viktor\Documents\GitHub\Animal_shelter\resources\views/login.blade.php ENDPATH**/ ?>