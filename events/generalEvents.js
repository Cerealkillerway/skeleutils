skeleUtils.globalEvents.TooltipOnRendered = function(instance) {
    instance.autorun(function() {
        let currentLang = TAPi18n.getLanguage();

        instance.$('.tooltipped').tooltip('remove');
        instance.$('.tooltipped').tooltip({delay: 50});
    });
};
skeleUtils.globalEvents.TooltipOnDestroyed = function(instance) {
    instance.$('.tooltipped').tooltip('remove');
};
