SkeleUtils.GlobalUtilities.checkPermissions = function(permissionType) {
    'use strict';
    let userRoles;
    let allowedPermissions = [];
    let result = false;

    if (Meteor.isClient) {
        userRoles = Skeletor.currentUserRoles.get();

        if (userRoles) {
            userRoles = userRoles.fetch();
        }
    }

    switch (permissionType) {
        /*case 'particularTreatment':
        Array.prototype.push.apply(allowedPermissions, []);
        break;*/

        default:
        allowedPermissions.push(permissionType);
    }

    checkIfAllowed = function(userRoles, evaluatingPermission) {
        return _.find(userRoles, function(role) {
            if (role.name === 'SUPERUSER') {
                SkeleUtils.GlobalUtilities.logger('SUPERUSER detected -> access granted', 'skelePermissions');
                return true;
            }

            return role[evaluatingPermission];
        });
    };

    for (let i = 0; i < allowedPermissions.length; i++) {
        let evaluatingPermission = allowedPermissions[i];
        let isAllowed = checkIfAllowed(userRoles, evaluatingPermission);

        if (isAllowed !== undefined) {
            return true;
        }
    }

    return false;
};
