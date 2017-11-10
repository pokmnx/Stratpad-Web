define(['FinancialStatement', 'views/reports/IncomeStatementDetail', 'i18n!nls/IncomeStatement.i18n', 'Config', 'PageStructure'],

  function(FinancialStatement, IncomeStatementDetail, instLocalizable, config, pageStructure) {

    var view = IncomeStatementDetail.extend({

      el: "#worksheetDetail",

      reportName: 'WorksheetDetail',

      initialize: function(router, localizable) {
        _.bindAll(this, "load", "loadWorksheetDetail", "staff", "expenses", "cogs", "revenue");
        var l = _.extend({}, instLocalizable, localizable);
        IncomeStatementDetail.prototype.initialize.call(this, router, l);
      },

      load: function() {
        FinancialStatement.prototype.load.call(this);

        this.$el.spin({top: '50px'});

        var self = this;

        pageStructure.setNumberOfReportPages(self.router.chapter, 1);
        self.router.pageControlView.pageSliderView.updatePageNumber(self.router.page);

        $.ajax({
          url: config.serverBaseUrl + "/reports/worksheet/details",
          type: "GET",
          dataType: 'json',
          data: {
            'id': self.stratFileId
          },
          contentType: "application/json; charset=utf-8"
        })
          .done(function(response, textStatus, jqXHR) {

            // because json is altered for production of report, save a clone for pdf
            self.json = JSON.parse(JSON.stringify(response));

            self.beforeRender(response);

            self.loadWorksheetDetail(response);

          })
          .fail(function(jqXHR, textStatus, errorThrown) {
            console.error("%s: %s", textStatus, errorThrown);
            self.showUnexpectedError();
          })
          .always(function() {
            self.$el.spin(false);
          });

      },

      loadWorksheetDetail: function(json, dateFormat) {
        // defer to ISD, but override worker methods below
        return IncomeStatementDetail.prototype.loadIncomeStatementDetail.call(this, json, dateFormat);
      },

      staff: function (section, isDetail) {
        // NB. We add this in IncomeStatementSummary - not ideal but good for making sure everything else works
        var $div = $('<div/>');

        // for the detail table, reuse this code for row headers and content data
        var fx = isDetail ? this.header : this.row;

        // row header
        $div.append(fx(this.localized('ws_staff')));

        // rows for each expense + cogs
        $div.append(fx(this.localized('is_cogs'), section.cogs, 2));
        $div.append(fx(this.localized('is_generalAndAdministrative'), section.generalAndAdministrative, 2));
        $div.append(fx(this.localized('is_researchAndDevelopment'), section.researchAndDevelopment, 2));
        $div.append(fx(this.localized('is_salesAndMarketing'), section.salesAndMarketing, 2));        

        // total row
        var $total = $(fx('&nbsp;', section.totals));
        $total.addClass('rowDivider1');
        $div.append($total); 

        // don't append a total column to any of these rows (ie in pdf)
        // totalType can be none, prev, sum
        $div.find('tr').attr('totalType', 'prev');

        return $div.html();
      },

      // @override
      expenses: function (section, isDetail) {
        var self = this;
        var $div = $('<div/>');

        // for the detail table, reuse this code for row headers and content data
        var fx = isDetail ? this.header : this.row;

        // row header
        $div.append(fx(this.localized('is_expenses')));

        // rows for each expense

        // if we have expenses by the same name, collapse them
        var collapseDuplicates = function(notes) {
          var rows = {};
          _.each(notes, function(note) {
            if (rows.hasOwnProperty(note.category)) {
              // add them together
              var baseValues = rows[note.category].amounts;
              var newValues = note.amounts;
              _.each(baseValues, function(val, idx) {
                baseValues[idx] = val + newValues[idx];
              });
            }
            else {
              rows[note.category] = note;
            }
          });
          return _.sortBy(_.values(rows), 'category');
        };

        var merge = function(ary1, ary2) {
          if (Array.isArray(ary1)) {
            if (Array.isArray(ary2)) {
              return ary1.concat(ary2);
            } else {
              return ary1;
            }
          } else if (Array.isArray(ary2)) {
            return ary2;
          } else {
            return [];
          }
        }

        // GA
        if (Array.isArray(section.generalAndAdministrativeNotes) || Array.isArray(section.generalAndAdministrativeActivities)) {
          var all = merge(section.generalAndAdministrativeNotes, section.generalAndAdministrativeActivities);

          $div.append(fx(this.localized('is_generalAndAdministrative'), null, 2));
          var rows = collapseDuplicates(all);
          _.each(rows, function(row) {
            if (self.hasValues(row.amounts)) {
              $div.append(fx(_.escape(row.category), row.amounts, 3));
            };
          });
        } 
        else {
          $div.append(fx(this.localized('is_generalAndAdministrative'), section.generalAndAdministrative, 2));
        }

        // RD
        if (Array.isArray(section.researchAndDevelopmentNotes) || Array.isArray(section.researchAndDevelopmentActivities)) {
          var all = merge(section.researchAndDevelopmentNotes, section.researchAndDevelopmentActivities);

          $div.append(fx(this.localized('is_researchAndDevelopment'), null, 2));
          var rows = collapseDuplicates(all);
          _.each(rows, function(row) {
            if (self.hasValues(row.amounts)) {
              $div.append(fx(_.escape(row.category), row.amounts, 3));
            };
          });
        } 
        else {
          $div.append(fx(this.localized('is_researchAndDevelopment'), section.researchAndDevelopment, 2));
        }

        // SM
        if (Array.isArray(section.salesAndMarketingNotes) || Array.isArray(section.salesAndMarketingActivities)) {
          var all = merge(section.salesAndMarketingNotes, section.salesAndMarketingActivities);

          $div.append(fx(this.localized('is_salesAndMarketing'), null, 2));
          var rows = collapseDuplicates(all);
          _.each(rows, function(row) {
            if (self.hasValues(row.amounts)) {
              $div.append(fx(_.escape(row.category), row.amounts, 3));
            };
          });
        } 
        else {
          $div.append(fx(this.localized('is_salesAndMarketing'), section.salesAndMarketing, 2));
        }


        // total row
        var $total = $(fx('&nbsp;', section.subtotals));
        $total.addClass('rowDivider1');
        $div.append($total);

        return $div.html();
      },      


      // @override
      cogs: function (section, isDetail) {
        // always show COGS and running total, at minimum
        var self = this,
            $div = $('<div/>');

        // for the detail table, reuse this code for row headers and content data
        var fx = isDetail ? this.header : this.row;

        // row header
        $div.append(fx(this.localized('is_cogs')));

        // fix up names
        section.data = section.data || [];
        section.notes = section.notes || [];
        _.each(section.data, function(row) {
          row.startDate = row.date;
          row.themeName = row.name;
        });

        // identify notes easily
        _.each(section.notes, function(row) {
          row.isNote = true;
        });

        // organize
        var projects = _.sortBy(section.data.concat(section.notes), 'startDate');
        var orderedProjectNames = _.uniq(_.pluck(projects, "themeName"));
        var groupedProjects = _.groupBy(projects, 'themeName');

        // render
        // in the IS, we only show subtotal and total; in WS, we'll organize by project regardless if we have notes or not
        _.each(orderedProjectNames, function(projectName) {

          var projects = groupedProjects[projectName];
          
          // only notes technically could ever be grouped - it will be an array of 1
          if (projects.length && projects[0].isNote) {
            $div.append(fx(_.escape(projectName), null, 2));

            _.each(projects, function(note) 
            {
              // each note is a mini-section under its theme
              $div.append(fx(_.escape(note.category), null, 3));
              self.rowFormatter = $.stratweb.formatDecimalWithParens;
              $div.append(fx(self.localized('ws_quantity'), note.quantities, 4));
              $div.append(fx(self.localized('ws_price'), note.prices, 4));
              self.rowFormatter = $.stratweb.formatNumberWithParens;
              var $subtotal = $(fx('&nbsp;', note.amounts));
              $subtotal.addClass('rowDivider1');
              $div.append($subtotal);
            });

          } else if (projects.length) {
            // non-note
            var row = projects[0];
            var hasNonZeroValues = self.hasValues(row.values);
            if (hasNonZeroValues) {
              $div.append(fx(self.localized(_.escape(row.name)), row.values, 2));
            };                        
          };

        });  

        // don't add divider if we didn't draw any rows (ie no projects with values)
        var $r = $(fx('&nbsp;', section.subtotals));
        $r.addClass('rowDivider1');
        $div.append($r);

        // revenue - gross profit
        var $r = $(fx(this.localized('is_grossProfit'), section.totals));
        $r.addClass('rowDivider1');
        $div.append($r);

        $div.append(fx('&nbsp;'));

        return $div.html();
      },      

      // @override
      revenue: function(section, isDetail) {
        var self = this,
            $div = $('<div/>');

        // for the detail table, reuse this code for row headers and content data
        var fx = isDetail ? this.header : this.row;

        // row header
        $div.append(fx(this.localized('is_revenue')));

        // projects should be sorted across data and notes, by startDate

        // fix up names
        section.data = section.data || [];
        section.notes = section.notes || [];
        _.each(section.data, function(row) {
          row.startDate = row.date;
          row.themeName = row.name;
        });

        // identify notes easily
        _.each(section.notes, function(row) {
          row.isNote = true;
        });

        // organize
        var projects = _.sortBy(section.data.concat(section.notes), 'startDate');
        var orderedProjectNames = _.uniq(_.pluck(projects, "themeName"));
        var groupedProjects = _.groupBy(projects, 'themeName');

        // render
        _.each(orderedProjectNames, function(projectName) {

          var projects = groupedProjects[projectName];
          
          // only notes technically could ever be grouped - it will be an array of 1
          if (projects.length && projects[0].isNote) {
            $div.append(fx(_.escape(projectName), null, 2));

            _.each(projects, function(note) 
            {
              // each note is a mini-section under its theme
              $div.append(fx(_.escape(note.category), null, 3));
              self.rowFormatter = $.stratweb.formatDecimalWithParens;
              $div.append(fx(self.localized('ws_quantity'), note.quantities, 4));
              $div.append(fx(self.localized('ws_price'), note.prices, 4));
              self.rowFormatter = $.stratweb.formatNumberWithParens;
              var $subtotal = $(fx('&nbsp;', note.amounts));
              $subtotal.addClass('rowDivider1');
              $div.append($subtotal);
            });

          } else if (projects.length) {
            // non-note
            var row = projects[0];
            var hasNonZeroValues = self.hasValues(row.values);
            if (hasNonZeroValues) {
              $div.append(fx(self.localized(_.escape(row.name)), row.values, 2));
            };                        
          };

        });

        // total row
        var $total = $(fx('&nbsp;', section.subtotals));
        $total.addClass('rowDivider1');
        $div.append($total);

        $div.append(fx('&nbsp;'));

        return $div.html();
      },

      // @override
      prepData: function() {
        // remove revenue lines with no data
        IncomeStatementDetail.prototype.prepData.call(this);

        // remove activity expense lines with no data
        var activityExpenseTypes = [
        this.json.expenses.generalAndAdministrativeActivities,
        this.json.expenses.researchAndDevelopmentActivities,
        this.json.expenses.salesAndMarketingActivities];

        for (var i = 0; i < activityExpenseTypes.length; i++) {
          var activityExpenses = activityExpenseTypes[i];
          for (var j = 0; j < activityExpenses.length; j++) {
            var amounts = activityExpenses[j].amounts;
            if (!this.hasValues(amounts)) {
              activityExpenses.splice(j, 1);
            };
          };

        };

      },

    });

    return view;
  });