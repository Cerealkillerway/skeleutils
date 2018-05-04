import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


SkeleUtils.GlobalHelpers.skelelistGeneralHelpers = {
    label: function(listField, options) {
        let name = listField.name;
        name = listField.name.substring(name.lastIndexOf('.') + 1, name.length);

        switch(options) {

            default:
            return i18n.get(name + '_lbl');
        }
    },


    listRecord: function(listRecord, listSchema) {
        listSchema = listSchema.get();

        // if necessary fire "beforeRendering" callback (defined on the current schema)
        if (listSchema.callbacks && listSchema.callbacks.beforeRendering) {
            listRecord = listSchema.callbacks.beforeRendering(listRecord);
        }

        return listRecord;
    },


    field: function(listField, data, schema, listTemplateinstance) {
        if (listTemplateinstance.skeleSubsReady.get()) {
            let name = listField.name;
            let fieldSchema = SkeleUtils.GlobalUtilities.fieldSchemaLookup(schema.fields, name);
            let lang = FlowRouter.getParam('itemLang');
            let defaultLang = Skeletor.configuration.lang.default;
            let UIlang = FlowRouter.getQueryParam('lang');
            let result = {};
            let value;
            let listViewOptions = schema.listView.get();
            let listOptions = fieldSchema.__listView;
            let link = schema.__listView.detailLink;
            let pathShards = name.split('.');
            let fieldMissingTranslation = false;

            if (name === '_id') {
                fieldSchema = {i18n: false};
            }

            if (fieldSchema.i18n === undefined) {
                if (data[lang + '---' + name]) {
                    value = data[lang + '---' + name];
                }
                else {
                    value = data[defaultLang + '---' + name];
                    fieldMissingTranslation = true;
                }
            }
            else {
                value = data;

                pathShards.forEach(function(pathShard, index) {
                    value = value[pathShard];
                });
            }

            // if the value is a data source -> find the source attribute
            if (listViewOptions.sourcedFields && listViewOptions.sourcedFields[name] !== undefined) {
                let sourceOptions = listViewOptions.sourcedFields[name];
                let values;
                let mappedValue = [];

                // value can be an array since the field can contain multiple values (like a multiple select)
                // to handle this properly, let's transform it into an array if it's a single value
                if (!Match.test(value, [Match.Any])) {
                    values = [value];
                }
                else {
                    values = value;
                }

                values.forEach(function(value) {
                    let sourceDocument = Skeletor.Data[sourceOptions.collection].findOne({_id: value});

                    if (sourceDocument) {
                        let nameAttr = sourceDocument;
                        let missingTranslation = false;

                        sourceOptions.mapTo.split('.').forEach(function(nameShard, index) {
                            if (nameShard.indexOf(':itemLang---') === 0) {
                                let nameOnly = nameShard.substring(12, nameShard.length);

                                if (nameAttr[lang + '---' + nameOnly]) {
                                    nameAttr = nameAttr[lang + '---' + nameOnly];
                                }
                                else {
                                    nameAttr = nameAttr[defaultLang + '---' + nameOnly];
                                    missingTranslation = true;
                                }
                            }
                            else {
                                nameAttr = nameAttr[nameShard];
                            }
                        });

                        if (missingTranslation) {
                            value = '#(' + nameAttr + ')';
                        }
                        else {
                            value = nameAttr;
                        }
                    }
                    else {
                        value = i18n.get('none_lbl');
                    }
                    mappedValue.push(value);
                });

                value = mappedValue.join(', ');
            }

            // check if the field should be a link to detail page
            if (listField.link) {
                let params = {};
                let segmentLang = FlowRouter.getParam('itemLang');

                link.params.forEach(function(param, index) {
                    switch (param) {
                        case 'itemLang':
                        params[param] = lang;
                        break;

                        default:
                        let paramFieldSchema = SkeleUtils.GlobalUtilities.fieldSchemaLookup(schema.fields, param);

                        if (paramFieldSchema.i18n === undefined) {
                            if (data[lang + '---' + param]) {
                                params[param] = data[lang + '---' + param];
                            }
                            else {
                                params[param] = data[defaultLang + '---' + param];
                                segmentLang = defaultLang;
                            }
                        }
                        else {
                            params[param] = data[param];
                        }
                    }
                });

                result.link = FlowRouter.path(link.basePath, params, {lang: UIlang, sLang: segmentLang});
            }

            // applies field's listview options
            if (listOptions) {
                // strip HTML
                if (listOptions.stripHTML) {
                    value = value.replace(/<(?:.|\n)*?>/gm, '');
                }

                // handle truncation
                if (listOptions.truncate) {
                    if (value.length > listOptions.truncate.max) {
                        let truncateSuffix = listOptions.truncate.suffix || '[...]';

                        value = value.substr(0, listOptions.truncate.max) + truncateSuffix;
                    }
                }

                // fire transformation callback
                if (listOptions.transform) {
                    value = listOptions.transform(value, data);
                }
            }

            if (fieldMissingTranslation) {
                result.value = '#(' + value + ')';
            }
            else {
                if (value === '' || value === undefined) {
                    result.value = i18n.get('none_lbl');
                }
                else {
                    result.value = value;
                }
            }
            return result;
        }
    },


    isSorted: function(field) {
        let sortOptions = Template.instance().data.schema.__listView.sort;

        let sorted = _.find(sortOptions, function(sortValue, sortName) {
            return sortName === field.name;
        });

        if (sorted === 1) {
            return '<i class="material-icons">arrow_drop_down</i>'
        }
        if (sorted === -1) {
            return '<i class="material-icons">arrow_drop_up</i>'
        }
    },


    paginate: function(data) {
        if (!data.list) {
            let schema = data.schema;
            let listSchema = schema.__listView;
            let options = listSchema.options;
            let sort = listSchema.sort;
            let collection = schema.__collection;
            let findOptions = {};
            let list;

            // build sort object managing lang dependant attributes
            if (sort) {
                findOptions.sort = {};

                _.keys(sort).forEach(function(sortOption, index) {
                    let fieldSchema = $.grep(schema.fields, function(field){
                        return field.name == sortOption;
                    });

                    if (fieldSchema[0].i18n === undefined) {
                        findOptions.sort[FlowRouter.getParam('itemLang') + '---' + sortOption] = sort[sortOption];
                    }
                    else {
                        findOptions.sort[sortOption] = sort[sortOption];
                    }
                });
            }

            // get paginated data
            if (options && options.pagination) {
                let currentPage = FlowRouter.getQueryParam('page');
                let skip = parseInt(currentPage - 1) * options.itemsPerPage;

                findOptions.limit = options.itemsPerPage;
                findOptions.skip = skip;
                list = Skeletor.Data[collection].find({}, findOptions);
            }
            // get all data
            else {
                list = Skeletor.Data[collection].find({}, findOptions);
            }

            return list;
        }

        return data.list;
    },


    isPaginated: function(data) {
        let options = data.schema.listView.get().options;

        if  (options && options.pagination) {
            return true;
        }
        return false;
    },


    isTranslatable: function() {
        if (FlowRouter.getParam('itemLang')) {
            return true;
        }
        return false;
    }
};
