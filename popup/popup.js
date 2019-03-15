window.onload = () => {
  chrome.storage.sync.get("clipboard", data => {
    let selectionList = document.getElementById("selectionList");
    data.clipboard.forEach((element, index) => {
      let entry = generateListElement(selectionList, element, index);
      selectionList.appendChild(entry);
    });
  });

  let settingsIcon = document.getElementById("settings");
  settingsIcon.onclick = () => chrome.runtime.openOptionsPage();
};

const generateListElement = (selectionList, text, index) => {
  let li = document.createElement("li");
  li.appendChild(generateListElementParagraph(text));
  if (index !== 0)
    li.appendChild(generateListElementCloseIcon(selectionList, text));

  return li;
};

const generateListElementParagraph = text => {
  let p = document.createElement("p");
  p.innerText = text;
  p.onclick = e => writeToClipboard(e);

  return p;
};

const generateListElementCloseIcon = (selectionList, text) => {
  let i = document.createElement("i");
  i.classList.add("fas", "fa-times", "fa-lg");
  i.onclick = e => eraseItemFromSelectionList(selectionList, e, text);

  return i;
};

const writeToClipboard = e =>
  navigator.clipboard.writeText(e.target.textContent);

const eraseItemFromSelectionList = (selectionList, e, text) => {
  selectionList.removeChild(e.target.parentNode);
  chrome.storage.sync.get("clipboard", data => {
    const index = data.clipboard.indexOf(text);
    chrome.storage.sync.set({
      clipboard: [
        ...data.clipboard.slice(0, index),
        ...data.clipboard.slice(index + 1, data.clipboard.length)
      ]
    });
  });
};
