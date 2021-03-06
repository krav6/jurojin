class StatusHandler {
  static clearStatus() {
    const statusBar = document.getElementById('statusBar');

    while (statusBar.firstChild) {
      statusBar.firstChild.remove();
    }

    statusBar.classList.remove('fade');
  }

  static setProcessingStatus(msg) {
    StatusHandler.clearStatus();

    const spinnerIcon = document.createElement('i');
    spinnerIcon.classList.add(
      'material-icons',
      'status-icon',
      'spinner'
    );
    spinnerIcon.innerText = 'sync';

    const statusBar = document.getElementById('statusBar');
    statusBar.innerText = msg;
    statusBar.prepend(spinnerIcon);
  }

  static setProcessCompleteStatus(msg) {
    StatusHandler.clearStatus();

    const checkIcon = document.createElement('i');
    checkIcon.classList.add('material-icons', 'status-icon');
    checkIcon.innerText = 'check';

    const statusBar = document.getElementById('statusBar');
    statusBar.innerText = msg;
    statusBar.prepend(checkIcon);

    setTimeout(() => statusBar.classList.add('fade'), 1500);
  }
}

export default StatusHandler;
