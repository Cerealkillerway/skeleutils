import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


// STRING
// left trim
String.prototype.ltrim = function () {
  return this.replace(/^\s+/, '');
};

// right trim
String.prototype.rtrim = function () {
  return this.replace(/\s+$/, '');
};

// replace inside a string
String.prototype.replaceAll = function(search, replace) {
  if (replace === undefined) {
    return this.toString();
  }
  return this.split(search).join(replace);
};

// dasherize and lower-capitalize string
String.prototype.dasherize = function() {
    return this.replace(/\W+/g, '-').toLowerCase();
};

// capitalize string
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

// split at index
String.prototype.splitAt = function(index) {
    if (!index) {
        index = this.length;
    }
    return [this.substring(0, index), this.substring(index)];
};

// convert price with currency symbol into float
String.prototype.moneyStringToFloat = function() {
    return parseFloat(this.replace(',', '.').substring(0, this.length - 1));
};

// set always 2 decimals on number
Number.prototype.toCurrencyFormat = function() {
    return parseFloat(Math.round(this * 100) / 100).toFixed(2);
};


// ARRAY
// push into array if item does not alredy exists in it
Array.prototype.pushUnique = function (item){
    if(this.indexOf(item) == -1) {
        this.push(item);
        return true;
    }
    return false;
};

