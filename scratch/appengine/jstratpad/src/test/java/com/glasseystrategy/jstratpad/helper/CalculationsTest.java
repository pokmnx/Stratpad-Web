package com.glasseystrategy.jstratpad.helper;

import com.glasseystrategy.jstratpad.inout.report.BalanceSheetOut;
import com.glasseystrategy.jstratpad.inout.report.CashFlowOut;
import com.glasseystrategy.jstratpad.inout.report.IncomeStatementOut;
import com.glasseystrategy.jstratpad.model.AssetBase;
import com.glasseystrategy.jstratpad.model.EmployeeDeduction;
import com.glasseystrategy.jstratpad.model.EquityBase;
import com.glasseystrategy.jstratpad.model.Frequency;
import com.glasseystrategy.jstratpad.model.IncomeTax;
import com.glasseystrategy.jstratpad.model.IncomeTaxBase;
import com.glasseystrategy.jstratpad.model.LoanBase;
import com.glasseystrategy.jstratpad.model.RemittanceDueDate;
import com.glasseystrategy.jstratpad.model.SalesTax;
import com.glasseystrategy.jstratpad.model.SalesTaxBase;
import com.glasseystrategy.jstratpad.model.Theme;
import com.glasseystrategy.jstratpad.model.ThemeBase;
import com.glasseystrategy.jstratpad.resource.report.BalanceSheetResource;
import com.glasseystrategy.jstratpad.resource.report.BigDecimalTA;
import com.glasseystrategy.jstratpad.resource.report.IncomeStatementResource;
import com.glasseystrategy.jstratpad.util.ThemeOrderComparator;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.junit.Test;

/**
 */
public class CalculationsTest extends CalculationsHelperTest {

    /**
     */
    public CalculationsTest() {
        super();
    }

