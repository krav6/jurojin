const saveOptions = () => {
  const clipboardSync = document.getElementById('clipboardSync').value;
  chrome.storage.sync.set({
    clipboardSync
  });

  chrome.runtime.sendMessage({
    clipboardSync
  });
};

const restoreOptions = () => {
  chrome.storage.sync.get(
    'clipboardSync',
    data =>
      (document.getElementById('clipboardSync').value = data.clipboardSync)
  );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
