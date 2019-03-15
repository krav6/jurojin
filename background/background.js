chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    clipboard: [],
    clipboardSync: "browser",
    intervalId: null
  });
});

const updateClipboardStorage = content => {
  if (!content || content.trim() === "") {
    return;
  }

  chrome.storage.sync.get("clipboard", data => {
    const index = data.clipboard.indexOf(content);

    let clipboard;
    if (index !== -1) {
      clipboard = [
        content,
        ...data.clipboard.slice(0, index),
        ...data.clipboard.slice(index + 1, data.clipboard.length)
      ];
    } else {
      clipboard = [content, ...data.clipboard];
    }

    chrome.storage.sync.set({
      clipboard
    });
  });
};

const getContentFromClipboard = () => {
  let sandbox = document.getElementById("sandbox");
  sandbox.value = "";
  sandbox.select();
  if (document.execCommand("paste")) {
    updateClipboardStorage(sandbox.value);
  }
};

const handleOptionsChanged = options => {
  chrome.storage.sync.get("intervalId", data => {
    if (options.clipboardSync == "system" && !data.intervalId) {
      const intervalId = setInterval(getContentFromClipboard, 500);
      chrome.storage.sync.set({
        intervalId
      });
    } else if (options.clipboardSync == "browser" && data.intervalId) {
      clearInterval(data.intervalId);
      chrome.storage.sync.set({
        intervalId: null
      });
    }
  });
};

chrome.runtime.onMessage.addListener((msg, sender) => {
  switch (sender.url) {
    case `chrome-extension://${chrome.runtime.id}/options/options.html`:
      handleOptionsChanged(msg);
      break;
    default:
      updateClipboardStorage(msg.selection);
      break;
  }
});
