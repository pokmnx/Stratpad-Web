define(['MyAccountBasePageView', 'CommunityTrackingCollection', 'PageStructure'],

function(MyAccountBasePageView, CommunityTrackingCollection, pageStructure) {

    var view = MyAccountBasePageView.extend({

        el: '#connectReport',

        template: 'community/myAccount/ReportView',

        initialize: function(router) {            
            MyAccountBasePageView.prototype.initialize.call(this, router);

            _.bindAll(this, 'load', 'serviceProviderLoaded', 'populateReportTables', 'percentFormat', 'goConnect');
        },  

        renderPage: function() {
            // add to render context
            this.localizable.put('hasCompletedConnect', this.router.user.get('hasCompletedConnect'));

            MyAccountBasePageView.prototype.renderPage.call(this);

            // hook up the signup link
            this.$el.find('a#connectSignup')
                .off(this.router.clicktype, this.goConnect)
                .on(this.router.clicktype, this.goConnect);
        },

        load: function() {
            MyAccountBasePageView.prototype.load.call(this);
        },

        serviceProviderLoaded: function() {
            MyAccountBasePageView.prototype.serviceProviderLoaded.call(this);

            var self = this;

            // pretend this loaded up community trackings too
            this.trackings = new CommunityTrackingCollection([], {serviceProviderId: this.serviceProvider.get("id")});
            this.trackings.fetch({
                success: function(models) {
                    console.debug("Synced community trackings: " + models.length);

                    self.populateReportTables();

                },
                error: function(models, xhr, options) {
                    console.error(sprintf("Oops, couldn't sync community trackings. Status: %s %s", xhr.status, xhr.statusText));
                }                
            });

            // this.trackings.add([
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'impression', 'yearMonth': 201401, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'impression', 'yearMonth': 201401, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'impression', 'yearMonth': 201401, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'impression', 'yearMonth': 201402, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'impression', 'yearMonth': 201402, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'impression', 'yearMonth': 201402, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'impression', 'yearMonth': 201402, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'impression', 'yearMonth': 201403, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'impression', 'yearMonth': 201403, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'impression', 'yearMonth': 201403, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'impression', 'yearMonth': 201404, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'impression', 'yearMonth': 201404, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'impression', 'yearMonth': 201405, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'impression', 'yearMonth': 201405, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'impression', 'yearMonth': 201405, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'impression', 'yearMonth': 201406, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'impression', 'yearMonth': 201406, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'impression', 'yearMonth': 201406, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'impression', 'yearMonth': 201406, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'impression', 'yearMonth': 201406, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'impression', 'yearMonth': 201407, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'impression', 'yearMonth': 201407, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'impression', 'yearMonth': 201407, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'impression', 'yearMonth': 201407, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'impression', 'yearMonth': 201408, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'impression', 'yearMonth': 201408, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'impression', 'yearMonth': 201408, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'impression', 'yearMonth': 201409, 'cost': 0},

            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'click', 'yearMonth': 201401, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'click', 'yearMonth': 201402, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'click', 'yearMonth': 201403, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'click', 'yearMonth': 201404, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'click', 'yearMonth': 201405, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'click', 'yearMonth': 201405, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'click', 'yearMonth': 201406, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'click', 'yearMonth': 201406, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'click', 'yearMonth': 201407, 'cost': 0},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'click', 'yearMonth': 201407, 'cost': 0},

            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'invitation', 'yearMonth': 201405, 'cost': 25},
            //     {'serviceProviderId': 1, 'stratFileId': 1, 'action': 'invitation', 'yearMonth': 201407, 'cost': 25}

            //     ], {silent: true});

        },

        populateReportTables: function() {
            // NB this table implies a current cost per invite, but the actual cost is generated at the time of the invite

            $('header h2').text( sprintf(this.localizable.get('report_subtitle') + ' - %s', this.serviceProvider.get('name')) );

            // for the summary table, just fill in the blanks
            this.$el.find('#summaryTable #costPerView').text(0);
            this.$el.find('#summaryTable #costPerClick').text(0);
            var priceForInvitation = this.serviceProvider.get('priceForInvitation');
            this.$el.find('#summaryTable #costPerInvite').text(priceForInvitation != undefined ? $.stratweb.formatDecimalWithParens(priceForInvitation) : '-');

            var counts = this.trackings.countBy(function(tracking) { return tracking.get('action')});
            this.$el.find('#summaryTable #totalViews').text(counts.impression || 0);
            this.$el.find('#summaryTable #totalClicks').text(counts.click || 0);
            this.$el.find('#summaryTable #totalInvites').text(counts.invitation || 0);

            var ctr = counts.click/counts.impression*100;
            this.$el.find('#summaryTable #ctr').text(ctr ? $.stratweb.formatDecimalWithParens(ctr) + '%' : '-');   

            var totalCost = this.trackings.reduce(function(runningTotal, tracking) {return runningTotal + (tracking.get('cost') || 0)}, 0)
            this.$el.find('#summaryTable #totalCost').text($.stratweb.formatDecimalWithParens(totalCost));  


            // organize data for the main table:
            // let's show last 12 months for now, including current month

            var now = moment();
            if (this.trackings.length) {
                var earliestTracking = this.trackings.min(function(tracking) { return tracking.get('yearMonth'); });
                var earliestDate = moment(earliestTracking.get('yearMonth')+'', 'YYYYMM');
                var text = sprintf(this.localizable.get('summaryTableHeaderExtended'), earliestDate.format('MMMM YYYY'), now.format('MMMM YYYY'));
                $('#summaryTableWrapper h3').text(text);
            };

            var viewTrackings = this.trackings.where({"action":'impression'});
            var viewsPerMonth = _.countBy(viewTrackings, function(tracking) { return tracking.get('yearMonth')});

            var clickTrackings = this.trackings.where({"action":'click'});
            var clicksPerMonth = _.countBy(clickTrackings, function(tracking) { return tracking.get('yearMonth')});

            var inviteTrackings = this.trackings.where({"action":'invitation'});
            var invitesPerMonth = _.countBy(inviteTrackings, function(tracking) { return tracking.get('yearMonth')});

            // start and end date - last 12 months for now
            var duration = 12; // months
            var endMonth = now.format("YYYYMM");
            var startMonth = moment(now).subtract("months", duration-1).format("YYYYMM");

            // fill data
            var $headerRow = this.$el.find('#monthlyTable thead tr');
            var $viewsRow = this.$el.find('#monthlyTable tbody tr.views');
            var $clicksRow = this.$el.find('#monthlyTable tbody tr.clicks');
            var $invitesRow = this.$el.find('#monthlyTable tbody tr.invites');
            var $ctrRow = this.$el.find('#monthlyTable tbody tr.ctr');
            var $itrFromViewsRow = this.$el.find('#monthlyTable tbody tr.itrFromViews');
            var $itrFromClicksRow = this.$el.find('#monthlyTable tbody tr.itrFromClicks');

            var runningMonth = moment(now).subtract("months", duration-1);

            for (var i = 0; i < duration; i++) {
                var key = runningMonth.format('YYYYMM');

                var vpm = (viewsPerMonth[key] || '-');
                var cpm = (clicksPerMonth[key] || '-');
                var ipm = (invitesPerMonth[key] || '-');

                var ctrpm = vpm == 0 ? 0 : cpm/vpm*100;
                var itrvpm = vpm == 0 ? 0 : ipm/vpm*100;
                var itrcpm = vpm == 0 ? 0 : ipm/cpm*100;

                $headerRow.append('<th>' + runningMonth.format('MMM YYYY') + '</th>');
                $viewsRow.append('<td>' + vpm + '</td>');
                $clicksRow.append('<td>' + cpm + '</td>');
                $invitesRow.append('<td>' + ipm + '</td>');

                $ctrRow.append('<td>' + this.percentFormat(ctrpm) + '</td>');
                $itrFromViewsRow.append('<td>' + this.percentFormat(itrvpm) + '</td>');
                $itrFromClicksRow.append('<td>' + this.percentFormat(itrcpm) + '</td>');

                runningMonth.add('months', 1);
            };

        },

        percentFormat: function(num) {
            if (!num) return "-";
            else return $.stratweb.formatDecimalWithParens(num) + '%';
        },

        goConnect: function(e) {
            e.preventDefault();
            e.stopPropagation();
            var url = pageStructure.urlForCoords(pageStructure.SECTION_COMMUNITY, pageStructure.CHAPTER_MY_ACCOUNT, 0);
            this.router.emitPageChangeEvent = true;
            this.router.navigate(url, {
                trigger: true,
                replace: false
            });
        }


    });

    return view;
});