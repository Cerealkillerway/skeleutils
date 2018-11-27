// get a field name from the key of a received data object
SkeleUtils.ClientServerUtilities.getFieldName = function(dataKey) {
    let i18nPrefixIndex = dataKey.indexOf('---');

    if (i18nPrefixIndex > 0) {
        return {
            name: dataKey.slice(i18nPrefixIndex + 3),
            lang: dataKey.substring(0, i18nPrefixIndex)
        };
    }
    return {
        name: dataKey,
        lang: undefined
    };
}

// deeply traverse object
SkeleUtils.GlobalUtilities.traverseObject = function(object, callback) {
    _.each(object, function(element) {
        if (typeof element === 'object') {
            Skeleutils.GlobalUtilities.traverseObject(element, callback);
        }
        callback(element);
    });
}

// parse null or undefined to empty string
SkeleUtils.GlobalUtilities.purgeNullUndefined = function(value) {
    if (value === undefined || value === null) {
        return '';
    }
    return value;
};
