package com.glasseystrategy.jstratpad.model;

import org.simpleframework.xml.Default;
import org.simpleframework.xml.Element;

/**
 * Base class for the {@link Theme} entity.
 */
@Default(required = false)
public class ThemeBase extends EntityAuditable {

    /**
     */
    private static final long serialVersionUID = -718954359778134325L;

    // base

    /**
     */
    @Element(name = "title")
    private String name;

    /**
     * The start date of the theme, in the format yyyyMMdd.
     */
    private Long startDate;

    /**
     * The end date of the theme, in the format yyyyMMdd.
     */
    private Long endDate;

    /**
     */
    private Boolean mandatory;

    /**
     */
    private Boolean enhanceUniqueness;

    /**
     */
    private Boolean enhanceCustomerValue;

    /**
     */
    private String responsible;

    /**
     */
    private Integer order;

    // COGS

    /**
     */
    private Long cogsMonthly;

    /**
     */
    private Long cogsQuarterly;

    /**
     */
    private Long cogsAnnually;

    /**
     */
    private Long cogsOneTime;

    // General & Administrative

    /**
     */
    private Long generalAndAdminMonthly;

    /**
     */
    private Long generalAndAdminAnnually;

    /**
     */
    private Long generalAndAdminQuarterly;

    /**
     */
    private Long generalAndAdminOneTime;

    // Research & Development

    /**
     */
    private Long researchAndDevelopmentMonthly;

    /**
     */
    private Long researchAndDevelopmentQuarterly;

    /**
     */
    private Long researchAndDevelopmentAnnually;

    /**
     */
    private Long researchAndDevelopmentOneTime;

    // Sales & Marketing

    /**
     */
    private Long salesAndMarketingMonthly;

    /**
     */
    private Long salesAndMarketingQuarterly;

    /**
     */
    private Long salesAndMarketingAnnually;

    /**
     */
    private Long salesAndMarketingOneTime;

    // Revenues

    /**
     */
    private Long revenueMonthly;

    /**
     */
    private Long revenueQuarterly;

    /**
     */
    private Long revenueAnnually;

    /**
     */
    private Long revenueOneTime;

    /*
     * adjustments - note that these are actually decimals, but GAE doesn't
     * support decimal
     * 
     * also note there is no adjustment for a one time financial
     */

    // COGS

    /**
     */
    private Integer cogsMonthlyAdjustment;

    /**
     */
    private Integer cogsQuarterlyAdjustment;

    /**
     */
    private Integer cogsAnnuallyAdjustment;

    // General & Administrative

    /**
     */
    private Integer generalAndAdminMonthlyAdjustment;

    /**
     */
    private Integer generalAndAdminQuarterlyAdjustment;

    /**
     */
    private Integer generalAndAdminAnnuallyAdjustment;

    // Research & Development

    /**
     */
    private Integer researchAndDevelopmentMonthlyAdjustment;

    /**
     */
    private Integer researchAndDevelopmentQuarterlyAdjustment;

    /**
     */
    private Integer researchAndDevelopmentAnnuallyAdjustment;

    // Sales & Marketing

    /**
     */
    private Integer salesAndMarketingMonthlyAdjustment;

    /**
     */
    private Integer salesAndMarketingQuarterlyAdjustment;

    /**
     */
    private Integer salesAndMarketingAnnuallyAdjustment;

    // Revenues

    /**
     */
    private Integer revenueMonthlyAdjustment;

    /**
     */
    private Integer revenueQuarterlyAdjustment;

    /**
     */
    private Integer revenueAnnuallyAdjustment;

    /**
     */
    private Integer numberOfEmployeesAtThemeStart;

    /**
     */
    private Integer numberOfEmployeesAtThemeEnd;

    /*
     * how much of each expense (including COGS but not revenue) is related to
     * payroll we will not add an adjustment for these values
     */

    /**
     */
    private Integer percentCogsIsPayroll;

    /**
     */
    private Integer percentResearchAndDevelopmentIsPayroll;

    /**
     */
    private Integer percentGeneralAndAdminIsPayroll;

    /**
     */
    private Integer percentSalesAndMarketingIsPayroll;

    /**
     */
    public ThemeBase() {
        super();
    }

    /**
     * @return the name
     */
    public String getName() {
        return this.name;
    }

    /**
     * @param name the name to set
     */
    public void setName(final String name) {
        this.name = name;
    }

