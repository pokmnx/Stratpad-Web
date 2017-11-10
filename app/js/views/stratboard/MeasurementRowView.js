define(['backbone'],
  function() {

    var view = Backbone.View.extend({

      // will surround the handlebar template with a li.measurementItem
      tagName: 'li',
      className: 'measurementItem',

      initialize: function(router, measurement, localizable) {
        _.bindAll(this, 'render', 'emphasize');
        this.router = router;
        this.measurement = measurement;
        this.localizable = localizable;
      },

      render: function() {
        // properties are simply absent if they were not set
        var date = this.measurement.has('date') ? moment(this.measurement.get('date').toString(), $.stratweb.dateFormats.in) : null;
        var formattedDate = date ? date.format($.stratweb.dateFormats.out) : null;
        var formattedValue = this.measurement.has('value') ? $.stratweb.formatDecimalWithParens(this.measurement.get('value')) : '&nbsp;';
        // last cell could need &nbsp; to align trash
        var comment = this.measurement.has('comment') ? this.measurement.get('comment') : '&nbsp;';

        var compiledTemplate = Handlebars.templates['stratboard/MeasurementRowView'];
        var context = _.extend(this.measurement.toJSON(), this.localizable.all(), {
          // additional strings
          measurement: this.measurement,
          date: formattedDate,
          value: formattedValue
        });

        var html = compiledTemplate(context);
        this.$el.html(html); // xss safe
        this.$el.attr('measurementId', this.measurement.id);
        
        return this;
      },

      emphasize: function() {
        this.$el.addClass('highlight');
      }

    });

    return view;
  });