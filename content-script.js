console.log(`    ____             __                                       \r\n   \/ __ \\__  _______\/ \/_  ___  _________ _   _____  _____  __ \r\n  \/ \/_\/ \/ \/ \/ \/ ___\/ __ \\\/ _ \\\/ ___\/ __ \\ | \/ \/ _ \\\/ ___\/_\/ \/_\r\n \/ ____\/ \/_\/ (__  ) \/ \/ \/  __\/ \/  \/ \/_\/ \/ |\/ \/  __\/ \/  \/_  __\/\r\n\/_\/    \\__,_\/____\/_\/ \/_\/\\___\/_\/   \\____\/|___\/\\___\/_\/    \/_\/  `);
// ####################################################################################

// window.addEventListener ("load", myMain, false);

let msgBefore = '';
let openedTab = null;

function nodeInsertedCallback(e) {
    const messagesDiv = document.getElementById('messages');
    const newestPush = messagesDiv.children[0];

    if (newestPush !== undefined) {
        newestPush.click();

        const newestPushContent = newestPush.children[2].children[1];
        const newestPushMsg = newestPushContent.innerHTML.toString();
        const newestPushHerf = newestPushContent.children[0];
        
        if (msgBefore !== newestPushMsg) {
            chrome.runtime.sendMessage({
                toSay: newestPushMsg
            }, function() {
                msgBefore = newestPushMsg;

                /*if (newestPushHerf !== undefined) {
                    if (openedTab !== null) {
                        openedTab.close();
                    }

                    const newestPushCord = newestPushHerf.href.split('=')[1].replace('%22', '');
                    openMaps(newestPushCord);
                }*/

                return true;
            });
        }
    }
};
document.addEventListener('DOMNodeInserted', nodeInsertedCallback);


function openMaps(cord) {
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=1000,height=800,left=50,top=500`;

    openedTab = open(`https://www.google.dk/maps/dir/Karen+Schacks+Vej+42,+2800+Kongens+Lyngby/${cord}/@55.7337835,12.3728096,12z/data=!3m1!4b1!4m8!4m7!1m5!1m1!1s0x46524e7776ee07f3:0x40b47e6cd531d689!2m2!1d12.5276465!2d55.7756502!1m0`, 'test', params);
}