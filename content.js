/**
 *
 */

let host = location.host;
if (host === 'rpm.newrelic.com') {
    createRedmineLink();
} else if (host === 'redmine.teamo.ru') {
    fillRedmineIssue();
}

function createRedmineLink()
{
    let mainWrapper = document.getElementById('primary_content'),
        errorWrapper = mainWrapper.getElementsByClassName('error_message');

    if (typeof errorWrapper[0] === "undefined") {
        return;
    }

    chrome.storage.sync.set({
        title: errorWrapper[0].innerText,
        link: document.location.href
    });

    let ul = mainWrapper.getElementsByClassName('action_bar'),
        redmineButtonLi = document.createElement('li');

    redmineButtonLi.innerHTML = '<a href="https://redmine.teamo.ru/projects/teamo/issues/new" target="_blank">Create redmine issue ></a>';
    ul[0].append(redmineButtonLi);
}

function fillRedmineIssue()
{
    if (location.pathname.indexOf('issues/new') === -1) {
        return;
    }

    chrome.storage.sync.get(['title', 'link'], function(data) {
        if (typeof data.title === "undefined" || typeof data.link === "undefined") {
            return;
        }

        document.getElementById('issue_subject').value = data.title.substr(0, 140) + '...';
        document.getElementById('issue_description').value = data.title + "\n\n\n" + data.link;
        document.getElementById('issue_custom_field_values_22').value = 'bug';

        chrome.storage.sync.remove(['title', 'link']);
    });
}
