import { generateConfirmationModal } from '../utilities/DomElementGenerators.js';
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

    const onDelete = () => {
      const selectionList = document.getElementById('selectionList');
      while (selectionList.firstChild) {
        selectionList.removeChild(selectionList.firstChild);
      }
    };

    const deleteAllIcon = document.getElementById('deleteAll');
    deleteAllIcon.onclick = () => {
      const menu = document.getElementById('menu');
      if (document.getElementsByClassName('modal').length !== 0) {
        return;
      }

      menu.appendChild(
        generateConfirmationModal(
          'Are you sure you want to delete your clipboard history?',
          'Delete',
          onDelete
        )
      );
    };
  }
}

export default Menubar;
