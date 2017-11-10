define(['BaseReport', 'Config'],

    function(BaseReport, config) {

        var view = BaseReport.extend({

            el:'#projectPlanReport',

            dateFormat: $.stratweb.dateFormats.in,

            reportName: 'ProjectPlan',

            initialize: function(router, localizable) {
                _.bindAll(this, "load", "renderTable", "formattedDate");
                BaseReport.prototype.initialize.call(this, router, localizable);
            },

            load: function() {
                BaseReport.prototype.load.call(this);

                this.$el.find('tbody').empty();

                this.$el.spin({top: '50px'});
                
                var self = this;

                // fetch report for current stratFile
                $.ajax({
                    url: config.serverBaseUrl + "/reports/projectplan?id=" + self.stratFileId,
                    type: "GET",
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8"
                })
                    .done(function(response, textStatus, jqXHR) {

                        self.beforeRender(response);

                        self.renderTable(response);

                        // subtitle
                        var strategyStartDate = moment(response.startDate.toString(), self.dateFormat);
                        var key = self.localized('title');
                        $(self.el).find('header hgroup h2').text(sprintf(key, strategyStartDate.format("MMMM D, YYYY")));

						$('#pageContent').nanoScroller();

                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        console.error("%s: %s", textStatus, errorThrown);
                    })
                    .always(function() {
                        self.$el.spin(false);
                    });

            },

            renderTable: function(json) {
                var self = this;
                var $table = self.$el.find('tbody');

                // sort by dates
                self.sortThemes(json.themes);
                _.each(json.themes, function(theme) {
                    var $tr = $('<tr class="groupHeading rowDivider1 rowDivider6"></tr>');
                    $tr.append('<td>' + _.escape(theme.name) + (theme.responsible ? " [" + _.escape(theme.responsible) + "]" : "") + '</td>');
                    $tr.append('<td>' + self.formattedDate(theme.startDate) + '</td>');
                    $tr.append('<td>' + self.formattedDate(theme.endDate) + '</td>');
                    $table.append($tr);

                    self.sortObjectivesByDate(theme.objectives);
                    _.each(theme.objectives, function(objective) {
                        // if none of the metrics have a targetValue, and at least one has a targetDate, 
                        //    show the objective and the greatest metric targetDate (in the endDate col)
                        // otherwise just show the objective name
                        var metricsWithTargetValues = _.filter(objective.metrics, function(metric) {
                            return metric.targetValue != undefined && metric.targetValue != "";
                        });
                        if (!metricsWithTargetValues.length) {
                            var metricsWithTargetDates = _.filter(objective.metrics, function(metric) { return metric.targetDate != undefined; });
                            if (metricsWithTargetDates.length) {
                                self.sortMetrics(metricsWithTargetDates);

                                var $tr = $('<tr class="metric"></tr>');
                                $tr.append('<td>' + _.escape(objective.name) + '</td>');
                                $tr.append('<td></td>');
                                $tr.append('<td>' + self.formattedDate(_.last(metricsWithTargetDates).targetDate) + '</td>');
                                $table.append($tr);

                            };
                        } else {
                            var $tr = $('<tr class="metric"></tr>');
                            $tr.append('<td colspan="3">' + _.escape(objective.name) + '</td>');
                            $table.append($tr);

                        }

                        self.sortActivities(objective.activities);
                        _.each(objective.activities, function(activity) {
                            var $tr = $('<tr class="activity"></tr>');
                            $tr.append('<td>' + _.escape(activity.name) + (activity.responsible ? " [" + _.escape(activity.responsible) + "]" : "") + '</td>');
                            $tr.append('<td>' + self.formattedDate(activity.startDate) + '</td>');
                            $tr.append('<td>' + self.formattedDate(activity.endDate) + '</td>');
                            $table.append($tr);

                        });

                    });

                });

            },

            formattedDate: function(rawDate) {
                if (rawDate != undefined && rawDate > 0) {
                    return moment(rawDate.toString(), this.dateFormat).format('MMMM D, YYYY');
                } else {
                    return "&nbsp;";
                }
            }



        });

        return view;
    });