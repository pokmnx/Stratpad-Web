package com.glasseystrategy.jstratpad.helper;

import com.glasseystrategy.jstratpad.model.Frequency;
import com.glasseystrategy.jstratpad.model.LoanBase;
import com.glasseystrategy.jstratpad.model.ThemeBase;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.apache.poi.ss.formula.functions.Finance;

/**
 */
public class CalculationsUtils implements CalculationsConstants {

    /**
     */
    private static final Logger LOGGER = Logger
        .getLogger(CalculationsUtils.class.getName());

    /**
     * Add two {@link BigDecimal} handling <code>null</code> values.
     * 
     * @param original
     * @param value
     * @return a {@link BigDecimal}
     */
    public static BigDecimal add(final BigDecimal original,
    final BigDecimal value) {
        final BigDecimal result;

        if (original == null) {
            result = value;
        } else if (value == null) {
            result = original;
        } else {
            result = original.add(value);
        }

        return result;
    }

    /**
     * Add two arrays of {@link BigDecimal} handling <code>null</code> values.
     * 
     * @param originals
     * @param values
     * @return a BigDecimal[]
     */
    public static BigDecimal[] add(final BigDecimal[] originals,
    final BigDecimal[] values) {
        final BigDecimal[] result = new BigDecimal[originals.length];

        for (int i = 0; i < originals.length; ++i) {
            result[i] = add(originals[i], values[i]);
        }

        return result;
    }

    /**
     * @param loan
     * @return a Map<Long, BigDecimal>
     */
    public static Map<Long, BigDecimal> calculateInterestOnly(
    final LoanBase loan) {
        if (LOGGER.isLoggable(Level.FINEST)) {
            LOGGER.finest("loan: " + loan);
        }

        // key = yyyyMM, value = ppmt or ipmt
        final Map<Long, BigDecimal> map = new Hashtable<Long, BigDecimal>();

        final long date = loan.getDate();
        long year = date / 100;
        long month = date % 100;

        /**
         * TODO: Should we also implement frequencies in InterestOnly ?
         */

        final BigDecimal amount = BigDecimal.valueOf(loan.getAmount());
        final BigDecimal rate =
            loan.getRate().divide(HUNDRED)
                .divide(TWELVE, SCALE, RoundingMode.DOWN);
        final int term = loan.getTerm();

        final BigDecimal value = amount.multiply(rate).negate();

        for (int i = 0; i < term; ++i) {
            // System.out.println((year * 100) + month + ": " + value);
            map.put((year * 100) + month, value);

            ++month;
            while (month > NB_MONTHS_PER_YEAR) {
                month = month - NB_MONTHS_PER_YEAR;
                ++year;
            }
        }

        return map;
    }

