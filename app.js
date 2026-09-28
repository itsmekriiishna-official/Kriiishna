/* ==========================================================================
   Rachel How — Interactive Client Application Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  initNavigationRouter();
  initMobileMenu();
  initArticleHoverPreview();
  initHomeProjectMasonry();
  initHomeGallery();
});

/**
 * Keeps the home projects in the same two independent columns as the
 * reference layout, rather than allowing CSS grid rows to force equal heights.
 */
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

/**
 * 1. Real-time Clock showing MYT (Kuala Lumpur / UTC+8)
 */
function initLiveClock() {
  const clockElement = document.getElementById('liveClock');
  if (!clockElement) return;

  function updateClock() {
    const now = new Date();
    // Format to MYT Time (UTC+8)
    const options = {
      timeZone: 'Asia/Kuala_Lumpur',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    clockElement.textContent = now.toLocaleTimeString('en-US', options);
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/**
 * 2. SPA Navigation & Page Router
 */
function initNavigationRouter() {
  const navLinks = document.querySelectorAll('.nav-link');
  const pageSections = document.querySelectorAll('.page-section');
  const sidebarNavItems = document.querySelectorAll('.sidebar .nav-item');
  const sidebar = document.getElementById('sidebar');

  function navigateTo(pageId) {
    if (!pageId) return;

    // Normalize pageId
    const targetPageId = pageId.replace('#', '');
    const targetSection = document.getElementById(`page-${targetPageId}`);

    if (!targetSection) return;

    // Hide all page sections
    pageSections.forEach(section => {
      section.classList.remove('active');
    });

    // Show target section
    targetSection.classList.add('active');

    // Update active state in sidebar nav items
    sidebarNavItems.forEach(item => {
      const itemPage = item.getAttribute('data-page');
      if (itemPage === targetPageId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Close mobile menu if open
    if (sidebar && sidebar.classList.contains('open')) {
      sidebar.classList.remove('open');
    }

    // Scroll to top of window smooth
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update URL hash without forcing full page reload
    if (history.pushState) {
      history.pushState(null, null, `#${targetPageId}`);
    } else {
      location.hash = `#${targetPageId}`;
    }
  }

  // Add click listeners to all nav links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const pageAttr = link.getAttribute('data-page');
      const hrefAttr = link.getAttribute('href');

      if (pageAttr) {
        e.preventDefault();
        navigateTo(pageAttr);
      } else if (hrefAttr && hrefAttr.startsWith('#')) {
        e.preventDefault();
        navigateTo(hrefAttr.substring(1));
      }
    });
  });

  // Check initial hash on load
  const initialHash = window.location.hash.substring(1);
  if (initialHash && document.getElementById(`page-${initialHash}`)) {
    navigateTo(initialHash);
  } else {
    navigateTo('home');
  }

  // Handle browser back/forward buttons
  window.addEventListener('popstate', () => {
    const currentHash = window.location.hash.substring(1) || 'home';
    navigateTo(currentHash);
  });
}

/**
 * 3. Mobile Navigation Drawer Toggle
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');

  if (menuToggle && sidebar) {
    menuToggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (sidebar.classList.contains('open') && 
          !sidebar.contains(e.target) && 
          !menuToggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });
  }
}

/**
 * 4. Article Item Floating Image Preview Popup
 */
function initArticleHoverPreview() {
  const articleItems = document.querySelectorAll('.article-item');
  const hoverPreview = document.getElementById('hoverPreview');
  const hoverPreviewImg = document.getElementById('hoverPreviewImg');

  if (!hoverPreview || !hoverPreviewImg) return;

  articleItems.forEach(item => {
    item.addEventListener('mouseenter', (e) => {
      const imgSrc = item.getAttribute('data-preview');
      if (imgSrc) {
        hoverPreviewImg.src = imgSrc;
        hoverPreview.classList.add('show');
      }
    });

    item.addEventListener('mousemove', (e) => {
      // Position floating preview thumbnail offset from mouse cursor
      hoverPreview.style.left = `${e.clientX + 20}px`;
      hoverPreview.style.top = `${e.clientY - 40}px`;
    });

    item.addEventListener('mouseleave', () => {
      hoverPreview.classList.remove('show');
    });
  });
}
