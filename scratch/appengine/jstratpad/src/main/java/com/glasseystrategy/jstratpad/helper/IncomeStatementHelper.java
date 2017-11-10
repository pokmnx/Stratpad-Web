package com.glasseystrategy.jstratpad.helper;

import com.glasseystrategy.jstratpad.inout.report.IncomeStatementOut;
import com.glasseystrategy.jstratpad.inout.report.IsEbitOut;
import com.glasseystrategy.jstratpad.inout.report.IsEbitdaOut;
import com.glasseystrategy.jstratpad.inout.report.IsEbtOut;
import com.glasseystrategy.jstratpad.inout.report.IsExpensesOut;
import com.glasseystrategy.jstratpad.inout.report.IsLine1Out;
import com.glasseystrategy.jstratpad.inout.report.NameValuesOut;
import com.glasseystrategy.jstratpad.model.AssetBase;
import com.glasseystrategy.jstratpad.model.IncomeTaxBase;
import com.glasseystrategy.jstratpad.model.LoanBase;
import com.glasseystrategy.jstratpad.model.LoanType;
import com.glasseystrategy.jstratpad.model.ThemeBase;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Date;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

/**
 */
public class IncomeStatementHelper extends CalculationsHelper {

    /**
     */
    private IncomeTaxBase incomeTax;

    /**
     */
    private List<? extends ThemeBase> themes;

    /**
     * Theme begin date yyyyMM.
     */
    private int beginDate;

    /**
     * Theme end data yyyyMM.
     */
    private int endDate;

    /**
     * Strategy start month MM.
     */
    private long startMonth;

    /**
     * Strategy start year yyyy.
     */
    private long startYear;

    /**
     */
    public IncomeStatementHelper() {
        super();
    }

