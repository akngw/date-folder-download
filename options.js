var DEFAULT_NAME_PATTERN = 'yyyy-MM-dd';

function save_options() {
    var pattern = document.getElementById('pattern').value;
    chrome.storage.local.set({
        folderNamePattern: pattern
    }, function() {
        var status = document.getElementById('status');
        status.textContent = 'Saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 800);
    });
}

function restore_options() {
    chrome.storage.local.get({
        folderNamePattern: DEFAULT_NAME_PATTERN
    }, function(items) {
        document.getElementById('pattern').value = items.folderNamePattern;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);

// vim: set ai et sts=4 sw=4:
