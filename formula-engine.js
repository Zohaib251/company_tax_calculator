// tabular-engine.js - COMPLETE REWRITE FOR NEW EXCEL STRUCTURE
// Implements ALL formulas from the new Excel file with 31 inadmissible rows

class TaxEngine {
  constructor() {
    this.data = {}; // Main data store for all cell values
    this.initializeAllData(); // Initialize all cells with default values
    this.psebRegistered = true; // Default PSEB registration status is "Yes"
  }

  // Initialize all data cells with default values
  initializeAllData() {
    // Initialize ALL cells from row 1 to 160 for columns C, D, and E
    for (let i = 1; i <= 160; i++) {
      this.data[`C${i}`] = 0;
      this.data[`D${i}`] = 0;
      this.data[`E${i}`] = 0;
    }

    // Set special default values
    this.data["C7"] = 1; // Row 7 Column C is always 1
    this.data["D6"] = "Yes"; // Default PSEB registration
    this.data["C142"] = "No"; // NEW: Default startup question is "No"
    
    // Initialize specific cells that are marked as empty or not used
    this.data["E134"] = 0; // Tax on High Earners (empty)
    this.data["E135"] = 0; // Tax on Deemed Income (empty)
    this.data["E137"] = 0; // Difference of Minimum Tax Chargeable (empty)
    
    // Initialize advance tax payments (NOW IN E COLUMN!)
    this.data["E147"] = 0; // Withholding Tax
    this.data["E148"] = 0; // Advance Tax
    this.data["E149"] = 0; // Advance Tax 147(A)
    this.data["E150"] = 0; // Advance Tax 147(5B)
  }

  // Get value from a specific cell
  getValue(cell) {
    return this.data[cell] || 0;
  }

  // Set value for a specific cell and trigger recalculation
  setValue(cell, value) {
    if (cell === "D6" || cell === "C142") {
      // Special handling for dropdowns
      this.data[cell] = value;
      if (cell === "D6") {
        this.psebRegistered = value === "Yes";
      }
    } else {
      const numericValue = parseFloat(value) || 0;
      this.data[cell] = numericValue;
    }
    this.calculateAll();
  }

  // Helper function to sum a range of cells
  sumRange(column, start, end) {
    let sum = 0;
    for (let i = start; i <= end; i++) {
      sum += this.getValue(`${column}${i}`);
    }
    return sum;
  }

