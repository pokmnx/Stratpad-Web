define(['BaseReport', 'views/reports/R8.Agenda', 'i18n!nls/R8.Agenda.i18n', 'Config'],

    function(BaseReport, Agenda, R8_localizable, config) {

        var view = Agenda.extend({

            reportName: 'Playbook.Agenda',

            // @override
            initialize: function(router, startDate) {
                _.bindAll(this, "load");

                // a moment
                this.startDate = startDate;
                this.endDate = moment(this.startDate).add(1, 'month');

                // prevent these embedded charts from listening for these events
                this.boundEventPageChanged = true;
                this.boundEventStratFileLoaded = true;

                // call super
                Agenda.prototype.initialize.call(this, router, R8_localizable);
            },

            // @override
            load: function(excludeMeetings) {
                BaseReport.prototype.load.call(this);

                var self = this;

                // fetch report for current stratFile - return a promise
                return $.ajax({
                        url: config.serverBaseUrl + "/reports/r8",
                        type: "GET",
                        dataType: 'json',
                        data: {
                            'id': this.router.stratFileManager.stratFileId,
                            'startDate': this.startDate.format('YYYYMMDD'),
                            'endDate': this.endDate.format('YYYYMMDD')
                        },
                        contentType: "application/json; charset=utf-8"
                    })
                    .done(function(response, textStatus, jqXHR) {

                        self.beforeRender(response);

                        self.$el = $('<div id="agendaReport"/>');

                        if (!_.isEmpty(response.meetings)) {

                            // we don't want to see meetings from "this month" in "next month"
                            if (!_.isEmpty(excludeMeetings)) {

                                // remove duplicates
                                var meetings = _.reject(response.meetings, function(meeting) {
                                    // the meeting must have the same date, frequency and items
                                    var dup = _.findWhere(excludeMeetings, {
                                        date: meeting.date,
                                        frequency: meeting.frequency
                                    });
                                    // check items equivalency on meeting and dup
                                    if (!_.isEmpty(dup) && dup.items.length == meeting.items.length) {
                                        // good chance this is a dup; check item props
                                        return _.every(meeting.items, function(item) {
                                            return _.findWhere(dup.items, item);
                                        });
                                    } else {
                                        return false; // ie. don't reject
                                    }
                                });
                                self.renderMeetings(meetings);                                
                            }
                            else {
                                // renders onto self.$el
                                self.renderMeetings(response.meetings);                                
                            }

                        } else {
                            $('<div/>').text('No meetings scheduled.').appendTo(self.$el);
                        }

                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        console.error("%s: %s", textStatus, errorThrown);
                    });

            },

            //returns true if source has all the properties(nested) of target.
            contains: function(source, target) {
                var keys = _.keys(target);
                var noMatch = false; // assume it is a match
                noMatch = _.any(keys, function(key) { //loop through all the keys and return a true, if any no match found
                    var source_value = source[key];
                    var target_value = target[key];
                    if (_.isObject(target_value)) {
                        var result = _.contains(source_value, target_value);
                        return !result;
                    } 
                    else { 
                        return (source_value != target_value)
                    }
                });

                return !noMatch;
            }


        });

        return view;
    });