    /**
     * @throws Exception
     */
    @SuppressWarnings("static-method")
    // @Test
    public
    void test() throws Exception {
        final List<AssetBase> assets = Collections.emptyList();

        final EmployeeDeduction employeeDeduction = new EmployeeDeduction();
        employeeDeduction.setDueDate(RemittanceDueDate.NEXT_MONTH);
        employeeDeduction.setEmployeeContributionPercentage(15);
        employeeDeduction.setEmployerContributionPercentage(20);
        employeeDeduction.setPercentCogsAreWages(10);
        employeeDeduction.setPercentGandAAreWages(20);
        employeeDeduction.setPercentRandDAreWages(30);
        employeeDeduction.setPercentSandMAreWages(40);

        final List<EquityBase> equities = Collections.emptyList();

        final IncomeTaxBase incomeTax = new IncomeTax();
        incomeTax.setRate1(10);
        incomeTax.setRate2(30);
        incomeTax.setRate3(50);
        incomeTax.setRemittanceFrequency(Frequency.MONTHLY);
        incomeTax.setRemittanceMonth(0);
        incomeTax.setSalaryLimit1(10000);
        incomeTax.setSalaryLimit2(30000);
        incomeTax.setYearsCarryLossesForward(5);

        final List<LoanBase> loans = Collections.emptyList();

        final SalesTaxBase salesTax = new SalesTax();
        salesTax.setPercentRevenuesIsTaxable(50);
        salesTax.setRate(10);
        salesTax.setRemittanceFrequency(Frequency.MONTHLY);
        salesTax.setRemittanceMonth(0);

        final ThemeBase theme = new Theme();
        theme.setCogsMonthly(10000L);
        theme.setEndDate(20130331L);
        theme.setGeneralAndAdminMonthly(20000L);
        theme.setName("Theme01");
        theme.setOrder(0);
        theme.setResearchAndDevelopmentMonthly(40000L);
        theme.setRevenueMonthly(250000L);
        theme.setSalesAndMarketingMonthly(80000L);
        theme.setStartDate(20120101L);

        final List<ThemeBase> themes = Arrays.asList(theme);
        Collections.sort(themes, new ThemeOrderComparator<ThemeBase>());

        final int durationInMonths =
            CalculationsUtils
                .durationInMonths(6 + CalculationsHelper.PRE, 4, 4);

        final IncomeStatementHelper isHelper = new IncomeStatementHelper();
        isHelper.setAssets(assets);
        isHelper.setIncomeTax(incomeTax);
        isHelper.setLoans(loans);
        isHelper.setNbMonth(durationInMonths);
        isHelper.setThemes(themes);

        final IncomeStatementOut isOut = isHelper.calculate();
        // IncomeStatementResource.removePrepended(isOut);

        final CashFlowHelper cfHelper = new CashFlowHelper();
        cfHelper.setAccountsPayableTerm(30);
        cfHelper.setAccountsReceivableTerm(30);
        cfHelper.setAssets(assets);
        cfHelper.setCogsMonthly(isOut.getCogs().getSubtotals());
        cfHelper.setDepreciationMonthly(isOut.getEbitda().getDepreciation());
        cfHelper.setEmployeeDeduction(employeeDeduction);
        cfHelper.setEquities(equities);
        cfHelper.setExpensesMonthly(isOut.getExpenses().getSubtotals());
        cfHelper.setGeneralAdminMonthly(isOut.getExpenses()
            .getGeneralAndAdministrative());
        cfHelper.setIncomeTax(incomeTax);
        cfHelper.setIncomeTaxesMonthly(isOut.getEbt().getIncomeTaxes());
        cfHelper.setInventoryLeadTime(0);
        cfHelper.setLoans(loans);
        cfHelper.setNbMonth(durationInMonths);
        cfHelper.setNetIncomeMonthly(isOut.getNetIncome().getTotals());
        cfHelper.setPercentCogsIsInventory(10);
        cfHelper.setResearchDevMonthly(isOut.getExpenses()
            .getResearchAndDevelopment());
        cfHelper.setRevenuesMonthly(isOut.getRevenue().getSubtotals());
        cfHelper.setSalesMarketingMonthly(isOut.getExpenses()
            .getSalesAndMarketing());
        cfHelper.setSalesTax(salesTax);
        cfHelper.setStrategyBeginDate(isOut.getStartDate());
        cfHelper.setStrategyEndDate(isOut.getEndDate());

        final CashFlowOut cfOut = cfHelper.calculate();
        // CashFlowResource.removePrepended(out);

        final BalanceSheetHelper bsHelper = new BalanceSheetHelper();
        bsHelper.setAccountsPayableMonthly(cfOut.getOperations().getAp());
        bsHelper.setAccountsReceivableMonthly(cfOut.getOperations().getAr());
        bsHelper.setAssets(assets);
        bsHelper.setCashAtEndMonthly(cfOut.getNetCash().getEndCash());
        bsHelper
            .setDepreciationMonthly(cfOut.getOperations().getDepreciation());
        bsHelper.setEmpDeducMonthly(cfHelper.getDeductionsPlusEp());
        bsHelper.setEquities(equities);
        bsHelper.setIncomeTaxPayment(cfHelper.getIncomeTaxPayment());
        bsHelper.setInventoryMonthly(cfOut.getOperations().getInventory());
        bsHelper.setLoans(loans);
        bsHelper.setNbMonth(6 + CalculationsHelper.PRE);
        bsHelper.setNbQuarter(4);
        bsHelper.setNbYear(4);
        bsHelper.setNetIncomeMonthly(cfOut.getOperations().getNetIncome());
        bsHelper.setPrepaidPurchasesMonthly(cfOut.getInvestments()
            .getPrepaidPurchases());
        bsHelper.setPrepaidSalesMonthly(cfOut.getInvestments()
            .getPrepaidSales());
        bsHelper.setSalesTaxCustomer(cfHelper.getSalesTaxCustomer());
        bsHelper.setSalesTaxGovernment(cfHelper.getSalesTaxGovernment());
        bsHelper.setSalesTaxPeriod(cfHelper.getSalesTaxPeriod());
        bsHelper.setStrategyBeginDate(cfOut.getStartDate());
        bsHelper.setStrategyEndDate(cfOut.getEndDate());

        final BalanceSheetOut bsOut = bsHelper.calculate();
        BalanceSheetResource.removePrepended(bsOut);

        final GsonBuilder gsonBuilder = new GsonBuilder();
        gsonBuilder.registerTypeAdapter(BigDecimal.class, new BigDecimalTA());
        gsonBuilder.setPrettyPrinting();
        final Gson gson = gsonBuilder.create();
        final String actual = gson.toJson(bsOut);

        System.out.println(actual);
    }

