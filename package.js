Package.describe({
    name: 'cerealkiller:skeleutils',
    version: '3.0.2',
    summary: 'Utilities and common functions for Skeletor',
    // URL to the Git repository containing the source code for this package.
    git: '',
    documentation: 'README.md'
});

Package.onUse(function(api) {
    // namespace
    api.addFiles(['namespace.js'], ['client', 'server']);

    api.versionsFrom('METEOR@1.6.1');
    // dependencies
    api.use([
        'jquery',
        'blaze-html-templates@1.1.2',
        'fourseven:scss@4.5.4'
    ],
    ['client']);

    api.use([
        'ecmascript',
        'underscore@1.0.0'
    ], ['client', 'server']);

    // styles
    api.addFiles(['styles/loading.scss'], ['client']);

    // templates
    api.addFiles(['templates/loading.html'], ['client']);

    // libraries
    api.addFiles([
        'lib/globalUtilities.js',
        'lib/jquery.alterClass.js'
    ],
    ['client']);

    api.addFiles([
        'lib/permissions.js',
        'lib/accounts.js',
        'lib/clientServerUtilities.js'
    ],
    ['client', 'server']);

    api.addFiles([
        'helpers/generalHelpers.js',
        'helpers/listHelpers.js',
        'helpers/loadingHelpers.js',
        'events/generalEvents.js'
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
