document.addEventListener('DOMContentLoaded', function() {
    var pinForm = document.getElementById('pinForm');
    var pinInput = document.getElementById('pinInput');
  
    pinForm.addEventListener('submit', function(event) {
      event.preventDefault();
  
      var enteredPin = pinInput.value;
      if (enteredPin === '1978') {
        // PIN verification successful, allow extension removal
        chrome.management.uninstallSelf({ showConfirmDialog: true });
      } else {
        // Invalid PIN, show an error message
        pinInput.value = '';
        pinInput.placeholder = 'Invalid PIN. Try again.';
      }
    });
  });
  