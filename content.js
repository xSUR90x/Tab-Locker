let overlayAppended = false;
let current_url = null;
let flag = false;
let saved_pin = null;

function checkUrlInStorage(url) {
  chrome.storage.sync.get(null, function(data) {
    for (const key in data) {
      if (key === url) {
        current_url = url;
        saved_pin = data[key];
        flag = true;
      }
    }
  });
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'blurWebpage') {

    if (!overlayAppended) { // Check if overlay is not already appended
      blurWebpage(message.pin);
      overlayAppended = true; // Set flag to true after appending the overlay
    }
    sendResponse({ success: true });
  }
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  checkUrlInStorage(tab.url);

  //***************************** */


  if (tab.url.includes(current_url)) {
    if (!overlayAppended) { // Check if overlay is not already appended
      blurWebpage();
      overlayAppended = true; // Set flag to true after appending the overlay
    }
  } else {
    overlayAppended = false; // Reset the flag if the tab is not web.whatsapp.com
  }
});


function blurWebpage(pin) {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0)';
  overlay.style.zIndex = '9999';

  const form = document.createElement('form');
  form.style.position = 'fixed';
  form.style.top = '50%';
  form.style.left = '50%';
  form.style.transform = 'translate(-50%, -50%)';
  form.style.zIndex = '10000';

  const label = document.createElement('label');
  label.textContent = 'Enter 4-digit PIN: ';
  label.style.color = '#fff';
  label.style.marginRight = '5px';

  const input = document.createElement('input');
  input.type = 'password';
  input.maxLength = 4;

  const button = document.createElement('button');
  button.textContent = 'Submit';

  const message = document.createElement('p');
  message.style.color = 'red';
  message.style.marginTop = '10px';
  message.style.display = 'none';

  form.appendChild(label);
  form.appendChild(input);
  form.appendChild(button);
  form.appendChild(message);
  overlay.appendChild(form);

  if (!overlayAppended) {
    document.body.appendChild(overlay);
    overlayAppended = true; // Set flag to true after appending the overlay
  }

  document.addEventListener('contextmenu', (event) => {
    alert('Right click not allowed!');
    event.preventDefault();
  });

  document.addEventListener('keydown', (event) => {
    if (event.keyCode === 123 || (event.ctrlKey && event.shiftKey && event.keyCode === 73)) {
      event.preventDefault();
    }
  });

  button.addEventListener('click', function(event) {
     event.preventDefault();
     const enteredPin = input.value;
    
     if (enteredPin.length === 4 && enteredPin === pin) {      
       pinEntered = true;
       overlay.style.display = 'none';
       document.body.removeChild(overlay);
       overlayAppended = false;
     } else {
       message.textContent = 'Wrong PIN entered.';
       message.style.display = 'block';
       input.value = ''; // Clear the input field after an incorrect entry
     }
  });
  
}


