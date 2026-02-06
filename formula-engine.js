// tax-engine.js - FIXED TAX CALCULATIONS
// This class implements the complete tax calculation engine that replicates Excel formulas
// It handles all revenue, expense, exemption, and tax calculations with exact Excel logic

class TaxEngine {
  constructor() {
    this.data = {}; // Main data store for all cell values (C1, D1, E1, etc.)
    this.initializeAllData(); // Initialize all cells with default values
    this.psebRegistered = true; // Default PSEB registration status is "Yes"
  }

  // Initialize all data cells with default values (0 or appropriate defaults)
  initializeAllData() {
    // Initialize ALL cells from row 1 to 160 for columns C, D, and E
    for (let i = 1; i <= 160; i++) {
      this.data[`C${i}`] = 0; // Column C: TOTAL AMOUNTS (User input fields)
      this.data[`D${i}`] = 0; // Column D: EXEMPT/FIXED TAX (Calculated automatically)
      this.data[`E${i}`] = 0; // Column E: NORMAL TAX (Calculated automatically)
    }

    // Set special default values that don't change during calculations
    this.data["C7"] = 1; // Row 7 Column C is always 1 as per Excel template
    this.data["D6"] = "Yes"; // Default PSEB registration status is "Yes"

    // Initialize specific cells to 0 that are marked as "put zero by default" or "not used"
    this.data["C138"] = 0; // WWF - Worker's Welfare Fund (not used)
    this.data["C139"] = 0; // Tax on High Earners (marked as "not used")
    this.data["C142"] = 0; // Difference of Minimum Tax (put zero by default)
    this.data["C143"] = 0; // Tax on Deemed Income (marked as "not used")
    this.data["C144"] = 0; // Difference of Alternate Tax (put zero by default)
    this.data["C145"] = 0; // Difference of Minimum Tax Chargeable
    this.data["C146"] = 0; // Tax Reduction
    this.data["C150"] = 0; // Other Credits (put zero by default)
    this.data["C151"] = 0; // Tax Credit u/s 103 (marked as "not used")

    // Initialize all D column values to 0 (will be calculated during compute)
    for (let i = 1; i <= 160; i++) {
      this.data[`D${i}`] = 0;
    }
  }

  // Get value from a specific cell (e.g., 'C4', 'D5', 'E136')
  getValue(cell) {
    return this.data[cell] || 0; // Return 0 if cell doesn't exist or is undefined
  }

  // Set value for a specific cell and trigger recalculation of all dependent formulas
  setValue(cell, value) {
    if (cell === "D6") {
      // Special handling for PSEB registration dropdown in row 6
      this.data[cell] = value; // Store the string value ("Yes" or "No")
      this.psebRegistered = value === "Yes"; // Update PSEB registration status
    } else {
      const numericValue = parseFloat(value) || 0; // Convert to number, default to 0 if invalid
      this.data[cell] = numericValue; // Store the numeric value
    }
    this.calculateAll(); // Recalculate all dependent formulas when any value changes
  }

  // Helper function to sum a range of cells in a specific column
  sumRange(column, start, end) {
    let sum = 0;
    for (let i = start; i <= end; i++) {
      sum += this.getValue(`${column}${i}`); // Sum values from start to end inclusive
    }
    return sum;
  }

  // Main calculation function - executes all formulas in proper dependency order
  calculateAll() {
    // 1. Calculate export ratio first (D7 = +C5/C3) - Core driver of all proportional exemptions
    const c3 = this.getValue("C3"); // Total Revenue
    const c5 = this.getValue("C5"); // Export Sales
    if (c3 > 0) {
      this.data["D7"] = c5 / c3; // Export Ratio = Export Sales / Total Revenue
    } else {
      this.data["D7"] = 0; // Default to 0 if no revenue
    }
    this.data["E7"] = this.getValue("C7") - this.getValue("D7"); // E7 = +C7-D7 (Domestic ratio)

    // 2. REVENUE SECTION CALCULATIONS
    // C3 = SUM(C4:C5) - Gross Revenue = Domestic Sales + Export Sales
    this.data["C3"] = this.getValue("C4") + this.getValue("C5");
    // D3 = SUM(D4:D5) - Total Exempt Revenue
    this.data["D3"] = this.getValue("D4") + this.getValue("D5");
    // E3 = SUM(E4:E5) - Total Taxable Revenue
    this.data["E3"] = this.getValue("E4") + this.getValue("E5");

    // Row 4: Domestic Sales
    this.data["D4"] = 0; // D4 = 0 (Domestic sales have no exemption)
    this.data["E4"] = this.getValue("C4") - this.getValue("D4"); // E4 = +C4-D4 (Taxable domestic sales)

    // Row 5: Export Sales with PSEB registration logic
    this.data["D5"] = this.psebRegistered ? this.getValue("C5") : 0; // D5 = IF(D6="Yes",C5,0)
    this.data["E5"] = this.getValue("C5") - this.getValue("D5"); // E5 = +C5-D5 (Taxable export sales)

    // 3. SELLING EXPENSES CALCULATIONS
    // C8 = SUM(C9:C11) - Total Selling Expenses
    this.data["C8"] = this.sumRange("C", 9, 11);
    // D8 = SUM(D9:D11) - Total Exempt Selling Expenses
    this.data["D8"] = this.sumRange("D", 9, 11);
    // E8 = SUM(E9:E11) - Total Taxable Selling Expenses
    this.data["E8"] = this.sumRange("E", 9, 11);

    // Row 9: Domestic Commission
    this.data["D9"] = 0; // D9 = 0 (Domestic commission not exempt)
    this.data["E9"] = this.getValue("C9") - this.getValue("D9"); // E9 = +C9-D9

    // Row 10: Foreign Commission
    this.data["D10"] = this.getValue("C10"); // D10 = +C10 (100% exempt)
    this.data["E10"] = this.getValue("C10") - this.getValue("D10"); // E10 = +C10-D10

    // Row 11: Rebate/Duty Drawbacks with proportional exemption
    this.data["D11"] = this.getValue("C11") * this.getValue("D7"); // D11 = +C11*D7
    this.data["E11"] = this.getValue("C11") - this.getValue("D11"); // E11 = +C11-D11

    // 4. NET REVENUE CALCULATION
    // C13 = C3-C8 - Net Revenue Amount
    this.data["C13"] = this.getValue("C3") - this.getValue("C8");
    // E13 = +E3-E8 - Net Taxable Revenue
    this.data["E13"] = this.getValue("E3") - this.getValue("E8");

    // 5. COST OF SALES CALCULATIONS
    // C15 = SUM(C17:C25) - Total Cost of Sales
    this.data["C15"] = this.sumRange("C", 17, 25);
    // D15 = SUM(D17:D25) - Total Exempt Cost of Sales
    this.data["D15"] = this.sumRange("D", 17, 25);
    // E15 = SUM(E17:E25) - Total Taxable Cost of Sales
    this.data["E15"] = this.sumRange("E", 17, 25);

    // Apply proportional exemption to direct expenses (rows 17-25)
    for (let i = 17; i <= 25; i++) {
      this.data[`D${i}`] = this.getValue(`C${i}`) * this.getValue("D7"); // D{i} = +C{i}*$D$7
      this.data[`E${i}`] = this.getValue(`C${i}`) - this.getValue(`D${i}`); // E{i} = +C{i}-D{i}
    }

    // 6. GROSS PROFIT CALCULATION
    // C26 = +C13-C15 - Gross Profit Amount
    this.data["C26"] = this.getValue("C13") - this.getValue("C15");
    // E26 = +E13-E15 - Taxable Gross Profit
    this.data["E26"] = this.getValue("E13") - this.getValue("E15");

    // 7. INDIRECT EXPENSES CALCULATIONS
    // C28 = SUM(C29:C54) - Total Indirect Expenses
    this.data["C28"] = this.sumRange("C", 29, 54);
    // E28 = SUM(E29:E54) - Total Taxable Indirect Expenses
    this.data["E28"] = this.sumRange("E", 29, 54);

    // Apply proportional exemption to indirect expenses (rows 29-54)
    for (let i = 29; i <= 54; i++) {
      this.data[`D${i}`] = this.getValue(`C${i}`) * this.getValue("D7"); // D{i} = +C{i}*$D$7
      this.data[`E${i}`] = this.getValue(`C${i}`) - this.getValue(`D${i}`); // E{i} = +C{i}-D{i}
    }

    // 8. OTHER REVENUES CALCULATIONS
    // C56 = SUM(C57:C65) - Total Other Revenues
    this.data["C56"] = this.sumRange("C", 57, 65);
    // E56 = SUM(E57:E65) - Total Taxable Other Revenues
    this.data["E56"] = this.sumRange("E", 57, 65);

    // Apply proportional exemption to other revenues (rows 57-65)
    for (let i = 57; i <= 65; i++) {
      this.data[`D${i}`] = this.getValue(`C${i}`) * this.getValue("D7"); // D{i} = +C{i}*$D$7
      this.data[`E${i}`] = this.getValue(`C${i}`) - this.getValue(`D${i}`); // E{i} = +C{i}-D{i}
    }

    // 9. ACCOUNTING PROFIT CALCULATION
    // C66 = +C26-C28+C56 - Accounting Profit Amount
    this.data["C66"] =
      this.getValue("C26") - this.getValue("C28") + this.getValue("C56");
    // E66 = +E26-E28+E56 - Taxable Accounting Profit
    this.data["E66"] =
      this.getValue("E26") - this.getValue("E28") + this.getValue("E56");

    // 10. INADMISSIBLE DEDUCTIONS CALCULATIONS
    // C68 = SUM(C69:C107) - Total Inadmissible Deductions
    this.data["C68"] = this.sumRange("C", 69, 107);
    // E68 = SUM(E69:E107) - Total Taxable Inadmissible Deductions
    this.data["E68"] = this.sumRange("E", 69, 107);

    // Apply proportional exemption to inadmissible deductions (rows 69-107)
    for (let i = 69; i <= 107; i++) {
      this.data[`D${i}`] = this.getValue(`C${i}`) * this.getValue("D7"); // D{i} = +C{i}*$D$7
      this.data[`E${i}`] = this.getValue(`C${i}`) - this.getValue(`D${i}`); // E{i} = +C{i}-D{i}
    }

    // 11. ADMISSIBLE DEDUCTIONS CALCULATIONS
    // C109 = SUM(C110:C114) - Total Admissible Deductions
    this.data["C109"] = this.sumRange("C", 110, 114);

    // Apply proportional exemption to admissible deductions (rows 110-114)
    for (let i = 110; i <= 114; i++) {
      this.data[`D${i}`] = this.getValue(`C${i}`) * this.getValue("D7"); // D{i} = +C{i}*$D$7
      this.data[`E${i}`] = this.getValue(`C${i}`) - this.getValue(`D${i}`); // E{i} = +C{i}-D{i}
    }
    // E109 = SUM(E110:E114) - Total Taxable Admissible Deductions
    this.data["E109"] = this.sumRange("E", 110, 114);

    // 12. INCOME BEFORE DEPRECIATION CALCULATION
    // C116 = +C66+C68-C109 - Income Before Depreciation Amount
    this.data["C116"] =
      this.getValue("C66") + this.getValue("C68") - this.getValue("C109");
    // E116 = +E66+E68-E109 - Taxable Income Before Depreciation
    this.data["E116"] =
      this.getValue("E66") + this.getValue("E68") - this.getValue("E109");

    // 13. TAX DEPRECIATION CALCULATIONS
    // C118 = SUM(C119:C121) - Total Tax Depreciation
    this.data["C118"] = this.sumRange("C", 119, 121);

    // Apply proportional exemption to tax depreciation items (rows 119-121)
    for (let i = 119; i <= 121; i++) {
      this.data[`D${i}`] = this.getValue(`C${i}`) * this.getValue("D7"); // D{i} = +C{i}*$D$7
      this.data[`E${i}`] = this.getValue(`C${i}`) - this.getValue(`D${i}`); // E{i} = +C{i}-D{i}
    }
    // E118 = SUM(E119:E121) - Total Taxable Tax Depreciation
    this.data["E118"] = this.sumRange("E", 119, 121);

    // 14. BUSINESS INCOME CALCULATION
    // C123 = +C116-C118 - Business Income Amount
    this.data["C123"] = this.getValue("C116") - this.getValue("C118");
    // E123 = +E116-E118 - Taxable Business Income
    this.data["E123"] = this.getValue("E116") - this.getValue("E118");

    // 15. TOTAL INCOME CALCULATION (sum of rows 123-128)
    // C129 = SUM(C123:C128) - Total Income Amount
    this.data["C129"] = this.sumRange("C", 123, 128);
    // E129 = SUM(E123:E128) - Total Taxable Income
    this.data["E129"] = this.sumRange("E", 123, 128);

    // 16. DEDUCTIBLE ALLOWANCES CALCULATIONS
    // C131 = SUM(C132:C133) - Total Deductible Allowances
    this.data["C131"] = this.getValue("C132") + this.getValue("C133");
    // E131 = SUM(E132:E133) - Total Taxable Deductible Allowances
    this.data["E131"] = this.getValue("E132") + this.getValue("E133");

    // Rows 132-133: Special handling for allowances
    // E132 = C132-D132 - Taxable Workers Welfare Fund
    this.data["E132"] = this.getValue("C132") - this.getValue("D132");
    // E133 = C133-D133 - Taxable Workers Profit Participation Fund
    this.data["E133"] = this.getValue("C133") - this.getValue("D133");

    // 17. TAXABLE INCOME CALCULATION
    // C135 = +C129-C131 - Taxable Income Amount
    this.data["C135"] = this.getValue("C129") - this.getValue("C131");
    // E135 = +E129-E131 - Final Taxable Income
    this.data["E135"] = this.getValue("E129") - this.getValue("E131");

    // ========== TAX CALCULATIONS SECTION ==========
    // IMPORTANT: Based on Excel structure, display rows are:
    // Row 137 (Display): NORMAL INCOME TAX @ 29% = +E135*0.29
    // Row 138 (Display): FINAL/FIXED/MINIMUM/AVERAGE/RELEVANT/REDUCED INCOME TAX = +D5*0.025

    // E137 = +E135*0.29 (Normal Income Tax @ 29%) - Set negative to 0
    const normalTaxCalc = this.getValue("E135") * 0.29;
    this.data["E137"] = normalTaxCalc < 0 ? 0 : normalTaxCalc;

    // E138 = +D5*0.025 (Final/Fixed/Reduced Income Tax @ 2.5%) - This is calculation row 137
    this.data["E138"] = this.getValue("D5") * 0.025;

    // E139 = WWF (Worker's Welfare Fund) - set to 0 as per "not used"
    this.data["E139"] = 0;

    // E139 = Tax on High Earners - set to 0 as per "not used"
    this.data["E139"] = 0;

    // E140 = +C66*0.17 (Alternate Corporate Tax @ 17%) - Set negative to 0
    const alternateTaxCalc = this.getValue("C66") * 0.17;
    this.data["E140"] = alternateTaxCalc < 0 ? 0 : alternateTaxCalc;

    // E141 = +E3*0.0125 (Minimum Tax @ 1.25%) - Set negative to 0
    const minimumTaxCalc = this.getValue("E3") * 0.0125;
    this.data["E141"] = minimumTaxCalc < 0 ? 0 : minimumTaxCalc;

    // E142 = IF((E141>E137),(E141-E137),0) - Difference of Minimum Tax (put zero by default)
    this.data["E142"] =
      this.getValue("E141") > this.getValue("E137")
        ? this.getValue("E141") - this.getValue("E137")
        : 0;

    // E143 = Tax on Deemed Income - set to 0 as per "not used"
    this.data["E143"] = 0;

    // E144 = IF(E140>E137,(E140-E137),0) - Difference of Alternate Tax (put zero by default)
    this.data["E144"] =
      this.getValue("E140") > this.getValue("E137")
        ? this.getValue("E140") - this.getValue("E137")
        : 0;

    // E145 = Difference of Minimum Tax Chargeable - set to 0
    this.data["E145"] = 0;

    // E146 = Tax Reduction - set to 0
    this.data["E146"] = 0;

    // ========== TAX CREDITS CALCULATIONS ==========

    // E149 = MIN((E136/E135*C149),(0.2*E135)) - Charitable Donations Credit
    const e136 = this.getValue("E136");
    const e135 = this.getValue("E135");
    const c149 = this.getValue("C149");
    if (e135 > 0) {
      const credit1 = (e136 / e135) * c149; // Proportional credit based on tax rate
      const credit2 = 0.2 * e135; // Maximum credit of 20% of taxable income
      this.data["E149"] = Math.min(credit1, credit2); // Take the lower of the two
    } else {
      this.data["E149"] = 0; // No credit if no taxable income
    }

    // E150 = +C150 (Other Credits - put zero by default)
    this.data["E150"] = this.getValue("C150");

    // E151 = Tax Credit u/s 103 - set to 0 as per "not used"
    this.data["E151"] = 0;

    // E148 = SUM(E149:E151) - Total Tax Credits
    this.data["E148"] =
      this.data["E149"] + this.data["E150"] + this.data["E151"];

    // ========== TAX CHARGEABLE CALCULATION ==========
    // E136 = (MAX(E137,E140,E141)+E138+E139)+E142+E143+E144+E145+E146-E148
    // Note: In the MAX function, we use E137 (Final/Reduced Tax), E140 (Alternate Tax), E141 (Minimum Tax)
    const maxTax = Math.max(
      this.getValue("E137"), // Final/Reduced Tax @ 2.5%
      this.getValue("E140"), // Alternate Tax @ 17%
      this.getValue("E141"), // Minimum Tax @ 1.25%
    );

    const baseTax = maxTax + this.getValue("E138") + this.getValue("E139");
    const withDifferences =
      baseTax +
      this.getValue("E142") +
      this.getValue("E143") +
      this.getValue("E144") +
      this.getValue("E145") +
      this.getValue("E146");

    this.data["E136"] = Math.max(0, withDifferences - this.getValue("E148"));

   // In the calculateAll() method, after the ADMITTED INCOME TAX calculation:

// ========== TAX PAYMENTS AND BALANCES ==========

// Sum D152:D154 for withholding and advance taxes
const sumD152toD154 = this.getValue('D152') + this.getValue('D153') + this.getValue('D154');
const totalTaxPaid = sumD152toD154 + this.getValue('D155');

// E156 = IF(((SUM(D152:D154)+D155)>E136),0,(E136-(SUM(D152:D154)+D155)))
// This is ADMITTED INCOME TAX - compared against Normal Income Tax (E136)
this.data['E156'] = totalTaxPaid > this.getValue('E136')
    ? 0
    : (this.getValue('E136') - totalTaxPaid);

// E157 = REFUNDABLE INCOME TAX = IF(E156>0,0,(SUM(D152:D154)+D155)-E136)
// If admitted tax > 0, then no refund. Otherwise, refund = tax paid - tax chargeable
this.data['E157'] = this.getValue('E156') > 0 
    ? 0 
    : (totalTaxPaid - this.getValue('E136'));

// Note: E158 remains empty as per "(Don't use this including formula)"
this.data['E158'] = 0;
  }

