import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


SkeleUtils.GlobalHelpers.toolbarsHelpers = {
    makeUndoPath: function(path) {
        let params = Skeletor.Skeleform.utils.createPath(path);
        return FlowRouter.path(path[0], params.params, {lang: Skeletor.Skelelang.i18n.currentLocale.get()});
    }
};
