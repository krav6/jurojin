window.onload = () => {
  chrome.storage.sync.get('clipboard', data => {
    const selectionList = document.getElementById('selectionList');
    data.clipboard.forEach((element, index) => {
      const entry = generateListElement(selectionList, element, index);
      selectionList.appendChild(entry);
    });

    document.addEventListener('keydown', e => handleKeyDown(e, selectionList));
  });

  const settingsIcon = document.getElementById('settings');
  settingsIcon.onclick = () => chrome.runtime.openOptionsPage();
};

const generateListElement = (selectionList, text, index) => {
  const li = document.createElement('li');
  li.appendChild(generateListElementNumber(index));
  li.appendChild(generateListElementParagraph(text));
  li.appendChild(generateListElementCloseIcon(selectionList, text));
  li.appendChild(generateListElementNotification());

  return li;
};

const generateListElementNumber = index => {
  const div = document.createElement('div');
  div.classList.add('number');
  div.innerText = index + 1;

  return div;
};

const generateListElementParagraph = text => {
  const p = document.createElement('p');
  p.innerText = text;
  p.onclick = e => writeToClipboard(e.target);

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

const handleKeyDown = (e, selectionList) => {
  const parsedKey = parseInt(e.key);
  if (
    parsedKey > 0 &&
    parsedKey < 10 &&
    selectionList.childNodes.length >= parsedKey
  ) {
    writeToClipboard(selectionList.childNodes[parsedKey - 1].childNodes[1]);
  }
};

const writeToClipboard = targetNode => {
  const notification = targetNode.parentNode.lastChild;
  notification.classList.add('visible');
  setTimeout(() => notification.classList.remove('visible'), 1000);

  navigator.clipboard.writeText(targetNode.textContent);
};

const eraseItemFromSelectionList = (selectionList, e, text) => {
  e.target.parentNode.classList.add('deleted');
  setTimeout(
    () => removeElementAndUpdateNumbers(selectionList, e.target.parentNode),
    300
  );
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

const removeElementAndUpdateNumbers = (selectionList, element) => {
  selectionList.removeChild(element);
  selectionList.childNodes.forEach(
    (element, index) => (element.childNodes[0].innerText = index + 1)
  );
};
