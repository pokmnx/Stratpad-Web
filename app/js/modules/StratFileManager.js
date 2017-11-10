define(['Config', 'StratFile', 'StratFileCollection', 'Theme', 'ThemeCollection', 'ObjectiveCollection', "i18n!nls/Global.i18n", 'Dictionary', 'PageStructure', 'backbone', 'ipp'],

    function(config, StratFile, StratFileCollection, Theme, ThemeCollection, ObjectiveCollection, gLocalizable, Dictionary, pageStructure) {

    var StratFileManager = Class.extend({

        initialize: function(router) {
            _.bindAll(this, "createStratFile", "initThemes", "initObjectives", "loadStratFile", "currentStratFile", "addTheme");
            this.router = router;
            this.localizable = new Dictionary(gLocalizable);

            // initialize collections so that we can establish listeners in other views
            this.stratFileCollection = new StratFileCollection();
            this.themeCollection = new ThemeCollection();
            this.objectiveCollection = new ObjectiveCollection();

            $(document).bind("stratFileLoaded", function(e, stratFile) {
                var attrs = stratFile.changedAttributes();
                if (attrs && Object.keys(attrs).length == 1 && 'lastAccessDate' in attrs && stratFile.id == this.stratFileId) {
                    // if we're just changing the access date on stratfile, then don't bother loading everything
                    console.debug("Updated lastAccessDate - don't reload themes");
                    return;
                };

                this.stratFileId = stratFile.get('id');

                // store this stratfile as the last one opened
                var userData = $.parseJSON($.localStorage.getItem('user'));
                var lastStratFileIdKey = sprintf('%s-%s', 'lastStratFileId', userData.id);
                $.localStorage.setItem(lastStratFileIdKey, this.stratFileId);

                // load up the rest of the stratfile pieces
                console.debug("Load up new themes.");
                this.themeCollection.reset();
                this.themeCollection.setStratFileId(this.stratFileId);
                this.initThemes(this.stratFileId);
                this.initObjectives(this.stratFileId);
            }.bind(this));

            // get stratFiles
            this.stratFileCollection.fetch({
                success: function(model, response) {
                    // don't bother creating a stratfile automatically anymore - welcome pages walk them through it

                    // ordered by lastAccessDate
                    // load up the stratFile we were last working on, or the last accessed
                    var userData = $.parseJSON($.localStorage.getItem('user'));
                    var lastStratFileIdKey = sprintf('%s-%s', 'lastStratFileId', userData.id);
                    this.stratFileId = $.localStorage.getItem(lastStratFileIdKey);
                    var stratFile = this.stratFileCollection.get(this.stratFileId);

                    // just use the first (last accessed) stratfile, if we don't have one saved, that is actually readable (ie easy to have an unaccepted stratfile here)
                    if (!stratFile) {
                        stratFile = this.stratFileCollection.filter(function(stratfile) {return stratfile.hasReadAccess('PLAN'); })[0];
                        this.stratFileId = stratFile.get('id');                        
                    };

                    // this starts the load of the app's first stratfile
                    $(document).trigger("stratFileLoaded", stratFile);

                }.bind(this),
                error: function(model, xhr, options) {
                    console.error(sprintf("Oops, couldn't load themes. Status: %s %s", xhr.status, xhr.statusText) );
                },
                silent: true // send no 'add' events (cause they don't honour the collection order)
            });                
        },

        createStratFile: function(navigateToStart) {

            var user = $.parseJSON($.localStorage.getItem('user'));
            var currency = user.preferredCurrency || '$';

            var stratFile = {
                name: this.localizable.get('default_stratfile_name'),
                uuid: $.stratweb.generateUUID(),
                permissions: '0700',
                currency: currency
            };

            var theme = {
                name: this.localizable.get('default_theme_name'),
                order: 0
            };

            var objective = {
                'summary': this.localizable.get('default_objective_name'),
                'order': 0,
                'type': 'FINANCIAL'
            };

            var stratFileId, themeId, sfm = this;
            var deferred = $.Deferred();
            deferred.resolve();

            deferred = deferred.then(function() {
                return $.ajax({
                    url: config.serverBaseUrl + "/stratfiles",
                    type: "POST",
                    data: JSON.stringify(stratFile),
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8"
                })
                .done(function(response, textStatus, jqXHR) {
                    stratFileId = response.data.stratFile.id;
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    console.error("%s: %s", textStatus, errorThrown);
                });             
            });

            deferred = deferred.then(function() {
                return $.ajax({
                    url: config.serverBaseUrl + "/stratfiles/" + stratFileId + '/themes',
                    type: "POST",
                    data: JSON.stringify(theme),
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8"
                })
                .done(function(response, textStatus, jqXHR) {
                    themeId = response.data.theme.id;
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    console.error("%s: %s", textStatus, errorThrown);
                });             
            });

            deferred = deferred.then(function() {
                return $.ajax({
                    url: config.serverBaseUrl + "/stratfiles/" + stratFileId + '/themes/' + themeId + '/objectives',
                    type: "POST",
                    data: JSON.stringify(objective),
                    dataType: 'json',
                    contentType: "application/json; charset=utf-8"
                })
                .done(function(response, textStatus, jqXHR) {

                    var sf = new StratFile({id: stratFileId});
                    sfm.stratFileCollection.add(sf, {at: 0, silent: true});
                    sfm.loadStratFile(stratFileId);
                    
                })
                .fail(function(jqXHR, textStatus, errorThrown) {
                    console.error("%s: %s", textStatus, errorThrown);
                });             
            });

        },

        initThemes: function(stratFileId) {
            if (!stratFileId) {
                console.error("You must provide a stratFileId");
                return;
            }

            // fetch the themes for this stratfile
            this.themeCollection.fetch({
                success: function(response) {
                    console.debug("Successfully downloaded themes.");

                    // custom event - sync on themeCollection gets fired too much
                    $(document).trigger("themesLoaded", this.themeCollection);
                }.bind(this),
                error: function(model, xhr, options) {
                    console.error(sprintf("Oops, couldn't load themes. Status: %s %s", xhr.status, xhr.statusText) );
                }
            });                

        },

        addTheme: function() {
            // determine order; we should always have >= 1 theme
            var order = 0;
            if (this.themeCollection.length) {
                console.debug("theme ct: " + this.themeCollection.length);
                var lastTheme = this.themeCollection.max(function(theme) {
                    return theme.get('order');
                });
                order = lastTheme.get('order') + 1;
            };

            // create new theme and save it
            var theme = new Theme({
                'name': this.localizable.get('default_theme_name'),
                'order': order
            }, {
                'stratFileId': this.themeCollection.stratFileId
            });
            theme.save(null, {
                success: function(model, response, options) {
                    this.themeCollection.add(theme); // will trigger the render

                    // navigate to new theme
                    var url = sprintf('nav/%s/%s/%s', pageStructure.SECTION_FORM, pageStructure.CHAPTER_THEMES, this.themeCollection.length - 1);
                    this.router.navigate(url, {
                        trigger: true,
                        replace: false
                    });

                    $('#pageContent').addClass('addingTheme');

                }.bind(this),
                error: function(model, xhr, options) {
                    console.error("Oops, couldn't save theme.");
                }
            });
        },

        cloneTheme: function(theme, includeObjectives) {
            // create new theme and save it
            var theme = new Theme({
                // no properties needed
            }, {
                'stratFileId': this.themeCollection.stratFileId,
                'sourceId': theme.get('id'),
                'includeObjectives': includeObjectives
            });
            theme.save(null, {
                success: function(model, response, options) {
                    this.themeCollection.add(theme); // will trigger the render

                    // navigate to new theme
                    var url = sprintf('nav/%s/%s/%s', pageStructure.SECTION_FORM, pageStructure.CHAPTER_THEMES, this.themeCollection.length - 1);
                    this.router.navigate(url, {
                        trigger: true,
                        replace: false
                    });

                    $('#pageContent').addClass('addingTheme');

                }.bind(this),
                error: function(model, xhr, options) {
                    console.error("Oops, couldn't save theme.");
                }
            });
        },


        initObjectives: function(stratFileId) {
            if (!stratFileId) {
                console.error("You must provide a stratFileId");
                return;
            }

            // fetch the objectives for this stratfile (ignoring theme)
            this.objectiveCollection.reset();
            this.objectiveCollection.setStratFileId(stratFileId);
            this.objectiveCollection.fetch({
                success: function(response) {
                    console.debug("Successfully downloaded all objectives for this stratfile.");
                },
                error: function(model, xhr, options) {
                    console.error(sprintf("Oops, couldn't load objectives. Status: %s %s", xhr.status, xhr.statusText) );
                }
            });                

        },

        loadStratFile: function(stratFileId, options) {
            var stratFile = this.stratFileCollection.get(stratFileId);
            options = options || {};
            var opts = {
                success: function(model) {
                    console.debug('StratFile fetched: ' + model.get('id'));
                    $(document).trigger("stratFileLoaded", [model]);
                }.bind(this),
                error: function(model, xhr, options) {
                    console.error(sprintf("Oops, couldn't load stratFile. Status: %s %s", xhr.status, xhr.statusText) );
                }
            };
            _.extend(opts, options);
            if (stratFile) {
                stratFile.fetch(opts);
            } 
            else {
                // this stratFile doesn't exist in our collection yet
                console.error('Make sure you add the new stratfile to the collection first.');
            }
        },

        currentStratFile: function() {
            return this.stratFileCollection.get(this.stratFileId);
        }



    });

    return StratFileManager;
});