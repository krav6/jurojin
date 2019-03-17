chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    clipboard: [
      'Thanks for using Jurojin!',
      'Press Ctrl+Shift+A (or Command+Shift+A on a Mac) to toggle this window.',
      'Click on a list element or press the 1-9 keys to copy it to the clipboard.'
    ],
    clipboardSync: 'browser',
    latestElement: 'Thanks for using Jurojin!',
    intervalId: null
  });
});

const updateClipboardStorage = content => {
  if (!content || content.trim() === '') {
    return;
  }

  chrome.storage.sync.get(['clipboard', 'latestElement'], data => {
    if (data.latestElement === content) {
      return;
    }

    const index = data.clipboard.indexOf(content);
    const clipboard =
      index !== -1
        ? [
            content,
            ...data.clipboard.slice(0, index),
            ...data.clipboard.slice(index + 1, data.clipboard.length)
          ]
        : [content, ...data.clipboard];

    chrome.storage.sync.set({
      clipboard,
      latestElement: content
    });
  });
};

const getContentFromClipboard = () => {
  const placeholderTextArea = document.getElementById('placeholder');
  placeholderTextArea.value = '';
  placeholderTextArea.select();
  if (document.execCommand('paste')) {
    updateClipboardStorage(placeholderTextArea.value);
  }
};

const handleOptionsChanged = options => {
  chrome.storage.sync.set(
    {
      clipboardSync: options.clipboardSync
    },
    () => {
      chrome.storage.sync.get('intervalId', data => {
        if (options.clipboardSync == 'system' && !data.intervalId) {
          const intervalId = setInterval(getContentFromClipboard, 500);
          chrome.storage.sync.set({
            intervalId
          });
        } else if (options.clipboardSync == 'browser' && data.intervalId) {
          clearInterval(data.intervalId);
          chrome.storage.sync.set({
            intervalId: null
          });
        }
      });
    }
  );
};

const handleSyncRequest = msg => chrome.storage.sync.set(msg.dataToSync);

chrome.runtime.onMessage.addListener((msg, sender) => {
  switch (sender.url) {
    case `chrome-extension://${chrome.runtime.id}/options/options.html`:
      handleOptionsChanged(msg);
      break;
    case `chrome-extension://${chrome.runtime.id}/popup/popup.html`:
      handleSyncRequest(msg);
      break;
    default:
      updateClipboardStorage(msg.selection);
      break;
  }
});
