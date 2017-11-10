package com.glasseystrategy.jstratpad.helper;

import com.glasseystrategy.jstratpad.inout.report.IncomeStatementOut;
import com.glasseystrategy.jstratpad.model.Asset;
import com.glasseystrategy.jstratpad.model.AssetBase;
import com.glasseystrategy.jstratpad.model.AssetDepreciationType;
import com.glasseystrategy.jstratpad.model.AssetType;
import com.glasseystrategy.jstratpad.model.Frequency;
import com.glasseystrategy.jstratpad.model.IncomeTax;
import com.glasseystrategy.jstratpad.model.IncomeTaxBase;
import com.glasseystrategy.jstratpad.model.Loan;
import com.glasseystrategy.jstratpad.model.LoanBase;
import com.glasseystrategy.jstratpad.model.LoanType;
import com.glasseystrategy.jstratpad.model.Theme;
import com.glasseystrategy.jstratpad.model.ThemeBase;
import com.glasseystrategy.jstratpad.resource.report.BigDecimalTA;
import com.glasseystrategy.jstratpad.resource.report.IncomeStatementResource;
import com.glasseystrategy.jstratpad.resource.report.ReportIT;
import com.glasseystrategy.jstratpad.util.ThemeOrderComparator;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.File;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.apache.commons.io.FileUtils;
import org.junit.Test;
import org.skyscreamer.jsonassert.JSONAssert;

/**
 */
public class IncomeStatementHelperTest extends CalculationsHelperTest {

    /**
     */
    public IncomeStatementHelperTest() {
        super();
    }

    /**
     * @throws Exception
     */
    @SuppressWarnings("static-method")
    @Test
    public void testDetails() throws Exception {
        testDetails("test01");
    }

    /**
     * @throws Exception
     */
    @SuppressWarnings("static-method")
    @Test
    public void testSummaryGetToMarketFull() throws Exception {
        final AssetBase asset0 = new Asset();
        asset0.setDate(201206L);
        asset0.setDepreciationTerm(8);
        asset0.setDepreciationType(AssetDepreciationType.STRAIGHT_LINE);
        asset0.setName("BMW");
        asset0.setSalvageValue(4000L);
        asset0.setType(AssetType.MACHINERY);
        asset0.setValue(24000L);

        final List<AssetBase> assets = Arrays.asList(asset0);

        final IncomeTaxBase incomeTax = new IncomeTax();
        incomeTax.setRate1(20);
        incomeTax.setRate2(25);
        incomeTax.setRate3(30);
        incomeTax.setRemittanceFrequency(Frequency.MONTHLY);
        incomeTax.setRemittanceMonth(0);
        incomeTax.setSalaryLimit1(35000);
        incomeTax.setSalaryLimit2(60000);
        incomeTax.setYearsCarryLossesForward(5);

        final LoanBase loan0 = new Loan();
        loan0.setAmount(20000L);
        loan0.setDate(201206L);
        loan0.setFrequency(Frequency.MONTHLY);
        loan0.setName("Car");
        loan0.setRate(BigDecimal.valueOf(5.35));
        loan0.setTerm(48);
        loan0.setType(LoanType.PRINCIPAL_PLUS_INTEREST);

        final List<LoanBase> loans = Arrays.asList(loan0);

        final ThemeBase theme0 = new Theme();
        theme0.setEndDate(20120331L);
        theme0.setGeneralAndAdminMonthly(85000L);
        theme0.setName("Complete DocLock Development");
        theme0.setOrder(0);
        theme0.setStartDate(20120101L);

        final ThemeBase theme1 = new Theme();
        theme1.setEndDate(20120930L);
        theme1.setGeneralAndAdminMonthly(15000L);
        theme1.setName("Develop Reseller Relationships");
        theme1.setOrder(2);
        theme1.setStartDate(20120301L);

        final ThemeBase theme2 = new Theme();
        theme2.setEndDate(20120930L);
        theme2.setGeneralAndAdminMonthly(35000L);
        theme2.setName("Sell 100 \"Pro\"Licenses");
        theme2.setOrder(1);
        theme2.setRevenueMonthly(60000L);
        theme2.setStartDate(20120201L);

        final List<ThemeBase> themes = Arrays.asList(theme0, theme1, theme2);
        Collections.sort(themes, new ThemeOrderComparator<ThemeBase>());

        final IncomeStatementHelper helper = new IncomeStatementHelper();
        helper.setAssets(assets);
        helper.setIncomeTax(incomeTax);
        helper.setLoans(loans);
        helper.setNbMonth(6 + CalculationsHelper.PRE);
        helper.setNbQuarter(4);
        helper.setNbYear(4);
        helper.setThemes(themes);

        testSummary("GetToMarketFull", helper);
    }

    /**
     * @throws Exception
     */
    @SuppressWarnings("static-method")
    @Test
    public void testSummary() throws Exception {
        testSummary("GetToMarketFull");
        testSummary("test01");
        testSummary("test02");
        testSummary("test03");
    }

    /**
     * @param helper
     * @param file
     * @throws Exception
     */
    private static void
    test(final IncomeStatementHelper helper, final File file) throws Exception {
        final IncomeStatementOut out = helper.calculate();
        IncomeStatementResource.removePrepended(out);

        final GsonBuilder gsonBuilder = new GsonBuilder();
        gsonBuilder.registerTypeAdapter(BigDecimal.class, new BigDecimalTA());
        final Gson gson = gsonBuilder.create();
        final String actual = gson.toJson(out);

        if (file.exists()) {
            final String expected = FileUtils.readFileToString(file);

            JSONAssert.assertEquals(expected, actual, true);
        } else {
            System.out.println("File not found: " + file.getAbsolutePath());
        }
    }

    /**
     * @param prefix
     * @throws Exception
     */
    private static void testDetails(final String prefix) throws Exception {
        final IncomeStatementHelper helper = toIncomeStatementHelper(prefix);
        helper.setNbMonth(96 + CalculationsHelper.PRE);
        helper.setNbQuarter(0);
        helper.setNbYear(0);

        testDetails(prefix, helper);
    }

    /**
     * @param prefix
     * @param helper
     * @throws Exception
     */
    private static void testDetails(final String prefix,
    final IncomeStatementHelper helper) throws Exception {
        final File file =
            new File(ReportIT.FOLDER + prefix
                + "-income-statement-details.json");

        test(helper, file);
    }

    /**
     * @param prefix
     * @throws Exception
     */
    private static void testSummary(final String prefix) throws Exception {
        final IncomeStatementHelper helper = toIncomeStatementHelper(prefix);
        helper.setNbMonth(6 + CalculationsHelper.PRE);
        helper.setNbQuarter(4);
        helper.setNbYear(4);

        testSummary(prefix, helper);
    }

    /**
     * @param prefix
     * @param helper
     * @throws Exception
     */
    private static void testSummary(final String prefix,
    final IncomeStatementHelper helper) throws Exception {
        final File file =
            new File(ReportIT.FOLDER + prefix
                + "-income-statement-summary.json");

        test(helper, file);
    }
}
