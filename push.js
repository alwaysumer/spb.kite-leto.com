// Web push via SendPulse: a polite on-site prompt first, the browser's own permission prompt only after "Yes".
(function () {
    var ru = document.documentElement.lang === 'ru';
    var spb = /(^|\.)spb\./.test(location.hostname);
    var T = ru ? {
        title: spb ? 'Сообщать, когда в Сестрорецке ветер?' : 'Сообщать о ветре и акциях?',
        text: 'Пришлём уведомление, когда будет хороший ветер для занятий, и напомним об акциях на обучение. Без спама, отключить можно в любой момент.',
        yes: 'Да, сообщать', no: 'Не сейчас',
        policy: 'Политика конфиденциальности', policyUrl: 'https://kite-leto.com/privacy.html'
    } : {
        title: spb ? 'Get wind alerts for Sestroretsk?' : 'Get wind alerts and offers?',
        text: 'We will let you know when the wind is right for a lesson and remind you about course offers. No spam, turn it off any time.',
        yes: 'Yes, notify me', no: 'Not now',
        policy: 'Privacy policy', policyUrl: 'https://kite-leto.com/privacy-en.html'
    };
    var KEY = 'pushAskedAt', PAUSE = 14 * 24 * 3600 * 1000;   // ask again after 14 days

    var supported = 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window && window.isSecureContext;
    var bot = /bot|crawl|spider|slurp|yandex|google|bing|lighthouse/i.test(navigator.userAgent);
    if (!supported || bot || Notification.permission !== 'default') return;
    var last = 0; try { last = +localStorage.getItem(KEY) || 0; } catch (e) {}
    if (Date.now() - last < PAUSE) return;

    var shown = false;
    function remember() { try { localStorage.setItem(KEY, String(Date.now())); } catch (e) {} }
    function show() {
        if (shown || Notification.permission !== 'default') return;
        shown = true;
        var box = document.createElement('div');
        box.setAttribute('role', 'dialog');
        box.setAttribute('aria-label', T.title);
        box.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;z-index:65;max-width:380px;padding:18px;border-radius:18px;' +
            'border:1px solid rgba(255,255,255,.18);background:rgba(2,6,23,.92);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);' +
            'box-shadow:0 18px 50px rgba(2,8,23,.55);color:#e2e8f0;font-size:14px;line-height:1.5;opacity:0;transform:translateY(12px);transition:opacity .35s ease,transform .35s ease';
        box.innerHTML =
            '<p style="margin:0;font-size:16px;font-weight:600;color:#fff">' + T.title + '</p>' +
            '<p style="margin:8px 0 0;color:rgba(226,232,240,.85)">' + T.text + '</p>' +
            '<div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap">' +
            '<button type="button" data-push="yes" class="btn-primary" style="padding:.6rem 1.1rem">' + T.yes + '</button>' +
            '<button type="button" data-push="no" class="btn-outline" style="padding:.6rem 1.1rem">' + T.no + '</button></div>' +
            '<a href="' + T.policyUrl + '" style="display:inline-block;margin-top:10px;font-size:12px;color:rgba(148,163,184,.9);text-decoration:underline">' + T.policy + '</a>';
        document.body.appendChild(box);
        requestAnimationFrame(function () { box.style.opacity = '1'; box.style.transform = 'none'; });
        function close() { box.style.opacity = '0'; box.style.transform = 'translateY(12px)'; setTimeout(function () { box.remove(); }, 400); }
        box.querySelector('[data-push="no"]').addEventListener('click', function () { remember(); close(); });
        box.querySelector('[data-push="yes"]').addEventListener('click', function () {
            remember(); close();
            if (window.oSpP && typeof window.oSpP.startSubscription === 'function') window.oSpP.startSubscription();
            else Notification.requestPermission();
        });
    }
    // show after 25 seconds on the site, or once the visitor has scrolled half the page
    setTimeout(show, 25000);
    window.addEventListener('scroll', function onScroll() {
        var h = document.documentElement;
        if ((h.scrollTop + innerHeight) / h.scrollHeight > 0.5) { window.removeEventListener('scroll', onScroll); setTimeout(show, 1500); }
    }, { passive: true });
})();
