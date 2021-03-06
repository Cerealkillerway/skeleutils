import { FlowRouter } from 'meteor/ostrio:flow-router-extra'
import { Counts } from 'meteor/ros:publish-counts'


SkeleUtils.GlobalHelpers.skelelistGeneralHelpers = {
    label: function(listField, options) {
        let name = listField.name

        name = listField.name.substring(name.lastIndexOf('.') + 1, name.length)

        switch(options) {
            default:
            return Skeletor.Skelelang.i18n.get(name + '_lbl')
        }
    },


    listRecord: function(listRecord, listSchema, schema) {
        listSchema = listSchema.get()

        // if necessary fire "beforeRendering" callback (defined on the current schema)
        if (listSchema.callbacks && listSchema.callbacks.beforeRendering) {
            listRecord = listSchema.callbacks.beforeRendering(listRecord)
        }

        for (itemField of listSchema.itemFields) {
            // avoid displaying documents loaded by other parts of application
            // that doesn't have the needed fields
            let fieldSchema = SkeleUtils.GlobalUtilities.fieldSchemaLookup(schema.fields, itemField.name)
            let fieldName = itemField.name

            if (fieldSchema.i18n === undefined || fieldSchema.i18n === true) {
                let currentLang = FlowRouter.getParam('itemLang')

                fieldName = currentLang + '---' + fieldName
            }

            let fieldValue = listRecord

            for (fieldNameShard of fieldName.split('.')) {
                fieldValue = fieldValue[fieldNameShard]
            }

            if (fieldValue === undefined && !itemField.allowUndefined) {
                SkeleUtils.GlobalUtilities.logger(`record removed from list beacuse of undefined value in ${fieldName}`, 'SkeleUtils')
                return false
            }
        }

        return listRecord
    },


    field: function(listField, data, schema, listTemplateinstance) {
        if (listTemplateinstance.skeleSubsReady.get()) {
            let name = listField.name
            let fieldSchema = SkeleUtils.GlobalUtilities.fieldSchemaLookup(schema.fields, name)
            let lang = FlowRouter.getParam('itemLang')
            let defaultLang = Skeletor.configuration.lang.default
            let UIlang = FlowRouter.getQueryParam('lang')
            let result = {}
            let value
            let listViewOptions = schema.listView.get()
            let listOptions = fieldSchema.__listView
            let link = schema.__listView.detailLink
            let pathShards = name.split('.')
            let fieldMissingTranslation = false

            if (name === '_id') {
                fieldSchema = {i18n: false}
            }

            if (fieldSchema.i18n === undefined) {
                if (data[lang + '---' + name]) {
                    value = data[lang + '---' + name]
                }
                else {
                    value = data[defaultLang + '---' + name]
                    fieldMissingTranslation = true
                }
            }
            else {
                value = data

                pathShards.forEach(function(pathShard, index) {
                    value = value[pathShard]
                })
            }

            // if the value is a data source -> find the source attribute
            if (listViewOptions.sourcedFields && listViewOptions.sourcedFields[name] !== undefined) {
                let sourceOptions = listViewOptions.sourcedFields[name]
                let sourceSchema = Skeletor.Schemas[sourceOptions.schemaName]
                let sourceCollection = sourceSchema.__collection
                let sourceFieldSchema = SkeleUtils.GlobalUtilities.fieldSchemaLookup(sourceSchema.fields, sourceOptions.mapTo)
                let values
                let mappedValue = []

                // value can be an array since the field can contain multiple values (like a multiple select)
                // to handle this properly, let's transform it into an array if it's a single value
                if (!Match.test(value, [Match.Any])) {
                    values = [value]
                }
                else {
                    values = value
                }

                values.forEach(function(value) {
                    let sourceDocument = Skeletor.Data[sourceCollection].findOne({_id: value})

                    if (sourceDocument) {
                        let nameAttr = sourceDocument
                        let missingTranslation = false
                        let nameShards = sourceOptions.mapTo.split('.')

                        nameShards.forEach(function(nameShard, index) {
                            // if a nested field is i18n, that means that only the last shard should be prefixed with "lang---"
                            if ((index === nameShards.length -1) && (sourceFieldSchema.i18n === true || sourceFieldSchema.i18n === undefined)) {
                                if (nameAttr[`${lang}---${sourceOptions.mapTo}`]) {
                                    nameAttr = nameAttr[`${lang}---${sourceOptions.mapTo}`]
                                }
                                else {
                                    nameAttr = nameAttr[`${defaultLang}---${sourceOptions.mapTo}`]
                                    missingTranslation = true
                                }
                            }
                            else {
                                nameAttr = nameAttr[nameShard]
                            }
                        })

                        if (missingTranslation) {
                            value = '#(' + nameAttr + ')'
                        }
                        else {
                            value = nameAttr
                        }
                    }
                    else {
                        value = Skeletor.Skelelang.i18n.get('none_lbl')
                    }
                    mappedValue.push(value)
                })

                value = mappedValue.join(', ')
            }

            // check if the field should be a link to detail page
            if (listField.link) {
                let params = {}
                let segmentLang = FlowRouter.getParam('itemLang')

                link.params.forEach(function(param, index) {
                    switch (param) {
                        case 'itemLang':
                        params[param] = lang
                        break

                        default:
                        let paramFieldSchema = SkeleUtils.GlobalUtilities.fieldSchemaLookup(schema.fields, param)

                        if (paramFieldSchema.i18n === undefined) {
                            if (data[lang + '---' + param]) {
                                params[param] = data[lang + '---' + param]
                            }
                            else {
                                params[param] = data[defaultLang + '---' + param]
                                segmentLang = defaultLang
                            }
                        }
                        else {
                            params[param] = data[param]
                        }
                    }
                })

                result.link = FlowRouter.path(link.basePath, params, {lang: UIlang, sLang: segmentLang})
            }

            let emptyString = 'none_lbl'

            // applies field's listview options
            if (listOptions) {
                // strip HTML
                if (listOptions.stripHTML) {
                    value = value.replace(/<(?:.|\n)*?>/gm, '')
                }

                // handle truncation
                if (listOptions.truncate) {
                    if (value.length > listOptions.truncate.max) {
                        let truncateSuffix = listOptions.truncate.suffix || '[...]'

                        value = value.substr(0, listOptions.truncate.max) + truncateSuffix
                    }
                }

                // fire transformation callback
                if (listOptions.transform) {
                    value = listOptions.transform(value, data)
                }

                // custom none string
                if (listOptions.customEmptyString) {
                    emptyString = listOptions.customEmptyString
                }
            }

            if (fieldMissingTranslation) {
                result.value = '#(' + value + ')'
            }
            else {
                if (value === '' || value === undefined) {
                    result.value = Skeletor.Skelelang.i18n.get(emptyString)
                }
                else {
                    result.value = value
                }
            }
            return result
        }
    },


    isSorted: function(field) {
        let sortOptions = Template.instance().data.schema.__listView.sort

        let sorted = _.find(sortOptions, function(sortValue, sortName) {
            return sortName === field.name
        })

        if (sorted && sorted.direction === 1) {
            return '<i class="material-icons">arrow_drop_down</i>'
        }
        if (sorted && sorted.direction === -1) {
            return '<i class="material-icons">arrow_drop_up</i>'
        }
    },


    getDocumentsList: function(data) {
        let schema = data.schema
        let listSchema = schema.listView.get()
        let options = listSchema.options
        let sort = listSchema.sort
        let collection = schema.__collection
        let findOptions = {}
        let list
        let instance = Template.instance()
        let listQuery = instance.data.listQuery.get() || {}

        // build sort object managing lang dependant attributes
        if (sort) {
            findOptions.sort = {}

            _.keys(sort).forEach(function(sortOption, index) {
                let fieldSchema = SkeleUtils.GlobalUtilities.fieldSchemaLookup(schema.fields, sortOption)
                let sortOptionName

                if (fieldSchema.i18n === undefined) {
                    sortOptionName = FlowRouter.getParam('itemLang') + '---' + sortOption
                }
                else {
                    sortOptionName = sortOption
                }

                /*if (sort[sortOption].caseInsensitive) {
                    sortOptionName = Skeletor.configuration.sort.caseInsensitivePrefix + sortOptionName
                }*/

                findOptions.sort[sortOptionName] = sort[sortOption].direction
            })
        }

        return Skeletor.Data[collection].find(listQuery, findOptions)
    },


    isPaginated: function(data) {
        let options = data.schema.listView.get().options

        if  (options && options.pagination) {
            return true
        }
        return false
    },


    isTranslatable: function() {
        if (FlowRouter.getParam('itemLang')) {
            return true
        }
        return false
    },

    documentsCounter: function() {
        if (!Counts) {
            return false
        }

        let schema = Template.instance().data.schema
        let collection = schema.__collection

        return Counts.get(`${collection}Counter`)
    }
}
