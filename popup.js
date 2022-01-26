let mailsToTry = ['strawberry.developments@gmx.net', 'simon.hellbrueck@gmail.com'];
let correctMails = [];
let falseMails = [];
let index = 0;
let waitingCounter = 0;

window.addEventListener("load", function () {

        typeMail()
        checkMail();

        function typeMail() {
                document.querySelector("#identifierId").click();
                document.querySelector("#identifierId").value = "";
                document.querySelector("#identifierId").value = mailsToTry[index];
                document.querySelector("#identifierNext > div > button > span").click();
        }

        async function checkMail() {
                console.log('correct mails: '+ correctMails);
                console.log('false mails: '+ falseMails);
                checkIfMailIsValid(mailsToTry[index]).then(function (result) {
                        console.log(result);
                        console.log('back')
                        if (index < mailsToTry.length) {
                                index++;
                                goToLogin();
                                typeMail();
                                checkMail();
                        }
                }).catch((result) => {
                        console.log(result);
                        if(waitingCounter < 5) {
                                waitingCounter++;
                                setTimeout(function() {
                                        checkMail();
                                }, 3000);
                        } else {
                                console.log('waiting longer ...');
                                waitingCounter = 0;
                                setTimeout(function() {
                                        goToLogin();
                                        typeMail();
                                        checkMail();
                                }, 900000);
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
                                if("Couldn’t find your Google Account".localeCompare(statusMsg) === 0) {
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
        }

        function goToLogin() {
                window.location.assign("https://accounts.google.com/servicelogin");
        }

        function setMailAsFalse(mail){
                falseMails.push(mail);
        }



        /*startChecking(mailsToTry).then(function(result) {
                console.log('Got the final result: ' + result);
        })*/








        /* function checkIfMailIsValid(mailToTry) {
                 return new Promise((resolve, reject) => {

                         resolve(document.querySelector("#initialView > div.xkfVF"))
                 });
         }*/

        /*checkIfMailIsValid('12312321321@gmail.com').then(function(result) {
                // to do
        })*/


});