    /**
     * @return a {@link IncomeStatementOut}
     */
    public IncomeStatementOut calculate() {
        final Date now = new Date();

        final long[] strategyDates =
            CalculationsUtils.calculateStrategyDates(this.themes, now);
        super.setStrategyBeginDate(strategyDates[0] / 100);
        super.setStrategyEndDate(strategyDates[1] / 100);

        this.startYear = super.getStrategyBeginDate() / 100;
        this.startMonth = super.getStrategyBeginDate() % 100;

        // Starts at startMonth minus number of prepended months.
        this.startMonth = this.startMonth - PRE;
        while (this.startMonth <= 0) {
            this.startMonth = this.startMonth + NB_MONTHS_PER_YEAR;
            --this.startYear;
        }

        super.durationInMonths =
            CalculationsUtils.durationInMonths(super.nbMonth, super.nbQuarter,
                super.nbYear);

        final int length = super.nbMonth + super.nbQuarter + super.nbYear;

        BigDecimal[] gaMonthly = new BigDecimal[super.durationInMonths];
        BigDecimal[] rdMonthly = new BigDecimal[super.durationInMonths];
        BigDecimal[] smMonthly = new BigDecimal[super.durationInMonths];

        final List<NameValuesOut> cogsData = new ArrayList<NameValuesOut>();

        final List<NameValuesOut> revenueData = new ArrayList<NameValuesOut>();

        for (final ThemeBase theme : this.themes) {
            // [0] = beginDate, [1] = endDate, format = yyyyMM
            final long[] themeDates =
                CalculationsUtils.calculateThemeDates(theme, now);

            this.beginDate = (int) themeDates[0];
            this.endDate = (int) themeDates[1];

            // COGS

            final BigDecimal[] cogsValues = this.cogs(theme);

            final NameValuesOut cogs = new NameValuesOut();
            cogs.setName(theme.getName());
            cogs.setValues(cogsValues);

            cogsData.add(cogs);

            // General & Administrative

            final BigDecimal[] gaSum = this.generalAndAdministrative(theme);
            gaMonthly = CalculationsUtils.add(gaMonthly, gaSum);

            // Research & Development

            final BigDecimal[] rdSum = this.researchAndDevelopment(theme);
            rdMonthly = CalculationsUtils.add(rdMonthly, rdSum);

            // Sales & Marketing

            final BigDecimal[] smSum = this.salesAndMarketing(theme);
            smMonthly = CalculationsUtils.add(smMonthly, smSum);

            // Revenues

            // if ((theme.getRevenueMonthly() == null)
            // && (theme.getRevenueOneTime() == null)
            // && (theme.getRevenueQuarterly() == null)
            // && (theme.getRevenueAnnually() == null)) {
            // continue;
            // }

            final BigDecimal[] revenueValues = this.revenue(theme);

            final NameValuesOut revenue = new NameValuesOut();
            revenue.setName(theme.getName());
            revenue.setValues(revenueValues);

            revenueData.add(revenue);
        }

        // interest (loans)

        final BigDecimal[] interestMonthly = this.interest();

        for (int i = 0; i < super.durationInMonths; ++i) {
            if (interestMonthly[i] == null) {
                // Nothing to do.
            } else {
                interestMonthly[i] = interestMonthly[i].negate();
            }
        }

        // depreciation (assets)

        final BigDecimal[] depreciationMonthly = this.depreciation();

        // Subtotals

        final BigDecimal[] cogsSubsMonthly =
            new BigDecimal[super.durationInMonths];
        for (int i = 0; i < super.durationInMonths; ++i) {
            BigDecimal monthly = null;
            for (final NameValuesOut cogs : cogsData) {
                final BigDecimal[] values = cogs.getValues();
                monthly = CalculationsUtils.add(monthly, values[i]);
            }

            cogsSubsMonthly[i] = monthly;
        }

        final BigDecimal[] expensesSubsMonthly =
            new BigDecimal[super.durationInMonths];
        for (int i = 0; i < super.durationInMonths; ++i) {
            BigDecimal monthly = null;
            monthly = CalculationsUtils.add(monthly, gaMonthly[i]);
            monthly = CalculationsUtils.add(monthly, rdMonthly[i]);
            monthly = CalculationsUtils.add(monthly, smMonthly[i]);

            expensesSubsMonthly[i] = monthly;
        }

        final BigDecimal[] revenueSubsMonthly =
            new BigDecimal[super.durationInMonths];
        for (int i = 0; i < super.durationInMonths; ++i) {
            BigDecimal monthly = null;
            for (final NameValuesOut revenue : revenueData) {
                final BigDecimal[] values = revenue.getValues();
                monthly = CalculationsUtils.add(monthly, values[i]);
            }

            revenueSubsMonthly[i] = monthly;
        }

        final BigDecimal[] cogsMonthly = new BigDecimal[super.durationInMonths];
        for (int i = 0; i < super.durationInMonths; ++i) {
            final BigDecimal monthly =
                CalculationsUtils.subtract(revenueSubsMonthly[i],
                    cogsSubsMonthly[i]);

            cogsMonthly[i] = monthly;
        }

        final BigDecimal[] ebitdaMonthly =
            new BigDecimal[super.durationInMonths];
        for (int i = 0; i < super.durationInMonths; ++i) {
            final BigDecimal monthly =
                CalculationsUtils.subtract(cogsMonthly[i],
                    expensesSubsMonthly[i]);

            ebitdaMonthly[i] = monthly;
        }

        final BigDecimal[] ebitMonthly = new BigDecimal[super.durationInMonths];
        for (int i = 0; i < super.durationInMonths; ++i) {
            final BigDecimal monthly =
                CalculationsUtils.subtract(ebitdaMonthly[i],
                    depreciationMonthly[i]);

            ebitMonthly[i] = monthly;
        }

        final BigDecimal[] ebtMonthly = new BigDecimal[super.durationInMonths];
        for (int i = 0; i < super.durationInMonths; ++i) {
            final BigDecimal monthly =
                CalculationsUtils.subtract(ebitMonthly[i], interestMonthly[i]);

            ebtMonthly[i] = monthly;
        }

        final BigDecimal[] ebtCumulated = this.itEbtCumulated(ebtMonthly);
        this.itCarriedForward(ebtCumulated);
        final BigDecimal[] itMonthly = this.incomeTax(ebtCumulated);

        final BigDecimal[] niMonthly = new BigDecimal[super.durationInMonths];
        for (int i = 0; i < super.durationInMonths; ++i) {
            final BigDecimal monthly =
                CalculationsUtils.subtract(ebtMonthly[i], itMonthly[i]);

            niMonthly[i] = monthly;
        }

        // Calculate the sums

        for (final NameValuesOut cogs : cogsData) {
            final BigDecimal[] values = new BigDecimal[length];
            super.calculateSum(values, cogs.getValues());

            cogs.setValues(values);
        }

        final BigDecimal[] ga = new BigDecimal[length];
        super.calculateSum(ga, gaMonthly);

        final BigDecimal[] rd = new BigDecimal[length];
        super.calculateSum(rd, rdMonthly);

        final BigDecimal[] sm = new BigDecimal[length];
        super.calculateSum(sm, smMonthly);

        for (final NameValuesOut revenue : revenueData) {
            final BigDecimal[] values = new BigDecimal[length];
            super.calculateSum(values, revenue.getValues());

            revenue.setValues(values);
        }

        final BigDecimal[] interest = new BigDecimal[length];
        super.calculateSum(interest, interestMonthly);

        final BigDecimal[] depreciation = new BigDecimal[length];
        super.calculateSum(depreciation, depreciationMonthly);

        final BigDecimal[] cogsSubs = new BigDecimal[length];
        super.calculateSum(cogsSubs, cogsSubsMonthly);

        final BigDecimal[] expensesSubs = new BigDecimal[length];
        super.calculateSum(expensesSubs, expensesSubsMonthly);

        final BigDecimal[] revenueSubs = new BigDecimal[length];
        super.calculateSum(revenueSubs, revenueSubsMonthly);

        final BigDecimal[] incomeTaxes = new BigDecimal[length];
        super.calculateSum(incomeTaxes, itMonthly);

        // Totals

        final BigDecimal[] cogsTotals = new BigDecimal[length];
        super.calculateSum(cogsTotals, cogsMonthly);

        final BigDecimal[] ebitdaTotals = new BigDecimal[length];
        super.calculateSum(ebitdaTotals, ebitdaMonthly);

        final BigDecimal[] ebitTotals = new BigDecimal[length];
        super.calculateSum(ebitTotals, ebitMonthly);

        final BigDecimal[] ebtTotals = new BigDecimal[length];
        super.calculateSum(ebtTotals, ebtMonthly);

        final BigDecimal[] netIncomeTotals = new BigDecimal[length];
        super.calculateSum(netIncomeTotals, niMonthly);

        // Build the result

        final IsLine1Out cogs = new IsLine1Out();
        // cogs.setData(cogsData);
        cogs.setSubtotals(cogsSubs);
        cogs.setTotals(cogsTotals);

        final IsExpensesOut expenses = new IsExpensesOut();
        expenses.setGeneralAndAdministrative(ga);
        expenses.setResearchAndDevelopment(rd);
        expenses.setSalesAndMarketing(sm);
        expenses.setSubtotals(expensesSubs);

        final IsEbitOut ebit = new IsEbitOut();
        ebit.setInterest(interest);
        ebit.setTotals(ebitTotals);

        final IsEbitdaOut ebitda = new IsEbitdaOut();
        ebitda.setDepreciation(depreciation);
        ebitda.setTotals(ebitdaTotals);

        final IsEbtOut ebt = new IsEbtOut();
        ebt.setIncomeTaxes(incomeTaxes);
        ebt.setTotals(ebtTotals);

        final IsLine1Out netIncome = new IsLine1Out();
        // netIncome.setData(netIncomeData);
        // netIncome.setSubtotals(netIncomeSubs);
        netIncome.setTotals(netIncomeTotals);

        final IsLine1Out revenue = new IsLine1Out();
        revenue.setData(revenueData);
        revenue.setSubtotals(revenueSubs);
        // revenue.setTotals(revenueTotals);

        final IncomeStatementOut out = new IncomeStatementOut();
        out.setCogs(cogs);
        out.setEbit(ebit);
        out.setEbitda(ebitda);
        out.setEbt(ebt);
        out.setEndDate(super.getStrategyEndDate());
        out.setExpenses(expenses);
        out.setNetIncome(netIncome);
        out.setRevenue(revenue);
        out.setStartDate(super.getStrategyBeginDate());

        // Return the result

        return out;
    }

