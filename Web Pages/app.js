document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  initNavigationRouter();
  initMobileMenu();
  initArticleHoverPreview();
  initHomeProjectMasonry();
  initHomeGallery();
});

function initHomeProjectMasonry() {
  const grid = document.querySelector('.bento-grid');
  if (!grid || grid.dataset.masonryReady) return;

  const columns = [
    ['deskslope-card', 'snack-card', 'campfire-card', 'catrain-card'],
    ['dumpling-card', 'sunset-card', 'gallery-card']
  ];

  columns.forEach((cardClasses, index) => {
    const column = document.createElement('div');
    column.className = `home-project-column home-project-column-${index + 1}`;
    cardClasses.forEach(cardClass => {
      const card = grid.querySelector(`.${cardClass}`);
      if (card) column.appendChild(card);
    });
    grid.appendChild(column);
  });

  grid.dataset.masonryReady = 'true';
}

function initHomeGallery() {
  const gallery = document.querySelector('.home-gallery');
  if (!gallery) return;
  const slides = gallery.querySelectorAll('.home-gallery-slide');
  const dots = gallery.querySelectorAll('.home-gallery-dot');
  dots.forEach((dot, index) => dot.addEventListener('click', () => {
    slides.forEach((slide, slideIndex) => slide.classList.toggle('active', slideIndex === index));
    dots.forEach((item, dotIndex) => {
      const active = dotIndex === index;
      item.classList.toggle('active', active);
      item.toggleAttribute('aria-current', active);
    });
  }));
}

function initLiveClock() {
  const clockElement = document.getElementById('liveClock');
  if (!clockElement) return;
  const updateClock = () => {
    clockElement.textContent = new Date().toLocaleTimeString('en-US', {
      timeZone: 'Asia/Kuala_Lumpur',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };
  updateClock();
  setInterval(updateClock, 1000);
}

function initNavigationRouter() {
  const navLinks = document.querySelectorAll('.nav-link');
  const pageSections = document.querySelectorAll('.page-section');
  const sidebarNavItems = document.querySelectorAll('.sidebar .nav-item');
  const sidebar = document.getElementById('sidebar');

  function navigateTo(pageId) {
    if (!pageId) return;
    const targetPageId = pageId.replace('#', '');
    const targetSection = document.getElementById(`page-${targetPageId}`);
    if (!targetSection) return;
    pageSections.forEach(section => section.classList.remove('active'));
    targetSection.classList.add('active');
    sidebarNavItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-page') === targetPageId);
    });
    if (sidebar) sidebar.classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.pushState(null, null, `#${targetPageId}`);
  }

  navLinks.forEach(link => link.addEventListener('click', event => {
    const page = link.getAttribute('data-page');
    const href = link.getAttribute('href');
    if (page) {
      event.preventDefault();
      navigateTo(page);
    } else if (href && href.startsWith('#')) {
      event.preventDefault();
      navigateTo(href.slice(1));
    }
  }));

  const initialPage = window.location.hash.slice(1);
  if (initialPage && document.getElementById(`page-${initialPage}`)) navigateTo(initialPage);
  else if (document.getElementById('page-home')) navigateTo('home');

  window.addEventListener('popstate', () => {
    const page = window.location.hash.slice(1) || 'home';
    navigateTo(page);
  });
}

function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  if (!menuToggle || !sidebar) return;

  menuToggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  document.addEventListener('click', event => {
    if (sidebar.classList.contains('open') && !sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
      sidebar.classList.remove('open');
    }
  });
}

function initArticleHoverPreview() {
  const items = document.querySelectorAll('.article-item');
  const preview = document.getElementById('hoverPreview');
  const image = document.getElementById('hoverPreviewImg');
  if (!preview || !image) return;

  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      const source = item.getAttribute('data-preview');
      if (!source) return;
      image.src = source;
      preview.classList.add('show');
    });
    item.addEventListener('mousemove', event => {
      preview.style.left = `${event.clientX + 20}px`;
      preview.style.top = `${event.clientY - 40}px`;
    });
    item.addEventListener('mouseleave', () => preview.classList.remove('show'));
  });
}
