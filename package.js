Package.describe({
    name: 'cerealkiller:skeleutils',
    version: '1.0.0',
    // Brief, one-line summary of the package.
    summary: 'utilities and common functions',
    // URL to the Git repository containing the source code for this package.
    git: '',
    // By default, Meteor will default to using README.md for documentation.
    // To avoid submitting documentation, set this field to null.
    documentation: 'README.md'
});

Package.onUse(function(api) {
    // packages
    api.use('jquery', 'client');
    api.use('ecmascript');
    api.use('underscore@1.0.0');
    api.use('blaze-html-templates', 'client');
    api.use('tap:i18n@1.7.0');
    api.use('fourseven:scss@3.2.0', 'client');

    //exports
    api.export('skeleUtils');   // package namespace

    // styles
    api.addFiles('styles/loading.scss', 'client');

    // templates
    api.addFiles('templates/loading.html', 'client');

    // i18n
    api.addFiles('i18n/it.i18n.json');
    api.addFiles('i18n/en.i18n.json');

    // libraries
    api.addFiles('namespace.js');
    api.addFiles('lib/commonUtilities.js', 'client');
    api.addFiles('lib/permissions.js');

    api.addFiles('helpers/generalHelpers.js', 'client');
    api.addFiles('helpers/listHelpers.js', 'client');

    api.addFiles('events/generalEvents.js', 'client');

});

Package.onTest(function(api) {
    api.use('tinytest');
    api.use('cerealkiller:skeleutils');
    api.addFiles('skeleUtils-tests.js');
});




// UTILITIES
// get list of all files in a folder
function getFilesFromFolder(packageName, folder){
    // local imports
    var _ = Npm.require("underscore");
    var fs = Npm.require("fs");
    var path = Npm.require("path");
    // helper function, walks recursively inside nested folders and return absolute filenames
    function walk(folder){
        var filenames = [];
        // get relative filenames from folder
        var folderContent=fs.readdirSync(folder);
        // iterate over the folder content to handle nested folders
        _.each(folderContent,function(filename){
            // build absolute filename
            var absoluteFilename=folder + path.sep + filename;
            // get file stats
            var stat=fs.statSync(absoluteFilename);
            if (stat.isDirectory()){
                // directory case => add filenames fetched from recursive call
                filenames=filenames.concat(walk(absoluteFilename));
            }
            else {
                // file case => simply add it
                filenames.push(absoluteFilename);
            }
        });
        return filenames;
    }
    // save current working directory (something like "/home/user/projects/my-project")
    var cwd = process.cwd();
    // chdir to our package directory
    process.chdir("packages" + path.sep + packageName);
    // launch initial walk
    var result = walk(folder);
    // restore previous cwd
    process.chdir(cwd);
    return result;
}
