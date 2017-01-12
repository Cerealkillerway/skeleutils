// General spacebar helpers

// get global configuration object
let configuration = Meteor.settings.public.configuration;

// console log
UI.registerHelper('log', function(context, options) {
    console.log(context);
});

// check if debug is enable
UI.registerHelper('debug', function(context, options) {
    if (Skeletor.configuration.debug) return true;
    return false;
});

// checks if two given values are equal
UI.registerHelper('test', function(value1, value2) {
    if (value1 === value2) {
        return true;
    }
    return false;
});

// outputs the currentLang session variable
UI.registerHelper('currentLang', function() {
    return FlowRouter.getParam('itemLang');
});

// get a lang nested attribute
UI.registerHelper('langAttribute', function(data, attribute, lang) {
    if (!lang) {
        lang  = FlowRouter.getParam('itemLang');
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

// outputs a link with currentLang queryParam
UI.registerHelper('currentLangLink', function(link) {
    let langQuery = '?lang=' + FlowRouter.getQueryParam('lang');

    if (link) {
        return link + langQuery;
    }
    return langQuery;
});

// outputs attribute from configuration object
UI.registerHelper('conf', function(context, options) {
    let pathShards = context.split('.');
    let result = configuration;

    pathShards.forEach(function(shard, index) {
        result = result[shard];
    });
    return result;
});

// outputs special variables
UI.registerHelper('display', function(context, options) {
    switch (context) {
        case 'currentYear':
            return moment().format('YYYY');

        case 'connectionStatus':
            return TAPi18n.__(Meteor.status().status + '_lbl');
    }
});


// remove HTML markup
UI.registerHelper('stripHtml', function(context, truncate) {
    if (context) return context.replace(/<(?:.|\n)*?>/gm, '');
});

// remove HTML markup from lang dependant attribute
UI.registerHelper('stripHtmlLang', function(context, attribute, truncate) {
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
            return attribute + ' (' + TAPi18n.__('translationTitleNoHTML_missing').toUpperCase() + ')';
        }
    }
});

// check if supplied username belongs to current logged user
UI.registerHelper('isMe', function(username, options) {
    if (username === Meteor.user().username) {
        return true;
    }
    else return false;
});
