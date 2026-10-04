<header>
    <div class="navigation">
        <div class="brandname">
            <span>Állatmenhely</span>
        </div>
        <nav aria-label="Fő navigáció">
            <?php if($home ?? false): ?>
                <a href="#animal">Állatok</a>
                <a href="#time">Időpontfoglalás</a>
                <a href="#contact">Kapcsolat</a>
                <a href="<?php echo e(route('login')); ?>">Bejelentkezés</a>
            <?php else: ?>
                <a href="<?php echo e(route('home')); ?>">Vissza a főoldalra</a>
            <?php endif; ?>
            <?php echo $__env->make('partials.theme-toggle', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?>
        </nav>
    </div>
</header>
<?php /**PATH C:\Users\Viktor\Documents\GitHub\Animal_shelter\resources\views/partials/header.blade.php ENDPATH**/ ?>