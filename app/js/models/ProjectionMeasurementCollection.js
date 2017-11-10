define(['Config', 'ProjectionMeasurement', 'PageStructure', 'i18n!nls/Global.i18n', 'i18n!nls/ChartPage.i18n', 'Dictionary', 'backbone'], 

function(config, ProjectionMeasurement, pageStructure, gLocalizable, cLocalizable, Dictionary) {
    var ProjectionMeasurementCollection = Backbone.Collection.extend({
        entityName: "ProjectionMeasurementCollection",
        model: ProjectionMeasurement,
        urlRoot: config.serverBaseUrl + "/stratfiles/%s/projections/%s/measurements",
        initialize:function(models, options) {
            if (options) {
                this.stratFileId = options.stratFileId;
                this.projectionId = options.projectionId;
                this.url = sprintf(this.urlRoot, this.stratFileId, this.projectionId);
            };
            this.localizable = new Dictionary(gLocalizable, cLocalizable);
        },

        setIds:function(stratFileId, projectionId) {
            this.stratFileId = stratFileId;
            this.projectionId = projectionId;
            this.url = sprintf(this.urlRoot, this.stratFileId, this.projectionId);
        },

        parse: function(json) {
            if ("data" in json && "measurements" in json.data) {
                return json.data.measurements;
            } else {
                console.warn("Raw Measurements being parsed!!! This could be an error.");
                if (json.hasOwnProperty('errors')) {
                    var err = json.errors[0];
                    console.warn('Warning: ' + err.error);

                    if (err.error == 'QBO_ERROR_AUTHENTICATION') {

                        vex.dialog.open({
                            className: 'vex-theme-plain',
                            message: this.localizable.get('QBO_ERROR_AUTHENTICATION'),
                            buttons: [
                                $.extend({}, vex.dialog.buttons.YES, { text: this.localizable.get('btn_ok') }),
                                $.extend({}, vex.dialog.buttons.NO, { text: this.localizable.get('btn_reconnect') })
                            ],
                            callback: function(isOK) {
                                if (!isOK) {
                                    window.router.showStratPage(pageStructure.SECTION_FORM, pageStructure.CHAPTER_ABOUT, 0, true); 
                                }
                            }
                        });

                    };

                    return [];
                } 
                else {
                    return json;
                }
            }
        },
        comparator: function(measurement) {
            return measurement.get("date");
        },

        fetch: function(options) {
            // since we don't include parent ids in measurement from server, add them now

            var success = options.success;
            var error = options.error;

            var self = this;
            var opts = {
                success: function(collection, response) {
                    collection.each(function(measurement) {
                        measurement.stratFileId = self.stratFileId;
                        measurement.projectionId = self.projectionId;
                        measurement.updateUrl();
                    });

                    success(collection, response);
                },
                error: function(model, xhr, options) {
                    error(model, xhr, options);
                }
            };

            // overwrite old success and error, but maintain any other options
            _.extend(options, opts);

            return Backbone.Collection.prototype.fetch.call(this, options);
        }

    });
    return ProjectionMeasurementCollection;
});