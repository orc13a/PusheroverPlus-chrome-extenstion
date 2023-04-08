document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('githubBtn');

    link.addEventListener('click', function() {
        chrome.tabs.create({active: true, url: "https://github.com/orc13a/PusheroverPlus-chrome-extenstion/releases"});
    });
});