    /**
     * @throws Exception
     */
    @SuppressWarnings("static-method")
    @Test
    public void testIncometax() throws Exception {
        final List<AssetBase> assets = Collections.emptyList();

        final EmployeeDeduction employeeDeduction = new EmployeeDeduction();
        employeeDeduction.setDueDate(RemittanceDueDate.NEXT_MONTH);
        employeeDeduction.setEmployeeContributionPercentage(0);
        employeeDeduction.setEmployerContributionPercentage(0);
        employeeDeduction.setPercentCogsAreWages(0);
        employeeDeduction.setPercentGandAAreWages(0);
        employeeDeduction.setPercentRandDAreWages(0);
        employeeDeduction.setPercentSandMAreWages(0);

        final List<EquityBase> equities = Collections.emptyList();

        final IncomeTaxBase incomeTax = new IncomeTax();
        incomeTax.setRate1(10);
        incomeTax.setRate2(30);
        incomeTax.setRate3(50);
        incomeTax.setRemittanceFrequency(Frequency.MONTHLY);
        incomeTax.setRemittanceMonth(0);
        incomeTax.setSalaryLimit1(10000);
        incomeTax.setSalaryLimit2(30000);
        incomeTax.setYearsCarryLossesForward(3);

        final List<LoanBase> loans = Collections.emptyList();

        final SalesTaxBase salesTax = new SalesTax();
        salesTax.setPercentRevenuesIsTaxable(0);
        salesTax.setRate(0);
        salesTax.setRemittanceFrequency(Frequency.MONTHLY);
        salesTax.setRemittanceMonth(0);

        final ThemeBase theme0 = new Theme();
        theme0.setName("Theme0");
        theme0.setOrder(0);
        theme0.setRevenueOneTime(-200L);
        theme0.setStartDate(20120101L);

        final ThemeBase theme1 = new Theme();
        theme1.setName("Theme1");
        theme1.setOrder(1);
        theme1.setRevenueOneTime(-100L);
        theme1.setStartDate(20130101L);

        final ThemeBase theme2 = new Theme();
        theme2.setName("Theme2");
        theme2.setOrder(2);
        theme2.setRevenueOneTime(-50L);
        theme2.setStartDate(20140101L);

        final ThemeBase theme3 = new Theme();
        theme3.setName("Theme3");
        theme3.setOrder(3);
        theme3.setRevenueOneTime(50L);
        theme3.setStartDate(20150101L);

        final ThemeBase theme4 = new Theme();
        theme4.setName("Theme4");
        theme4.setOrder(4);
        theme4.setRevenueOneTime(75L);
        theme4.setStartDate(20160101L);

        final ThemeBase theme5 = new Theme();
        theme5.setName("Theme5");
        theme5.setOrder(5);
        theme5.setRevenueOneTime(100L);
        theme5.setStartDate(20170101L);

        final ThemeBase theme6 = new Theme();
        theme6.setName("Theme6");
        theme6.setOrder(6);
        theme6.setRevenueOneTime(-25L);
        theme6.setStartDate(20180101L);

        final ThemeBase theme7 = new Theme();
        theme7.setName("Theme7");
        theme7.setOrder(7);
        theme7.setRevenueOneTime(200L);
        theme7.setStartDate(20190101L);

        final List<ThemeBase> themes =
            Arrays.asList(theme0, theme1, theme2, theme3, theme4, theme5,
                theme6, theme7);
        Collections.sort(themes, new ThemeOrderComparator<ThemeBase>());

        final int durationInMonths =
            CalculationsUtils
                .durationInMonths(0 + CalculationsHelper.PRE, 0, 8);

        final IncomeStatementHelper isHelper = new IncomeStatementHelper();
        isHelper.setAssets(assets);
        isHelper.setIncomeTax(incomeTax);
        isHelper.setLoans(loans);
        isHelper.setNbMonth(durationInMonths);
        isHelper.setThemes(themes);

        final IncomeStatementOut isOut = isHelper.calculate();
        IncomeStatementResource.removePrepended(isOut);

        final GsonBuilder gsonBuilder = new GsonBuilder();
        gsonBuilder.registerTypeAdapter(BigDecimal.class, new BigDecimalTA());
        gsonBuilder.setPrettyPrinting();
        final Gson gson = gsonBuilder.create();
        final String actual = gson.toJson(isOut);

        System.out.println(actual);
    }
}
