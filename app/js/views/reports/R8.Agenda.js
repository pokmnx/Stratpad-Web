define(['BaseReport', 'Config'],

    function(BaseReport, config) {

        var view = BaseReport.extend({

            el: '#agendaReport',

            reportName: 'Agenda',

            initialize: function(router, localizable) {
                _.bindAll(this, "load", "renderMeetings", "_strategyItem", '_themeItem', '_metricItem', '_activityItem', '_phrase');
                BaseReport.prototype.initialize.call(this, router, localizable);
            },

            load: function() {
                BaseReport.prototype.load.call(this);

                this.$el.empty();

                this.$el.spin({top: '50px'});
                
                var self = this;

                $.ajax({
                    url: config.serverBaseUrl + "/reports/r8",
                    type: "GET",
                    dataType: 'json',
                    // data: {'id': self.stratFileId, 'startDate': 20120201},
                    data: {'id': self.stratFileId},
                    contentType: "application/json; charset=utf-8"
                })
                    .done(function(response, textStatus, jqXHR) {

                        self.beforeRender(response);

                        self.startDate = response.startDate;

                        // subtitle
                        $('header > hgroup > h2').text(self.subcontext(response.startDate));

                        self.renderMeetings(response.meetings);

						$('#pageContent').nanoScroller();

                    })
                    .fail(function(jqXHR, textStatus, errorThrown) {
                        console.error("%s: %s", textStatus, errorThrown);
                    })
                    .always(function() {
                        self.$el.spin(false);
                    });

            },

            // startDate is straight from the json - YYYYMMDD
            subcontext: function(strategyStartDate) {
                if (strategyStartDate == undefined) {
                    strategyStartDate = this.startDate;
                };
                var date = moment(strategyStartDate.toString(), $.stratweb.dateFormats.in);
                var key = this.localized('title');                
                return sprintf(key, date.format("MMMM D, YYYY"));
            },

            contentForPdf: function() {
                var $content = BaseReport.prototype.contentForPdf.call(this).clone();

                // setup the subcontext, prince looks for h6 with id=subcontextn to drag into the header
                // use the same subcontext over and over, in this case
                var $subcontext = $('<h6>')
                    .prop('id', 'subcontext1')
                    .addClass('subcontextEntry')
                    .text(this.subcontext());
                $content.prepend($subcontext);

                // add dynamicSubcontext to the first meeting only (why? - somehow it allows the @top-right to appear)
                $content.find('> .meeting:nth-child(2)').addClass('dynamicSubcontext');

                return $content;
            },

            renderMeetings: function(meetingsJson) {
                var $el = this.$el || $(this.el);
                var self = this;

                var allResponsibles = [];
                _.each(meetingsJson, function(meeting) {
                    _.each(meeting.items, function(agendaItem) {
                        if ('themeResponsible' in agendaItem) {
                            allResponsibles.push(agendaItem.themeResponsible);
                        }
                        else if ('activityResponsible' in agendaItem) {
                            allResponsibles.push(agendaItem.activityResponsible);
                        }
                    });
                });
                allResponsibles = _.uniq(allResponsibles);

                _.each(meetingsJson, function(meeting) {
                    var $meeting = $('<div class="meeting"></div>');

                    // header
                    var $meetingHeader = $('<div class="meetingHeader"></div>');
                    var periodicString = '<strong>' + self.localized(meeting.frequency).toLowerCase() + '</strong>'
                    if (meeting.frequency == 'WEEKLY') {
                        var dateString = '<strong>' + moment(meeting.date.toString(), $.stratweb.dateFormats.in).format($.stratweb.dateFormats.out) + '</strong>';
                        $meetingHeader.html(sprintf(self.localized('AGENDA_WEEKLY_MEETING'), dateString, periodicString )); // xss safe
                    } else if (meeting.frequency == 'MONTHLY') {
                        var dateString = '<strong>' + moment(meeting.date.toString(), $.stratweb.dateFormats.in).format('MMMM YYYY') + '</strong>';
                        $meetingHeader.html(sprintf(self.localized('AGENDA_PERIODIC_MEETING'), dateString, periodicString )); // xss safe
                    } else if (meeting.frequency == 'QUARTERLY') {
                        var dateString = '<strong>' + moment(meeting.date.toString(), $.stratweb.dateFormats.in).format('MMMM YYYY') + '</strong>';
                        $meetingHeader.html(sprintf(self.localized('AGENDA_PERIODIC_MEETING'), dateString, periodicString )); // xss safe
                    } else if (meeting.frequency == 'ANNUALLY') {
                        var dateString = '<strong>' + moment(meeting.date.toString(), $.stratweb.dateFormats.in).format('MMMM YYYY') + '</strong>';
                        $meetingHeader.html(sprintf(self.localized('AGENDA_ANNUAL_MEETING'), dateString, periodicString )); // xss safe
                    }
                    $meetingHeader.appendTo($meeting);

                    // meeting items
                    var responsibles = [];
                    $agendaItems = $('<ul></ul>');
                    _.each(meeting.items, function(agendaItem) {
                        if (agendaItem.type == 'STRATEGY') {
                            $agendaItems.append(self._strategyItem(agendaItem, meeting.frequency));
                            // any strategy item should have everyone mentioned included
                            _.each(allResponsibles, function(responsible) {
                                responsibles.push(responsible);
                            });
                        } 
                        else if (agendaItem.type == 'THEME') {
                            $agendaItems.append(self._themeItem(agendaItem, meeting.frequency));
                            if ('themeResponsible' in agendaItem) {
                                responsibles.push(agendaItem.themeResponsible);
                            };
                        }
                        else if (agendaItem.type == 'METRIC') {
                            $agendaItems.append(self._metricItem(agendaItem));
                            if ('metricResponsible' in agendaItem) {
                                responsibles.push(agendaItem.metricResponsible);
                            };                            
                        } 
                        else if (agendaItem.type == 'ACTIVITY') {
                            $agendaItems.append(self._activityItem(agendaItem));
                            if ('activityResponsible' in agendaItem) {
                                responsibles.push(agendaItem.activityResponsible);
                            };
                        } 

                    });
                    $agendaItems.appendTo($meeting);

                    // add responsible to meeting
                    if (responsibles.length) {
                        $meeting.append(sprintf(self.localized('AGENDA_RESPONSIBLE_PEOPLE'), self._phrase(responsibles)));
                    } else {
                        // NB. sometimes we have meetings which contain only metrics, but we ask for projects or activities to be assigned, which is correct
                        $meeting.append(self.localized('AGENDA_NO_RESPONSIBLE_PEOPLE'));
                    }

                    // add the meeting to the content
                    $meeting.appendTo($el);

                });

            },

            _strategyItem: function(itemJson, frequency) {
                if ('strategyStartDate' in itemJson) {
                    var date = moment(itemJson.strategyStartDate.toString(), $.stratweb.dateFormats.in).format($.stratweb.dateFormats.out);
                    return sprintf('<li>' + this.localized('AGENDA_ITEM_STRATEGY_START') + '</li>', _.escape(itemJson.strategyName), date );
                } else if ('strategyEndDate' in itemJson) {
                    var date = moment(itemJson.strategyEndDate.toString(), $.stratweb.dateFormats.in).format($.stratweb.dateFormats.out);
                    return sprintf('<li>' + this.localized('AGENDA_ITEM_STRATEGY_STOP') + '</li>', _.escape(itemJson.strategyName), date ) ;
                } else {
                    if (frequency == 'ANNUALLY') {
                        return sprintf('<li>' + this.localized('AGENDA_ITEM_STRATEGY_REVIEW') + '</li>', _.escape(itemJson.strategyName) );
                    } else {
                        return sprintf('<li>' + this.localized('AGENDA_ITEM_STRATEGY_PROGRESS') + '</li>', _.escape(itemJson.strategyName) );
                    }
                }
            },

            _themeItem: function(itemJson, frequency) {
                var responsible;
                if ('themeResponsible' in itemJson) {
                    responsible = _.escape($.stratweb.firstname(itemJson.themeResponsible)); 
                } else {
                    responsible = this.localized('UNASSIGNED');
                }

                if ('themeStartDate' in itemJson) {
                    var date = moment(itemJson.themeStartDate.toString(), $.stratweb.dateFormats.in).format($.stratweb.dateFormats.out);
                    return sprintf('<li>' + this.localized('AGENDA_ITEM_THEME_START') + '</li>', responsible, _.escape(itemJson.themeName), date );
                } else if ('themeEndDate' in itemJson) {
                    var date = moment(itemJson.themeEndDate.toString(), $.stratweb.dateFormats.in).format($.stratweb.dateFormats.out);
                    return sprintf('<li>' + this.localized('AGENDA_ITEM_THEME_STOP') + '</li>', responsible, _.escape(itemJson.themeName), date );
                } else {
                    return sprintf('<li>' + this.localized('AGENDA_ITEM_FINANCIAL_REVIEW') + '</li>', responsible, this.localized(frequency).toLowerCase(), _.escape(itemJson.themeName));
                }
            },

            _metricItem: function(itemJson) {
                var responsible;
                if ('metricResponsible' in itemJson) {
                    responsible = _.escape($.stratweb.firstname(itemJson.metricResponsible)); 
                } else {
                    responsible = this.localized('UNASSIGNED');
                }

                if ('metricTargetDate' in itemJson && 'metricTargetValue' in itemJson) {
                    var date = moment(itemJson.metricTargetDate.toString(), $.stratweb.dateFormats.in).format($.stratweb.dateFormats.out);
                    return sprintf('<li>' + this.localized('AGENDA_ITEM_OBJECTIVE_HAS_TARGET_AND_DATE') + '</li>', responsible, _.escape(itemJson.metricSummary), _.escape(itemJson.metricTargetValue), date );
                }
                else if ('metricTargetDate' in itemJson) {
                    var date = moment(itemJson.metricTargetDate.toString(), $.stratweb.dateFormats.in).format($.stratweb.dateFormats.out);
                    return sprintf('<li>' + this.localized('AGENDA_ITEM_OBJECTIVE_HAS_DATE') + '</li>', responsible, _.escape(itemJson.metricSummary), date );
                }
                else if ('metricTargetValue' in itemJson) {
                    return sprintf('<li>' + this.localized('AGENDA_ITEM_OBJECTIVE_HAS_TARGET') + '</li>', responsible, _.escape(itemJson.metricSummary), _.escape(itemJson.metricTargetValue) );
                }
                else {
                    return sprintf('<li>' + this.localized('AGENDA_ITEM_OBJECTIVE') + '</li>', responsible, _.escape(itemJson.metricSummary) );
                }

            },

            _activityItem: function(itemJson) {
                var responsible;
                if ('activityResponsible' in itemJson) {
                    responsible = _.escape($.stratweb.firstname(itemJson.activityResponsible)); 
                } else {
                    responsible = this.localized('UNASSIGNED');
                }
                if ('activityStartDate' in itemJson) {
                    var date = moment(itemJson.activityStartDate.toString(), $.stratweb.dateFormats.in).format($.stratweb.dateFormats.out);
                    return sprintf('<li>' + this.localized('AGENDA_ITEM_ACTIVITY_START') + '</li>', responsible, _.escape(itemJson.activityAction), date );
                } else if ('activityEndDate' in itemJson) {
                    var date = moment(itemJson.activityEndDate.toString(), $.stratweb.dateFormats.in).format($.stratweb.dateFormats.out);
                    return sprintf('<li>' + this.localized('AGENDA_ITEM_ACTIVITY_STOP') + '</li>', responsible, _.escape(itemJson.activityAction), date );
                }

            },

            _phrase: function(responsibles) {
                var head, tail;
                responsibles = _.uniq(responsibles);
                if (responsibles.length == 1) {
                    head = responsibles;
                    tail = undefined;
                }
                else if (responsibles.length > 1) {
                    head = responsibles.slice(0,responsibles.length-1);
                    tail = responsibles.slice(responsibles.length-1)[0];
                }
                else {
                    return undefined;
                }
                return _.escape( head.join(', ') + (tail ? ' and ' + tail : '') );
            }

        });

        return view;
    });