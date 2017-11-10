define(['backbone'],
  function() {

    var view = Backbone.View.extend({

      // this will surround the handlebar template with a li.activitySortableItem
      tagName: 'li',
      className: 'activitySortableItem',

      initialize: function(router, activity, localizable) {
        _.bindAll(this, 'render');
        this.router = router;
        this.activity = activity;
        this.localizable = localizable;
      },

      render: function() {
        var compiledTemplate = Handlebars.templates['forms/ActivityRowView'];

        // timeframe
        var timeframe;
        var startDate = this.activity.has('startDate') ? this.activity.get('startDate').toString() : '';
        var endDate = this.activity.has('endDate') ? this.activity.get('endDate').toString() : '';
        if (startDate != '' && endDate != '') {
          var startDate = moment(startDate, $.stratweb.dateFormats.in).format($.stratweb.dateFormats.out);
          var endDate = moment(endDate, $.stratweb.dateFormats.in).format($.stratweb.dateFormats.out);
          timeframe = sprintf('%s - %s', startDate, endDate);
        }
        else if (startDate != '') {
          timeframe = moment(startDate, $.stratweb.dateFormats.in).format($.stratweb.dateFormats.out);
        } 
        else if (endDate != '') {
          timeframe = moment(endDate, $.stratweb.dateFormats.in).format($.stratweb.dateFormats.out);
        } 
        else {
          timeframe = '';
        }

        // ongoing cost
        var ongoing;
        if (this.activity.has('ongoingCost') && this.activity.get('ongoingCost') != '') {
          var frequency = this.localizable['PER_'+this.activity.get('ongoingFrequency')];
          ongoing = sprintf('%s/%s', this.activity.get('ongoingCost'), frequency);
        } else {
          // must have both, or none
          ongoing = '&nbsp;';
        }

        var context = _.extend(this.activity.toJSON(), {
          'activity': this.activity,
          'ongoing': new Handlebars.SafeString(ongoing),
          'timeframe': new Handlebars.SafeString(timeframe)
        });

        var html = compiledTemplate(context);
        this.$el.html(html); // xss safe
        this.$el.data('activityId', this.activity.id);
        return this;
      }

    });

    return view;
  });