<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Állatmenhely')</title>
    <script src="{{ asset('js/theme.js') }}"></script>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body class="@yield('body-class')">
    @yield('content')

    <script src="{{ asset('js/script.js') }}"></script>
</body>
</html>
