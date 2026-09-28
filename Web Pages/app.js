document.addEventListener('DOMContentLoaded', () => {
  const clock = document.getElementById('liveClock');
  if (clock) {
    const updateClock = () => {
      clock.textContent = new Date().toLocaleTimeString('en-US', {
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

  const toggle = document.getElementById('menuToggle');
  const sidebar = document.getElementById('sidebar');
  if (toggle && sidebar) toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
});
