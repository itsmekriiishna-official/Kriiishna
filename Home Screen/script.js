const track = document.querySelector('#carousel-track');
const gallery = document.querySelector('.photo-gallery');
const slides = [...track.querySelectorAll('img')];
const dots = [...document.querySelectorAll('.carousel-dots button')];
const menuToggle = document.querySelector('.menu-toggle');
const mobileNavigation = document.querySelector('#mobile-navigation');
let activeSlide = 0;
let pointerStartX = null;

function selectSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  track.style.transform = `translate3d(-${activeSlide * 100}%, 0, 0)`;
  dots.forEach((dot, dotIndex) => {
    const active = dotIndex === activeSlide;
    dot.setAttribute('aria-current', String(active));
    if (active) dot.classList.add('is-active');
    else dot.classList.remove('is-active');
    slides[dotIndex].setAttribute('aria-hidden', String(!active));
  });
}

dots.forEach((dot) => dot.addEventListener('click', () => selectSlide(Number(dot.dataset.slide))));
gallery.addEventListener('pointerdown', (event) => {
  if (event.target.closest('button')) return;
  pointerStartX = event.clientX;
  gallery.setPointerCapture(event.pointerId);
});
gallery.addEventListener('pointerup', (event) => {
  if (pointerStartX === null) return;
  const distance = event.clientX - pointerStartX;
  pointerStartX = null;
  if (Math.abs(distance) > 40) selectSlide(activeSlide + (distance < 0 ? 1 : -1));
});
gallery.addEventListener('pointercancel', () => { pointerStartX = null; });
gallery.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') selectSlide(activeSlide + 1);
  if (event.key === 'ArrowLeft') selectSlide(activeSlide - 1);
});
selectSlide(activeSlide);

function setMenuOpen(open) {
  menuToggle.classList.toggle('is-open', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  mobileNavigation.hidden = !open;
  document.body.classList.toggle('menu-open', open);
}
menuToggle.addEventListener('click', () => setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true'));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') setMenuOpen(false);
});
mobileNavigation.addEventListener('click', (event) => {
  if (event.target.closest('a')) setMenuOpen(false);
});

const clock = document.querySelector('#local-time');
const updateClock = () => {
  const value = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kuala_Lumpur',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).format(new Date());
  clock.textContent = `${value} MYT`;
};
updateClock();
setInterval(updateClock, 1000);

