import '../../assets/img/icon-34.png';
import '../../assets/img/icon-128.png';
import rules from './diff-rules'

console.log('This is the background page.');
console.log('Put the background scripts here.');
const jsLocation = 'contentScript.bundle.js';


chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log('----------------- background.js: chrome.tabs.onUpdated.addListener');
  if (changeInfo.status === 'complete' && jsLocation !== null) {
    console.log('----------------- background.js: ' + tabId + ',  chrome.tabs.executeScript: ' + jsLocation);
    console.log('----------------- background.js: chrome.tabs.executeScript');
    chrome.tabs.executeScript(tabId, {
      file: jsLocation,
      runAt: 'document_end',
    });
  }
});







chrome.runtime.onInstalled.addListener(function() {
	chrome.storage.sync.set({rules});
});
