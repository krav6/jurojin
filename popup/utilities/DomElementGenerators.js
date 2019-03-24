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
    generateListElementCloseIcon(text, eraseItemFromSelectionList)
  );

  return li;
};

const generateListElementNumber = index => {
  const div = document.createElement('div');
  div.classList.add('number', 'no-select');
  div.innerText = index + 1;

  return div;
};

const generateListElementParagraph = (text, writeToClipboard) => {
  const p = document.createElement('p');
  p.classList.add('list-element', 'no-select');
  p.innerText = text;
  p.onclick = e => writeToClipboard(e.target);

  return p;
};

const generateListElementCloseIcon = (text, eraseItemFromSelectionList) => {
  const i = document.createElement('i');
  i.classList.add('material-icons', 'clickable');
  i.innerText = 'close';
  i.onclick = e => eraseItemFromSelectionList(e, text);

  return i;
};

const generateConfirmationModal = (
  message,
  actionButtonLabel,
  actionMethod
) => {
  const div = document.createElement('div');
  div.classList.add('modal');

  div.appendChild(generateModalMessage(message));
  div.appendChild(generateModalButtons(div, actionButtonLabel, actionMethod));

  return div;
};

const generateModalMessage = message => {
  const p = document.createElement('p');
  p.classList.add('modal-message', 'no-select');
  p.innerText = message;

  return p;
};

const generateModalButtons = (
  parentDomElement,
  actionButtonLabel,
  actionMethod
) => {
  const div = document.createElement('div');
  div.classList.add('modal-buttons');

  const actionButton = generateModalButton(
    actionButtonLabel,
    'modal-button-danger'
  );
  actionButton.onclick = () => {
    actionMethod();
    parentDomElement.remove();
  };
  div.appendChild(actionButton);

  const cancelButton = generateModalButton('Cancel', 'modal-button-cancel');
  cancelButton.onclick = () => parentDomElement.remove();
  div.appendChild(cancelButton);

  return div;
};

const generateModalButton = (message, type) => {
  const button = document.createElement('button');
  button.classList.add('modal-button', type);
  button.innerText = message;

  return button;
};

export { generateListElement, generateConfirmationModal };
