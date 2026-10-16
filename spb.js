// spb.kite-leto.com: language by browser, mobile menu, reveal on scroll
(function () {
    var root = document.documentElement;
    var page = root.lang === 'en' ? 'en' : 'ru';
    var home = { ru: root.dataset.homeRu || 'index.html', en: root.dataset.homeEn || 'en.html' };

    // Language: ?lang= in the URL > the visitor's own choice (EN/RU switch) > browser language.
    var fromUrl = new URLSearchParams(location.search).get('lang');
    var chosen = null; try { chosen = localStorage.getItem('langChoice'); } catch (e) {}
    var bot = /bot|crawl|spider|slurp|yandex|google|bing|lighthouse/i.test(navigator.userAgent);
    var langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || ''];
    var browser = (langs[0] || '').toLowerCase().indexOf('ru') === 0 ? 'ru' : 'en';
    var want = null;
    if (fromUrl === 'ru' || fromUrl === 'en') want = fromUrl;
    else if (!bot) want = (chosen === 'ru' || chosen === 'en') ? chosen : browser;
    if (want && want !== page) { location.replace(home[want] + location.hash); return; }

    document.querySelectorAll('[data-lang]').forEach(function (a) {
        a.addEventListener('click', function () {
            try { localStorage.setItem('langChoice', a.dataset.lang); } catch (e) {}
        });
    });

    // Mobile menu
    var btn = document.getElementById('menuToggle'), menu = document.getElementById('mobileMenu');
    if (btn && menu) {
        btn.addEventListener('click', function () {
            var open = menu.classList.toggle('open');
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
        menu.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () { menu.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); });
        });
    }

    // Reveal on scroll
    var items = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
        }, { threshold: 0.12 });
        items.forEach(function (el) { io.observe(el); });
    } else {
        items.forEach(function (el) { el.classList.add('in'); });
    }
})();
