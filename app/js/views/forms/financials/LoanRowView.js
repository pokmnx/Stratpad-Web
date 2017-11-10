define(['backbone'],
  function() {

    var view = Backbone.View.extend({

      // will surround the handlebar template with a li.loanItem
      tagName: 'li',
      className: 'loanItem',

      initialize: function(router, loan, localizable) {
        _.bindAll(this, 'render');
        this.router = router;
        this.loan = loan;
        this.localizable = localizable;
      },

      render: function() {
        // properties are simply absent if they were not set
        var date = this.loan.has('date') ? moment(this.loan.get('date').toString(), 'YYYYMM') : null;
        var formattedDate = date ? date.format($.stratweb.dateFormats.monthYear) : null;
        var type = this.localizable.get(this.loan.has('type') ? this.loan.get('type') + '_ABBREV' : null);
        var term = this.loan.has('term') ? sprintf('%s %s', this.loan.get('term'), this.localizable.get('PER_MONTHLY').toLowerCase()) : null;
        var amount = this.loan.has('amount') ? $.stratweb.formatNumberWithParens(this.loan.get('amount')) : null;
        var rate = this.loan.has('rate') ? (this.loan.get('rate')*1).toFixed(2) + '%' : null;
        // last cell could need &nbsp; to align trash
        var frequency = this.localizable.get(this.loan.has('frequency') ? this.loan.escape('frequency') : '&nbsp;');
        var hasWriteAccess = this.router.stratFileManager.currentStratFile().hasWriteAccess('PLAN');
      
        var compiledTemplate = Handlebars.templates['forms/financials/LoanRowView'];
        var context = _.extend(this.loan.toJSON(), this.localizable.all(), {
          // additional strings
          type: type,
          date: formattedDate,
          frequency: frequency,
          term: term,
          rate: rate,
          amount: amount,
          hasWriteAccess: hasWriteAccess
        });

        var html = compiledTemplate(context);
        this.$el
            .html(html) // xss safe
            .find('.loanName')
            .text(context.name);

        this.$el.data('loanId', this.loan.id);
        
        return this;
      }

    });

    return view;
  });