    /**
     * @param loan
     * @param principal <code>true</code> for
     * {@link Finance#ppmt(double, int, int, double)}, <code>false</code> for
     * {@link Finance#ipmt(double, int, int, double)}
     * @return a Map<Long, BigDecimal>
     */
    public static Map<Long, BigDecimal> calculatePrincipalPlusInterest(
    final LoanBase loan, final boolean principal) {
        if (LOGGER.isLoggable(Level.FINEST)) {
            LOGGER.finest("loan: " + loan + ", principal: " + principal);
        }

        // key = yyyyMM, value = ppmt or ipmt
        final Map<Long, BigDecimal> map = new Hashtable<Long, BigDecimal>();

        final double amount = loan.getAmount();
        final int term = loan.getTerm();

        final long beginDate = loan.getDate();
        final long endDate = yyyyMMPlus(beginDate, term);

        long year = beginDate / 100;
        long month = beginDate % 100;

        final Frequency frequency = loan.getFrequency();
        BigDecimal rate = loan.getRate().divide(HUNDRED);
        final int nper;
        final int increment;

        if (frequency == Frequency.MONTHLY) {
            rate = rate.divide(TWELVE, SCALE, RoundingMode.DOWN);
            nper = term;
            increment = 1;
        } else if (frequency == Frequency.QUARTERLY) {
            rate = rate.divide(FOUR, SCALE, RoundingMode.DOWN);
            nper = (term / 3) + (((term % 3) == 0) ? 0 : 1);
            increment = 3;
        } else if (frequency == Frequency.ANNUALLY) {
            nper = (term / 12) + (((term % 12) == 0) ? 0 : 1);
            increment = 12;
        } else {
            throw new RuntimeException("frequency: " + frequency);
        }

        // Calculate the month of the first payment
        month += (increment - 1);
        while (month > NB_MONTHS_PER_YEAR) {
            month = month - NB_MONTHS_PER_YEAR;
            ++year;
        }

        // System.out.println("frequency: " + frequency + ", rate: " + rate
        // + ", nper: " + nper + ", increment: " + increment);

        for (int i = 0; i < nper; ++i) {
            final BigDecimal value;
            if (principal) {
                // payment on the principal

                final double ppmt =
                    Finance.ppmt(rate.doubleValue(), i + 1, nper, amount);
                value = BigDecimal.valueOf(ppmt);
            } else {
                // interest payment

                final double ipmt =
                    Finance.ipmt(rate.doubleValue(), i + 1, nper, amount);
                value = BigDecimal.valueOf(ipmt);
            }

            long yyyyMM = (year * 100) + month;
            if (yyyyMM > endDate) {
                /*
                 * In case the term is not a multiple of the frequency, use the
                 * endDate.
                 */
                yyyyMM = endDate;
            }
            // System.out.println(yyyyMM + ": " + value);
            map.put(yyyyMM, value);

            month += increment;
            while (month > NB_MONTHS_PER_YEAR) {
                month = month - NB_MONTHS_PER_YEAR;
                ++year;
            }
        }

        return map;
    }

    /**
     * @param themes
     * @param now
     * @return the strategy start and end dates, in yyyyMMdd format
     */
    public static long[] calculateStrategyDates(
    final List<? extends ThemeBase> themes, final Date now) {
        if (LOGGER.isLoggable(Level.FINEST)) {
            LOGGER.finest("themes: " + themes.size() + ", now: " + now);
        }

        long strategyBeginDate = 99999999;
        long strategyEndDate = 0;

        for (final ThemeBase theme : themes) {
            final Long startDate = theme.getStartDate();
            if (startDate == null) {
                // Nothing to do.
            } else if (startDate < strategyBeginDate) {
                strategyBeginDate = startDate;
            }

            final Long endDate = theme.getEndDate();
            if (endDate == null) {
                // Nothing to do.
            } else if (endDate > strategyEndDate) {
                strategyEndDate = endDate;
            }
        }

        /*
         * If there was no startDate in the themes, then set the
         * strategyBeginDate to now.
         */

        if (strategyBeginDate == 99999999) {
            strategyBeginDate = yyyyMMdd(now);
        }

        // If strategyEndDate is null, then use strategyBeginDate + 8 years.
        if (strategyEndDate == 0) {
            strategyEndDate =
                CalculationsUtils.yyyyMMddPlus8Years(strategyBeginDate);
        }

        final long[] dates = {
            strategyBeginDate, strategyEndDate,
        };

        return dates;
    }

    /**
     * @param theme
     * @param now
     * @return the theme start and end dates, in yyyyMM format
     */
    public static long[] calculateThemeDates(final ThemeBase theme,
    final Date now) {
        if (LOGGER.isLoggable(Level.FINEST)) {
            LOGGER.finest("theme: " + theme + ", now: " + now);
        }

        // If theme startDate is null, then use now.
        Long beginDate = theme.getStartDate();
        if (beginDate == null) {
            beginDate = CalculationsUtils.yyyyMM(now);
        } else {
            beginDate = beginDate / 100;
        }

        // If theme endDate is null, then use startDate + 8 years.
        Long endDate = theme.getEndDate();
        if (endDate == null) {
            endDate = CalculationsUtils.yyyyMMPlus8Years(beginDate);
        } else {
            endDate = endDate / 100;
        }

        final long[] dates = {
            beginDate, endDate,
        };

        return dates;
    }

