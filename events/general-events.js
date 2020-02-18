import 'materialize-css'

SkeleUtils.GlobalEvents.TooltipOnRendered = function(instance) {
    instance.autorun(function() {
        // register dependency from currentLang
        let currentLang = Skeletor.Skelelang.i18n.currentLocale.get()

        let elements = document.querySelectorAll('.tooltipped')
        for (const element of elements) {
            const instance = M.Tooltip.getInstance(element)
            if (instance) {
                instance.destroy()
            }
        }
        M.Tooltip.init(elements, { delay: 50 })
    })
}


SkeleUtils.GlobalEvents.TooltipOnDestroyed = function(instance) {
    const elements = document.querySelectorAll('.tooltipped')
    for (const element of elements) {
        const instance = M.Tooltip.getInstance(element)
        if (instance) {
            instance.destroy()
        }
    }
}