  // Load test data with values from the Excel sample
  loadTestData() {
    // Reset all data first to clear any existing values
    this.initializeAllData();

    // Set test data exactly as in Excel
    this.setValue("C4", 100000000); // Domestic Sales: 100,000,000
    this.setValue("C5", 15000000); // Export Sales: 15,000,000

    // Selling Expenses
    this.setValue("C9", 1000000); // Domestic Commission: 1,000,000
    this.setValue("C10", 1000000); // Foreign Commission: 1,000,000
    this.setValue("C11", 1000000); // Rebate/Duty Drawbacks: 1,000,000

    // Direct Expenses (17-25) - all 1,500,000
    for (let i = 17; i <= 25; i++) {
      this.setValue(`C${i}`, 1500000);
    }

    // Indirect Expenses (29-54) - all 1,500,000
    for (let i = 29; i <= 54; i++) {
      this.setValue(`C${i}`, 1500000);
    }

    // Other Revenues (57-65) - all 1,500,000
    for (let i = 57; i <= 65; i++) {
      this.setValue(`C${i}`, 1500000);
    }

    // Inadmissible Deductions (69-107) - all 1,000,000
    for (let i = 69; i <= 107; i++) {
      this.setValue(`C${i}`, 1000000);
    }

    // Admissible Deductions (110-114) - all 1,500,000
    for (let i = 110; i <= 114; i++) {
      this.setValue(`C${i}`, 1500000);
    }

    // Tax Depreciation (119-121) - all 1,500,000
    for (let i = 119; i <= 121; i++) {
      this.setValue(`C${i}`, 1500000);
    }

    // Additional income types (124-128) - all 0
    for (let i = 124; i <= 128; i++) {
      this.setValue(`C${i}`, 0);
    }

    // Allowances (132-133) - both 1,500,000
    this.setValue("C132", 1500000);
    this.setValue("C133", 1500000);

    // Tax Credits
    this.setValue("C149", 1500000); // Charitable Donations: 1,500,000
    this.setValue("C150", 0); // Other Credits: 0 (put zero by default)

    // Tax Payments (D column inputs)
    this.setValue("D152", 1000000); // Withholding Tax: 1,000,000
    this.setValue("D153", 10000000); // Advance Tax: 10,000,000
    this.setValue("D154", 0); // Advance Tax 147(A): 0
    this.setValue("D155", 0); // Advance Tax 147(5B): 0

    // Set PSEB registration to "Yes"
    this.setValue("D6", "Yes");

    // Calculate everything with the new data
    this.calculateAll();
  }

