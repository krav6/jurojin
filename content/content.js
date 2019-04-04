document.addEventListener('copy', () => {
  if (!chrome.storage) {
    return;
  }

  chrome.storage.local.get('clipboardSync', data => {
    if (data.clipboardSync === 'browser') {
      chrome.runtime.sendMessage({
        selection: window.getSelection().toString()
      });
    }
  });
});
