SkeleUtils.GlobalEvents.TooltipOnRendered = function(instance) {
    instance.autorun(function() {
        let currentLang = TAPi18n.getLanguage();

        instance.$('.tooltipped').tooltip('remove');
        instance.$('.tooltipped').tooltip({delay: 50});
    });
};
SkeleUtils.GlobalEvents.TooltipOnDestroyed = function(instance) {
    instance.$('.tooltipped').tooltip('remove');
};
