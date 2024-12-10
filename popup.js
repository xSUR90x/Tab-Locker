function viewSavedPins() {
  var pinList = document.getElementById('pinList');
  pinList.innerHTML = '';

  chrome.storage.sync.get(null, function(data) {
    for (var key in data) {
      if (data.hasOwnProperty(key)) {
        var url = key;
        var pin = data[key];

        var pinEntry = document.createElement('div');
        pinEntry.innerHTML = '<strong>URL:</strong> ' + url + ', <strong>PIN:</strong> ' + pin;

        var changeButton = document.createElement('button');
        changeButton.innerText = 'Change PIN';
        changeButton.addEventListener('click', createChangePINHandler(url));

        var deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.addEventListener('click', createDeletePINHandler(url));

        pinEntry.appendChild(changeButton);
        pinEntry.appendChild(deleteButton);
        pinList.appendChild(pinEntry);
      }
    }
  });
}

function createChangePINHandler(url) {
  return function() {
    var newPIN = prompt('Enter the new 4-digit PIN:');
    if (newPIN && newPIN.length === 4) {
      chrome.storage.sync.set({ [url]: newPIN }, function() {
        console.log('PIN changed successfully');
        viewSavedPins();
      });
    }
  };
}

function createDeletePINHandler(url) {
  return function() {
    chrome.storage.sync.remove(url, function() {
      console.log('PIN deleted successfully');
      viewSavedPins();
    });
  };
}

document.addEventListener('DOMContentLoaded', function() {
  const saveButton = document.getElementById('save');
  const successMessage = document.getElementById('success-message');
  const mainPinInput = document.getElementById('main_pin');
  const urlEntrySection = document.getElementById('urlEntry');

  // Event listener for the Save button
  saveButton.addEventListener('click', function() {
    const urlInput = document.getElementById('link');
    const url = urlInput.value;

    const pinInput = document.getElementById('pin');
    const pin = pinInput.value;

    if (url && pin.length === 4) {
      chrome.storage.sync.set({ [url]: pin }, function() {
        successMessage.textContent = 'PIN added successfully. Kindly refresh the webpage to reflect the changes!';
        pinInput.value = '';
        urlInput.value = '';
        urlInput.focus();
        pinInput.focus();

        // Send message to content script to update the PIN value
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          const activeTab = tabs[0];
          chrome.tabs.sendMessage(activeTab.id, { action: 'updatePin', [url]: pin });
        });
      });
    }
  });

  // Event listener for the View Saved PINs button
  viewPinsButton.addEventListener('click', () => {
    const mainPin = mainPinInput.value;
    // Check if the entered main PIN is correct
    if (mainPin === '1234') { // Replace '1234' with your actual main PIN
      // Clear the main PIN input field
      mainPinInput.value = '';
      // Show the URL and PIN entry section
      urlEntrySection.style.display = 'block';
      viewSavedPins();
    } else {
      // Display an error message for incorrect main PIN
      mainPinInput.value = '';
      alert('Incorrect main PIN!');
    }
  });
});
