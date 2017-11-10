define(['ProjectNoteItemListView', 'ProjectNoteItem', 'ProjectNoteItemCollection', 'Config', 'Selectize'],

    function(ProjectNoteItemListView, ProjectNoteItem, ProjectNoteItemCollection, config, Selectize) {

        var ProjectNotesManager = Class.extend({

            initialize: function(router, theme, localizable) {
            	this.router = router;
            	this.theme = theme;
            	this.localizable = localizable;

                _.bindAll(this, "load", "_pniAddNote", "_pniRemoveNote", "_pniHandleInputChange", "_pniSelectize", "_setupSelectize");            	

                var self = this;

                this._setupSelectize();

	            this.$el = $('#pageContent .content section article form');
                this.stratFile = this.router.stratFileManager.stratFileCollection.get(this.theme.get('stratFileId'));
                this.projectNoteItemCollection = new ProjectNoteItemCollection(null, {
                    stratFileId: this.stratFile.id,
                    themeId: this.theme.id
                });

                // all the fields which can have notes
                this.$projectNoteTips = $('#pageContent').find('.projectNotesIcon');

                // fetch categories
                this.pniCategories = [];

                // prepare for render
                var noteTemplate = Handlebars.templates['forms/themes/ProjectNoteItemList'],
                    context = _.extend(self.localizable.all(), {readonly: this.stratFile.isReadOnly('PLAN') }),
                    noteTip = noteTemplate(context);

                // add tooltipster to each relevant field
                this.$projectNoteTips
                    .tooltipster({
                        autoClose: true,
                        content: $(noteTip),
                        contentCloning: false,
                        positionTracker: true,
                        contentAsHTML: true,

                        // on close
                        functionAfter: function(origin) {

                            origin.parent().removeClass('active');

                            $('.tooltip-overlay')
                                .fadeOut(200, function() {
                                    $(this).remove();
                                });

                            var $field = origin.next();
                            var notes = self.projectNoteItemCollection.where({
                              'field': $field.attr('id')
                            });

                            // if we don't have write access, don't release the readonly (on the main project field)
                            var hasNotes = notes.length > 0;
                            var hasWrite = self.stratFile.hasWriteAccess('PLAN');
                            $field.prop('readonly', !hasWrite || hasNotes);

                            // clear out the old project list
                            self.projectNoteItemListView.clearRows();

                        },

                        // on open
                        functionReady: function(origin, tooltip) {

                            // origin is the icon
                            origin.parent().addClass('active');

                            // the project field we're working on
                            var $field = origin.next(),
                                itemData = {
                                    amount: $field.val(),
                                    field: $field.attr('id'),
                                    stratFileId: self.stratFile.id,
                                    themeId: self.theme.id
                                };

                            // add a class with fieldType so we can hide certain columns on certain types

                            tooltip
                                .addClass(sprintf('fieldType-%s', itemData.field))
                                .data('fieldType', itemData.field);

                            if (self.projectNoteItemCollection.where({'field': itemData.field}).length) {

                                // we have some for this field, render

	                            origin.parent().addClass('has-notes');

                                self.projectNoteItemListView = new ProjectNoteItemListView(
                                    self.router,
                                    self.theme,
                                    self.projectNoteItemCollection,
                                    itemData.field,
                                    self.localizable
                                );

                                self.projectNoteItemListView.render();

                            } else {

                                // no notes for this field yet, lets create the default and render

                                var projectNoteItem = new ProjectNoteItem({
                                    "stratFileId": itemData.stratFileId,
                                    "themeId": itemData.themeId,
                                    "price": itemData.amount,
                                    "field": itemData.field,
                                    "amount": itemData.amount
                                });

                                projectNoteItem.save(null, {
                                    success: function(model) {
                                        self.projectNoteItemCollection.add(model);
                                        self.projectNoteItemListView = new ProjectNoteItemListView(
                                            self.router,
                                            self.theme,
                                            self.projectNoteItemCollection,
                                            itemData.field,
                                            self.localizable
                                        );

                                        self.projectNoteItemListView.render();
	                                    origin.parent().addClass('has-notes');

                                    },
                                    error: function(model, xhr, options) {
                                        console.log("error saving note item.");
                                    }
                                });

                            }

                            $('#pageContent').find('#f4')
                                .prepend('<div class="tooltip-overlay" />')
                                .find('.tooltip-overlay')
                                .animate({
                                    opacity: 1
                                }, 200);

                        },
                        interactive: true,
                        offsetY: '0px',
                        maxWidth: 768,
                        onlyOne: true,
                        theme: 'tooltipster-stratpad tooltip-notes',
                        trigger: 'click'
                    });

                $(document)
                    .off('notesRendered')
                    .on('notesRendered', function(e, tooltip) {

		                self._pniAdjustTooltipHeight($(tooltip).closest('.tooltip-notes'));

                        // attach handlers for note items

                        $(tooltip)
                            .off('change.note')
                            .on('change.note', 'input, select', this._pniHandleInputChange)
                            .off('click.note')
                            .on('click.note', '.icon-new-times', this._pniRemoveNote)
	                        .on('click.note', '#closeNoteItem', function(e){
		                        e.preventDefault();
		                        self.$projectNoteTips.tooltipster('hide');
	                        })
                            .on('click.note', '#addNoteItem', this._pniAddNote)
                            .on('keydown', '.notesQuantity, .notesStaff', $.stratweb.integerField)
                            .on('keydown', '.notesPrice', $.stratweb.decimalField);

                        // kick in selectize

                        this._pniSelectize(tooltip);

                    }.bind(this));
            },

	        addPopulatedClass: function(notes) {

		        var self = this;

		        // add a class to all existing populated notes containers for icon display

		        notes.each(function(projectNoteItem) {
			        self.$el.find('input#' + projectNoteItem.get('field')).parent().addClass('has-notes');
		        });

	        },

            applyPermissions: function() {
                // for any field which has a note, it must be readonly, regardless of whether the stratfile is rw or r
                // thus we must do this after the main applyPermissions run, only setting fields to r when needed (not rw)

                var self = this;

                // the main project fields
                this.projectNoteItemCollection.each(function(projectNoteItem) {
	                self.$el.find('input#' + projectNoteItem.get('field')).prop('readonly', true);
                });

                // remove icon where no notes
                if (this.stratFile.isReadOnly('PLAN')) {
                    this.$el.find('#oneTimeAndMonthly, #seasonallyAndAnnually').find('table i.projectNotesIcon').each(function() {
                        var $this = $(this);
                        if ($this.parent().hasClass('has-notes')) {
                            $this.show();
                        } else {
                            $this.hide();
                        }
                    });
                };
            },

            load: function() {
		        var self = this;

		        // load up categories
		        $.ajax({
			        url: config.serverBaseUrl + '/stratfiles/' + this.stratFile.id + '/projectNoteItemCategories',
			        type: 'GET',
			        dataType: 'json',
			        error: function() {
				        console.error('Problem fetching note categories.');
			        },
			        success: function(results) {
				        console.log('Fetched note categories.');
				        self.pniCategories = results.data.projectNoteItemCategories;
			        }
		        });

		        // load up project notes - all notes for project regardless of field
	            this.projectNoteItemCollection.fetch({
		            success: function (notes) {
                        console.debug('Downloaded project notes: ' + notes.length);
                        self.addPopulatedClass(notes);
                        self.applyPermissions();
		            },
		            error  : function (model, xhr, options) {
			            console.error(sprintf("Oops, couldn't load notes. Status: %s %s", xhr.status, xhr.statusText));
		            }
	            });            	
            },

	        _pniAdjustTooltipHeight: function($tooltip){

		        // fix height of tooltip if needed for overflow

		        var $allTips = $('.projectNotesIcon'),
			        $noteItems = $tooltip.find('#projectNoteItems'),
			        vHeight = $(window).height();

		        $noteItems
			        .css({
				        'height':'auto',
				        'overflow-y':'visible'
			        });

		        $allTips.tooltipster('reposition');

		        var maxHeight = vHeight - (vHeight * 0.6),
			        toolHeight = $noteItems.height();

		        if(toolHeight > maxHeight){

			        maxHeight = (maxHeight < 100) ? 100 : maxHeight;

			        $noteItems
				        .css({
					        'height':maxHeight,
					        'overflow-y':'scroll'
				        });

			        $allTips.tooltipster('reposition');
		        }

	        },

	        _pniAddNote: function(e){

		        // add a note

		        var self = this,
			        tooltip = $(e.currentTarget).closest('.tooltip-notes'),
			        projectNoteItem = new ProjectNoteItem({
			        "stratFileId":self.stratFile.id,
			        "themeId":self.theme.id,
			        "field": tooltip.data('fieldType')
		        });

		        projectNoteItem.save(null, {
			        success: function(model) {
				        self.projectNoteItemCollection.add(model);
				        self._pniSelectize(tooltip.find('.note-item').last());
				        self._pniAdjustTooltipHeight(tooltip);
			        },
			        error: function(model, xhr, options) {
				        console.log("error saving note item.");
			        }
		        });

	        },

	        _pniHandleInputChange: function(e){

                // when any field emits a change event, including when selectize is cleared
		        var $this = $(e.currentTarget),
			        noteId = $this.closest('.note-item').data('projectNoteItemId'),
                    field = $this.data('key');

		        var projectNoteItem = this.projectNoteItemCollection.get(noteId);
		        projectNoteItem.set($this.attr('data-key'), $this.val());
                projectNoteItem.set('amount', projectNoteItem.total());
                projectNoteItem.save();

	        },

	        _pniRemoveNote: function(e){

		        var self = this,
			        tooltip = $(e.currentTarget).closest('.tooltip-notes'),
			        noteId = $(e.currentTarget).closest('.note-item').data('projectNoteItemId'),
		            note = this.projectNoteItemCollection.get(noteId);

		        note.destroy({
			        success: function(model) {
				        self.projectNoteItemCollection.remove(model);
				        $('.projectNotesIcon').tooltipster('reposition');

				        // remove has notes class if no notes for this field

				        if (!self.projectNoteItemCollection.where({'field': tooltip.data('fieldType')}).length) {
				            $('#' + tooltip.data('fieldType')).parent().removeClass('has-notes');
				        }

			        },
			        error: function(model, xhr, options) {
				        console.log("error removing note.");
			        }
		        });

	        },            

	        _pniSelectize: function(tooltip){

		        var self = this;

		        var $selectize = $(tooltip)
			        .find('.selectize')
			        .selectize({
                        plugins     : ['deleteOption'],
				        create      : true,
                        selectOnTab : true,
                        maxItems    : 1,
                        valueField  : 'name',
                        labelField  : 'name',
                        searchField : 'name',
                        maxOptions  : 50,
                        sortField   : [{
                            field: 'name',
                            direction: 'asc'
                        }, {
                            field: '$score',
                            direction: 'asc'
                        }],
                        load: function (query, callback) {
                            callback(self.pniCategories);
                        },  
                        // we set pni.category as a default 'Miscellaneous' in backbone, this will persist it as a PNIC if it doesn't exist
				        onOptionAdd:  function (value) {

					        console.log('adding ' + value + ' to pni categories');

                            var selectize = this;

					        $.ajax({
						        url        : config.serverBaseUrl + '/stratfiles/' + self.stratFile.id + '/projectNoteItemCategories',
						        type       : 'POST',
						        data       : JSON.stringify({"name": value}),
						        dataType   : 'json',
						        contentType: "application/json; charset=utf-8",
						        error      : function () {
							        console.error('Error adding category.');
						        },
						        success    : function (results) {
							        // update our categories with the new one
							        self.pniCategories.push(results.data.projectNoteItemCategory);
                                    selectize.updateOption(value, results.data.projectNoteItemCategory);
						        }
					        });

				        }
			        });

	        },

            _setupSelectize: function() {
                var self = this;

                // allow deleting of PNI categories using a plugin
                Selectize.define('deleteOption', function(options) {
                    var selectize = this;

                    // override the setup method to add an extra "click" handler
                    this.setup = (function() {
                        var original = selectize.setup;

                        selectize.settings.render.option = function(item, escape) {
                            return '<div>' + escape(item.name) + '<i class="icon-new-times"></i></div>';
                        };

                        return function() {
                            original.apply(this, arguments);
                            this.$dropdown.on('mousedown', 'i', function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                                var val = $(this).parent().data('value');
                                if (window.confirm(sprintf(self.localizable.get('msgDeleteCategory'), val))) { 
                                    console.debug('Removing option: ' + val);

                                    var cat = selectize.options[val];

                                    $.ajax({
                                        url        : config.serverBaseUrl + '/stratfiles/' + cat.stratFileId + '/projectNoteItemCategories/' + cat.id,
                                        type       : 'DELETE',
                                        dataType   : 'json',
                                        contentType: "application/json; charset=utf-8",
                                        error      : function () {
                                            console.error('Error deleting category.');
                                            selectize.close();
                                        },
                                        success    : function (results) {
                                            selectize.removeOption(val);
                                            selectize.refreshOptions(false);

                                            // remove from our internal list
                                            self.pniCategories.splice(_.indexOf(self.pniCategories, _.find(self.pniCategories, function(item) {
                                                return item.id == cat.id;
                                            })), 1);
                                        }
                                    });
                                }

                                // can't get it to stop closing the selectize and the pni tooltipster, when we open it
                                // vex.dialog.confirm({
                                //     className: 'vex-theme-plain',
                                //     message: sprintf(self.localizable.get('msgDeleteCategory'), val),
                                //     buttons: [$.extend({}, vex.dialog.buttons.YES, { text: self.localizable.get('btn_delete') }),
                                //               $.extend({}, vex.dialog.buttons.NO, { text: self.localizable.get('btn_cancel') }) ],
                                //     callback: function(value) {
                                //         if (value) {
                                //             console.debug('Removing option: ' + val);
                                //             selectize.removeOption(val);
                                //             selectize.refreshOptions(false);

                                //             // remove from our internal list
                                //             self.pniCategories.splice(_.indexOf(self.pniCategories, _.find(self.pniCategories, function(item) {
                                //                 return item.id == cat.id;
                                //             })), 1);
                                //         };
                                //         return false;
                                //     }
                                // });
                            });
                        };
                    })();

                });

            }          

        });

        return ProjectNotesManager;
    });
