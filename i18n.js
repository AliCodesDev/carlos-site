// ===== Tiny i18n layer (no build step) =====
// - Language is chosen by: saved choice (localStorage) > browser language > English.
// - Static text uses [data-i18n] (textContent) and [data-i18n-ph] (placeholder).
// - On change, a `langchange` CustomEvent fires so JS-rendered content
//   (e.g. the Energy Test quiz) can re-render itself.
(function () {
    const SUPPORTED = ['en', 'es'];

    const DICT = {
        en: {
            // index.html chrome
            'hero.tagline': 'Photo & Video',
            'filter.all': 'All',
            'filter.portraits': 'Portraits',
            'filter.landscapes': 'Landscapes',
            'filter.events': 'Events',
            'filter.product': 'Product',
            'filter.spaces': 'Spaces',
            'filter.videos': 'Videos',
            'gallery.empty': 'No items in this category yet.',
            'energy.kicker': 'Energy Test',
            'energy.title': "What's your predominant energy?",
            'energy.text': 'Masculine or feminine — find out in 5 minutes.',
            'energy.btn': 'Take the test',
            // energy-test.html chrome
            'et.headerTitle': "What's your predominant energy?",
            'et.headerIntro': 'We all carry both masculine and feminine energy, but one is always predominant. Discover yours in just 5 minutes.',
            'et.gateKicker': 'Last step',
            'et.gateTitle': 'Your result is ready',
            'et.gateText': 'Enter your email to discover your predominant energy.',
            'et.gateBtn': 'See my result',
            'et.gateNote': 'No spam. Just content about energy and personal growth.',
            'et.placeholder': 'you@email.com',
            'et.resultHeading': 'Your predominant energy is',
            'et.resultCTA': 'Talk to me about your result',
            'et.backHome': '← Back to home',
            'nav.back': 'Back',
            'nav.next': 'Next',
            'nav.seeResult': 'See result',
            'result.typeFem': 'Feminine Energy',
            'result.typeMasc': 'Masculine Energy',
            'result.typeBal': 'Balance',
            'result.textFem': 'Your predominant energy is feminine. This means you tend to be guided by intuition, emotional expression and connection. You value the process over the result and feel most comfortable flowing with the present moment.',
            'result.textMasc': 'Your predominant energy is masculine. This means you tend to be guided by logic, action and goals. You value structure and results, and feel most comfortable with a clear plan and a defined direction.',
            'result.textBal': "You have a balance between both energies. This means you can move fluidly between intuition and logic, action and receptivity. It's a powerful state — and one that takes awareness to maintain.",
        },
        es: {
            // index.html chrome
            'hero.tagline': 'Foto y Vídeo',
            'filter.all': 'Todo',
            'filter.portraits': 'Retratos',
            'filter.landscapes': 'Paisajes',
            'filter.events': 'Eventos',
            'filter.product': 'Producto',
            'filter.spaces': 'Espacios',
            'filter.videos': 'Vídeos',
            'gallery.empty': 'No hay nada en esta categoría todavía.',
            'energy.kicker': 'Test de Energía',
            'energy.title': '¿Cuál es tu energía predominante?',
            'energy.text': 'Masculina o femenina — descúbrelo en 5 minutos.',
            'energy.btn': 'Hacer el test',
            // energy-test.html chrome
            'et.headerTitle': '¿Cuál es tu Energía Predominante?',
            'et.headerIntro': 'Aunque todos tenemos ambas energías masculina y femenina, siempre habrá una que sea predominante. Descúbrelo en solo 5 minutos.',
            'et.gateKicker': 'Último paso',
            'et.gateTitle': 'Tu resultado está listo',
            'et.gateText': 'Introduce tu email y descubre cuál es tu energía predominante.',
            'et.gateBtn': 'Ver mi resultado',
            'et.gateNote': 'Sin spam. Solo contenido sobre energía y crecimiento personal.',
            'et.placeholder': 'tu@email.com',
            'et.resultHeading': 'Tu energía predominante es',
            'et.resultCTA': 'Habla conmigo sobre tu resultado',
            'et.backHome': '← Volver al inicio',
            'nav.back': 'Atrás',
            'nav.next': 'Siguiente',
            'nav.seeResult': 'Ver resultado',
            'result.typeFem': 'Energía Femenina',
            'result.typeMasc': 'Energía Masculina',
            'result.typeBal': 'Equilibrio',
            'result.textFem': 'Tu energía predominante es femenina. Esto significa que tiendes a guiarte por la intuición, la expresión emocional y la conexión. Valoras el proceso por encima del resultado y te sientes más cómodo/a fluyendo con el momento presente.',
            'result.textMasc': 'Tu energía predominante es masculina. Esto significa que tiendes a guiarte por la lógica, la acción y los objetivos. Valoras la estructura, los resultados y te sientes más cómodo/a cuando tienes un plan claro y una dirección definida.',
            'result.textBal': 'Tienes un equilibrio entre ambas energías. Esto significa que puedes moverte con fluidez entre la intuición y la lógica, la acción y la receptividad. Es un estado poderoso — y también uno que requiere consciencia para mantener.',
        },
    };

    function detect() {
        try {
            const saved = localStorage.getItem('lang');
            if (saved && SUPPORTED.includes(saved)) return saved;
        } catch (e) { /* localStorage may be unavailable */ }
        const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
        return SUPPORTED.includes(nav) ? nav : 'en';
    }

    let lang = detect();

    function t(key) {
        return (DICT[lang] && DICT[lang][key] != null) ? DICT[lang][key]
             : (DICT.en[key] != null ? DICT.en[key] : key);
    }

    function applyStatic() {
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            el.textContent = t(el.getAttribute('data-i18n'));
        });
        document.querySelectorAll('[data-i18n-ph]').forEach(el => {
            el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph')));
        });
        document.querySelectorAll('.lang-btn').forEach(b => {
            const on = b.dataset.lang === lang;
            b.classList.toggle('active', on);
            b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
    }

    function setLang(next) {
        if (SUPPORTED.includes(next)) lang = next;
        try { localStorage.setItem('lang', lang); } catch (e) { /* ignore */ }
        applyStatic();
        document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
    }

    // Public API for page-specific dynamic content
    window.I18N = { get lang() { return lang; }, t, setLang, supported: SUPPORTED };

    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('.lang-btn').forEach(b => {
            b.addEventListener('click', () => setLang(b.dataset.lang));
        });
        applyStatic();
        // Let dynamic content render in the detected language on first load.
        document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
    });
})();
