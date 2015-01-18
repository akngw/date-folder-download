/**
 * Date Folder Download
 *
 * Copyright (C) 2014,2015 Kinugawa Akihito.
 */

var DEFAULT_NAME_PATTERN = 'yyyy-MM-dd';
var STORAGE_KEY_FOR_PATTERN = 'folderNamePattern';

var padWithZero = function (n) {
    return ("0" + n).substr(-2);
};

var REPLACEMENTS = [
    function (str, date) {
        return str.replace(/yyyy/, date.getFullYear());
    },
    function (str, date) {
        return str.replace(/MM/, padWithZero(date.getMonth() + 1));
    },
    function (str, date) {
        return str.replace(/dd/, padWithZero(date.getDate()));
    }
];

var reduce = function (init, ary, func) {
    if (ary.length == 0) {
        return init;
    }
    return reduce(func(init, ary[0]), ary.slice(1, ary.length), func);
};

var buildFolderName = function (date, format) {
    return reduce(format, REPLACEMENTS, function (acc, func) {
        return func(acc, date);
    });
};

var getFolderNamePattern = function () {
    return new Promise(function (resolve, reject) {
        chrome.storage.local.get(null, function(obj) {
            resolve(obj[STORAGE_KEY_FOR_PATTERN] || DEFAULT_NAME_PATTERN);
        });
    });
};

var prependFolder = function (folderNamePattern, name) {
    return new Promise(function (resolve, reject) {
        resolve(buildFolderName(new Date(), folderNamePattern) + "/" + name);
    });
};

chrome.downloads.onDeterminingFilename.addListener(function (downloadItem, suggest) {
    getFolderNamePattern().then(function (folderNamePattern) {
        return prependFolder(folderNamePattern, downloadItem.filename);
    }).then(function (filename) {
        suggest({"filename": filename});
    });
    return true;
});

// vim: set ai et sts=4 sw=4:
