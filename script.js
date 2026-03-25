// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu toggle
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Filmmaking tabs (Photo / Video)
document.querySelectorAll('.av-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.av-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.av-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
    });
});

// Show more videos
const showMoreBtn = document.getElementById('show-more-videos');
if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
        document.querySelectorAll('.hidden-video').forEach(card => {
            card.classList.remove('hidden-video');
            // Load the iframe src from data-src
            const iframe = card.querySelector('iframe[data-src]');
            if (iframe) {
                iframe.src = iframe.dataset.src;
                iframe.removeAttribute('data-src');
            }
        });
        showMoreBtn.style.display = 'none';
    });
}

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = lightbox.querySelector('.lightbox-img');
const galleryItems = document.querySelectorAll('.gallery-item img');
let currentIndex = 0;

galleryItems.forEach((img, i) => {
    img.addEventListener('click', () => {
        currentIndex = i;
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

lightbox.querySelector('.lightbox-prev').addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    lightboxImg.src = galleryItems[currentIndex].src;
});

lightbox.querySelector('.lightbox-next').addEventListener('click', (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % galleryItems.length;
    lightboxImg.src = galleryItems[currentIndex].src;
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightbox.querySelector('.lightbox-prev').click();
    if (e.key === 'ArrowRight') lightbox.querySelector('.lightbox-next').click();
});

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

// Scroll fade-in animation
const fadeEls = document.querySelectorAll('.section-title, .coaching-centered, .music-card, .gallery-item, .video-card, .energy-test-card, .who-teaser-layout, .youtube-cta-inner');
fadeEls.forEach(el => el.classList.add('fade-in'));

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });

fadeEls.forEach(el => observer.observe(el));

// Active nav link highlight
const sections = document.querySelectorAll('section, footer');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 120;
        if (window.scrollY >= top) current = section.getAttribute('id');
    });
    navAnchors.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === '#' + current) a.classList.add('active');
    });
});
