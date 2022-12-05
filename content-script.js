console.log(`    ____             __                                       \r\n   \/ __ \\__  _______\/ \/_  ___  _________ _   _____  _____  __ \r\n  \/ \/_\/ \/ \/ \/ \/ ___\/ __ \\\/ _ \\\/ ___\/ __ \\ | \/ \/ _ \\\/ ___\/_\/ \/_\r\n \/ ____\/ \/_\/ (__  ) \/ \/ \/  __\/ \/  \/ \/_\/ \/ |\/ \/  __\/ \/  \/_  __\/\r\n\/_\/    \\__,_\/____\/_\/ \/_\/\\___\/_\/   \\____\/|___\/\\___\/_\/    \/_\/  `);
// ####################################################################################

let messagesObserver = new MutationObserver(mutations => {
    for (let mutation of mutations) {
        for (const addedNode of mutation.addedNodes) {
            if (addedNode.nodeName === "DIV") {
                if (addedNode.id === 'messages') {
                    const messages = addedNode;
                    const newestPush = messages.children[0];
                    focusNewestPush(newestPush);

                    setTimeout(() => {
                        if (isMessagePfTrafik() === true) {
                            const messageInfo = getFocusPfTrafikMessage();
                            showGoogleMaps(messageInfo.cors);
                        } else {
                            const messageInfo = getFocusMessage();
                            showGoogleMaps(messageInfo.cors);
                        }
                    }, 1000);
                }
            }
        }
    }
});
messagesObserver.observe(document, { childList: true, subtree: true });

const focusNewestPush = (pushElt) => {
    pushElt.click();
}

const isMessagePfTrafik = () => {
    const big_message_title = document.getElementById('big_message_title');

    if (big_message_title.innerText.includes('PF Trafik')) {
        return true;
    } else {
        return false;
    }
}

// ########################################
// Google Maps
// ########################################

const getFocusPfTrafikMessage = () => {
    const big_message_message = document.getElementById('big_message_message');
    const mapsLink = big_message_message.children[big_message_message.childElementCount -1];
    const cors = mapsLink.getAttribute('href').split('&query=')[1];
    big_message_message.removeChild(mapsLink);

    return {
        message: big_message_message.innerText,
        cors: cors
    }
}

const getFocusMessage = () => {
    const big_message_message = document.getElementById('big_message_message');
    const mapsLink = big_message_message.children[big_message_message.childElementCount -1];
    const cors = mapsLink.getAttribute('href').split('maps?q=')[1].replace('"', '');


    return {
        message: big_message_message.innerText,
        cors: cors
    }
}

const showGoogleMaps = (destinationCors) => {
    const bigMessageContainer = document.getElementById('big_message');

    const checkMapsContainer = document.getElementById('p_plus-embeded-maps');

    if (checkMapsContainer !== null) {
        bigMessageContainer.removeChild(checkMapsContainer);
    }

    const mapsContainer = document.createElement('div');
    mapsContainer.setAttribute('id', 'p_plus-embeded-maps');
    mapsContainer.setAttribute('style', 'width: 100%; height: 375px;');
    bigMessageContainer.appendChild(mapsContainer);

    const iframeMaps = document.createElement('iframe');
    iframeMaps.setAttribute('width', '100%'); // 375
    iframeMaps.setAttribute('height', '450px'); // 450
    iframeMaps.setAttribute('style', 'border:0px;');
    iframeMaps.setAttribute('loading', 'lazy');
    iframeMaps.setAttribute('allowfullscreen', '');
    iframeMaps.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    iframeMaps.setAttribute('src', 
    `https://www.google.com/maps/embed/v1/directions?key=AIzaSyAF1E4kdwZVswl1rsHwKUjimojtXi-Bxp4&origin=place_id:ChIJ6WzacndOUkYR0_ozzT-vnyc&destination=${destinationCors}`);
    mapsContainer.appendChild(iframeMaps);

    console.log(`https://www.google.com/maps/embed/v1/directions?key=AIzaSyAF1E4kdwZVswl1rsHwKUjimojtXi-Bxp4&origin=place_id:ChIJ6WzacndOUkYR0_ozzT-vnyc&destination=${destinationCors}`);
}
























