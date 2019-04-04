import StatusHandler from '../utilities/StatusHandler.js';
import { generateListElement } from '../utilities/DomElementGenerators.js';

class ClipboardList {
  constructor(clipboard) {
    this.selectionList = document.getElementById('selectionList');
    clipboard.forEach((element, index) => {
      const entry = generateListElement(
        element,
        index,
        targetNode => this.writeToClipboard(targetNode),
        (e, text) => this.eraseItemFromSelectionList(e, text)
      );

      this.selectionList.appendChild(entry);
    });
  }

  isTargetBeingDeleted() {
    return Array.prototype.slice
      .call(this.selectionList.childNodes)
      .some(
        element =>
          element.classList.contains('deleted') ||
          element.classList.contains('bump-deleted')
      );
  }

  writeToClipboard(targetNode) {
    if (this.isTargetBeingDeleted()) {
      return;
    }

    navigator.clipboard.writeText(targetNode.textContent);
    if (targetNode.parentNode.firstChild.innerText !== '1') {
      StatusHandler.setProcessingStatus('Copying..');
      this.bumpElementToTheTopOfTheList(targetNode);
    } else {
      StatusHandler.setProcessCompleteStatus('Copied!');
    }
  }

  eraseItemFromSelectionList(e, text) {
    if (this.isTargetBeingDeleted()) {
      return;
    }

    StatusHandler.setProcessingStatus('Removing..');
    e.target.parentNode.classList.add('deleted');
    setTimeout(
      () => this.removeElementAndUpdateNumbers(e.target.parentNode),
      300
    );
    chrome.storage.local.get('clipboard', data => {
      const index = data.clipboard.indexOf(text);
      if (index === -1) {
        return;
      }

      chrome.runtime.sendMessage({
        dataToSync: {
          clipboard: [
            ...data.clipboard.slice(0, index),
            ...data.clipboard.slice(index + 1, data.clipboard.length)
          ]
        }
      });
    });
  }
  
  bumpElementToTheTopOfTheList(element) {
    element.parentNode.classList.add('bump-deleted');
    setTimeout(
      () =>
        this.removeAndAddElementAndUpdateNumbers(
          element.parentNode,
          generateListElement(
            element.textContent,
            0,
            target => this.writeToClipboard(target),
            (e, text) => this.eraseItemFromSelectionList(e, text)
          )
        ),
      300
    );
    chrome.storage.local.get('clipboard', data => {
      const index = data.clipboard.indexOf(element.textContent);
      if (index === -1) {
        return;
      }

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
  }

  removeElementAndUpdateNumbers(element) {
    this.selectionList.removeChild(element);
    this.selectionList.childNodes.forEach(
      (element, index) => (element.firstChild.innerText = index + 1)
    );

    StatusHandler.setProcessCompleteStatus('Removed!');
  }

  removeAndAddElementAndUpdateNumbers(elementToRemove, elementToAdd) {
    this.selectionList.removeChild(elementToRemove);
    this.selectionList.prepend(elementToAdd);
    this.selectionList.childNodes.forEach(
      (element, index) => (element.firstChild.innerText = index + 1)
    );

    StatusHandler.setProcessCompleteStatus('Copied!');
  }
}

export default ClipboardList;
