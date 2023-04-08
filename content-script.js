console.log(`    ____             __                                       \r\n   \/ __ \\__  _______\/ \/_  ___  _________ _   _____  _____  __ \r\n  \/ \/_\/ \/ \/ \/ \/ ___\/ __ \\\/ _ \\\/ ___\/ __ \\ | \/ \/ _ \\\/ ___\/_\/ \/_\r\n \/ ____\/ \/_\/ (__  ) \/ \/ \/  __\/ \/  \/ \/_\/ \/ |\/ \/  __\/ \/  \/_  __\/\r\n\/_\/    \\__,_\/____\/_\/ \/_\/\\___\/_\/   \\____\/|___\/\\___\/_\/    \/_\/  `);
console.log('v1.2.0');
// ####################################################################################

// ########################################
// Pushover UI
// ########################################



// ########################################
// Push focus and tts
// ########################################

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
                            ttsMessage(messageInfo.message);
                        } else {
                            const messageInfo = getFocusMessage();
                            showGoogleMaps(messageInfo.cors);
                            const newMessage = translateMessage(messageInfo.message);
                            ttsMessage(newMessage);
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

const translateMessage = (message) => {
    let newMsg = message.split('RSE_')[0];

    try {
        const ssFirstS = newMsg.split('#SS');
        const ssSecoundS = ssFirstS[1].split('#');

        newMsg = ssFirstS[0] + '... ' + ssSecoundS[1];
    } catch (error) {

    }
    
    return newMsg;
}

const isMessagePfTrafik = () => {
    const big_message_title = document.getElementById('big_message_title');

    if (big_message_title.innerText.includes('PF Trafik')) {
        return true;
    } else {
        return false;
    }
}

const getFocusPfTrafikMessage = () => {
    const big_message_message = document.getElementById('big_message_message');
    const mapsLink = big_message_message.children[big_message_message.childElementCount - 1];
    const cors = mapsLink.getAttribute('href').split('&query=')[1];
    big_message_message.removeChild(mapsLink);

    return {
        message: big_message_message.innerText,
        cors: cors
    }
}

const getFocusMessage = () => {
    const big_message_message = document.getElementById('big_message_message');
    const mapsLink = big_message_message.children[big_message_message.childElementCount - 1];
    let cors = undefined;

    try {
        cors = mapsLink.getAttribute('href').split('maps?q=')[1].replace('"', '')
    } catch (error) {
        console.error('Kunne ikke finde nogen koordinater');
    }


    return {
        message: big_message_message.innerText,
        cors: cors
    }
}

const ttsMessage = (pushMessage) => {
    setTimeout(() => {
        chrome.runtime.sendMessage({
            toSay: pushMessage
        }, function () {
            return true;
        });
    }, 2000);
}

// ########################################
// Google Maps
// ########################################

const showGoogleMaps = (destinationCors) => {
    if (destinationCors !== null) {
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
        iframeMaps.setAttribute('id', 'p_plus-embeded-maps-iframe')
        iframeMaps.setAttribute('width', '100%'); // 375
        iframeMaps.setAttribute('height', '450px'); // 450
        iframeMaps.setAttribute('style', 'border:0px;');
        iframeMaps.setAttribute('loading', 'lazy');
        iframeMaps.setAttribute('allowfullscreen', '');
        iframeMaps.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');

        const mapsUrl = `https://www.google.com/maps/embed/v1/directions?key=AIzaSyAF1E4kdwZVswl1rsHwKUjimojtXi-Bxp4&origin=place_id:ChIJ6WzacndOUkYR0_ozzT-vnyc&destination=${destinationCors}`;

        iframeMaps.setAttribute('src', mapsUrl);
        mapsContainer.appendChild(iframeMaps);

        const im = document.getElementById('p_plus-embeded-maps-iframe');

        try {
            im.setAttribute('src', im.getAttribute('src').split('&output')[0]);
        } catch (error) {

        }
    } else {
        console.error('Kunne ikke vise Google Maps, da der ingen koordinater er.');
    }
}