    /**
     * @return the incomeTax
     */
    public IncomeTaxBase getIncomeTax() {
        return this.incomeTax;
    }

    /**
     * @param incomeTax the incomeTax to set
     */
    public void setIncomeTax(final IncomeTaxBase incomeTax) {
        this.incomeTax = incomeTax;
    }

    /**
     * @return the themes
     */
    public List<? extends ThemeBase> getThemes() {
        return this.themes;
    }

    /**
     * @param themes the themes to set
     */
    public void setThemes(final List<? extends ThemeBase> themes) {
        this.themes = themes;
    }

    /**
     * @param value
     * @param adjustment
     * @param increment
     * @return a BigDecimal[]
     */
    private BigDecimal[] calculate(final Long value, final Integer adjustment,
    final int increment) {
        final BigDecimal[] values = new BigDecimal[super.durationInMonths];

        if (value == null) {
            return values;
        }

        final BigDecimal val = CalculationsUtils.toBigDecimal(value);
        BigDecimal adj = CalculationsUtils.toBigDecimal(adjustment);
        if (adj == null) {
            // Nothing to do.
        } else {
            adj = adj.divide(HUNDRED).add(BigDecimal.ONE);
        }

        long year = this.startYear;
        long month = this.startMonth;

        BigDecimal previous = null;

        for (int i = 0; i < values.length; ++i) {
            final long yyyyMM = (year * 100) + month;

            if ((yyyyMM >= this.beginDate) && (yyyyMM <= this.endDate)) {
                final int index = i;
                /*
                 * If adjustment is null, then current value = value, else
                 * current value = previous value + adjustment.
                 */
                if (adj == null) {
                    values[index] = val;
                } else {
                    if (previous == null) {
                        values[index] = val;
                    } else {
                        values[index] = previous.multiply(adj);
                    }
                    previous = values[index];
                }

                // if increment = -1, then we stop (oneTime case)
                if (increment == -1) {
                    break;
                }

                // we increment by increment - 1 for the loop
                i += increment - 1;
                month += increment - 1;
            } else if (yyyyMM < this.beginDate) {
                values[i] = BigDecimal.ZERO;
            } else {
                // Nothing to do.
            }

            ++month;
            while (month > NB_MONTHS_PER_YEAR) {
                month = month - NB_MONTHS_PER_YEAR;
                ++year;
            }
        }

        return values;
    }

