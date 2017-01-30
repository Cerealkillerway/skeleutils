// this function accepts both a string or array of strings argument;
// each string represents a needed permission type or an unwanted permission type
// (if prefixed with "!")
SkeleUtils.GlobalUtilities.checkPermissions = function(permissionTypes) {
    'use strict';
    let userRoles;
    let neededPermissions = [];
    let forbiddenPermissions = [];
    let result = false;

    if (Meteor.isClient) {
        userRoles = Skeletor.currentUserRoles.get();

        if (userRoles) {
            userRoles = userRoles.fetch();
        }
    }
    if (Meteor.isServer) {
        let rolesIds = Meteor.user().profile.roles;

        userRoles = Skeletor.Data.Roles.find({_id: {$in: rolesIds}}).fetch();
    }

    function handlePermission(permissionType) {
        if (permissionType.indexOf('!') === 0) {
            forbiddenPermissions.push(permissionType.substring(1));
        }
        else {
            neededPermissions.push(permissionType);
        }
    }

    // if argument is a single permission type
    if (Match.test(permissionTypes, String)) {
        handlePermission(permissionTypes);
    }
    else {
        // if argument is an array of permission types
        if (Match.test(permissionTypes, [String])) {
            permissionTypes.forEach(function(permissionType) {
                handlePermission(permissionType);
            });
        }
        else {
            // wrong argument(s)
            return false;
        }
    }

    // neededPermissions contains all needed permissions to check
    // while forbiddenPermissions contains all unwanted permissions (if user have one or more of these, check will fail)

    // check if user is a SUPER USER
    if (_.find(userRoles, function(role) { return role.name === 'SUPERUSER'; })) {
        if (Meteor.isClient) {
            SkeleUtils.GlobalUtilities.logger('SUPERUSER detected -> access granted', 'skelePermissions');
        }
        return true;
    }


    // FIX!!!!!!
    checkIfAllowed = function(userRoles, evaluatingPermission) {
        return _.find(userRoles, function(role) {
            return role[evaluatingPermission];
        });
    };

    // check needed permissions
    for (let i = 0; i < neededPermissions.length; i++) {
        let evaluatingPermission = neededPermissions[i];
        let isAllowed = checkIfAllowed(userRoles, evaluatingPermission);

        if (isAllowed !== undefined) {
            continue;
        }
        else {
            return false;
        }
    }

    // check forbidden permissions
    for (let i = 0; i < forbiddenPermissions.length; i++) {
        let evaluatingPermission = forbiddenPermissions[i];
        let isAllowed = checkIfAllowed(userRoles, evaluatingPermission);

        if (isAllowed === undefined) {
            continue;
        }
        else {
            return false;
        }
    }

    return true;
};