// change item position inside an array
Array.prototype.move = function (old_index, new_index) {
    if (new_index >= this.length) {
        let k = new_index - this.length;

        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};

// insert element at index
Array.prototype.insertAt = function(element, index) {
    this.splice(index, 0, element);
};

// delete element from index
Array.prototype.removeAt = function(index) {
    this.splice(index, 1);
};

// get first element of array
Array.prototype.first = function() {
    return this[0] || undefined;
};

// get last element of array
Array.prototype.last = function() {
    if(this.length > 0) {
        return this[this.length - 1];
    }
    return undefined;
};

// get max in array
Array.prototype.max = function(array){
    return Math.max.apply(Math, array);
};

// get min in array
Array.prototype.min = function(array){
    return Math.min.apply(Math, array);
};


// DATE
// go to midnight
Date.prototype.toMidnight = function(){
    this.setMinutes(0);
    this.setSeconds(0);
    this.setHours(0);
};


// JQUERY
// set focus on element without scrolling on it
$.fn.focusWithoutScrolling = function(){
    let x = window.scrollX, y = window.scrollY;

    this.focus();
    window.scrollTo(x, y);
};


// UTILITIES
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

    if (force || Skeletor.configuration.consoleLogger) {
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


// scrollTo
SkeleUtils.GlobalUtilities.scrollTo = function(offset, animation) {
    $('html, body').animate({
        scrollTop: offset
    }, animation);
};

// creates language culture name (xx-XX) from ISO 639-1 (2chars code xx)
SkeleUtils.GlobalUtilities.doubleLangCode = function(langCode) {
    return langCode + '-' + langCode.toUpperCase();
};

// parses an object to an array
SkeleUtils.GlobalUtilities.objectToArray = function(object) {
    return Object.keys(object).map(function (key) { return object[key]; });
};

// checks if a canvas is empty - the two parameters are expected to be DOM elements
SkeleUtils.GlobalUtilities.isEmptyCanvas = function(canvas, blankCanvas) {
    blankCanvas.width = canvas.width;
    blankCanvas.height = canvas.height;

    if (blankCanvas.toDataURL() === canvas.toDataURL()) return true;
    return false;
};

// returns only the file name starting from a full path or a name with extension
SkeleUtils.GlobalUtilities.getFileName = function(path) {
    path = path.split("/").pop();
    path = path.substr(0, path.lastIndexOf('.')) || path;
    return path;
};

// multi type equal comparer
SkeleUtils.GlobalUtilities.areEquals = function(value1, value2) {
    let type1 = typeof value1;
    let type2 = typeof value2;

    //if not same type => skip comparison
    if (type1 !== type2) return false;

    switch (type1.toLowerCase()) {
        case 'object':
        return _.isEqual(value1, value2);

        case 'array':
        return value1.join() === value2.join();

        default:
        return (value1 === value2);
    }
};

// set background for panel
SkeleUtils.GlobalUtilities.skeleSetPanelBackground = function() {
    $('body').alterClass('*', 'skelePanelBody');
};

// change application's interface current language
SkeleUtils.GlobalUtilities.changeRouteLang = function(newLang) {
    i18n.setLocale(newLang);
    moment.locale(newLang);

    FlowRouter.setQueryParams({'lang': newLang});
};

// ck menu icon menu with text description
SkeleUtils.GlobalUtilities.skeleSwingMenu = function($element) {
    $element.each(function(index, menuList) {
        $(menuList).prepend('<div class="menuItemName"></div>');

        let nameHolder =  $(menuList).children('.menuItemName');
        let maxMenuHeight = $(menuList).closest('nav').height();
        let cleaner;

        $(menuList).find('li').css({'max-height': maxMenuHeight});

        $(menuList).find('li').mouseover(function() {
            var name = $(this).find('.navItemName').html();

            Meteor.clearTimeout(cleaner);
            nameHolder.html(name);
        });

        $(menuList).find('li').mouseout(function() {
            cleaner = Meteor.setTimeout(function() {
                nameHolder.html('');
            }, 1500);
        });
    });
};

// get property by variable (also with "dot" notation strings)
SkeleUtils.GlobalUtilities.getPropertyFromString = function(propertyName, object) {
    let parts = propertyName.split('.'),
        length = parts.length,
        i,
        property = object;

    for (i = 0; i < length; i++) {
        property = property[parts[i]];
    }

    return property;
}

// get a skeleform field instance from the skeleform form instance
SkeleUtils.GlobalUtilities.getFieldInstance = function(formContext, name) {
    for (field of formContext.fields) {
        if (field.data.fieldSchema.get().name === name) {
            return field;
        }
    }

    return undefined;
}


// remove fields that are usually not to be displayed on a data item
SkeleUtils.GlobalUtilities.removeHiddenFieldsFromData = function(data) {
    delete data._id;
    delete data.created;
    delete data.updated;

    return data;
}


SkeleUtils.GlobalUtilities.autoSelectLang = function() {
    let userLang = Skeletor.configuration.detectedLang;
    let selectedLang;

    if (userLang && Skeletor.configuration.tryUserLangFirst && Skeletor.configuration.langEnable[userLang]) {
        selectedLang = userLang;
        SkeleUtils.GlobalUtilities.logger(`User lang is supported => will use [${selectedLang}]`, 'skelePlugin');
    }
    else {
        selectedLang = Skeletor.configuration.lang.default;
        SkeleUtils.GlobalUtilities.logger('Will use default lang', 'skelePlugin');
    }

    return selectedLang;
}


SkeleUtils.GlobalUtilities.colorDifference = function(color1, color2) {
    let i;
    let distance = 0;

    for (i = 0; i < color1.length; i++) {
        distance = distance + (color1[i] - color2[i])*(color1[i] - color2[i]);
    }

    return Math.sqrt(distance);
}


SkeleUtils.GlobalUtilities.colorConversion = function(colorVal, inputType, outputType) {
    if (!colorVal) {
        return false;
    }

    let parts;
    let result;

    switch (inputType) {
        case 'rgb':
            parts = colorVal.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            break;


        case 'rgba':
            parts = colorVal.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d+)\)$/);
            break;


        default:
            SkeleUtils.GlobalUtilities.logger(`unknown input type for color conversion: ${inputType} `, 'skelePlugin');
            return false;
    }


    switch (outputType) {
        case 'rgb':
            delete(parts[0]);
            result = [parts[1], parts[2], parts[3]];
            break;


        case 'rgba':
            let alpha = parts[4] || 1;

            delete(parts[0]);
            result = [parts[1], parts[2], parts[3], alpha];
            break;


        case 'hex':
            delete(parts[0]);

            for (var i = 1; i <= 3; ++i) {
                parts[i] = parseInt(parts[i]).toString(16);

                if (parts[i].length == 1) {
                    parts[i] = '0' + parts[i];
                }
            }
            result = '#' + parts.join('');


        default:
            SkeleUtils.GlobalUtilities.logger(`unknown output type for color conversion: ${outputType}`, 'skelePlugin');
            return false;
    }

    return result;
}


SkeleUtils.GlobalUtilities.fieldSchemaLookup = function(schema, name) {
    let schemaFound;

    _.find(schema, function(field) {
        if (field.skeleformGroup) {
            let schema = SkeleUtils.GlobalUtilities.fieldSchemaLookup(field.fields, name);
            if (schema) {
                schemaFound = schema;
                return schema;
            }
        }
        schemaFound = field;
        return field.name === name;
    });

    return schemaFound;
}