    /**
     * @param annually
     * @param adjustment
     * @return a BigDecimal[]
     */
    private BigDecimal[] calculateAnnually(final Long annually,
    final Integer adjustment) {
        final BigDecimal[] values =
            this.calculate(annually, adjustment, NB_MONTHS_PER_YEAR);

        return values;
    }

    /**
     * @param monthly
     * @param adjustment
     * @return a BigDecimal[]
     */
    private BigDecimal[] calculateMonthly(final Long monthly,
    final Integer adjustment) {
        final BigDecimal[] values = this.calculate(monthly, adjustment, 1);

        return values;
    }

    /**
     * @param oneTime
     * @param adjustment
     * @return a BigDecimal[]
     */
    private BigDecimal[] calculateOneTime(final Long oneTime,
    final Integer adjustment) {
        final BigDecimal[] values = this.calculate(oneTime, adjustment, -1);

        return values;
    }

    /**
     * @param quarterly
     * @param adjustment
     * @return a BigDecimal[]
     */
    private BigDecimal[] calculateQuarterly(final Long quarterly,
    final Integer adjustment) {
        final BigDecimal[] values =
            this.calculate(quarterly, adjustment, NB_MONTHS_PER_QUARTER);

        return values;
    }

    /**
     * @param theme
     * @return a BigDecimal[]
     */
    private BigDecimal[] cogs(final ThemeBase theme) {
        final Long monthly = theme.getCogsMonthly();
        final Integer monthlyAdjustment = theme.getCogsMonthlyAdjustment();
        final BigDecimal[] monthlies =
            this.calculateMonthly(monthly, monthlyAdjustment);

        final Long oneTime = theme.getCogsOneTime();
        final BigDecimal[] oneTimes = this.calculateOneTime(oneTime, null);

        final Long quarterly = theme.getCogsQuarterly();
        final Integer quarterlyAdjustment = theme.getCogsQuarterlyAdjustment();
        final BigDecimal[] quarterlies =
            this.calculateQuarterly(quarterly, quarterlyAdjustment);

        final Long annually = theme.getCogsAnnually();
        final Integer annuallyAdjustment = theme.getCogsAnnuallyAdjustment();
        final BigDecimal[] annualies =
            this.calculateAnnually(annually, annuallyAdjustment);

        BigDecimal[] sum = CalculationsUtils.add(monthlies, oneTimes);
        sum = CalculationsUtils.add(sum, quarterlies);
        sum = CalculationsUtils.add(sum, annualies);

        return sum;
    }

