chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log('hello');
    chrome.tts.speak(request.toSay, {
        rate: 0.8,
        lang: 'da-DK',
        // voiceName: 'Microsoft Helle - Danish (Denmark)',
        onEvent: function (e) { }
    }, function () {
        setTimeout(function () {
            sendResponse({ status: true });
        }, 1);
        return true;
    });
});