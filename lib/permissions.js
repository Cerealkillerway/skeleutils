// this function accepts both a string or array of strings argument;
// each string represents a needed permission type or an unwanted permission type
// (if prefixed with "!")
SkeleUtils.GlobalUtilities.checkPermissions = function(permissionTypes) {
    'use strict';
    let userRoles;
    let result = true;

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

    // check if user is a SUPER USER
    if (_.find(userRoles, function(role) { return role.name === 'SUPERUSER'; })) {
        if (Meteor.isClient) {
            SkeleUtils.GlobalUtilities.logger('SUPERUSER detected -> access granted', 'skelePermissions');
        }
        return true;
    }

    // if argument is a single permission type, push it into an array
    if (Match.test(permissionTypes, String)) {
        permissionTypes = [permissionTypes];
    }

    // find a role that have all the needed requirements
    checkIfAllowed = function(userRoles, neededPermissions, forbiddenPermissions) {
        return _.find(userRoles, function(role) {
            /*if (Meteor.isClient) {
                SkeleUtils.GlobalUtilities.logger('----------------------------\nChecking permissions:\nNeeded permissions:\n' + neededPermissions.join(', ') + '\nForbidden permissions:\n' + forbiddenPermissions.join(', '), 'skelePermissions');
            }*/

            // check if the role have all neededPermissions
            for (let i = 0; i < neededPermissions.length; i++) {
                if (!role[neededPermissions[i]]) {
                    return false;
                }
            }

            // check if the role does not have all forbiddenPermissions
            for (let i = 0; i < forbiddenPermissions.length; i++) {
                if (role[forbiddenPermissions[i]]) {
                    return false;
                }
            }

            /*if (Meteor.isClient) {
                SkeleUtils.GlobalUtilities.logger('Found role that meets all requirements:\n' + role.name + '\n----------------------------', 'skeleSuccess');
            }*/

            return true;
        });
    };

    // permissionTypes is 2D matrix: an array of permissions sets
    //permissionTypes.forEach(function(currentPermissionSet){
    for (let i = 0; i < permissionTypes.length; i++) {
        let currentPermissionSet = permissionTypes[i];
        let neededPermissions = [];
        let forbiddenPermissions = [];

        // if the permissions set is a single permission type, push it into an array
        if (Match.test(currentPermissionSet, String)) {
            currentPermissionSet = [currentPermissionSet];
        }

        // cycle the permissions set and get needed and forbidden permissions
        for (let j = 0; j < currentPermissionSet.length; j++) {
            let currentPermission = currentPermissionSet[j];

            if (currentPermission.indexOf('!') === 0) {
                forbiddenPermissions.push(currentPermission.substring(1));
            }
            else {
                neededPermissions.push(currentPermission);
            }
        }

        // find a role that have all the requisites; otherwise check will fail
        let isAllowed = checkIfAllowed(userRoles, neededPermissions, forbiddenPermissions);

        if (isAllowed === undefined) {
            result = false;
            break;
        }
    }

    // if the user has a role with all requirements for every permissions set => is authorized!
    return result;
};
