// created and reused by various tests; must run tests in order
// a module should be able to run independent of other modules, as long as the login module has run
var stratFileId;
var themeId;
var objectiveId;

////////////////////////////////////

// with BackBone, saves emit a POST if it is brand new, or a PUT if it already exists
// a PUT is designed to replace the existing contents (it is idempotent)
// this is argued ad nauseum: http://stackoverflow.com/questions/11013049/backbone-save-post-instead-of-put
// the biggest problem would be that we lose the creationDate
// Backbone also supports HTTP PATCH by adding {patch:true} to save method
// we will follow BackBone - a PUT will replace the entire object

test( "lib test", function() {
    stop();
    expect(4);

	if (typeof console !== 'undefined') console.debug('jquery:', $.fn.jquery);
	if (typeof console !== 'undefined') console.debug('underscore: ', _.VERSION);
	if (typeof console !== 'undefined') console.debug('Backbone: ', JSON.stringify(Backbone));
	equal( $.fn.jquery, "2.1.1", "jquery check" );
	equal( _.VERSION, "1.8.3", "Underscore check" );
	equal( Backbone.VERSION, "1.2.3", "Backbone check" );
    ok(typeof(Storage) !== "undefined", "localStorage check");
    start();
});

var stratFile;
test( "stratfile create", function() {
	stop();
	expect(3);

    stratFile = new StratFile({'name':'Backbone Test StratFile', 'city':'Calgary'});
    stratFile.set("uuid", generateUUID());

    stratFile.save(null, {
        success: function(model, response, options) {                        
            console.debug("Created stratFile with id: " + model.get("id"));
            ok (model.get("id")*1 > 0, "id check");

            console.debug("cdate: " + model.get("creationDate"));
    		console.debug("mdate: " + model.get("modificationDate"));
    		console.debug("adate: " + model.get("lastAccessDate"));

    		equal (model.get("creationDate"), model.get("modificationDate"), "date check 1");
    		equal (model.get("creationDate"), model.get("lastAccessDate"), "date check 2");

            start();
        },
        error: function(model, xhr, options) {
            console.error("Oops, couldn't save stratFile.");
            start();
        }
    });

});

test( "stratfile modify", function() {
	stop();
	expect(5);

	// note that with Backbone, because all attributes are sent again, we don't lose the city on an update
    stratFile.set("country", "Canada");

    stratFile.save(null, {
        success: function(model, response, options) {                        
            console.debug("Saved stratFile with id: " + model.get("id"));
    		equal( model.get("country"), "Canada", "country check" );
    		equal( model.get("city"), "Calgary", "country check" );

    		console.debug("cdate: " + model.get("creationDate"));
    		console.debug("mdate: " + model.get("modificationDate"));
    		console.debug("adate: " + model.get("lastAccessDate"));

    		notEqual (model.get("creationDate"), model.get("modificationDate"), "creation and modification dates should differ after a modify");
    		notEqual (model.get("creationDate"), model.get("lastAccessDate"), "lastAccessDate and creationDate should differ after a modify and a get");
    		equal (model.get("lastAccessDate"), model.get("modificationDate"), "lastAccessDate and modificationDate should be the same after a modify");

            start();
        },
        error: function(model, xhr, options) {
            console.error("Oops, couldn't save stratFile.");
            start();
        }
        // ,patch: true
    });

});

test( "stratfile get", function() {
	stop();
	expect(4);

	var id = stratFile.get("id");
    var sf = new StratFile({'id':id});

    sf.fetch({
        success: function(model, response, options) {                        
            console.debug("fetched stratFile with id: " + model.get("id"));
    		equal( model.get("country"), "Canada", "country check" );

    		console.debug("cdate: " + model.get("creationDate"));
    		console.debug("mdate: " + model.get("modificationDate"));
    		console.debug("adate: " + model.get("lastAccessDate"));

            notEqual (model.get("creationDate"), model.get("modificationDate"), "creation and modification dates should differ after a modify");
            notEqual (model.get("creationDate"), model.get("lastAccessDate"), "lastAccessDate and creationDate should differ after a modify and a get");
            notEqual (model.get("lastAccessDate"), model.get("modificationDate"), "lastAccessDate and modificationDate should be the same after a modify");

            start();
        },
        error: function(model, xhr, options) {
            console.error("Oops, couldn't fetch stratFile.");
            start();
        }
    });

});

