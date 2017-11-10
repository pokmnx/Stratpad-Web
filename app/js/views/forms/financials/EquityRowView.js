define(['backbone'],
  function() {

    var view = Backbone.View.extend({

      // will surround the handlebar template with a li.equityItem
      tagName: 'li',
      className: 'equityItem',

      initialize: function(router, equity, localizable) {
        _.bindAll(this, 'render');
        this.router = router;
        this.equity = equity;
        this.localizable = localizable;
      },

      render: function() {
        // properties are simply absent if they were not set
        var date = this.equity.has('date') ? moment(this.equity.get('date').toString(), 'YYYYMM') : null;
        var formattedDate = date ? date.format($.stratweb.dateFormats.monthYear) : null;
        // last cell could need &nbsp; to align trash
        var value = this.equity.has('value') ? $.stratweb.formatNumberWithParens(this.equity.get('value')) : '&nbsp;';
        var hasWriteAccess = this.router.stratFileManager.currentStratFile().hasWriteAccess('PLAN');


        var compiledTemplate = Handlebars.templates['forms/financials/EquityRowView'];
        var context = _.extend(this.equity.toJSON(), this.localizable.all(), {
          // additional strings
          date: formattedDate,
          value: value,
          hasWriteAccess: hasWriteAccess
        });

        var html = compiledTemplate(context);
        this.$el
            .html(html) // xss safe
            .find('.equityName')
            .text(context.name);
        this.$el.data('equityId', this.equity.id);
        
        return this;
      }

    });

    return view;
  });