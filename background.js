let flag = 0;
let pin = null;

chrome.storage.sync.get(null, function(data) {
  console.log(data);
});


function checkUrlInStorage(url, tabId) {
  chrome.storage.sync.get(null, function(data) {
    for (const key in data) {
      if (key === url) {
        pin = data[key];
        // URL exists, do something with the PIN
        console.log(`URL found: ${url}, PIN: ${pin}`);
        // Call a function or perform actions with the extracted PIN
        // ...
        flag = 1;
        chrome.tabs.sendMessage(tabId, { pin: pin, action: 'blurWebpage' });
        break; // Exit the loop if the URL is found
      }
    }
    // URL not found in storage
    if (flag === 0) {
      console.log(`URL not found: ${url}`);
    }
    
    if (flag === 1) {
      // Flag is 1, perform your logic here
      console.log('Flag is 1');
    } else {
      // Flag is 0, perform your logic here
      console.log('Flag is 0');
    }
  });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    flag = 0;
    checkUrlInStorage(tab.url, tabId);
  }
});

chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.tabs.get(tabId, (tab) => {
    flag = 0;
    checkUrlInStorage(tab.url, tabId);
    if (flag) {
      console.log("Dhukeche");
      chrome.tabs.sendMessage(tabId, { pin: pin, action: 'blurWebpage' });
    }
  });
});





  