test( "stratfile modify and get in parallel", function() {
    // replicates the situation where we are editing, say the strategystatement, and then we click on bizplan summary
    // that is essentially a save to stratfile on blur, and then a fetch on stratfile for bizplan
    stop();
    expect(6);

    var completed = 0;

    var proceed = function() {
        if (completed==2) {
            start();
        }
    }

    equal( stratFile.get("country"), "Canada", "country check" );

    stratFile.set('country', 'Spain');
    stratFile.save(null, {
        success:function(model, response, options) {
            console.debug("saved stratFile with id: " + model.get("id"));
            equal( model.get("country"), "Spain", "country check" );
            equal( stratFile.get("country"), "Spain", "country check" );
            completed += 1;
            proceed.call();
        },
        error: function(model, xhr, options) {
            console.error("Oops, couldn't save stratFile.");
            completed += 1;
            proceed.call();
        }
    });

    equal( stratFile.get("country"), "Spain", "country check" );

    // we can't guarantee what these will be, unless we wait for completion of the save
    stratFile.fetch({
        success: function(model, response, options) {                        
            console.debug("fetched stratFile with id: " + model.get("id"));
            ok( model.get("country") == "Spain" || model.get("country") == "Canada", "country check" );
            ok( stratFile.get("country") == "Spain" || stratFile.get("country") == "Canada", "country check" );

            completed += 1;
            proceed.call();
        },
        error: function(model, xhr, options) {
            console.error("Oops, couldn't fetch stratFile.");
            completed += 1;
            proceed.call();
        }
    });

});

test( "stratfile modify and get synchronously", function() {
    stop();
    expect(4);

    var deferred = $.Deferred();
    deferred.resolve();

    // we actually don't know what country is here, because it might not be done saving

    deferred = deferred.then(function() {
        stratFile.set('country', 'France');
        return stratFile.save(null, {
            success:function(model, response, options) {
                console.debug("saved stratFile with id: " + model.get("id"));
                equal( model.get("country"), "France", "country check" );
                equal( stratFile.get("country"), "France", "country check" );
            },
            error: function(model, xhr, options) {
                console.error("Oops, couldn't save stratFile.");
                start();            
            }
        });

    });

    deferred = deferred.then(function() {
        return stratFile.fetch({
            success: function(model, response, options) {                        
                console.debug("fetched stratFile with id: " + model.get("id"));
                equal( model.get("country"), "France");
                equal( stratFile.get("country"), "France");

                start();
            },
            error: function(model, xhr, options) {
                console.error("Oops, couldn't fetch stratFile.");
                start();
            }
        });

    });

});




test( "stratfile delete", function() {
	stop();
	expect(1);

    stratFile.destroy({
        success: function(model, response, options) {                        
            console.debug("Deleted stratFile with id: " + model.get("id"));
			equal( response.status, "success", "stratfile deletion check" );
            start();
        },
        error: function(model, xhr, options) {
            console.error("Oops, couldn't save stratFile.");
            start();
        }
    });

});




//////////////////////////////





