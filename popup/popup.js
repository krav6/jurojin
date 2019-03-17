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

  const scrollToTopIcon = document.getElementById('scrollToTop');
  scrollToTopIcon.onclick = () =>
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
};

const generateListElement = (selectionList, text, index) => {
  const li = document.createElement('li');
  li.appendChild(generateListElementNumber(index));
  li.appendChild(generateListElementParagraph(text));
  li.appendChild(generateListElementCloseIcon(selectionList, text));

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

const isTargetBeingDeleted = selectionList =>
  Array.prototype.slice
    .call(selectionList.childNodes)
    .some(
      element =>
        element.classList.contains('deleted') ||
        element.classList.contains('bump-deleted')
    );

const writeToClipboard = targetNode => {
  if (isTargetBeingDeleted(targetNode.parentNode.parentNode)) {
    return;
  }

  navigator.clipboard.writeText(targetNode.textContent);
  if (targetNode.parentNode.firstChild.innerText !== '1')
    bumpElementToTheTopOfTheList(targetNode.parentNode.parentNode, targetNode);
};

const eraseItemFromSelectionList = (selectionList, e, text) => {
  if (isTargetBeingDeleted(e.target.parentNode.parentNode)) {
    return;
  }

  e.target.parentNode.classList.add('deleted');
  setTimeout(
    () => removeElementAndUpdateNumbers(selectionList, e.target.parentNode),
    300
  );
  chrome.storage.sync.get('clipboard', data => {
    const index = data.clipboard.indexOf(text);
    chrome.runtime.sendMessage({
      dataToSync: {
        clipboard: [
          ...data.clipboard.slice(0, index),
          ...data.clipboard.slice(index + 1, data.clipboard.length)
        ]
      }
    });
  });
};

const bumpElementToTheTopOfTheList = (selectionList, element) => {
  element.parentNode.classList.add('bump-deleted');
  setTimeout(
    () =>
      removeAndAddElementAndUpdateNumbers(
        selectionList,
        element.parentNode,
        generateListElement(selectionList, element.textContent, 0)
      ),
    300
  );
  chrome.storage.sync.get('clipboard', data => {
    const index = data.clipboard.indexOf(element.textContent);
    chrome.runtime.sendMessage({
      dataToSync: {
        clipboard: [
          element.textContent,
          ...data.clipboard.slice(0, index),
          ...data.clipboard.slice(index + 1, data.clipboard.length)
        ],
        latestElement: element.textContent
      }
    });
  });
};

const removeElementAndUpdateNumbers = (selectionList, element) => {
  selectionList.removeChild(element);
  selectionList.childNodes.forEach(
    (element, index) => (element.firstChild.innerText = index + 1)
  );
};

const removeAndAddElementAndUpdateNumbers = (
  selectionList,
  elementToRemove,
  elementToAdd
) => {
  selectionList.removeChild(elementToRemove);
  selectionList.prepend(elementToAdd);
  selectionList.childNodes.forEach(
    (element, index) => (element.firstChild.innerText = index + 1)
  );
};
