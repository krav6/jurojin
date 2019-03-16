document.addEventListener("copy", e => {
  if (!chrome.storage) {
    return;
  }
  
  chrome.storage.sync.get("clipboardSync", data => {
    if (data.clipboardSync === "browser") {
      chrome.runtime.sendMessage({
        selection: window.getSelection().toString()
      });
    }
  });
});
