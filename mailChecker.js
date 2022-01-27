let allMails = [
        'isthismymail@gmail.com',
        'oristhismymail@gmail.com@gmail.com',
        'oreventhis@gmail.com',
];

let correctMails = [];
let falseMails = [];
let index = 0;
let waitingCounter = 0;

window.addEventListener("load", function () {

        function getActivationStatus() {
                return new Promise(function (resolve) {
                        chrome.storage.sync.get(['isActivated'], function (result) {
                                resolve(result);
                        })
                });
        }

        function getIndex() {
                return new Promise(function (resolve) {
                        chrome.storage.sync.get(['index'], function (result) {
                                resolve(result);
                        })
                });
        }

        function getCorrectMails() {
                return new Promise(function (resolve) {
                        chrome.storage.sync.get(['correctMails'], function (result) {
                                resolve(result);
                        })
                });
        }

        function getFalseMails() {
                return new Promise(function (resolve) {
                        chrome.storage.sync.get(['falseMails'], function (result) {
                                resolve(result);
                        })
                });
        }

        getActivationStatus().then(function (result) {
                if (result.isActivated) {
                        getIndex().then(function (result) {
                                index = result.index;
                                getCorrectMails().then(function (result) {
                                        correctMails = result.correctMails;
                                        getFalseMails().then(function (result) {
                                                falseMails = result.falseMails;
                                                typeMail()
                                                checkMail();
                                        });
                                });
                        });
                }
        });

        async function checkMail() {
                checkIfMailIsValid(allMails[index]).then(function (result) {
                        console.log(result);
                        if (index < allMails.length - 1) {
                                chrome.storage.sync.set({index: ++index}, function () {});
                                goToLogin();
                                typeMail();
                                checkMail();
                        } else {
                                chrome.storage.sync.set({isActivated: false}, function () {});
                                console.log('done ...');
                                console.log('correct mails: ' + correctMails);
                                console.log('false mails: ' + falseMails);
                        }
                }).catch((result) => {
                        console.log(result);
                        if (waitingCounter < 5) {
                                waitingCounter++;
                                setTimeout(function () {
                                        checkMail();
                                }, 3000);
                        } else {
                                console.log('waiting longer ...');
                                waitingCounter = 0;
                                setTimeout(function () {
                                        goToLogin();
                                        typeMail();
                                        checkMail();
                                }, 900000);
                        }
                });
        }

        function checkIfMailIsValid() {
                return new Promise((resolve, reject) => {
                        console.log('checking mail ...');
                        if (window.location.href.indexOf("https://accounts.google.com/signin/v2/challenge/pwd") > -1) {
                                setMailAsCorrect();
                                resolve('mail correct');
                        } else if (document.querySelector("#view_container > div > div > div.pwWryf.bxPAYd > div > div.WEQkZc > div > form > span > section > div > div > div.d2CFce.cDSmF.cxMOTc > div > div.LXRPh > div.dEOOab.RxsGPe > div")) {
                                let statusMsg = (document.querySelector("#view_container > div > div > div.pwWryf.bxPAYd > div > div.WEQkZc > div > form > span > section > div > div > div.d2CFce.cDSmF.cxMOTc > div > div.LXRPh > div.dEOOab.RxsGPe > div").childNodes[1].nodeValue);
                                if ("Couldn’t find your Google Account".localeCompare(statusMsg) === 0) {
                                        setMailAsFalse();
                                        resolve('mail not correct');
                                }
                        } else {
                                reject('took too long');
                        }
                });
        }

        function typeMail() {
                document.querySelector("#identifierId").click();
                document.querySelector("#identifierId").value = "";
                document.querySelector("#identifierId").value = allMails[index];
                document.querySelector("#identifierNext > div > button > span").click();
        }

        function setMailAsCorrect() {
                correctMails.push(allMails[index]);
                chrome.storage.sync.set({correctMails: correctMails}, function () {});
        }

        function setMailAsFalse() {
                falseMails.push(allMails[index]);
                chrome.storage.sync.set({falseMails: falseMails}, function () {});
        }

        function goToLogin() {
                window.location.assign("https://accounts.google.com/servicelogin");
        }
});


