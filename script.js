// ===== HERO VIDEO: random seek into [0, duration - 30s] on each load =====
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
    heroVideo.addEventListener('loadedmetadata', () => {
        const d = heroVideo.duration;
        if (isFinite(d) && d > 30) {
            heroVideo.currentTime = Math.random() * (d - 30);
        }
        // play() can be rejected if the browser blocks autoplay; catch silently
        heroVideo.play().catch(() => {});
    });
    // If the file is missing, the poster image takes over via the <video> element's poster attr
    heroVideo.addEventListener('error', () => {
        heroVideo.style.display = 'none';
    });
}

// ===== FILTER TABS =====
const filters = document.querySelectorAll('.filter');
const galleryItems = document.querySelectorAll('.gallery-item');
const galleryEmpty = document.querySelector('.gallery-empty');

filters.forEach(btn => {
    btn.addEventListener('click', () => {
        filters.forEach(f => {
            f.classList.remove('active');
            f.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const cat = btn.dataset.filter;
        let visibleCount = 0;
        galleryItems.forEach(item => {
            const matches = cat === 'all' || item.dataset.category === cat;
            item.classList.toggle('hidden', !matches);
            if (matches) visibleCount++;
        });
        if (galleryEmpty) galleryEmpty.hidden = visibleCount > 0;
    });
});

// ===== LIGHTBOX (photos + YouTube videos) =====
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = lightbox.querySelector('.lightbox-img');
const lightboxVideo = lightbox.querySelector('.lightbox-video');
const closeBtn      = lightbox.querySelector('.lightbox-close');
const prevBtn       = lightbox.querySelector('.lightbox-prev');
const nextBtn       = lightbox.querySelector('.lightbox-next');

let currentIndex = 0;

// Visible items respect the active filter
function visibleItems() {
    return [...galleryItems].filter(el => !el.classList.contains('hidden'));
}

function showItem(item) {
    const vid = item.dataset.video;
    if (vid) {
        // Video: embed YouTube iframe
        lightboxImg.hidden = true;
        lightboxImg.removeAttribute('src');
        lightboxVideo.hidden = false;
        lightboxVideo.innerHTML =
            `<iframe src="https://www.youtube.com/embed/${vid}?autoplay=1&rel=0" ` +
            `title="${(item.dataset.title || '').replace(/"/g, '&quot;')}" ` +
            `frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    } else {
        // Photo
        const img = item.querySelector('img');
        lightboxVideo.hidden = true;
        lightboxVideo.innerHTML = '';
        lightboxImg.hidden = false;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || '';
    }
}

function openLightbox(item) {
    const vis = visibleItems();
    currentIndex = vis.indexOf(item);
    if (currentIndex < 0) return;
    showItem(item);
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    // Stop YouTube playback by clearing the iframe
    lightboxVideo.innerHTML = '';
    lightboxVideo.hidden = true;
    lightboxImg.removeAttribute('src');
    lightboxImg.hidden = true;
}

function step(delta) {
    const vis = visibleItems();
    if (!vis.length) return;
    currentIndex = (currentIndex + delta + vis.length) % vis.length;
    showItem(vis[currentIndex]);
}

galleryItems.forEach(item => {
    item.addEventListener('click', () => openLightbox(item));
});

closeBtn.addEventListener('click', closeLightbox);
prevBtn.addEventListener('click',  (e) => { e.stopPropagation(); step(-1); });
nextBtn.addEventListener('click',  (e) => { e.stopPropagation(); step(1);  });
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape')     closeLightbox();
    if (e.key === 'ArrowLeft')  step(-1);
    if (e.key === 'ArrowRight') step(1);
});

// ===== SCROLL FADE-IN =====
const fadeEls = document.querySelectorAll('.gallery-item, .gallery-filters, .energy-cta, .contact');
fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

fadeEls.forEach(el => observer.observe(el));
