import { WindowManager } from './windowManager.js';

export function clockManager() {
  const clockElement = document.getElementById('clock');
  const optionMenu = document.getElementById('option-menu');

  function updateClock() {
    const now = new Date();

    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');

    clockElement.innerHTML = `${hours}:${minutes}<br>${year}-${month}-${day}`;
  }
  let isOpen = false;

  function toggleMenu() {
    isOpen = !isOpen;
    optionMenu.classList.toggle('hidden', !isOpen);
  }

  clock.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  document.addEventListener('click', (e) => {
    if (isOpen && !optionMenu.contains(e.target)) {
      toggleMenu();
    }
  });
  
  updateClock();
  setInterval(updateClock, 1000);
}