  // Main calculation function - executes ALL formulas in proper order
  calculateAll() {
    this.data["C3"] = this.getValue("C4") + this.getValue("C5");
    
    // 2. Calculate export ratio (D7 = +C5/C3)
    const c3 = this.getValue("C3");
    const c5 = this.getValue("C5");
    if (c3 > 0) {
        this.data["D7"] = c5 / c3;
    } else {
        this.data["D7"] = 0;
    }
    this.data["E7"] = this.getValue("C7") - this.getValue("D7");

    // 3. Calculate individual row values FIRST
    // Row 4: Domestic Sales (always 0 exempt)
    this.data["D4"] = 0;
    this.data["E4"] = this.getValue("C4") - this.getValue("D4");
    
    // Row 5: Export Sales (depends on PSEB) - CRITICAL: Calculate this BEFORE D3/E3!
    this.data["D5"] = this.psebRegistered ? this.getValue("C5") : 0;
    this.data["E5"] = this.getValue("C5") - this.getValue("D5");
    
    // 4. NOW calculate the totals (D3, E3) using the UPDATED D4, D5, E4, E5
    this.data["D3"] = this.getValue("D4") + this.getValue("D5");
    this.data["E3"] = this.getValue("E4") + this.getValue("E5");
    // 3. SELLING EXPENSES CALCULATIONS
    // C8 = SUM(C9:C11)
    this.data["C8"] = this.sumRange("C", 9, 11);
    // D8 = SUM(D9:D11)
    this.data["D8"] = this.sumRange("D", 9, 11);
    // E8 = SUM(E9:E11)
    this.data["E8"] = this.sumRange("E", 9, 11);

    // Row 9: Domestic Commission
    this.data["D9"] = 0;
    this.data["E9"] = this.getValue("C9") - this.getValue("D9");

    // Row 10: Foreign Commission
    this.data["D10"] = this.getValue("C10");
    this.data["E10"] = this.getValue("C10") - this.getValue("D10");

    // Row 11: Rebate/Duty Drawbacks
    this.data["D11"] = this.getValue("C11") * this.getValue("D7");
    this.data["E11"] = this.getValue("C11") - this.getValue("D11");

    // 4. NET REVENUE CALCULATION
    // C13 = C3-C8
    this.data["C13"] = this.getValue("C3") - this.getValue("C8");
    // E13 = +E3-E8
    this.data["E13"] = this.getValue("E3") - this.getValue("E8");

    // 5. COST OF SALES CALCULATIONS
    // C15 = SUM(C17:C25)
    this.data["C15"] = this.sumRange("C", 17, 25);
    // D15 = SUM(D17:D25)
    this.data["D15"] = this.sumRange("D", 17, 25);
    // E15 = SUM(E17:E25) - Note: Excel shows E16:E25 but should be E17:E25
    this.data["E15"] = this.sumRange("E", 17, 25);

    // Apply proportional exemption to direct expenses (rows 17-25)
    for (let i = 17; i <= 25; i++) {
      this.data[`D${i}`] = this.getValue(`C${i}`) * this.getValue("D7");
      this.data[`E${i}`] = this.getValue(`C${i}`) - this.getValue(`D${i}`);
    }

    // 6. GROSS PROFIT CALCULATION
    // C26 = +C13-C15
    this.data["C26"] = this.getValue("C13") - this.getValue("C15");
    // E26 = +E13-E15
    this.data["E26"] = this.getValue("E13") - this.getValue("E15");

    // 7. INDIRECT EXPENSES CALCULATIONS
    // C28 = SUM(C29:C54)
    this.data["C28"] = this.sumRange("C", 29, 54);
    // E28 = SUM(E29:E54)
    this.data["E28"] = this.sumRange("E", 29, 54);

    // Apply proportional exemption to indirect expenses (rows 29-54)
    for (let i = 29; i <= 54; i++) {
      this.data[`D${i}`] = this.getValue(`C${i}`) * this.getValue("D7");
      this.data[`E${i}`] = this.getValue(`C${i}`) - this.getValue(`D${i}`);
    }

    // 8. OTHER REVENUES CALCULATIONS
    // C56 = SUM(C57:C65)
    this.data["C56"] = this.sumRange("C", 57, 65);
    // E56 = SUM(E57:E65)
    this.data["E56"] = this.sumRange("E", 57, 65);

    // Apply proportional exemption to other revenues (rows 57-65)
    for (let i = 57; i <= 65; i++) {
      this.data[`D${i}`] = this.getValue(`C${i}`) * this.getValue("D7");
      this.data[`E${i}`] = this.getValue(`C${i}`) - this.getValue(`D${i}`);
    }

    // 9. ACCOUNTING PROFIT CALCULATION
    // C66 = +C26-C28+C56
    this.data["C66"] = this.getValue("C26") - this.getValue("C28") + this.getValue("C56");
    // E66 = +E26-E28+E56
    this.data["E66"] = this.getValue("E26") - this.getValue("E28") + this.getValue("E56");

    // 10. INADMISSIBLE DEDUCTIONS CALCULATIONS - ⚠️ CHANGED: 31 rows (69-99)
    // C68 = SUM(C69:C99)
    this.data["C68"] = this.sumRange("C", 69, 99);
    // E68 = SUM(E69:E99)
    this.data["E68"] = this.sumRange("E", 69, 99);

    // Apply proportional exemption to inadmissible deductions (rows 69-99)
    for (let i = 69; i <= 99; i++) {
      this.data[`D${i}`] = this.getValue(`C${i}`) * this.getValue("D7");
      this.data[`E${i}`] = this.getValue(`C${i}`) - this.getValue(`D${i}`);
    }

    // Special formulas for rows 94-99 that reference other cells
    // Row 94: C94 = +C51
    this.data["C94"] = this.getValue("C51");
    // Row 95: C95 = +C52
    this.data["C95"] = this.getValue("C52");
    // Row 96: C96 = C53+C24
    this.data["C96"] = this.getValue("C53") + this.getValue("C24");
    // Row 97: C97 = C54+C25
    this.data["C97"] = this.getValue("C54") + this.getValue("C25");
    // Row 98: C98 = +C63
    this.data["C98"] = this.getValue("C63");
    // Row 99: C99 = +C64
    this.data["C99"] = this.getValue("C64");

    // 11. ADMISSIBLE DEDUCTIONS CALCULATIONS - ⚠️ CHANGED: Row 101 (was 109)
    // C101 = SUM(C102:C106)
    this.data["C101"] = this.sumRange("C", 102, 106);
    // E101 = SUM(E102:E106)
    this.data["E101"] = this.sumRange("E", 102, 106);

    // Apply proportional exemption to admissible deductions (rows 102-106)
    for (let i = 102; i <= 106; i++) {
      this.data[`D${i}`] = this.getValue(`C${i}`) * this.getValue("D7");
      this.data[`E${i}`] = this.getValue(`C${i}`) - this.getValue(`D${i}`);
    }

    // 12. INCOME BEFORE DEPRECIATION - ⚠️ CHANGED: Row 108 (was 116)
    // C108 = +C66+C68-C101
    this.data["C108"] = this.getValue("C66") + this.getValue("C68") - this.getValue("C101");
    // E108 = +E66+E68-E101
    this.data["E108"] = this.getValue("E66") + this.getValue("E68") - this.getValue("E101");

    // 13. TAX DEPRECIATION CALCULATIONS - ⚠️ CHANGED: Row 110 (was 118)
    // C110 = SUM(C111:C113)
    this.data["C110"] = this.sumRange("C", 111, 113);
    // E110 = SUM(E111:E113)
    this.data["E110"] = this.sumRange("E", 111, 113);

    // Apply proportional exemption to tax depreciation items (rows 111-113)
    for (let i = 111; i <= 113; i++) {
      this.data[`D${i}`] = this.getValue(`C${i}`) * this.getValue("D7");
      this.data[`E${i}`] = this.getValue(`C${i}`) - this.getValue(`D${i}`);
    }

    // 14. BUSINESS INCOME CALCULATION - ⚠️ CHANGED: Row 115 (was 123)
    // C115 = +C108-C110
    this.data["C115"] = this.getValue("C108") - this.getValue("C110");
    // E115 = +E108-E110
    this.data["E115"] = this.getValue("E108") - this.getValue("E110");

    // 15. OTHER INCOMES CALCULATIONS - ⚠️ CHANGED: Rows 116-120 (was 124-128)
    for (let i = 116; i <= 120; i++) {
      this.data[`E${i}`] = this.getValue(`C${i}`) - this.getValue(`D${i}`);
    }

    // 16. TOTAL INCOME CALCULATION - ⚠️ CHANGED: Row 121 (was 129)
    // C121 = SUM(C115:C120)
    this.data["C121"] = this.sumRange("C", 115, 120);
    // E121 = SUM(E115:E120)
    this.data["E121"] = this.sumRange("E", 115, 120);

    // 17. DEDUCTIBLE ALLOWANCES CALCULATIONS - ⚠️ CHANGED: Row 123 (was 131)
    // C123 = SUM(C124:C124) - Only one allowance now
    this.data["C123"] = this.getValue("C124");
    // E123 = SUM(E124:E124)
    this.data["E123"] = this.getValue("E124");
    // E124 = C124-D124 (Workers Welfare Fund)
    this.data["E124"] = this.getValue("C124") - this.getValue("D124");

    // 18. TAXABLE INCOME CALCULATION - ⚠️ CHANGED: Row 126 (was 135)
    // C126 = +C121-C123
    this.data["C126"] = this.getValue("C121") - this.getValue("C123");
    // E126 = +E121-E123
    this.data["E126"] = this.getValue("E121") - this.getValue("E123");

    // ========== TAX CALCULATIONS SECTION ==========
    // Based on NEW Excel formulas

    // E129: NORMAL INCOME TAX @ 29% (with IF condition)
    const taxableIncome = this.getValue("E126");
    this.data["E129"] = taxableIncome > 0 ? taxableIncome * 0.29 : 0;

    // E130: FINAL/FIXED TAX @ 2.5%
    this.data["E130"] = this.getValue("D5") * 0.025;

    // E131: ALTERNATE CORPORATE TAX @ 17% (with IF condition)
    const accountingProfit = this.getValue("C66");
    this.data["E131"] = accountingProfit > 0 ? accountingProfit * 0.17 : 0;

    // E132: MINIMUM TAX @ 1.25% (with threshold)
    const taxableRevenue = this.getValue("E3");
    this.data["E132"] = taxableRevenue > 100000000 ? taxableRevenue * 0.0125 : 0;

    // E133: DIFFERENCE OF MINIMUM TAX
    this.data["E133"] = this.getValue("E132") > this.getValue("E129") 
        ? this.getValue("E132") - this.getValue("E129") 
        : 0;

    // E134: TAX ON HIGH EARNERS (empty)
    this.data["E134"] = 0;

    // E135: TAX ON DEEMED INCOME (empty)
    this.data["E135"] = 0;

    // E136: DIFFERENCE OF ALTERNATE TAX
    this.data["E136"] = this.getValue("E131") > this.getValue("E129")
        ? this.getValue("E131") - this.getValue("E129")
        : 0;

    // E137: DIFFERENCE OF MINIMUM TAX CHARGEABLE (empty)
    this.data["E137"] = 0;

    // E128: TAX CHARGEABLE (NEW FORMULA!)
    const maxTax = Math.max(
        this.getValue("E129"), // Normal tax
        this.getValue("E131"), // Alternate tax  
        this.getValue("E132")  // Minimum tax
    );

    this.data["E128"] = maxTax + 
        this.getValue("E130") + // Final tax
        this.getValue("E133") + // Diff min tax
        this.getValue("E134") + // Tax high earners (0)
        this.getValue("E135") + // Tax deemed income (0)
        this.getValue("E136") + // Diff alt tax
        this.getValue("E137");  // Diff min chargeable (0)

    // ========== TAX CREDITS ==========
    // E140: Charitable Donations Credit (COMPLEX FORMULA!)
    const taxChargeable = this.getValue("E128");
    const charitableDonations = this.getValue("C140");

    let charitableCredit = 0;
    if (charitableDonations > 0 && taxableIncome > 0 && taxChargeable > 0) {
        const option1 = (taxChargeable / taxableIncome) * charitableDonations;
        const option2 = 0.2 * taxableIncome;
        charitableCredit = Math.min(option1, option2);
        if (charitableCredit < 0) charitableCredit = 0;
    }
    this.data["E140"] = charitableCredit;

    // E141: Other Credits (depends on startup question)
    const startupRegistered = this.data["C142"] === "Yes";
    this.data["E141"] = startupRegistered ? this.getValue("E128") : this.getValue("C141");

    // E139: Total Tax Credits
    this.data["E139"] = this.getValue("E140") + this.getValue("E141");

    // E144: Net Tax Liability
    this.data["E144"] = this.getValue("E128") - this.getValue("E139");

    // ========== ADVANCE TAX PAYMENTS ==========
    // NOW IN E COLUMN! (147-150)
    // E146: Advance Tax Total
    this.data["E146"] = 
        this.getValue("E147") + // WHT
        this.getValue("E148") + // Advance Tax
        this.getValue("E149") + // Advance 147(A)
        this.getValue("E150");  // Advance 147(5B)

    // ========== FINAL TAX CALCULATIONS ==========
    // E152: ADMITTED INCOME TAX
    this.data["E152"] = this.getValue("E146") > this.getValue("E144")
        ? 0
        : this.getValue("E144") - this.getValue("E146");

    // E153: REFUNDABLE INCOME TAX
    this.data["E153"] = this.getValue("E152") > 0
        ? 0
        : this.getValue("E146") - this.getValue("E144");
  }

