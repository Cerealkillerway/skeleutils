// logger variables
SkeleUtils.GlobalVariables.logTypes = {
    skeletor: 'background-color: #9c27b0; color: #ffeb3b;',
    skeleform: 'background-color: #ffeb3b; color: #9c27b0;',
    skeleformCommon: 'background-color: #d500f9; color: #eeeeee;',
    skeleformField: 'background-color: #651fff; color: #eeeeee;',
    skeleformFieldValidation: 'background-color: #f50057; color: #eeeeee;',
    skelelist: 'background-color: #6b7efe; color: #ffeb3b;',
    SkeleUtils: 'background-color: #222; color: #eee;',
    skelePermissions: 'background-color: #004d40; color: #eee;',
    skelePlugin: 'background-color: #eeff41; color: #333;',

    skeleSuccess: 'background-color: #4caf50; color: #eee;',
    skeleError: 'background-color: #f00; color: #eee;',
    skeleWarning: 'background-color: #ff9000; color: #333;'
};
SkeleUtils.GlobalVariables.logSeparators = {
    standard: '\n--------------------------\n'
};
// logger function
SkeleUtils.GlobalUtilities.logger = function(message, type, force, stackTrace, customSeparator) {
    let separator;
    let logTypes = SkeleUtils.GlobalVariables.logTypes;
    let css = logTypes[type] || '';
    let verb = 'log';

    if (customSeparator === undefined) {
        separator = SkeleUtils.GlobalVariables.logSeparators.standard;
    }
    else {
        separator = SkeleUtils.GlobalVariables.logSeparators[customSeparator] || customSeparator;
    }

    if (stackTrace) {
        verb = 'trace';
    }

    if (force || (Skeletor && Skeletor.configuration.consoleLogger)) {
        if (typeof message === 'string') {
            message = String(message);
            message = message.replace('<separator>', separator);
            message = type.toUpperCase() + ': ' + message;
            console[verb](`%c ${message}`, css);
        }
        else {
            console[verb](message);
        }
    }
};


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


// get field schema
SkeleUtils.GlobalUtilities.fieldSchemaLookup = function(fields, name) {
    let schemaFound = false;

    for (let i = 0; i < fields.length; i++) {
        let field = fields[i];

        // avoid useless loops
        if (schemaFound !== false) {
            break;
        }

        if (field.skeleformGroup) {
            schemaFound = SkeleUtils.GlobalUtilities.fieldSchemaLookup(field.fields, name);
        }
        else {
            if (field.name === name) {
                schemaFound = field;
                break;
            }
        }
    }

    return schemaFound;
}
