import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


// always use these functions to handle login and logout since they
// properly handles global variables reset

// login reusable function
SkeleUtils.Accounts.loginWithPassword = function(email, password, redirectPath) {
    let message;

    // reset registry
    if (SkeleUtils.GlobalUtilities.RegistryReset) {
        SkeleUtils.GlobalUtilities.RegistryReset();
    }

    Meteor.loginWithPassword(email, password, function(error) {
        if (error) {
            switch (error.reason) {
                case 'User not found':
                message = i18n.get('userNotFound_error');
                break;

                case 'Incorrect password':
                message = i18n.get('incorrectPassword_error');
                break;
            }

            Materialize.toast(i18n.get('accessDenied_error') + ' - ' + message, 4000);
        }
        else {
            // ensure that autorun cycles are recalculated since the function that gets current user's roles is inside
            // a Tracker.autorun cycle
            Tracker.flush();

            if (redirectPath) {
                FlowRouter.go(redirectPath, {}, {lang: FlowRouter.current().queryParams.lang});
            }
            else {
                FlowRouter.go(Skeletor.configuration.login.defaultRedirectPath, {}, {lang: FlowRouter.current().queryParams.lang});
            }
        }
    });
};

// logout reusable function
SkeleUtils.Accounts.logout = function(redirectPath) {
    // reset registry
    if (SkeleUtils.GlobalUtilities.RegistryReset) {
        SkeleUtils.GlobalUtilities.RegistryReset();
    }

    Meteor.logout(function(error) {
        // when logging out drop all cached documents from all collections
        // in standard subs managers
        _.each(Skeletor.subsManagers, function(subManager) {
            subManager.clear();
        });

        if (redirectPath) {
            FlowRouter.go(redirectPath, {}, {lang: FlowRouter.current().queryParams.lang});
        }
        else {
            FlowRouter.go(Skeletor.configuration.login.defaultLogoutPath, {}, {lang: FlowRouter.current().queryParams.lang});
        }
    });
};