    /**
     * @return the startDate
     */
    public Long getStartDate() {
        return this.startDate;
    }

    /**
     * @param startDate the startDate to set
     */
    public void setStartDate(final Long startDate) {
        this.startDate = startDate;
    }

    /**
     * @return the endDate
     */
    public Long getEndDate() {
        return this.endDate;
    }

    /**
     * @param endDate the endDate to set
     */
    public void setEndDate(final Long endDate) {
        this.endDate = endDate;
    }

    /**
     * @return the mandatory
     */
    public Boolean getMandatory() {
        return this.mandatory;
    }

    /**
     * @param mandatory the mandatory to set
     */
    public void setMandatory(final Boolean mandatory) {
        this.mandatory = mandatory;
    }

    /**
     * @return the enhanceUniqueness
     */
    public Boolean getEnhanceUniqueness() {
        return this.enhanceUniqueness;
    }

    /**
     * @param enhanceUniqueness the enhanceUniqueness to set
     */
    public void setEnhanceUniqueness(final Boolean enhanceUniqueness) {
        this.enhanceUniqueness = enhanceUniqueness;
    }

    /**
     * @return the enhanceCustomerValue
     */
    public Boolean getEnhanceCustomerValue() {
        return this.enhanceCustomerValue;
    }

    /**
     * @param enhanceCustomerValue the enhanceCustomerValue to set
     */
    public void setEnhanceCustomerValue(final Boolean enhanceCustomerValue) {
        this.enhanceCustomerValue = enhanceCustomerValue;
    }

    /**
     * @return the responsible
     */
    public String getResponsible() {
        return this.responsible;
    }

    /**
     * @param responsible the responsible to set
     */
    public void setResponsible(final String responsible) {
        this.responsible = responsible;
    }

    /**
     * @return the order
     */
    public Integer getOrder() {
        return this.order;
    }

    /**
     * @param order the order to set
     */
    public void setOrder(final Integer order) {
        this.order = order;
    }

    /**
     * @return the cogsMonthly
     */
    public Long getCogsMonthly() {
        return this.cogsMonthly;
    }

    /**
     * @param cogsMonthly the cogsMonthly to set
     */
    public void setCogsMonthly(final Long cogsMonthly) {
        this.cogsMonthly = cogsMonthly;
    }

    /**
     * @return the cogsQuarterly
     */
    public Long getCogsQuarterly() {
        return this.cogsQuarterly;
    }

    /**
     * @param cogsQuarterly the cogsQuarterly to set
     */
    public void setCogsQuarterly(final Long cogsQuarterly) {
        this.cogsQuarterly = cogsQuarterly;
    }

    /**
     * @return the cogsAnnually
     */
    public Long getCogsAnnually() {
        return this.cogsAnnually;
    }

    /**
     * @param cogsAnnually the cogsAnnually to set
     */
    public void setCogsAnnually(final Long cogsAnnually) {
        this.cogsAnnually = cogsAnnually;
    }

    /**
     * @return the cogsOneTime
     */
    public Long getCogsOneTime() {
        return this.cogsOneTime;
    }

    /**
     * @param cogsOneTime the cogsOneTime to set
     */
    public void setCogsOneTime(final Long cogsOneTime) {
        this.cogsOneTime = cogsOneTime;
    }

    /**
     * @return the generalAndAdminMonthly
     */
    public Long getGeneralAndAdminMonthly() {
        return this.generalAndAdminMonthly;
    }

    /**
     * @param generalAndAdminMonthly the generalAndAdminMonthly to set
     */
    public void setGeneralAndAdminMonthly(final Long generalAndAdminMonthly) {
        this.generalAndAdminMonthly = generalAndAdminMonthly;
    }

    /**
     * @return the generalAndAdminAnnually
     */
    public Long getGeneralAndAdminAnnually() {
        return this.generalAndAdminAnnually;
    }

    /**
     * @param generalAndAdminAnnually the generalAndAdminAnnually to set
     */
    public void setGeneralAndAdminAnnually(final Long generalAndAdminAnnually) {
        this.generalAndAdminAnnually = generalAndAdminAnnually;
    }

    /**
     * @return the generalAndAdminQuarterly
     */
    public Long getGeneralAndAdminQuarterly() {
        return this.generalAndAdminQuarterly;
    }