/*
let msgBefore = '';
let openedTab = null;

let observer = new MutationObserver(mutations => {
    for(let mutation of mutations) {
        for(let addedNode of mutation.addedNodes) {
            if (addedNode.nodeName === "DIV") {
                if (addedNode.id === 'messages') {
                    const messages = addedNode;
                    const newestPush = messages.children[0];
                    focusNewestPush(newestPush);
                    ttsNewestPush(newestPush, 1000);
                }
            }
        }

        for(let removedNode of mutation.removedNodes) {
            if (removedNode.nodeName === "DIV") {
                if (removedNode.id.includes('message_') === true) {
                    const messages = document.getElementById('messages');
                    const newestPush = messages.children[0];
                    focusNewestPush(newestPush);
                }
            }
        }
     }
 });
 observer.observe(document, { childList: true, subtree: true });



function focusNewestPush(pushElt) {
    pushElt.click();
}

function ttsNewestPush(pushElt, delay) {
    const newestPushContent = pushElt.children[2].children[1];
    const newestPushMsg = newestPushContent.innerHTML.toString().split('RSE_')[0].replace('<br>', '').replace('FUH', 'færdselsuheld').replace('Min.', 'mindre').replace('MTV', 'motervejen...');

    try {
        //const newestPushMapsLink = newestPushContent.getElementsByTagName('<a>')[0];
        const newestPushMapsLink = newestPushContent.children[0].getAttribute('href')
        const d = newestPushMapsLink.split('maps?q=');
        console.log(newestPushMapsLink);
        console.log(d);
        const cors = d[1].replace('"', '');

        embedMaps(cors);
    } catch (error) {
        console.error('Kunne ikke vise Google Maps');
        console.error(error);
    }

    // PF
    try {
        //const newestPushMapsLink = newestPushContent.getElementsByTagName('<a>')[0];
        const newestPushMapsLink2 = newestPushContent.children[newestPushContent.childElementCount - 1].getAttribute('href')
        const d2 = newestPushMapsLink2.split('&query=');
        const cors2 = d[d2.length - 1].replace('"', '');

        embedMaps(cors2);
    } catch (error) {
        console.error('Kunne ikke vise Google Maps');
        console.error(error);
    }

    setTimeout(() => {
        chrome.runtime.sendMessage({
            toSay: newestPushMsg
        }, function() {
            msgBefore = newestPushMsg;
    
            // if (newestPushHerf !== undefined) {
            //     if (openedTab !== null) {
            //         openedTab.close();
            //     }
            //     
            //     const newestPushCord = newestPushHerf.href.split('=')[1].replace('%22', '');
            //     openMaps(newestPushCord);
            // }
    
            return true;
        });
    }, delay);
}




function myFunc(e) {
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

                // if (newestPushHerf !== undefined) {
                //     if (openedTab !== null) {
                //         openedTab.close();
                //     }
                //     
                //     const newestPushCord = newestPushHerf.href.split('=')[1].replace('%22', '');
                //     openMaps(newestPushCord);
                // }

                return true;
            });
        }
    }
};
// document.addEventListener('DOMNodeInserted', nodeInsertedCallback);


document.addEventListener('DOMSubtreeModified', (e) => {
    myFunc(e);
});

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    for (let i = 0; i < 5; i++) {
        const p = document.createElement('p')
        p.textContent = 'hello'
        document.body.appendChild(p)
        await sleep(1000)
    }
})();



function openMaps(cord) {
    let params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=1000,height=800,left=50,top=500`;

    openedTab = open(`https://www.google.dk/maps/dir/Karen+Schacks+Vej+42,+2800+Kongens+Lyngby/${cord}/@55.7337835,12.3728096,12z/data=!3m1!4b1!4m8!4m7!1m5!1m1!1s0x46524e7776ee07f3:0x40b47e6cd531d689!2m2!1d12.5276465!2d55.7756502!1m0`, 'test', params);
}

function embedMaps(destinationCors) {
    const bigMessageContainer = document.getElementById('big_message');

    try {
        const mapsContainer = document.getElementById('p_plus-embeded-maps');
        mapsContainer.remove();
    } catch (error) {
        console.error(error);
    }

    const mapsContainer = document.createElement('div');
    mapsContainer.setAttribute('id', 'p_plus-embeded-maps');
    mapsContainer.setAttribute('style', 'width: 100%; height: 375px;');
    bigMessageContainer.appendChild(mapsContainer);

    const iframeMaps = document.createElement('iframe');
    iframeMaps.setAttribute('width', '100%'); // 375
    iframeMaps.setAttribute('height', '450px'); // 450
    iframeMaps.setAttribute('style', 'border:0px;');
    iframeMaps.setAttribute('loading', 'lazy');
    iframeMaps.setAttribute('allowfullscreen', '');
    iframeMaps.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    iframeMaps.setAttribute('src', 
    `https://www.google.com/maps/embed/v1/directions?key=AIzaSyAF1E4kdwZVswl1rsHwKUjimojtXi-Bxp4&origin=place_id:ChIJ6WzacndOUkYR0_ozzT-vnyc&destination=${destinationCors}`);
    mapsContainer.appendChild(iframeMaps);
}
*/