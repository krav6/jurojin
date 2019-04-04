const saveOptions = () => {
  const clipboardSync = document.getElementById('clipboardSync').value;

  chrome.runtime.sendMessage({
    clipboardSync
  });
};

const restoreOptions = () => {
  chrome.storage.local.get(
    'clipboardSync',
    data =>
      (document.getElementById('clipboardSync').value = data.clipboardSync)
  );
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
