
// NB. this file is overwritten by the ant build, on deployment
// properties come from build.properties
define(function() {
  var Config = {
    // dictates i18n choice
    lang: 'en',

    // used for constructing URL's to the backend
    serverBaseUrl: 'https://jstratpad.appspot.com',

    // base url to google cloud service storage
    gcsBaseUrl: 'https://storage.googleapis.com',

    // used for building URL's to WP-hosted content
    wpUrl: 'https://www.stratpad.com/',

    // the main site, with pricing tables, etc
    siteUrl: 'https://www.stratpad.com/',

    // city lookup service
    regionsUrl: 'https://cloud.stratpad.com/regions.php',

    // Avangate store URL for product purchases
    cartUrl: 'https://store.stratpad.com/order/checkout.php?PRODS=PRODUCT_ID&QTY=1&CART=1&CARD=2&DOTEST=1&CURRENCY=USD&LANG=en',

    // Avangate URL for upgrading from one product to the next
    upgradeUrl: 'https://store.stratpad.com/order/upgrade.php?UPGRADEPROD=PRODUCT_ID&LICENSE=LICENSE_CODE&QTY=1&CART=1&CARD=2&DOTEST=1',

    // the Avangate product ids (NB can be for production or their sandbox)
    // Free is not an Avangate product, but we still need an id
    prodIdFreeTrial: 'Free',
    prodIdStartup: '4615217',
    prodIdBusiness: '4615224',
    prodIdUnlimited: '4615226',
    prodIdConnect: '4641549',

    prodIdBusinessMonthly: '4655190',
    prodIdUnlimitedMonthly: '4655189',
    prodIdCoach: '4655185',
    prodIdCoachMonthly: '4655186',
    prodIdAssociation: '4655187',
    prodIdAssociationMonthly: '4655188',

    // sku's for our products
    skuFree: 'com.stratpad.cloud.free',
    skuStudent: 'com.stratpad.cloud.student',
    skuBusiness: 'com.stratpad.cloud.business',
    skuUnlimited: 'com.stratpad.cloud.unlimited',
    skuConnect: 'com.stratpad.cloud.connect',

    skuBusinessMonthly: 'com.stratpad.cloud.business.monthly',
    skuUnlimitedMonthly: 'com.stratpad.cloud.unlimited.monthly',
    skuCoach: 'com.stratpad.cloud.coach',
    skuCoachMonthly: 'com.stratpad.cloud.coach.monthly',
    skuAssociation: 'com.stratpad.cloud.association',
    skuAssociationMonthly: 'com.stratpad.cloud.association.monthly',

    // in some cases, we need to build a URL to a static resource (eg. for princexml to use to grab css)
    staticServerName: 'staging.stratpad.com',

    // should we record analytics?
    analytics: false,

    // should we show QBO widgets?
    qbo: true,

    // channels, for multiuser notifications?
    channels: true,

    // show extended financials?
    disableFinancials: false,

    // use paymentType=Test in Connect payment dialog?
    connectTestPayments: true,   

    // which messages do we want to show
    logLevel: 'debug',

    // app version number
    version: '2.5.21',

    // git revision
    sha1: '650288b6ea45ba81caa48446587e6c967fe49b96',

    // the date the build was made
    buildDate: 'Jan 14, 2017 23:34:06 MST'

  };
  return Config;
});      
    