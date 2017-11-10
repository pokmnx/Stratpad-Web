define(['Config', 'backbone'], 

function(config) {
    var ServiceProviderModel = Backbone.Model.extend({
        
        urlRoot: config.serverBaseUrl + "/serviceProviders",
        defaults: {
            //-- part of a search result
            // List<String> acceptableAssetTypes;
            // List<String> availableFinancingTypes;
            // List<String> certifications;
            // String address1;
            // String address2;
            // String branchName;
            // String city;
            // String country;
            // String instructions;
            // String name;
            // String servicesDescription;
            // String provinceState;
            // List<String> categories;
            // String website;
            // String welcomeMessage;
            // String zipPostal; 
            // String status;
            // String docsFolderName;
            // String docs; -> readonly
            // Boolean invitationSent; -> readonly
            // Boolean hasInvitesAvailable; --> readonly

            //-- used for filtering - not passed to user
            // List<String> excludedNaicsCodes;
            // List<String> includedNaicsCodes;
            // Integer businessAgeMinimum;
            // Integer maxAgeOwner;
            // Integer minAgeOwner;
            // Integer minFicoScore;
            // Integer minimumRevenues;
            // Boolean preferredBankrupt;
            // Gender preferredGender;
            // ArrayList<String> preferredLanguages; - was preferredLanguage
            // Boolean preferredProfitability;
            // BigDecimal adBudget;
            // Integer minLoanAmount;
            // Integer maxLoanAmount;
            // List<CommunityTracking> communityTrackings;
            // Integer score;
            // Boolean hasLeadsAvailable;
            // Integer monthlyLeadLimit;



            //-- related entities
            // /serviceProviders/[id]/contacts (firstname, lastname, title, email, phone, type)
            // /serviceProviders/[id]/businessLocations
            // /serviceProviders/[id]/stratfiles/[]id]/communityTrackings

            //-- search
            // /stratfiles/[id]/serviceProviders

            //-- request introduction
            // /serviceProviders/[id]/intro?stratFileId=...
        },

        initialize:function(model, options) {
            if ("id" in model) {
                this.url = this.urlRoot + "/" + model.id;
            } else {
                this.url = this.urlRoot;
            }
            
        },
        // typically after we've saved a model to the server
        parse: function(json) {
            if ("data" in json && "serviceProvider" in json.data) {
                this.url = this.urlRoot + "/" + json.data.serviceProvider.id;
                return json.data.serviceProvider;
            } else {
                // when we get a collection of serviceProvider, then we don't need to do this parsing
                return json;
            }
        },

        progress: function(user) {

            // for location, which is split into city, provinceState and country, just check for city
            // for termsAccepted, deal with boolean
            // for categories, check empty too
            // for payment, check user.hasPaidConnect

            var requiredFields = ['name','priceForInvitation','servicesDescription' /*,'monthlyAdBudget' */,'welcomeMessage','address1','city','zipPostal'];

            var self = this;
            var numFields = requiredFields.length + 3, complete=0;
            var missing = [];

            // terms accepted
            if (this.has('termsAccepted') && this.get('termsAccepted')) {
                complete += 1;
            } else {
                missing.push('termsAccepted');
            }

            // arrays
            if (this.has('categories') && this.get('categories').length > 0) {
                complete += 1;
            } else {
                missing.push('categories');                
            }

            // payment - this means that at some point, user had filled out all fields and successfully paid for connect
            // the problem we run into is when users delete field values after
            if (user.get('hasPaidConnect')) {
                complete += 1;
            } else {
                missing.push('payment');
            }            

            // count requiredFields where they will be missing if no content
            for (var i = 0; i < requiredFields.length; i++) {
                var field = requiredFields[i];
                var val = this.get(field);
                if (_.isNumber(val) || !_.isEmpty(val)) {
                    complete += 1;
                } else {
                    missing.push(field);
                }
            }

            return { progress: complete/numFields, missing: missing};

        },

        // in GCS
        certifications: {
            'StratPadCoachLevel1': 'CoachingBadge_Level1-267x300.png',
            'StratPadCoachLevel2': 'CoachingBadge_Level2-267x300.png',
            'StratPadCoachLevel3': 'CoachingBadge_Level3-267x300.png',
            'IPBCCertifiedProfessionalBookkeeper': 'ipbc_cpb_color_logo.jpg',
            'QBOCertifiedProAdvisor': 'cloud-proadvisor-index-training-qbo.png',
            'BetterBusinessBureau': 'cbbb-badge-horz.png',
            'BetterBusinessBureauAPlus': 'bbb.png',
            'SBA8ACertified': 'sba-8a.jpg',
            'SBA': 'sba-logo.png',
            'SDVOSB': 'sdvosb.jpg'
        },        

        certificationLogoUrl: function(certification) { 
            var filename = this.certifications[certification];
            return sprintf('%s/service-provider-certifications/%s', config.gcsBaseUrl, filename);
        },

        accreditationLogoUrl: function(filename) {
            return sprintf('%s/financial-institutions/%s/%s', config.gcsBaseUrl, this.get("docsFolderName"), filename);
        }        

    }, {
        entityName: "ServiceProvider"
    });
    return ServiceProviderModel;
 });