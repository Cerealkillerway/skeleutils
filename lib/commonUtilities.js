// dasherize string
String.prototype.dasherize = function() {
    return this.replace(/\W+/g, "-").toLowerCase();
};

// capitalize string
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

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
        var k = new_index - this.length;
        while ((k--) + 1) {
            this.push(undefined);
        }
    }
    this.splice(new_index, 0, this.splice(old_index, 1)[0]);
    return this; // for testing purposes
};

// logger function
ckUtils.globalUtilities.logger = function(message, type) {
    var separator = '--------------------------\n';
    var types = {
        skeleform: 'background-color: #9c27b0; color: #ffeb3b',
    };
    type = types[type] || '';

    if (Session.get('consoleLogger')) {
        message.replace('+separator', '');

        console.log("%c" + message, type);
    }
};

// creates language culture name (xx-XX) from ISO 639-1 (2chars code xx)
ckUtils.globalUtilities.doubleLangCode = function(langCode) {
    return langCode + '-' + langCode.toUpperCase();
};

// parses an object to an array
ckUtils.globalUtilities.objectToArray = function(object) {
    return Object.keys(object).map(function (key) { return object[key]; });
};

// checks if a canvas is empty - the two parameters are expected to be DOM elements
ckUtils.globalUtilities.isEmptyCanvas = function(canvas, blankCanvas) {
    blankCanvas.width = canvas.width;
    blankCanvas.height = canvas.height;

    if (blankCanvas.toDataURL() === canvas.toDataURL()) return true;
    return false;
};

// returns only the file name starting from a full path or a name with extension
ckUtils.globalUtilities.getFileName = function(path) {
    path = path.split("/").pop();
    path = path.substr(0, path.lastIndexOf('.')) || path;
    return path;
};

// multi type equal comparer
ckUtils.globalUtilities.areEquals = function(value1, value2) {
    var type1 = typeof value1;
    var type2 = typeof value2;

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
