define(['backbone'],
  function() {

    var view = Backbone.View.extend({

      // will surround the handlebar template with a li.assetItem
      tagName: 'li',
      className: 'assetItem',

      initialize: function(router, asset, localizable) {
        _.bindAll(this, 'render');
        this.router = router;
        this.asset = asset;
        this.localizable = localizable;
      },

      render: function() {
        // properties are simply absent if they were not set
        var date = this.asset.has('date') ? moment(this.asset.get('date').toString(), 'YYYYMM') : null;
        var formattedDate = date ? date.format($.stratweb.dateFormats.monthYear) : null;
        var value = this.asset.has('value') ? $.stratweb.formatNumberWithParens(this.asset.get('value')) : null;
        var depreciationTerm = this.asset.has('depreciationTerm') ? sprintf('%s %s', this.asset.get('depreciationTerm'), this.localizable.get('PER_ANNUALLY').toLowerCase()) : null;
        var salvageValue = this.asset.has('salvageValue') ? $.stratweb.formatNumberWithParens(this.asset.get('salvageValue')) : null;
        var type = this.localizable.get(this.asset.get('type'));
        // last cell could need &nbsp; to align trash
        var depreciationType = this.localizable.get(this.asset.has('depreciationType') ? this.asset.escape('depreciationType') : '&nbsp;');
        var hasWriteAccess = this.router.stratFileManager.currentStratFile().hasWriteAccess('PLAN');        

        var compiledTemplate = Handlebars.templates['forms/financials/AssetRowView'];
        var context = _.extend(this.asset.toJSON(), this.localizable.all(), {
          // additional strings
          date: formattedDate,
          value: value,
          depreciationTerm: depreciationTerm,
          salvageValue: salvageValue,
          type: type,
          depreciationType: depreciationType,
          hasWriteAccess: hasWriteAccess
        });

        var html = compiledTemplate(context);
        this.$el
            .html(html) // xss safe
            .find('.assetName')
            .text(context.name);

        this.$el.data('assetId', this.asset.id);
        
        return this;
      }

    });

    return view;
  });