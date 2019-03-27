SkeleUtils.GlobalEvents.TooltipOnRendered = function(instance) {
    instance.autorun(function() {
        let currentLang = Skeletor.Skelelang.i18n.currentLocale.get();

        instance.$('.tooltipped').tooltip('remove');
        instance.$('.tooltipped').tooltip({delay: 50});
    });
};


SkeleUtils.GlobalEvents.TooltipOnDestroyed = function(instance) {
    instance.$('.tooltipped').tooltip('remove');
};
