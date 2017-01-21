Package.describe({
    name: 'cerealkiller:skeleutils',
    version: '1.5.3',
    summary: 'utilities and common functions',
    // URL to the Git repository containing the source code for this package.
    git: '',
    documentation: 'README.md'
});

Package.onUse(function(api) {
    // namespace
    api.addFiles(['namespace.js'], ['client', 'server']);

    // dependencies
    api.use([
        'jquery',
        'blaze-html-templates',
        'fourseven:scss@3.2.0'
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
        'lib/commonUtilities.js',
        'lib/jquery.alterClass.js'
    ],
    ['client']);
    api.addFiles([
        'lib/permissions.js',
        'lib/accounts.js'
    ],
    ['client', 'server']);

    api.addFiles([
        'helpers/generalHelpers.js',
        'helpers/listHelpers.js',
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

    api.addFiles('SkeleUtils-tests.js');
});
