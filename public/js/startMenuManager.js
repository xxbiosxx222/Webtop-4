export function startMenuManager() {
  const startButton = document.getElementById('str');
  const startMenu = document.getElementById('start-menu');
  
  let isOpen = false;

  function toggleMenu() {
    isOpen = !isOpen;
    startMenu.classList.toggle('hidden', !isOpen);
  }

  startButton.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  document.addEventListener('click', (e) => {
    if (isOpen && !startMenu.contains(e.target)) {
      toggleMenu();
    }
  });

  return {
    isOpen: () => isOpen,
    toggle: toggleMenu,
    close: () => {
      isOpen = false;
      startMenu.classList.add('hidden');
    }
  };
}