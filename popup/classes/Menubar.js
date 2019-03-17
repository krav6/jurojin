class Menubar {
  constructor() {
    const settingsIcon = document.getElementById('settings');
    settingsIcon.onclick = () => chrome.runtime.openOptionsPage();

    const scrollToTopIcon = document.getElementById('scrollToTop');
    scrollToTopIcon.onclick = () =>
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
  }
}

export default Menubar;
