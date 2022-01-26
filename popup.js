document.addEventListener('DOMContentLoaded', function() {

    let submitButton = document.getElementById('submit');
    let stopButton = document.getElementById('stop');

    submitButton.addEventListener('click', function() {
        chrome.storage.sync.set({isActivated: true}, function() {});
        chrome.storage.sync.set({correctMails: []}, function () {});
        chrome.storage.sync.set({falseMails: []}, function () {});
        chrome.storage.sync.set({index: 0}, function () {});
        let url  = "https://accounts.google.com/servicelogin";
        chrome.tabs.create({url: url});
    }, false);

    stopButton.addEventListener('click', function() {
        chrome.storage.sync.set({isActivated: false}, function() {});
    }, false);

});