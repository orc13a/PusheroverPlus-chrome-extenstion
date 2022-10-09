chrome.runtime.onMessage.addListener(function(request) {
    chrome.tts.speak(request.toSay, { 
        rate: 0.9,
        lang: 'da-DK',
        voiceName: 'Microsoft Helle - Danish (Denmark)',
        onEvent: function(e) {}
    }, function() {
        console.log('Got message');
        return true;
    });
});