  // Reset all data to default values
  resetAll() {
    this.initializeAllData(); // Reinitialize all cells
    this.setValue("D6", "Yes"); // Reset PSEB registration to default
    this.calculateAll(); // Recalculate with default values
  }

  // Format numbers with commas for display (e.g., 1000000 -> 1,000,000)
  formatNumber(num) {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  // Get comprehensive tax results for display in the results panel
  getTaxResults() {
    return {
      // These are the actual calculation row values for display
      normalTax: this.getValue("E136"), // E136 = +E135*0.29
      finalTax: this.getValue("E137"), // E137 = +D5*0.025
      alternateTax: this.getValue("E140"), // E140 = +C66*0.17
      minimumTax: this.getValue("E141"), // E141 = +E3*0.0125
      taxChargeable: this.getValue("E136"), // E136 = tax chargeable
      admittedTax: this.getValue("E156"), // E156 = admitted tax calculation
      refundableTax: this.getValue("E157"), // E157 = refundable tax calculation (NEW)
      totalTaxCredits: this.getValue("E148"), // Total tax credits
      ratio: this.getValue("D7"), // Export ratio for reference
      psebRegistered: this.psebRegistered, // Current PSEB registration status

      // Additional useful values for reference
      exportSales: this.getValue("C5"), // Export sales amount
      domesticSales: this.getValue("C4"), // Domestic sales amount
      totalRevenue: this.getValue("C3"), // Total revenue
      accountingProfit: this.getValue("C66"), // Accounting profit
      taxableIncome: this.getValue("E135"), // Final taxable income
    };
  }
}
