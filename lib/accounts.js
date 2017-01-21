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
                message = TAPi18n.__("userNotFound_error");
                break;

                case 'Incorrect password':
                message = TAPi18n.__("incorrectPassword_error");
                break;
            }

            Materialize.toast(TAPi18n.__("accessDenied_error") + ' - ' + message, 4000);
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
SkeleUtils.Accounts.logout = function() {
    // reset registry
    if (SkeleUtils.GlobalUtilities.RegistryReset) {
        SkeleUtils.GlobalUtilities.RegistryReset();
    }

    Meteor.logout(function(error) {
        // when logging out drop all cached documents from all collections
        _.each(Skeletor.subsManagers, function(subManager) {
            subManager.clear();
        });

        FlowRouter.go(Skeletor.configuration.login.defaultLogoutPath, {}, {lang: FlowRouter.current().queryParams.lang});
    });
};