    /**
     * @param generalAndAdminQuarterly the generalAndAdminQuarterly to set
     */
    public void
    setGeneralAndAdminQuarterly(final Long generalAndAdminQuarterly) {
        this.generalAndAdminQuarterly = generalAndAdminQuarterly;
    }

    /**
     * @return the generalAndAdminOneTime
     */
    public Long getGeneralAndAdminOneTime() {
        return this.generalAndAdminOneTime;
    }

    /**
     * @param generalAndAdminOneTime the generalAndAdminOneTime to set
     */
    public void setGeneralAndAdminOneTime(final Long generalAndAdminOneTime) {
        this.generalAndAdminOneTime = generalAndAdminOneTime;
    }

    /**
     * @return the researchAndDevelopmentMonthly
     */
    public Long getResearchAndDevelopmentMonthly() {
        return this.researchAndDevelopmentMonthly;
    }

    /**
     * @param researchAndDevelopmentMonthly the researchAndDevelopmentMonthly to
     * set
     */
    public void setResearchAndDevelopmentMonthly(
    final Long researchAndDevelopmentMonthly) {
        this.researchAndDevelopmentMonthly = researchAndDevelopmentMonthly;
    }

    /**
     * @return the researchAndDevelopmentQuarterly
     */
    public Long getResearchAndDevelopmentQuarterly() {
        return this.researchAndDevelopmentQuarterly;
    }

    /**
     * @param researchAndDevelopmentQuarterly the
     * researchAndDevelopmentQuarterly to set
     */
    public void setResearchAndDevelopmentQuarterly(
    final Long researchAndDevelopmentQuarterly) {
        this.researchAndDevelopmentQuarterly = researchAndDevelopmentQuarterly;
    }

    /**
     * @return the researchAndDevelopmentAnnually
     */
    public Long getResearchAndDevelopmentAnnually() {
        return this.researchAndDevelopmentAnnually;
    }

    /**
     * @param researchAndDevelopmentAnnually the researchAndDevelopmentAnnually
     * to set
     */
    public void setResearchAndDevelopmentAnnually(
    final Long researchAndDevelopmentAnnually) {
        this.researchAndDevelopmentAnnually = researchAndDevelopmentAnnually;
    }

    /**
     * @return the researchAndDevelopmentOneTime
     */
    public Long getResearchAndDevelopmentOneTime() {
        return this.researchAndDevelopmentOneTime;
    }

    /**
     * @param researchAndDevelopmentOneTime the researchAndDevelopmentOneTime to
     * set
     */
    public void setResearchAndDevelopmentOneTime(
    final Long researchAndDevelopmentOneTime) {
        this.researchAndDevelopmentOneTime = researchAndDevelopmentOneTime;
    }

    /**
     * @return the salesAndMarketingMonthly
     */
    public Long getSalesAndMarketingMonthly() {
        return this.salesAndMarketingMonthly;
    }

    /**
     * @param salesAndMarketingMonthly the salesAndMarketingMonthly to set
     */
    public void
    setSalesAndMarketingMonthly(final Long salesAndMarketingMonthly) {
        this.salesAndMarketingMonthly = salesAndMarketingMonthly;
    }

    /**
     * @return the salesAndMarketingQuarterly
     */
    public Long getSalesAndMarketingQuarterly() {
        return this.salesAndMarketingQuarterly;
    }

    /**
     * @param salesAndMarketingQuarterly the salesAndMarketingQuarterly to set
     */
    public void setSalesAndMarketingQuarterly(
    final Long salesAndMarketingQuarterly) {
        this.salesAndMarketingQuarterly = salesAndMarketingQuarterly;
    }

    /**
     * @return the salesAndMarketingAnnually
     */
    public Long getSalesAndMarketingAnnually() {
        return this.salesAndMarketingAnnually;
    }

    /**
     * @param salesAndMarketingAnnually the salesAndMarketingAnnually to set
     */
    public void setSalesAndMarketingAnnually(
    final Long salesAndMarketingAnnually) {
        this.salesAndMarketingAnnually = salesAndMarketingAnnually;
    }

    /**
     * @return the salesAndMarketingOneTime
     */
    public Long getSalesAndMarketingOneTime() {
        return this.salesAndMarketingOneTime;
    }

    /**
     * @param salesAndMarketingOneTime the salesAndMarketingOneTime to set
     */
    public void
    setSalesAndMarketingOneTime(final Long salesAndMarketingOneTime) {
        this.salesAndMarketingOneTime = salesAndMarketingOneTime;
    }