    /**
     * @return a BigDecimal[]
     */
    private BigDecimal[] depreciation() {
        final BigDecimal[] values = new BigDecimal[super.durationInMonths];

        for (final AssetBase asset : super.assets) {
            // key = yyyyMM, value = depreciation
            final Map<Long, BigDecimal> map = new Hashtable<Long, BigDecimal>();

            final long date = asset.getDate();
            long year = date / 100;
            long month = date % 100;

            final int term = asset.getDepreciationTerm() * NB_MONTHS_PER_YEAR;

            BigDecimal value = BigDecimal.valueOf(asset.getValue());
            value = value.subtract(BigDecimal.valueOf(asset.getSalvageValue()));
            value =
                value.divide(BigDecimal.valueOf(term), SCALE,
                    RoundingMode.HALF_DOWN);

            for (int i = 0; i < term; ++i) {
                map.put((year * 100) + month, value);

                ++month;
                while (month > NB_MONTHS_PER_YEAR) {
                    month = month - NB_MONTHS_PER_YEAR;
                    ++year;
                }
            }

            super.calculateMonthly(values, map);
        }

        return values;
    }

    /**
     * @param theme
     * @return a BigDecimal[]
     */
    private BigDecimal[] generalAndAdministrative(final ThemeBase theme) {
        final Long monthly = theme.getGeneralAndAdminMonthly();
        final Integer monthlyAdjustment =
            theme.getGeneralAndAdminMonthlyAdjustment();
        final BigDecimal[] monthlies =
            this.calculateMonthly(monthly, monthlyAdjustment);

        final Long oneTime = theme.getGeneralAndAdminOneTime();
        final BigDecimal[] oneTimes = this.calculateOneTime(oneTime, null);

        final Long quarterly = theme.getGeneralAndAdminQuarterly();
        final Integer quarterlyAdjustment =
            theme.getGeneralAndAdminQuarterlyAdjustment();
        final BigDecimal[] quarterlies =
            this.calculateQuarterly(quarterly, quarterlyAdjustment);

        final Long annually = theme.getGeneralAndAdminAnnually();
        final Integer annuallyAdjustment =
            theme.getGeneralAndAdminAnnuallyAdjustment();
        final BigDecimal[] annualies =
            this.calculateAnnually(annually, annuallyAdjustment);

        BigDecimal[] sum = CalculationsUtils.add(monthlies, oneTimes);
        sum = CalculationsUtils.add(sum, quarterlies);
        sum = CalculationsUtils.add(sum, annualies);

        return sum;
    }