test( "measurement collection PUT", function() {
    stop();
    expect(12);

    var deferred = $.Deferred();
    deferred.resolve();

    var theme, objective;

    stratFile = new StratFile({'name':'MetricCollection Test StratFile', 'city':'Calgary'});
    stratFile.set("uuid", generateUUID());

    deferred = deferred.then(function() {
        return stratFile.save(null, {
            success:function(model, response, options) {
                console.debug("saved stratFile with id: " + model.get("id"));
                equal( model.get("city"), "Calgary", "city check" );
            },
            error: function(model, xhr, options) {
                console.error("Oops, couldn't save stratFile.");
            }
        });
    });

    deferred = deferred.then(function() {
        theme = new Theme({'stratFileId': stratFile.get('id'), 'name': 'MetricCollection theme'});
        return theme.save(null, {
            success:function(model, response, options) {
                console.debug("saved theme with id: " + model.get("id"));
                equal( model.get("name"), "MetricCollection theme", "theme check" );
            },
            error: function(model, xhr, options) {
                console.error("Oops, couldn't save theme.");
            }
        });
    });

    deferred = deferred.then(function() {
        objective = new Objective({'stratFileId': stratFile.get('id'), 'themeId': theme.get('id'), 'summary': 'MetricCollection objective'});
        return objective.save(null, {
            success:function(model, response, options) {
                console.debug("saved objective with id: " + model.get("id"));
                equal( model.get("summary"), "MetricCollection objective", "objective check" );
            },
            error: function(model, xhr, options) {
                console.error("Oops, couldn't save objective.");
            }
        });
    });

    deferred = deferred.then(function() {
        var model = { 'stratFileId': stratFile.get('id'), 'themeId': theme.get('id'), 'objectiveId': objective.get('id') };
        var metric1 = new Metric($.extend(model, {'summary': 'metric1'}));

        return metric1.save(null, {
            success:function(model, response, options) {
                equal( model.get("summary"), "metric1", "metric check" );
            },
            error: function(model, xhr, options) {
                console.error("Oops, couldn't save objective.");
            }
        });

    });

    deferred = deferred.then(function() {
        var model = { 'stratFileId': stratFile.get('id'), 'themeId': theme.get('id'), 'objectiveId': objective.get('id') };
        var metric2 = new Metric($.extend(model, {'summary': 'metric2'}));

        return metric2.save(null, {
            success:function(model, response, options) {
                equal( model.get("summary"), "metric2", "metric check" );
            },
            error: function(model, xhr, options) {
                console.error("Oops, couldn't save objective.");
            }
        });

    });

    var metricCollection = new MetricCollection(null, {model: Metric}); // in test situation, MetricCollection doesn't know how to require Metric, so set it manually
    var metricIds;
    deferred = deferred.then(function() {
        metricCollection.setIds(stratFile.get('id'), theme.get('id'), objective.get('id'));
        return metricCollection.fetch({
            success: function(metrics) {
                equal (metrics.length, 2);
                metricIds = metrics.pluck('id');
            },
            error: function(model, xhr, options) {
                console.error(sprintf("Oops, couldn't load metrics. Status: %s %s", xhr.status, xhr.statusText) );
            }
        });
    });

    deferred = deferred.then(function() {
        var model = { 'stratFileId': stratFile.get('id'), 'themeId': theme.get('id'), 'objectiveId': objective.get('id') };
        var metric3 = new Metric($.extend(model, {'summary': 'metric3'}));
        metricCollection.add(metric3);

        return metricCollection.syncCollection({
            success:function(metrics, response, options) {
                equal (metrics.length, 3);

                // note that our ids are the same, but the cids are new (because of the internal reset)
                var newMetricIds = metrics.pluck('id');
                equal (_.union(metricIds, newMetricIds).length, 3);

                equal (metrics.where({'summary': 'metric1'}).length, 1 );
                equal (metrics.where({'summary': 'metric2'}).length, 1 );
                equal (metrics.where({'summary': 'metric3'}).length, 1 );
            },
            error: function(model, xhr, options) {
                console.error("Oops, couldn't save objective.");
            }
        });
    });

    deferred = deferred.then(function() {
        return stratFile.destroy({
            success: function(model, response, options) {                        
                console.debug("Deleted stratFile with id: " + model.get("id"));
                equal( response.status, "success", "stratfile deletion check" );
                start();
            },
            error: function(model, xhr, options) {
                console.error("Oops, couldn't save stratFile.");
                start();
            }
        });

    });


});