    /**
     * @return the revenueMonthly
     */
    public Long getRevenueMonthly() {
        return this.revenueMonthly;
    }

    /**
     * @param revenueMonthly the revenueMonthly to set
     */
    public void setRevenueMonthly(final Long revenueMonthly) {
        this.revenueMonthly = revenueMonthly;
    }

    /**
     * @return the revenueQuarterly
     */
    public Long getRevenueQuarterly() {
        return this.revenueQuarterly;
    }

    /**
     * @param revenueQuarterly the revenueQuarterly to set
     */
    public void setRevenueQuarterly(final Long revenueQuarterly) {
        this.revenueQuarterly = revenueQuarterly;
    }

    /**
     * @return the revenueAnnually
     */
    public Long getRevenueAnnually() {
        return this.revenueAnnually;
    }

    /**
     * @param revenueAnnually the revenueAnnually to set
     */
    public void setRevenueAnnually(final Long revenueAnnually) {
        this.revenueAnnually = revenueAnnually;
    }

    /**
     * @return the revenueOneTime
     */
    public Long getRevenueOneTime() {
        return this.revenueOneTime;
    }

    /**
     * @param revenueOneTime the revenueOneTime to set
     */
    public void setRevenueOneTime(final Long revenueOneTime) {
        this.revenueOneTime = revenueOneTime;
    }

    /**
     * @return the cogsMonthlyAdjustment
     */
    public Integer getCogsMonthlyAdjustment() {
        return this.cogsMonthlyAdjustment;
    }

    /**
     * @param cogsMonthlyAdjustment the cogsMonthlyAdjustment to set
     */
    public void setCogsMonthlyAdjustment(final Integer cogsMonthlyAdjustment) {
        this.cogsMonthlyAdjustment = cogsMonthlyAdjustment;
    }

    /**
     * @return the cogsQuarterlyAdjustment
     */
    public Integer getCogsQuarterlyAdjustment() {
        return this.cogsQuarterlyAdjustment;
    }

    /**
     * @param cogsQuarterlyAdjustment the cogsQuarterlyAdjustment to set
     */
    public void
    setCogsQuarterlyAdjustment(final Integer cogsQuarterlyAdjustment) {
        this.cogsQuarterlyAdjustment = cogsQuarterlyAdjustment;
    }

    /**
     * @return the cogsAnnuallyAdjustment
     */
    public Integer getCogsAnnuallyAdjustment() {
        return this.cogsAnnuallyAdjustment;
    }

    /**
     * @param cogsAnnuallyAdjustment the cogsAnnuallyAdjustment to set
     */
    public void setCogsAnnuallyAdjustment(final Integer cogsAnnuallyAdjustment) {
        this.cogsAnnuallyAdjustment = cogsAnnuallyAdjustment;
    }

    /**
     * @return the generalAndAdminMonthlyAdjustment
     */
    public Integer getGeneralAndAdminMonthlyAdjustment() {
        return this.generalAndAdminMonthlyAdjustment;
    }

    /**
     * @param generalAndAdminMonthlyAdjustment the
     * generalAndAdminMonthlyAdjustment to set
     */
    public void setGeneralAndAdminMonthlyAdjustment(
    final Integer generalAndAdminMonthlyAdjustment) {
        this.generalAndAdminMonthlyAdjustment =
            generalAndAdminMonthlyAdjustment;
    }

    /**
     * @return the generalAndAdminQuarterlyAdjustment
     */
    public Integer getGeneralAndAdminQuarterlyAdjustment() {
        return this.generalAndAdminQuarterlyAdjustment;
    }

    /**
     * @param generalAndAdminQuarterlyAdjustment the
     * generalAndAdminQuarterlyAdjustment to set
     */
    public void setGeneralAndAdminQuarterlyAdjustment(
    final Integer generalAndAdminQuarterlyAdjustment) {
        this.generalAndAdminQuarterlyAdjustment =
            generalAndAdminQuarterlyAdjustment;
    }

    /**
     * @return the generalAndAdminAnnuallyAdjustment
     */
    public Integer getGeneralAndAdminAnnuallyAdjustment() {
        return this.generalAndAdminAnnuallyAdjustment;
    }

    /**
     * @param generalAndAdminAnnuallyAdjustment the
     * generalAndAdminAnnuallyAdjustment to set
     */
    public void setGeneralAndAdminAnnuallyAdjustment(
    final Integer generalAndAdminAnnuallyAdjustment) {
        this.generalAndAdminAnnuallyAdjustment =
            generalAndAdminAnnuallyAdjustment;
    }

