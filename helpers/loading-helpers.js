Template.gearContent.helpers({
    displayLoading: function(formSchema) {
        if (formSchema.__options === undefined) {
            return true;
        }

        // display loading gears if loadingPlaceholder option is not explicitly set to false in the schema
        if (formSchema.__options.loadingPlaceholder !== false) {
            return true;
        }
        return false;
    }
});
