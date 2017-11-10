define(['Config', 'AccessControlEntry', 'backbone'], 

function(config, AccessControlEntry) {
 	var StratFileModel = Backbone.Model.extend({
        domains: {
            ALL: 'ALL',
            PLAN: 'PLAN',
            STRATBOARD: 'STRATBOARD'
        },
 		urlRoot: config.serverBaseUrl + "/stratfiles",
        defaults: {
        	// we don't really have a need for defaults at this point, but it is nice to know the model
        	// these must match what we have on the App Engine side of things        	
        },
        initialize : function() {
            this.ace = new AccessControlEntry(this.get('accessControlEntry') || {"permissions": []});
        },
        parse: function(json) {
            if ("data" in json && "stratFile" in json.data) {
                this.url = this.urlRoot + "/" + json.data.stratFile.id;
                return json.data.stratFile;
            } 
            else {
                // when we get a collection of stratfiles, then we don't need to do this parsing
                return json;
            }
        },
        isSampleFile: function() {
            return this.get('uuid') == "ABCDEFGH-1234-5678-IJKL-MNOPQRSTUV01" 
                || this.get('uuid') == "ABCDEFGH-1234-5678-IJKL-MNOPQRSTUV02"
                || this.get('uuid') == "ABCDEFGH-1234-5678-IJKL-MNOPQRSTUV03";

        },
        isOwner: function() {
            // if no ace, then nobody else has access, so it must be yours
            if (!this.has('accessControlEntry')) {
                return true;
            }
            else {
                // wasn't parsed
                var ownerId = this.get('accessControlEntry').owner.id;
                var userData = $.parseJSON($.localStorage.getItem('user'));
                return ownerId == userData.id;
            }
        },
        unlink: function(outcomes) {
            // this removes the relevant ACE from the stratfile
            $.ajax({
                url: config.serverBaseUrl + "/stratfiles/" + this.get('id') + '/unlink',
                type: "GET",
                dataType: 'json',
                contentType: "application/json; charset=utf-8"
            })
            .done(function(response, textStatus, jqXHR) {
                console.debug("Unlinked stratFile with id: " + this.get("id"));
                this.collection.remove(this.get("id"));
                outcomes.success();
            }.bind(this))
            .fail(function(jqXHR, textStatus, errorThrown) {
                console.error("%s: %s", textStatus, errorThrown);
                outcomes.error();
            });
        },

        hasReadAccess: function(domain) {
            if ($.stratweb.isBlank(domain)) { 
                console.warn('Empty domain! Please specify a domain. Returning false.');
            };
            return (this.ace.hasReadAccess(domain) || this.ace.hasReadAccess('ALL') || this.isOwner());
        },

        hasWriteAccess: function(domain) {
            // NB if you have write access, then you must also have read access
            if ($.stratweb.isBlank(domain)) { 
                console.warn('Empty domain! Please specify a domain. Returning false.');
            };
            return (this.ace.hasWriteAccess(domain) || this.ace.hasWriteAccess('ALL') || this.isOwner());
        },
        isReadOnly: function(domain) {
            return this.hasReadAccess(domain) && !this.hasWriteAccess(domain)
        }
 	}, {
        entityName: "StratFile"
    });
 	return StratFileModel;
 });