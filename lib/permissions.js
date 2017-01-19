skeleUtils.globalUtilities.checkPermissions = function(permissionType) {
    'use strict';
    let userRoles;
    let allowedRoles = [];
    let result = false;

    if (Meteor.isClient) {
        userRoles = Skeletor.currentUserRoles.get();

        if (userRoles) {
            userRoles = userRoles.fetch();
        }
    }

    switch (permissionType) {
        /*case 'particularTreatment':
        Array.prototype.push.apply(allowedRoles, []);
        break;*/

        default:
        allowedRoles.push(permissionType);
    }

    checkIfAllowed = function(userRoles, evaluatingRole) {
        return _.find(userRoles, function(role) {
            return role[evaluatingRole];
        });
    };

    for (let i = 0; i < allowedRoles.length; i++) {
        let evaluatingRole = allowedRoles[i];
        let isAllowed = checkIfAllowed(userRoles, evaluatingRole);

        if (isAllowed !== undefined) {
            result = true;
            break;
        }
    }

    return result;
};
