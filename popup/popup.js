import ClipboardList from './classes/ClipboardList.js';
import MenuBar from './classes/Menubar.js';

let clipboardList = null;
let menuBar = null; //eslint-disable-line no-unused-vars

window.onload = () => {
  chrome.storage.local.get('clipboard', data => {
    clipboardList = new ClipboardList(data.clipboard);
  });

  document.addEventListener('keydown', e =>
    handleKeyDown(e, clipboardList.selectionList)
  );

  menuBar = new MenuBar();

  document.body.onclick = e => {
    if (
      !e.target.closest('.modal') &&
      !e.target.classList.contains('modal-open')
    ) {
      const modals = document.getElementsByClassName('modal');
      Array.prototype.forEach.call(modals, element => element.remove());
    }
  };
};

const handleKeyDown = (e, selectionList) => {
  const parsedKey = parseInt(e.key);
  if (
    parsedKey > 0 &&
    parsedKey < 10 &&
    selectionList.childNodes.length >= parsedKey
  ) {
    clipboardList.writeToClipboard(
      selectionList.childNodes[parsedKey - 1].childNodes[1]
    );
  }
};
