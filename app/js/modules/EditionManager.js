define(['Config', 'i18n!nls/Global.i18n', 'backbone'],

    function(config, gLocalizable) {

        var EditionManager = Class.extend({

            // features
            FeatureCreateStratFile: 0,
            FeatureImportStratFile: 1,
            FeatureCloneStratFile: 2,
            FeatureExportPDF: 3,
            FeatureExportStratFile: 4,
            FeatureExportDocx: 5,
            FeatureExportCSV: 6,
            FeaturePrint: 7,
            FeatureShareStratFile: 8,
            FeatureExportPlaybook: 9,

            featureName: function(feature) {
                var keys = Object.keys(Object.getPrototypeOf(this));
                for (var i = 0; i < keys.length; i++) {
                    var val = this[keys[i]];
                    if (val == feature) {
                        return keys[i];
                    }
                }
                console.error('No feature defined: ' + feature);
                return undefined;
            },

            products: {
                // eg. Startup: {sku:'com.stratpad.cloud.student', productId:'4615217', name:'StratPad Startups & Students', key:'Startup'}
                'Free': {sku:config.skuFree, productId:config.prodIdFreeTrial, name:gLocalizable.VERSION_TITLE_TRIAL, key:'Free'},
                'Startup': {sku:config.skuStudent, productId:config.prodIdStartup, name:gLocalizable.VERSION_TITLE_STARTUP, key:'Startup'},
                'Business': {sku:config.skuBusiness, productId:config.prodIdBusiness, name:gLocalizable.VERSION_TITLE_BUSINESS, key:'Business'},
                'Unlimited': {sku:config.skuUnlimited, productId:config.prodIdUnlimited, name:gLocalizable.VERSION_TITLE_UNLIMITED, key:'Unlimited'},

                'Coach': {sku:config.skuCoach, productId:config.prodIdCoach, name:gLocalizable.VERSION_TITLE_COACH, key:'Coach'},
                'Association': {sku:config.skuAssociation, productId:config.prodIdAssociation, name:gLocalizable.VERSION_TITLE_ASSOCIATION, key:'Association'},

                'BusinessMonthly': {sku:config.skuBusinessMonthly, productId:config.prodIdBusinessMonthly, name:gLocalizable.VERSION_TITLE_BUSINESS_MONTHLY, key:'BusinessMonthly'},
                'CoachMonthly': {sku:config.skuCoachMonthly, productId:config.prodIdCoachMonthly, name:gLocalizable.VERSION_TITLE_COACH_MONTHLY, key:'CoachMonthly'},
                'AssociationMonthly': {sku:config.skuAssociationMonthly, productId:config.prodIdAssociationMonthly, name:gLocalizable.VERSION_TITLE_ASSOCIATION_MONTHLY, key:'AssociationMonthly'},                
                'UnlimitedMonthly': {sku:config.skuUnlimitedMonthly, productId:config.prodIdUnlimitedMonthly, name:gLocalizable.VERSION_TITLE_UNLIMITED_MONTHLY, key:'UnlimitedMonthly'},
            },

            initialize: function() {
                // eg. userData
                // {
                //     "email": "julian@mobilesce.com",
                //     "firstname": "Julian",
                //     "ipnFreeTrialStartDate": 1391210927563,
                //     "ipnOrderStatus": "COMPLETE",
                //     "ipnProductCode": "com.stratpad.cloud.unlimited",
                //     "lastname": "Wood",
                //     "verified": true,
                //     "creationDate": 1385614800000,
                //     "modificationDate": 1386108821363,
                //     "id": 5678444981518336,
                //     "fullname": "Julian Wood"
                // }

            },

            isFeatureEnabled: function(feature) {
                var userData = $.parseJSON($.localStorage.getItem('user'));
                if (feature == this.FeatureCreateStratFile || feature == this.FeatureImportStratFile || feature == this.FeatureCloneStratFile) {
                    var numberOfSampleStratFiles = window.router.stratFileManager.stratFileCollection.filter(function(stratFile) { return stratFile.isSampleFile(); }).length;
                    var numberOfUnacceptedStratFiles = window.router.stratFileManager.stratFileCollection.filter(
                        function(stratFile) { 
                            if (stratFile.has('accessControlEntry')) {
                                var ace = stratFile.get('accessControlEntry');
                                return ace.accepted == false;
                            } 
                        }
                    ).length;
                    var numberOfStratFilesTowardsLimit = window.router.stratFileManager.stratFileCollection.length - numberOfSampleStratFiles - numberOfUnacceptedStratFiles;

					console.debug('Number of stratfiles towards limit:' + numberOfStratFilesTowardsLimit);

                    if (userData.ipnProductCode == config.skuFree) {
                        return numberOfStratFilesTowardsLimit < 1;
                    }
                    else if (userData.ipnProductCode == config.skuStudent) {
                        return numberOfStratFilesTowardsLimit < 1;
                    }
                    else if (userData.ipnProductCode == config.skuBusiness || userData.ipnProductCode == config.skuBusinessMonthly) {
                        return numberOfStratFilesTowardsLimit < 5;
                    }
                    else if (userData.ipnProductCode == config.skuUnlimited || userData.ipnProductCode == config.skuUnlimitedMonthly
                        || userData.ipnProductCode == config.skuCoach || userData.ipnProductCode == config.skuCoachMonthly
                        || userData.ipnProductCode == config.skuAssociation || userData.ipnProductCode == config.skuAssociationMonthly
                        ) {
                        return true;
                    }
                    else {
                        console.warn('Unknown ipnProductCode: ' + useData.ipnProductCode);                        
                        return false;
                    }

                    return false;
                } else if (feature == this.FeatureExportPDF) {
                    return true;
                } else if (feature == this.FeatureExportStratFile) {
                    return true;
                } else if (feature == this.FeatureExportDocx) {
                    return true;
                } else if (feature == this.FeatureExportPlaybook) {
                    return true;
                } else if (feature == this.FeatureExportCSV) {
                    return true;
                } else if (feature == this.FeaturePrint) {
                    return true;
                } else if (feature == this.FeatureShareStratFile) {
                    return userData.ipnProductCode != config.skuFree;
                } else {
                    console.warn('Unknown feature: ' + feature);
                    return false;
                }
            },

            // eg. 4615226
            avangateId: function() {
                var sku = this.productCode();
                return _.indexBy(this.products, 'sku')[sku].productId;                
            },

            // eg. returns com.stratpad.cloud.unlimited
            productCode: function() {
                // same as the SKU
                var userData = $.parseJSON($.localStorage.getItem('user'));
                return userData.ipnProductCode;
            },

            // eg. 'Unlimited'
            productKey: function() {
                var sku = this.productCode();
                return _.indexBy(this.products, 'sku')[sku].key;
            },

            isFreeEdition: function() {
                var userData = $.parseJSON($.localStorage.getItem('user'));
                return (userData.ipnProductCode == config.skuFree);
            },

            product: function(sku) {
                return _.findWhere(_.values(this.products), {sku: sku});
            },

            isMonthly: function(sku) {
                return sku.endsWith('monthly');
            }

        });

        // singleton instance
        return new EditionManager();
    }
);