  // Load test data with values from the NEW Excel sample
  loadTestData() {
    this.initializeAllData();
    
    // Set test data exactly as in NEW Excel
    this.setValue("C4", 6000000);    // Domestic Sales: 6,000,000
    this.setValue("C5", 15000000);   // Export Sales: 15,000,000

    // Selling Expenses
    this.setValue("C9", 1000000);    // Domestic Commission
    this.setValue("C10", 1000000);   // Foreign Commission
    this.setValue("C11", 1000000);   // Rebate/Duty Drawbacks

    // Direct Expenses (17-25)
    for (let i = 17; i <= 25; i++) {
        this.setValue(`C${i}`, 1500000);
    }

    // Indirect Expenses (29-54)
    for (let i = 29; i <= 54; i++) {
        this.setValue(`C${i}`, 1500000);
    }

    // Other Revenues (57-65)
    for (let i = 57; i <= 65; i++) {
        this.setValue(`C${i}`, 1500000);
    }

    // Inadmissible Deductions (69-99) - ⚠️ 31 rows now
    for (let i = 69; i <= 99; i++) {
        this.setValue(`C${i}`, 1000000);
    }

    // Admissible Deductions (102-106) - ⚠️ New rows
    for (let i = 102; i <= 106; i++) {
        this.setValue(`C${i}`, 1500000);
    }

    // Tax Depreciation (111-113) - ⚠️ New rows
    for (let i = 111; i <= 113; i++) {
        this.setValue(`C${i}`, 1500000);
    }

    // Other Incomes (116-120) - ⚠️ New rows
    for (let i = 116; i <= 120; i++) {
        this.setValue(`C${i}`, 0);
    }

    // Allowances (only row 124 now)
    this.setValue("C124", 1500000);

    // Tax Credits
    this.setValue("C140", 1500000); // Charitable Donations
    this.setValue("C141", 0);       // Other Credits

    // Startup question (NEW)
    this.setValue("C142", "No");

    // Advance Tax Payments (NOW IN E COLUMN!)
    this.setValue("E147", 1000000);  // Withholding Tax
    this.setValue("E148", 10000000); // Advance Tax
    this.setValue("E149", 0);        // Advance Tax 147(A)
    this.setValue("E150", 0);        // Advance Tax 147(5B)

    // PSEB registration
    this.setValue("D6", "Yes");

    this.calculateAll();
  }

  // Reset all data to default values
  resetAll() {
    this.initializeAllData();
    this.setValue("D6", "Yes");
    this.setValue("C142", "No");
    this.calculateAll();
  }

  // Format numbers with commas for display
  formatNumber(num) {
    return num.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  // Get comprehensive tax results for display
  getTaxResults() {
    return {
      normalTax: this.getValue("E129"),
      finalTax: this.getValue("E130"),
      alternateTax: this.getValue("E131"),
      minimumTax: this.getValue("E132"),
      taxChargeable: this.getValue("E128"),
      admittedTax: this.getValue("E152"),
      refundableTax: this.getValue("E153"),
      totalTaxCredits: this.getValue("E139"),
      netTaxLiability: this.getValue("E144"),
      advanceTaxTotal: this.getValue("E146"),
      startupRegistered: this.data["C142"] === "Yes",
      exportRatio: this.getValue("D7"),
      taxableIncome: this.getValue("E126"),
      accountingProfit: this.getValue("C66"),
      domesticSales: this.getValue("C4"),
      exportSales: this.getValue("C5"),
      totalRevenue: this.getValue("C3")
    };
  }
}