    /**
     * @return the researchAndDevelopmentMonthlyAdjustment
     */
    public Integer getResearchAndDevelopmentMonthlyAdjustment() {
        return this.researchAndDevelopmentMonthlyAdjustment;
    }

    /**
     * @param researchAndDevelopmentMonthlyAdjustment the
     * researchAndDevelopmentMonthlyAdjustment to set
     */
    public void setResearchAndDevelopmentMonthlyAdjustment(
    final Integer researchAndDevelopmentMonthlyAdjustment) {
        this.researchAndDevelopmentMonthlyAdjustment =
            researchAndDevelopmentMonthlyAdjustment;
    }

    /**
     * @return the researchAndDevelopmentQuarterlyAdjustment
     */
    public Integer getResearchAndDevelopmentQuarterlyAdjustment() {
        return this.researchAndDevelopmentQuarterlyAdjustment;
    }

    /**
     * @param researchAndDevelopmentQuarterlyAdjustment the
     * researchAndDevelopmentQuarterlyAdjustment to set
     */
    public void setResearchAndDevelopmentQuarterlyAdjustment(
    final Integer researchAndDevelopmentQuarterlyAdjustment) {
        this.researchAndDevelopmentQuarterlyAdjustment =
            researchAndDevelopmentQuarterlyAdjustment;
    }

    /**
     * @return the researchAndDevelopmentAnnuallyAdjustment
     */
    public Integer getResearchAndDevelopmentAnnuallyAdjustment() {
        return this.researchAndDevelopmentAnnuallyAdjustment;
    }

    /**
     * @param researchAndDevelopmentAnnuallyAdjustment the
     * researchAndDevelopmentAnnuallyAdjustment to set
     */
    public void setResearchAndDevelopmentAnnuallyAdjustment(
    final Integer researchAndDevelopmentAnnuallyAdjustment) {
        this.researchAndDevelopmentAnnuallyAdjustment =
            researchAndDevelopmentAnnuallyAdjustment;
    }

    /**
     * @return the salesAndMarketingMonthlyAdjustment
     */
    public Integer getSalesAndMarketingMonthlyAdjustment() {
        return this.salesAndMarketingMonthlyAdjustment;
    }

    /**
     * @param salesAndMarketingMonthlyAdjustment the
     * salesAndMarketingMonthlyAdjustment to set
     */
    public void setSalesAndMarketingMonthlyAdjustment(
    final Integer salesAndMarketingMonthlyAdjustment) {
        this.salesAndMarketingMonthlyAdjustment =
            salesAndMarketingMonthlyAdjustment;
    }

    /**
     * @return the salesAndMarketingQuarterlyAdjustment
     */
    public Integer getSalesAndMarketingQuarterlyAdjustment() {
        return this.salesAndMarketingQuarterlyAdjustment;
    }

    /**
     * @param salesAndMarketingQuarterlyAdjustment the
     * salesAndMarketingQuarterlyAdjustment to set
     */
    public void setSalesAndMarketingQuarterlyAdjustment(
    final Integer salesAndMarketingQuarterlyAdjustment) {
        this.salesAndMarketingQuarterlyAdjustment =
            salesAndMarketingQuarterlyAdjustment;
    }

    /**
     * @return the salesAndMarketingAnnuallyAdjustment
     */
    public Integer getSalesAndMarketingAnnuallyAdjustment() {
        return this.salesAndMarketingAnnuallyAdjustment;
    }

    /**
     * @param salesAndMarketingAnnuallyAdjustment the
     * salesAndMarketingAnnuallyAdjustment to set
     */
    public void setSalesAndMarketingAnnuallyAdjustment(
    final Integer salesAndMarketingAnnuallyAdjustment) {
        this.salesAndMarketingAnnuallyAdjustment =
            salesAndMarketingAnnuallyAdjustment;
    }

    /**
     * @return the revenueMonthlyAdjustment
     */
    public Integer getRevenueMonthlyAdjustment() {
        return this.revenueMonthlyAdjustment;
    }

    /**
     * @param revenueMonthlyAdjustment the revenueMonthlyAdjustment to set
     */
    public void setRevenueMonthlyAdjustment(
    final Integer revenueMonthlyAdjustment) {
        this.revenueMonthlyAdjustment = revenueMonthlyAdjustment;
    }