    /**
     * @param ebtCumulated
     * @return a BigDecimal[]
     */
    private BigDecimal[] incomeTax(final BigDecimal[] ebtCumulated) {
        final BigDecimal limit1 =
            BigDecimal.valueOf(this.incomeTax.getSalaryLimit1());
        final BigDecimal limit2 =
            BigDecimal.valueOf(this.incomeTax.getSalaryLimit2());

        final BigDecimal rate1 =
            BigDecimal.valueOf(this.incomeTax.getRate1()).divide(HUNDRED);
        final BigDecimal rate2 =
            BigDecimal.valueOf(this.incomeTax.getRate2()).divide(HUNDRED);
        final BigDecimal rate3 =
            BigDecimal.valueOf(this.incomeTax.getRate3()).divide(HUNDRED);

        // final BigDecimal[] sum = new BigDecimal[super.durationInMonths];
        // super.calculateSum(sum, ebt);

        final BigDecimal[] incomeTax1 = new BigDecimal[super.durationInMonths];
        final BigDecimal[] incomeTax2 = new BigDecimal[super.durationInMonths];
        final BigDecimal[] incomeTax3 = new BigDecimal[super.durationInMonths];

        for (int i = 0; i < super.durationInMonths; ++i) {
            if (ebtCumulated[i] == null) {
                continue;
            }

            final boolean apply =
                (ebtCumulated[i].compareTo(BigDecimal.ZERO) == 1)
                    && (ebtCumulated[i].compareTo(limit1) < 1);
            if (apply) {
                incomeTax1[i] = ebtCumulated[i].multiply(rate1);
            }

            final boolean tax2 =
                (ebtCumulated[i].compareTo(limit1) > 0)
                    && (ebtCumulated[i].compareTo(limit2) < 1);
            if (tax2) {
                incomeTax1[i] = limit1.multiply(rate1);
                incomeTax2[i] =
                    ebtCumulated[i].subtract(limit1).multiply(rate2);
            }

            final boolean tax3 = (ebtCumulated[i].compareTo(limit2) > 0);
            if (tax3) {
                incomeTax2[i] = limit2.subtract(limit1).multiply(rate2);
                incomeTax3[i] =
                    ebtCumulated[i].subtract(limit2).multiply(rate3);
            }

            // System.out.println(i + " | " + sum[i] + " | " + incomeTax1[i]
            // + " | " + incomeTax2[i] + " | " + incomeTax3[i]);
        }

        BigDecimal[] subtotal = CalculationsUtils.add(incomeTax1, incomeTax2);
        subtotal = CalculationsUtils.add(subtotal, incomeTax3);

        long month = super.getStrategyBeginDate() % 100;

        month = month - PRE;
        while (month <= 0) {
            month = month + NB_MONTHS_PER_YEAR;
        }

        final BigDecimal[] total = new BigDecimal[super.durationInMonths];
        for (int i = 0; i < super.durationInMonths; ++i) {
            if (ebtCumulated[i] == null) {
                // Nothing to do.
            } else {
                // We reset the income taxes on each first month
                if ((i == 0) || (month == 1)) {
                    total[i] = CalculationsUtils.subtract(subtotal[i], null);
                } else {
                    total[i] =
                        CalculationsUtils
                            .subtract(subtotal[i], subtotal[i - 1]);
                }
            }

            // System.out.println(i + " | " + month + " | " + subtotal[i] +
            // " | "
            // + total[i]);

            ++month;
            while (month > NB_MONTHS_PER_YEAR) {
                month = month - NB_MONTHS_PER_YEAR;
            }
        }

        return total;
    }

