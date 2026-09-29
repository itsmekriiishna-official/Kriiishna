const clock = document.getElementById("liveClock");
const updateClock = () => {
  clock.textContent = new Date().toLocaleTimeString("en-US", {
    timeZone: "Asia/Kuala_Lumpur",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
};

updateClock();
window.setInterval(updateClock, 1000);

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");
const closeMenu = () => {
  sidebar.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
};

menuToggle.addEventListener("click", () => {
  const isOpen = sidebar.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

document.addEventListener("click", event => {
  if (sidebar.classList.contains("open") && !sidebar.contains(event.target) && !menuToggle.contains(event.target)) {
    closeMenu();
  }
});

const slides = document.querySelectorAll(".home-gallery-slide");
const dots = document.querySelectorAll(".home-gallery-dot");

dots.forEach((dot, selectedIndex) => {
  dot.addEventListener("click", () => {
    slides.forEach((slide, slideIndex) => slide.classList.toggle("active", slideIndex === selectedIndex));
    dots.forEach((item, dotIndex) => {
      const selected = dotIndex === selectedIndex;
      item.classList.toggle("active", selected);
      if (selected) item.setAttribute("aria-current", "true");
      else item.removeAttribute("aria-current");
    });
  });
});