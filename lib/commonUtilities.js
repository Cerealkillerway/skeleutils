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

// dasherize string
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
skeleUtils.globalVariables.logTypes = {
    skeletor: 'background-color: #9c27b0; color: #ffeb3b',
    skeleform: 'background-color: #ffeb3b; color: #9c27b0',
    skeleformCommon: 'background-color: #d500f9; color: #eeeeee',
    skeleformField: 'background-color: #651fff; color: #eeeeee',
    skeleformFieldValidation: 'background-color: #f50057; color: #eeeeee',
    skelelist: 'background-color: #6b7efe; color: #ffeb3b',
    skeleUtils: 'background-color: #222; color: #eee',

    skeleError: 'background-color: #f00; color: #eee'
};
skeleUtils.globalVariables.logSeparators = {
    standard: '--------------------------\n'
};
// logger function
skeleUtils.globalUtilities.logger = function(message, type, force, stackTrace, customSeparator) {
    let separator = skeleUtils.globalVariables.logSeparators[customSeparator] || customSeparator || skeleUtils.globalVariables.logSeparators.default;
    let logTypes = skeleUtils.globalVariables.logTypes;
    let css = logTypes[type] || '';
    let verb = 'log';

    if (stackTrace) {
        verb = 'trace';
    }

    if (force || Session.get('consoleLogger')) {
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

// parse null or undefined to empty string
skeleUtils.globalUtilities.purgeNullUndefined = function(value) {
    if (value === undefined || value === null) {
        return '';
    }
    return value;
};

// scrollTo
skeleUtils.globalUtilities.scrollTo = function(offset, animation) {
    $('html, body').animate({
        scrollTop: offset
    }, animation);
};

// creates language culture name (xx-XX) from ISO 639-1 (2chars code xx)
skeleUtils.globalUtilities.doubleLangCode = function(langCode) {
    return langCode + '-' + langCode.toUpperCase();
};

// parses an object to an array
skeleUtils.globalUtilities.objectToArray = function(object) {
    return Object.keys(object).map(function (key) { return object[key]; });
};

// checks if a canvas is empty - the two parameters are expected to be DOM elements
skeleUtils.globalUtilities.isEmptyCanvas = function(canvas, blankCanvas) {
    blankCanvas.width = canvas.width;
    blankCanvas.height = canvas.height;

    if (blankCanvas.toDataURL() === canvas.toDataURL()) return true;
    return false;
};

// returns only the file name starting from a full path or a name with extension
skeleUtils.globalUtilities.getFileName = function(path) {
    path = path.split("/").pop();
    path = path.substr(0, path.lastIndexOf('.')) || path;
    return path;
};

// multi type equal comparer
skeleUtils.globalUtilities.areEquals = function(value1, value2) {
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
