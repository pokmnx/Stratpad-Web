define(['Config', 'ChartCollection', 'backbone'],

    function(config, ChartCollection) {

    var StratBoardManager = Class.extend({

        initialize: function(router) {
            _.bindAll(this, 'fetchCharts');
            this.router = router;

            // initialize collections so that we can establish listeners in other views
            this.chartCollection = new ChartCollection();

            $(document).bind("stratFileLoaded", function(e, stratFile) {
                var attrs = stratFile.changedAttributes();
                if (attrs && Object.keys(attrs).length == 1 && 'lastAccessDate' in attrs && stratFile.id == this.stratFileId) {
                    // if we're just changing the access date on stratfile, then don't bother loading everything
                    console.debug("Updated lastAccessDate - don't reload charts");
                    return;
                };

                console.debug("Load up new charts.");
                this.fetchCharts(stratFile.get('id'));
            }.bind(this));
        },

        fetchCharts: function(stratFileId) {
            this.chartCollection.setStratFileId(stratFileId);
            this.chartCollection.reset();

            // users might not have access to charts
            this.chartCollection.fetch({
                global: false, // we don't want the additional handling of 401's in main.js, used for the rest of the app, in this request
                success: function(charts, response) {
                    console.debug('charts downloaded: ' + charts.length);
                    $(document).trigger("chartsLoaded", charts);
                },
                error: function(model, xhr, options) {
                    console.error(sprintf("Oops, couldn't load charts. Status: %s %s", xhr.status, xhr.statusText) );
                    if (xhr.status == 401) {
                        console.warn('Permission denied to load charts. Probably a shared file without sufficient permission.');
                        
                    };
                    $(document).trigger("chartsLoaded", this.chartCollection);
                }
            });            
        }


    });

    return StratBoardManager;
});