    /**
     * @return the revenueQuarterlyAdjustment
     */
    public Integer getRevenueQuarterlyAdjustment() {
        return this.revenueQuarterlyAdjustment;
    }

    /**
     * @param revenueQuarterlyAdjustment the revenueQuarterlyAdjustment to set
     */
    public void setRevenueQuarterlyAdjustment(
    final Integer revenueQuarterlyAdjustment) {
        this.revenueQuarterlyAdjustment = revenueQuarterlyAdjustment;
    }

    /**
     * @return the revenueAnnuallyAdjustment
     */
    public Integer getRevenueAnnuallyAdjustment() {
        return this.revenueAnnuallyAdjustment;
    }

    /**
     * @param revenueAnnuallyAdjustment the revenueAnnuallyAdjustment to set
     */
    public void setRevenueAnnuallyAdjustment(
    final Integer revenueAnnuallyAdjustment) {
        this.revenueAnnuallyAdjustment = revenueAnnuallyAdjustment;
    }

    /**
     * @return the numberOfEmployeesAtThemeStart
     */
    public Integer getNumberOfEmployeesAtThemeStart() {
        return this.numberOfEmployeesAtThemeStart;
    }

    /**
     * @param numberOfEmployeesAtThemeStart the numberOfEmployeesAtThemeStart to
     * set
     */
    public void setNumberOfEmployeesAtThemeStart(
    final Integer numberOfEmployeesAtThemeStart) {
        this.numberOfEmployeesAtThemeStart = numberOfEmployeesAtThemeStart;
    }

    /**
     * @return the numberOfEmployeesAtThemeEnd
     */
    public Integer getNumberOfEmployeesAtThemeEnd() {
        return this.numberOfEmployeesAtThemeEnd;
    }

    /**
     * @param numberOfEmployeesAtThemeEnd the numberOfEmployeesAtThemeEnd to set
     */
    public void setNumberOfEmployeesAtThemeEnd(
    final Integer numberOfEmployeesAtThemeEnd) {
        this.numberOfEmployeesAtThemeEnd = numberOfEmployeesAtThemeEnd;
    }

    /**
     * @return the percentCogsIsPayroll
     */
    public Integer getPercentCogsIsPayroll() {
        return this.percentCogsIsPayroll;
    }

    /**
     * @param percentCogsIsPayroll the percentCogsIsPayroll to set
     */
    public void setPercentCogsIsPayroll(final Integer percentCogsIsPayroll) {
        this.percentCogsIsPayroll = percentCogsIsPayroll;
    }

    /**
     * @return the percentResearchAndDevelopmentIsPayroll
     */
    public Integer getPercentResearchAndDevelopmentIsPayroll() {
        return this.percentResearchAndDevelopmentIsPayroll;
    }

    /**
     * @param percentResearchAndDevelopmentIsPayroll the
     * percentResearchAndDevelopmentIsPayroll to set
     */
    public void setPercentResearchAndDevelopmentIsPayroll(
    final Integer percentResearchAndDevelopmentIsPayroll) {
        this.percentResearchAndDevelopmentIsPayroll =
            percentResearchAndDevelopmentIsPayroll;
    }

    /**
     * @return the percentGeneralAndAdminIsPayroll
     */
    public Integer getPercentGeneralAndAdminIsPayroll() {
        return this.percentGeneralAndAdminIsPayroll;
    }

    /**
     * @param percentGeneralAndAdminIsPayroll the
     * percentGeneralAndAdminIsPayroll to set
     */
    public void setPercentGeneralAndAdminIsPayroll(
    final Integer percentGeneralAndAdminIsPayroll) {
        this.percentGeneralAndAdminIsPayroll = percentGeneralAndAdminIsPayroll;
    }

    /**
     * @return the percentSalesAndMarketingIsPayroll
     */
    public Integer getPercentSalesAndMarketingIsPayroll() {
        return this.percentSalesAndMarketingIsPayroll;
    }

    /**
     * @param percentSalesAndMarketingIsPayroll the
     * percentSalesAndMarketingIsPayroll to set
     */
    public void setPercentSalesAndMarketingIsPayroll(
    final Integer percentSalesAndMarketingIsPayroll) {
        this.percentSalesAndMarketingIsPayroll =
            percentSalesAndMarketingIsPayroll;
    }
}