    /**
     * @param ebtCumulated
     */
    private void itCarriedForward(final BigDecimal[] ebtCumulated) {
        final Map<Long, BigDecimal> ebtYears = new TreeMap<>();
        final Map<Long, BigDecimal> carriedYears = new TreeMap<>();
        final Map<Long, BigDecimal> carriedSum = new TreeMap<>();
        final Map<Long, BigDecimal> usedThis = new TreeMap<>();
        final Map<Long, BigDecimal> usedYears = new TreeMap<>();
        final int yearsCarryLossesForward =
            this.incomeTax.getYearsCarryLossesForward();

        long year = super.getStrategyBeginDate() / 100;
        long month = super.getStrategyBeginDate() % 100;

        month = month - PRE;
        while (month <= 0) {
            month = month + NB_MONTHS_PER_YEAR;
            --year;
        }

        for (int i = 0; i < super.durationInMonths; ++i) {
            if (month == 12) {
                final BigDecimal ebt = ebtCumulated[i];
                ebtYears.put(year, ebt);

                if ((ebt == null) || (ebt.signum() >= 0)) {
                    // Nothing to do.
                } else {
                    carriedYears.put(year, ebt.negate());
                }

                // System.out.println(i + " | " + year + " | " + ebt);

                BigDecimal current = null;
                for (int j = 0; j < yearsCarryLossesForward; ++j) {
                    final BigDecimal value = ebtYears.get(year - j - 1);
                    if ((value == null) || (value.signum() >= 0)) {
                        continue;
                    }

                    current = CalculationsUtils.add(current, value.negate());
                    current =
                        CalculationsUtils
                            .subtract(current, usedYears.get(year));
                }

                carriedSum.put(year, current);

                if ((ebt == null) || (ebt.signum() < 0)) {
                    // Nothing to do.
                } else if (current == null) {
                    // Nothing to do.
                } else if (ebt.compareTo(current) >= 0) {
                    usedThis.put(year, current);
                } else {
                    usedThis.put(year, ebt);
                }

                if ((ebt == null) || (ebt.signum() < 0)) {
                    // Nothing to do.
                } else {
                    BigDecimal total = ebt;
                    for (int j = 0; j < yearsCarryLossesForward; ++j) {
                        final long yearCurrent =
                            (year - yearsCarryLossesForward) + j;

                        final BigDecimal carry = carriedYears.get(yearCurrent);
                        if (carry == null) {
                            continue;
                        }

                        if (total.compareTo(carry) >= 0) {
                            usedYears.put(yearCurrent, carry);
                            total = total.subtract(carry);
                        } else {
                            usedYears.put(yearCurrent, total);
                            total = null;
                        }

                        if (total == null) {
                            break;
                        }
                    }
                }
            }

            ++month;
            while (month > NB_MONTHS_PER_YEAR) {
                month = month - NB_MONTHS_PER_YEAR;
                ++year;
            }
        }

        // System.out.println("ebtYears: " + ebtYears);
        // System.out.println("carriedYears: " + carriedYears);
        // System.out.println("carriedSum: " + carriedSum);
        // System.out.println("usedThis: " + usedThis);
        // System.out.println("usedYears: " + usedYears);

        year = super.getStrategyBeginDate() / 100;
        month = super.getStrategyBeginDate() % 100;

        month = month - PRE;
        while (month <= 0) {
            month = month + NB_MONTHS_PER_YEAR;
            --year;
        }

        for (int i = 0; i < super.durationInMonths; ++i) {
            final BigDecimal value = usedThis.get(year);
            ebtCumulated[i] =
                CalculationsUtils.subtract(ebtCumulated[i], value);

            ++month;
            while (month > NB_MONTHS_PER_YEAR) {
                month = month - NB_MONTHS_PER_YEAR;
                ++year;
            }
        }

        // System.out.println("ebtCumulated: " + Arrays.asList(ebtCumulated));
    }

    /**
     * @param ebtMonthly
     * @return a BigDecimal[]
     */
    private BigDecimal[] itEbtCumulated(final BigDecimal[] ebtMonthly) {
        long month = super.getStrategyBeginDate() % 100;

        month = month - PRE;
        while (month <= 0) {
            month = month + NB_MONTHS_PER_YEAR;
        }

        final BigDecimal[] ebtCumulated =
            new BigDecimal[super.durationInMonths];
        for (int i = 0; i < super.durationInMonths; ++i) {
            if ((i == 0) || (month == 1)) {
                ebtCumulated[i] = CalculationsUtils.add(ebtMonthly[i], null);
            } else {
                ebtCumulated[i] =
                    CalculationsUtils.add(ebtMonthly[i], ebtCumulated[i - 1]);
            }

            ++month;
            while (month > NB_MONTHS_PER_YEAR) {
                month = month - NB_MONTHS_PER_YEAR;
            }
        }

        return ebtCumulated;
    }

    /**
     * @return a BigDecimal[]
     */
    private BigDecimal[] interest() {
        final BigDecimal[] values = new BigDecimal[super.durationInMonths];

        for (final LoanBase loan : super.loans) {
            final Map<Long, BigDecimal> map;

            if (loan.getType() == LoanType.INTEREST_ONLY) {
                map = CalculationsUtils.calculateInterestOnly(loan);
            } else {
                map =
                    CalculationsUtils.calculatePrincipalPlusInterest(loan,
                        false);
            }

            super.calculateMonthly(values, map);
        }

        return values;
    }