    /**
     * Returns the number of months covered by the calculations.
     * 
     * @param nbMonth
     * @param nbQuarter
     * @param nbYear
     * @return the number of months covered by the calculations
     */
    public static int durationInMonths(final int nbMonth, final int nbQuarter,
    final int nbYear) {
        final int nbMonthTemp = nbMonth;
        final int nbQuarterTemp = (nbQuarter * NB_MONTHS_PER_QUARTER);
        final int nbYearTemp = nbYear * NB_MONTHS_PER_YEAR;
        final int duration = nbMonthTemp + nbQuarterTemp + nbYearTemp;

        return duration;
    }

    /**
     * Multiply two {@link BigDecimal} handling <code>null</code> values.
     * 
     * @param original
     * @param value
     * @return a {@link BigDecimal}
     */
    public static BigDecimal multiply(final BigDecimal original,
    final BigDecimal value) {
        final BigDecimal result;

        if (original == null) {
            result = null;
        } else if (value == null) {
            result = null;
        } else {
            result = original.multiply(value);
        }

        return result;
    }

    /**
     * Subtract two {@link BigDecimal} handling <code>null</code> values.
     * 
     * @param original
     * @param value
     * @return a {@link BigDecimal}
     */
    public static BigDecimal subtract(final BigDecimal original,
    final BigDecimal value) {
        final BigDecimal result;

        if (original == null) {
            if (value == null) {
                result = value;
            } else {
                result = BigDecimal.ZERO.subtract(value);
            }
        } else if (value == null) {
            result = original;
        } else {
            result = original.subtract(value);
        }

        return result;
    }

    /**
     * Translates a {@link Number} into a {@link BigDecimal} with a scale of
     * zero. Returns <code>null</code> if the specified integer is
     * <code>null</code>.
     * 
     * @param number
     * @return a {@link BigDecimal}
     */
    public static BigDecimal toBigDecimal(final Number number) {
        if (number == null) {
            return null;
        }

        return BigDecimal.valueOf(number.longValue());
    }

    /**
     * Returns the specified date in the yyyyMM format.
     * 
     * @param date
     * @return the specified date in the yyyyMM format
     */
    public static long yyyyMM(final Date date) {
        final DateFormat format = new SimpleDateFormat("yyyyMM");
        final String string = format.format(date);
        final long result = Long.valueOf(string);

        return result;
    }

    /**
     * Returns the specified date in the yyyyMMdd format.
     * 
     * @param date
     * @return the specified date in the yyyyMMdd format
     */
    public static long yyyyMMdd(final Date date) {
        final DateFormat format = new SimpleDateFormat("yyyyMMdd");
        final String string = format.format(date);
        final long result = Long.valueOf(string);

        return result;
    }

    /**
     * Returns a new yyyyMMdd date which equals to the specified date plus 8
     * years.
     * 
     * @param yyyyMMdd
     * @return a new yyyyMMdd date which equals to the specified date plus 8
     * years
     */
    public static long yyyyMMddPlus8Years(final long yyyyMMdd) {
        long year = yyyyMMdd / 10000;
        final long monthDay = yyyyMMdd % 10000;

        year = year + 8;

        final long result = (year * 10000) + monthDay;

        return result;
    }

    /**
     * Returns a new yyyyMM date which equals to the specified date plus nbMonth
     * months.
     * 
     * @param yyyyMM
     * @param nbMonth
     * @return a new yyyyMM date which equals to the specified date plus nbMonth
     * months
     */
    public static long yyyyMMPlus(final long yyyyMM, final int nbMonth) {
        long year = yyyyMM / 100;
        long month = yyyyMM % 100;

        month = month + nbMonth;
        while (month > NB_MONTHS_PER_YEAR) {
            month = month - NB_MONTHS_PER_YEAR;
            ++year;
        }

        final long result = (year * 100) + month;

        return result;
    }

    /**
     * Returns a new yyyyMM date which equals to the specified date plus 8
     * years.
     * 
     * @param yyyyMM
     * @return a new yyyyMM date which equals to the specified date plus 8 years
     */
    public static long yyyyMMPlus8Years(final long yyyyMM) {
        long year = yyyyMM / 100;
        final long month = yyyyMM % 100;

        year = year + 8;

        final long result = (year * 100) + month;

        return result;
    }

    /**
     */
    protected CalculationsUtils() {
        throw new UnsupportedOperationException();
    }
}
