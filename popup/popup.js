import ClipboardList from './classes/ClipboardList.js';
import MenuBar from './classes/Menubar.js';

let clipboardList = null;
let menuBar = null; //eslint-disable-line no-unused-vars

window.onload = () => {
  chrome.storage.sync.get('clipboard', data => {
    clipboardList = new ClipboardList(data.clipboard);
  });

  document.addEventListener('keydown', e =>
    handleKeyDown(e, clipboardList.selectionList)
  );

  menuBar = new MenuBar();
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
