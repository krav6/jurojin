window.onload = () => {
  chrome.storage.sync.get('clipboard', data => {
    const selectionList = document.getElementById('selectionList');
    data.clipboard.forEach(element => {
      const entry = generateListElement(selectionList, element);
      selectionList.appendChild(entry);
    });
  });

  const settingsIcon = document.getElementById('settings');
  settingsIcon.onclick = () => chrome.runtime.openOptionsPage();
};

const generateListElement = (selectionList, text) => {
  const li = document.createElement('li');
  li.appendChild(generateListElementParagraph(text));
  li.appendChild(generateListElementCloseIcon(selectionList, text));
  li.appendChild(generateListElementNotification());

  return li;
};

const generateListElementParagraph = text => {
  const p = document.createElement('p');
  p.innerText = text;
  p.onclick = e => writeToClipboard(e);

  return p;
};

const generateListElementCloseIcon = (selectionList, text) => {
  const i = document.createElement('i');
  i.classList.add('fas', 'fa-times', 'fa-lg');
  i.onclick = e => eraseItemFromSelectionList(selectionList, e, text);

  return i;
};

const generateListElementNotification = () => {
  const div = document.createElement('div');
  div.classList.add('notification');
  div.innerText = 'Copied to the clipboard!';

  return div;
};

const writeToClipboard = e => {
  const notification = e.target.parentNode.childNodes[2];
  notification.classList.add('visible');
  setTimeout(() => notification.classList.remove('visible'), 1000);

  navigator.clipboard.writeText(e.target.textContent);
};

const eraseItemFromSelectionList = (selectionList, e, text) => {
  selectionList.removeChild(e.target.parentNode);
  chrome.storage.sync.get('clipboard', data => {
    const index = data.clipboard.indexOf(text);
    chrome.storage.sync.set({
      clipboard: [
        ...data.clipboard.slice(0, index),
        ...data.clipboard.slice(index + 1, data.clipboard.length)
      ]
    });
  });
};
