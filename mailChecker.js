let mailsToTry = ['simon.hellbrueck@gmail.com', 'strawberry.developments@gmx.net'];
let correctMails = [];
let falseMails = [];
let index = 0;
let waitingCounter = 0;

window.addEventListener("load", function () {

        function GetActivationPromise() {
                let isActivatedPromise = new Promise(function (resolve) {
                        chrome.storage.sync.get(['isActivated'], function(result) {
                                resolve(result);
                        })
                });
                return isActivatedPromise;
        }

        function getIndexPromise() {
                let indexPromise = new Promise(function (resolve) {
                        chrome.storage.sync.get(['index'], function(result) {
                                resolve(result);
                        })
                });
                return indexPromise;
        }

        function getCorrectMailsPromise() {
                let correctMailsPromise = new Promise(function (resolve) {
                        chrome.storage.sync.get(['correctMails'], function(result) {
                                resolve(result);
                        })
                });
                return correctMailsPromise;
        }

        function getFalseMailsPromise() {
                let falseMailsPromise = new Promise(function (resolve) {
                        chrome.storage.sync.get(['falseMails'], function(result) {
                                resolve(result);
                        })
                });
                return falseMailsPromise;
        }

        GetActivationPromise().then(function (result) {
                if (result.isActivated) {
                        getIndexPromise().then(function (result) {
                                index = result.index;

                                typeMail()
                                checkMail();

                                function typeMail() {
                                        document.querySelector("#identifierId").click();
                                        document.querySelector("#identifierId").value = "";
                                        document.querySelector("#identifierId").value = mailsToTry[index];
                                        document.querySelector("#identifierNext > div > button > span").click();
                                }

                                async function checkMail() {
                                        checkIfMailIsValid(mailsToTry[index]).then(function (result) {
                                                console.log(result);
                                                if (index < mailsToTry.length - 1) {
                                                        chrome.storage.sync.set({index: ++index}, function () {});
                                                        goToLogin();
                                                        typeMail();
                                                        checkMail();
                                                } else {
                                                        chrome.storage.sync.set({isActivated: false}, function () {
                                                        });
                                                        console.log('done ...');
                                                        getCorrectMailsPromise().then(function (result) {
                                                                console.log('correct mails: ' + result.correctMails);
                                                        });
                                                        getFalseMailsPromise().then(function (result) {
                                                                console.log('false mails: ' + result.falseMails);
                                                        });
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
                                                        }, 50000);
                                                }
                                        });
                                }

                                function checkIfMailIsValid(mail) {
                                        return new Promise((resolve, reject) => {
                                                console.log('checking mail ...');
                                                if (window.location.href.indexOf("https://accounts.google.com/signin/v2/challenge/pwd") > -1) {
                                                        setMailAsCorrect();
                                                        resolve('mail correct');
                                                } else if (document.querySelector("#view_container > div > div > div.pwWryf.bxPAYd > div > div.WEQkZc > div > form > span > section > div > div > div.d2CFce.cDSmF.cxMOTc > div > div.LXRPh > div.dEOOab.RxsGPe > div")) {
                                                        let statusMsg = (document.querySelector("#view_container > div > div > div.pwWryf.bxPAYd > div > div.WEQkZc > div > form > span > section > div > div > div.d2CFce.cDSmF.cxMOTc > div > div.LXRPh > div.dEOOab.RxsGPe > div").childNodes[1].nodeValue);
                                                        if ("Couldn’t find your Google Account".localeCompare(statusMsg) === 0) {
                                                                setMailAsFalse(mail);
                                                                resolve('mail not correct');
                                                        }
                                                } else {
                                                        reject('took too long');
                                                }
                                        });
                                }

                                function setMailAsCorrect() {
                                        correctMails.push(mailsToTry[index]);
                                        chrome.storage.sync.set({correctMails: correctMails}, function () {});
                                }

                                function setMailAsFalse(mail) {
                                        falseMails.push(mail);
                                        chrome.storage.sync.set({falseMails: falseMails}, function () {});
                                }

                                function goToLogin() {
                                        window.location.assign("https://accounts.google.com/servicelogin");
                                }
                        });
                }
        });

});