    /**
     * @param theme
     * @return a BigDecimal[]
     */
    private BigDecimal[] researchAndDevelopment(final ThemeBase theme) {
        final Long monthly = theme.getResearchAndDevelopmentMonthly();
        final Integer monthlyAdjustment =
            theme.getResearchAndDevelopmentMonthlyAdjustment();
        final BigDecimal[] monthlies =
            this.calculateMonthly(monthly, monthlyAdjustment);

        final Long oneTime = theme.getResearchAndDevelopmentOneTime();
        final BigDecimal[] oneTimes = this.calculateOneTime(oneTime, null);

        final Long quarterly = theme.getResearchAndDevelopmentQuarterly();
        final Integer quarterlyAdjustment =
            theme.getResearchAndDevelopmentQuarterlyAdjustment();
        final BigDecimal[] quarterlies =
            this.calculateQuarterly(quarterly, quarterlyAdjustment);

        final Long annually = theme.getResearchAndDevelopmentAnnually();
        final Integer annuallyAdjustment =
            theme.getResearchAndDevelopmentAnnuallyAdjustment();
        final BigDecimal[] annualies =
            this.calculateAnnually(annually, annuallyAdjustment);

        BigDecimal[] sum = CalculationsUtils.add(monthlies, oneTimes);
        sum = CalculationsUtils.add(sum, quarterlies);
        sum = CalculationsUtils.add(sum, annualies);

        return sum;
    }

    /**
     * @param theme
     * @return a BigDecimal[]
     */
    private BigDecimal[] salesAndMarketing(final ThemeBase theme) {
        final Long monthly = theme.getSalesAndMarketingMonthly();
        final Integer monthlyAdjustment =
            theme.getSalesAndMarketingMonthlyAdjustment();
        final BigDecimal[] monthlies =
            this.calculateMonthly(monthly, monthlyAdjustment);

        final Long oneTime = theme.getSalesAndMarketingOneTime();
        final BigDecimal[] oneTimes = this.calculateOneTime(oneTime, null);

        final Long quarterly = theme.getSalesAndMarketingQuarterly();
        final Integer quarterlyAdjustment =
            theme.getSalesAndMarketingQuarterlyAdjustment();
        final BigDecimal[] quarterlies =
            this.calculateQuarterly(quarterly, quarterlyAdjustment);

        final Long annually = theme.getSalesAndMarketingAnnually();
        final Integer annuallyAdjustment =
            theme.getSalesAndMarketingAnnuallyAdjustment();
        final BigDecimal[] annualies =
            this.calculateAnnually(annually, annuallyAdjustment);

        BigDecimal[] sum = CalculationsUtils.add(monthlies, oneTimes);
        sum = CalculationsUtils.add(sum, quarterlies);
        sum = CalculationsUtils.add(sum, annualies);

        return sum;
    }

    /**
     * @param theme
     * @return a BigDecimal[]
     */
    private BigDecimal[] revenue(final ThemeBase theme) {
        final Long monthly = theme.getRevenueMonthly();
        final Integer monthlyAdjustment = theme.getRevenueMonthlyAdjustment();
        final BigDecimal[] monthlies =
            this.calculateMonthly(monthly, monthlyAdjustment);

        final Long oneTime = theme.getRevenueOneTime();
        final BigDecimal[] oneTimes = this.calculateOneTime(oneTime, null);

        /*
         * TODO: For quarterly and annually, should revenues be added on the
         * first month or on the last month ?
         */

        final Long quarterly = theme.getRevenueQuarterly();
        final Integer quarterlyAdjustment =
            theme.getRevenueQuarterlyAdjustment();
        final BigDecimal[] quarterlies =
            this.calculateQuarterly(quarterly, quarterlyAdjustment);

        final Long annually = theme.getRevenueAnnually();
        final Integer annuallyAdjustment = theme.getRevenueAnnuallyAdjustment();
        final BigDecimal[] annualies =
            this.calculateAnnually(annually, annuallyAdjustment);

        BigDecimal[] sum = CalculationsUtils.add(monthlies, oneTimes);
        sum = CalculationsUtils.add(sum, quarterlies);
        sum = CalculationsUtils.add(sum, annualies);

        return sum;
    }
}
