Package.describe({
    name: 'cerealkiller:skeleutils',
    version: '5.0.0',
    summary: 'utilities and common functions for skeletor',
    // URL to the Git repository containing the source code for this package.
    git: '',
    documentation: 'README.md'
});

Package.onUse(function(api) {
    // namespace
    api.addFiles([
        'namespace.js'
    ],
    ['client', 'server']);


    api.versionsFrom('METEOR@1.8.0.2');


    // dependencies
    api.use([
        'jquery',
        'blaze-html-templates@1.1.2',
        'fourseven:scss@4.5.4'
    ],
    ['client']);


    api.use([
        'ecmascript',
        'underscore@1.0.0',
        'momentjs:moment',
        'ros:publish-counts@0.4.0'
    ],
    ['client', 'server']);


    // styles
    api.addFiles([
        'styles/loading.scss'
    ],
    ['client']);


    // templates
    api.addFiles([
        'templates/loading.html'
    ],
    ['client']);


    // libraries
    api.addFiles([
        'lib/global-utilities.js',
        'lib/jquery.alter-class.js'
    ],
    ['client']);


    api.addFiles([
        'lib/permissions.js',
        'lib/accounts.js',
        'lib/client-server-utilities.js'
    ],
    ['client', 'server']);


    api.addFiles([
        'helpers/general-helpers.js',
        'helpers/list-helpers.js',
        'helpers/toolbars-helpers.js',
        'helpers/loading-helpers.js',
        'events/general-events.js'
    ],
    ['client']);


    // exports
    api.export(['SkeleUtils']);
});


Package.onTest(function(api) {
    api.use([
        'tinytest',
        'cerealkiller:skeleutils'
    ]);

    api.addFiles('skeleutils-tests.js');
});
