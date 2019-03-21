const generateListElement = (
  text,
  index,
  writeToClipboard,
  eraseItemFromSelectionList
) => {
  const li = document.createElement('li');
  li.appendChild(generateListElementNumber(index));
  li.appendChild(generateListElementParagraph(text, writeToClipboard));
  li.appendChild(
    generateListElementCloseIcon(
      text,
      eraseItemFromSelectionList
    )
  );

  return li;
};

const generateListElementNumber = index => {
  const div = document.createElement('div');
  div.classList.add('number');
  div.innerText = index + 1;

  return div;
};

const generateListElementParagraph = (text, writeToClipboard) => {
  const p = document.createElement('p');
  p.innerText = text;
  p.onclick = e => writeToClipboard(e.target);

  return p;
};

const generateListElementCloseIcon = (
  text,
  eraseItemFromSelectionList
) => {
  const i = document.createElement('i');
  i.classList.add('material-icons', 'clickable');
  i.innerText = 'close';
  i.onclick = e => eraseItemFromSelectionList(e, text);

  return i;
};

export { generateListElement };
