import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


// General spacebar helpers
// console log
Template.registerHelper('skeleLog', function(context, options) {
    console.log(context);
});


// console trace
Template.registerHelper('skeleTrace', function(context, options) {
    console.trace(context);
});


// outputs the defaultLang
Template.registerHelper('defaultLang', function() {
    return Skeletor.configuration.lang.default;
});


// gets the prefix for static files
Template.registerHelper('skeleStaticPath', function() {
    return Skeletor.configuration.staticFilesPath;
});


// gets a reactive var's value
Template.registerHelper('skeleGetReactiveVar', function(variable, options) {
    let result = variable.get();

    if (options.hash.property) {
        return result[options.hash.property];
    }

    return result;
});


// format dateStrings using moment.js
Template.registerHelper('skeleFormatDate', function(options) {
    let date;

    if (options.hash.input) {
        date = moment(options.hash.date, options.hash.input);
    }
    else {
        date = moment(options.hash.date);
    }

    if (options.hash.output) {
        return date.format(options.hash.output);
    }
    return date;
});


// check if data item(s) is(are) ready
Template.registerHelper('skeleIsDataReady', function(context) {
    if (context.skeleSubsReady.get() === false) {
        return false;
    }
    return true;
});


// check if debug is enable
Template.registerHelper('debug', function(context, options) {
    if (Skeletor.configuration.debug) return true;
    return false;
});


// checks if two given values are equal
Template.registerHelper('skeleformTest', function(value1, value2, operator) {
    //console.log(value1);
    //console.log(value2);
    //console.log(operator);

    switch (operator) {
        case 'gt':
        if (value1 > value2) {
            return true;
        }
        break;

        case 'gte':
        if (value1 >= value2) {
            return true;
        }
        break;

        case 'lt':
        if (value1 < value2) {
            return true;
        }
        break;

        case 'lte':
        if (value1 <= value2) {
            return true;
        }
        break;

        case 'and':
        return value1 && value2;
        break;

        case 'or':
        return value1 || value2;
        break;

        // by default test if values are equal
        default:
        if (value1 === value2) {
            return true;
        }
    }

    return false;
});


// outputs the currentLang of the i18n package
Template.registerHelper('currentLang', function() {
    //return FlowRouter.getParam('itemLang');
    return i18n.currentLocale.get();
});


// outputs the content lang from url
Template.registerHelper('currentContentLang', function() {
    //return FlowRouter.getParam('itemLang');
    return FlowRouter.getParam('itemLang');
});


// get a lang nested attribute
// IMPORTANT: when using this helper, you must supply 3 arguments (use false for the third argument)
// if you want it to get the language from the app
Template.registerHelper('skeleLangAttribute', function(data, attribute, lang) {
    if (!data) {
        return;
    }

    if (!lang) {
        lang  = i18n.currentLocale.get();
    }

    switch (lang) {
        case 'param':
        return data[FlowRouter.getParam('itemLang') + '---' + attribute];

        case 'queryParam':
        return data[FlowRouter.getQueryParam('lang') + '---' + attribute];

        case 'skeletorDefault':
        return data[Skeletor.configuration.lang.default + '---' + attribute];

        default:
        return data[lang + '---' + attribute];
    }
});


// get a lang value from a data item
Template.registerHelper('getCurrentLangData', function(data, fieldName) {
    if (!data) {
        return '';
    }

    let currentLang = FlowRouter.getParam('itemLang');

    return data[currentLang + '---' + fieldName];
});


// outputs a link with currentLang queryParam
Template.registerHelper('skeleCurrentLangLink', function(link) {
    let langQuery = '?lang=' + i18n.currentLocale.get();

    if (link) {
        return link + langQuery;
    }
    return langQuery;
});


// outputs attribute from configuration object
Template.registerHelper('conf', function(context, options) {
    let pathShards = context.split('.');
    let result = Skeletor.configuration;

    // register dependency from configuration document
    Skeletor.Registry.configurationChanged.get();

    pathShards.forEach(function(shard, index) {
        result = result[shard];
    });
    return result;
});


// outputs special variables
Template.registerHelper('display', function(context, options) {
    switch (context) {
        case 'currentYear':
            return moment().format('YYYY');

        case 'connectionStatus':
            return i18n.get(Meteor.status().status + '_lbl');
    }
});


// remove HTML markup
Template.registerHelper('stripHtml', function(context, truncate) {
    if (context) return context.replace(/<(?:.|\n)*?>/gm, '');
});


// remove HTML markup from lang dependant attribute
Template.registerHelper('stripHtmlLang', function(context, attribute, truncate) {
    let lang = FlowRouter.getQueryParam('lang');
    let result;

    if (context && context[lang]) {
        result = context[lang][attribute].replace(/<(?:.|\n)*?>/gm, '');

        if (truncate) {
            result = result.substr(0, truncate);
        }
        return result;
    }
    else {
        if (attribute) {
            return attribute + ' (' + i18n.get('translationTitleNoHTML_missing').toUpperCase() + ')';
        }
    }
});


// check if supplied username belongs to current logged user
Template.registerHelper('isMe', function(username, options) {
    if (username === Meteor.user().username) {
        return true;
    }
    else return false;
});


// check if currentUser is a SUPER user
Template.registerHelper('isSuperUser', function() {
    let userRoles;

    userRoles = Skeletor.currentUserRoles.get();

    if (userRoles) {
        userRoles = userRoles.fetch();
    }
    else {
        return false;
    }

    if (_.find(userRoles, function(role) { return role.name === 'SUPERUSER'; })) {
        return true;
    }
    return false;
});


// check permissions
Template.registerHelper('skeleCheckPermissions', function(permissionType, failCallback) {
    let isAllowed = SkeleUtils.Permissions.checkPermissions(permissionType);

    return isAllowed;
});


// check if skeletor' subscriptions are Ready
Template.registerHelper('skeleSubsReady', function(subscription) {
    // if particular subscription state is requested, look for a reactive var
    // with name subscription + 'Ready'
    if (subscription) {
        return Template.instance()[subscription + 'Ready'].get();
    }
    // otherwise return standard skeleSubsReady reactive var
    else {
        return Template.instance().skeleSubsReady.get();
    }
});


// return a 1-based index from a 0-based index
Template.registerHelper('humanReadableIndex', function(computerIndex) {
    return computerIndex + 1;
});


// Search for a field name in the collection's schema
Template.registerHelper('getDocumentField', function(fieldName, schema, document) {
    if (!schema || !document) {
        return false;
    }

    let result;
    let currentLang = i18n.currentLocale.get();

    fieldSchema = SkeleUtils.GlobalUtilities.fieldSchemaLookup(schema, fieldName);
    if (fieldSchema.i18n === false) {
        result = document[fieldName];
    }

    result = document[currentLang + '---' + fieldName];
    return result;
});


Template.registerHelper('skeleLangsEnable', function() {
    let enabledLangs = [];

    _.each(Skeletor.configuration.langEnable, function(isEnabled, lang) {
        if (isEnabled) {
            enabledLangs.push(lang);
        }
    });

    return enabledLangs;
});
