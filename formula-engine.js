// tabular-engine.js - COMPLETE REWRITE FOR NEW EXCEL STRUCTURE & FBR IRIS LOGIC
// Implements Corporate IT Exporter rules (FTR vs NTR, Startups)

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
    this.data["C142"] = "No"; // Default startup question is "No"
    this.data["C143"] = "No"; // Small Company Status (Not used for special rates per config)

    // Initialize specific cells that are marked as empty or not used
    this.data["E134"] = 0; // Tax on High Earners (empty)
    this.data["E135"] = 0; // Tax on Deemed Income (empty)
    this.data["E137"] = 0; // Difference of Minimum Tax Chargeable (empty)

    // Initialize advance tax payments
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
    if (cell === "D6" || cell === "C142" || cell === "C143") {
      // Special handling for dropdowns/flags
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
    // Row 4: Domestic Sales (NTR Bucket)
    this.data["D4"] = 0;
    this.data["E4"] = this.getValue("C4") - this.getValue("D4");

    // Row 5: Export Sales (FTR Bucket)
    // NOTE: FTR applies whether PSEB is Yes or No, only the rate changes later.
    this.data["D5"] = this.getValue("C5");
    this.data["E5"] = this.getValue("C5") - this.getValue("D5");

    // 4. NOW calculate the totals (D3, E3)
    this.data["D3"] = this.getValue("D4") + this.getValue("D5");
    this.data["E3"] = this.getValue("E4") + this.getValue("E5");

    // Row 9: Domestic Commission
    this.data["D9"] = 0;
    this.data["E9"] = this.getValue("C9") - this.getValue("D9");

    // Row 10: Foreign Commission
    this.data["D10"] = this.getValue("C10");
    this.data["E10"] = this.getValue("C10") - this.getValue("D10");

    // Row 11: Rebate/Duty Drawbacks (Apportionment for Other Incomes later)
    this.data["D11"] = this.getValue("C11") * this.getValue("D7");
    this.data["E11"] = this.getValue("C11") - this.getValue("D11");

    // 3. SELLING EXPENSES CALCULATIONS 
    // ⚠️ CHANGED: Removed C11 (Rebates) from expenses. Now acts as an inflow.
    this.data["C8"] = this.getValue("C9") + this.getValue("C10");
    this.data["D8"] = this.getValue("D9") + this.getValue("D10");
    this.data["E8"] = this.getValue("E9") + this.getValue("E10");

    // 4. NET REVENUE CALCULATION
    this.data["C13"] = this.getValue("C3") - this.getValue("C8");
    this.data["D13"] = this.getValue("D3") - this.getValue("D8");
    this.data["E13"] = this.getValue("E3") - this.getValue("E8");

    // 5. COST OF SALES CALCULATIONS
    this.data["C15"] = this.sumRange("C", 17, 25);
    this.data["D15"] = this.sumRange("D", 17, 25);
    this.data["E15"] = this.sumRange("E", 17, 25);

    // Apply proportional exemption to direct expenses (rows 17-25)
    for (let i = 17; i <= 25; i++) {
      this.data[`D${i}`] = this.getValue(`C${i}`) * this.getValue("D7");
      this.data[`E${i}`] = this.getValue(`C${i}`) - this.getValue(`D${i}`);
    }

    // 6. GROSS PROFIT CALCULATION
    this.data["C26"] = this.getValue("C13") - this.getValue("C15");
    this.data["D26"] = this.getValue("D13") - this.getValue("D15");
    this.data["E26"] = this.getValue("E13") - this.getValue("E15");

    // 7. INDIRECT EXPENSES CALCULATIONS
    this.data["C28"] = this.sumRange("C", 29, 54);
    this.data["D28"] = this.sumRange("D", 29, 54);
    this.data["E28"] = this.sumRange("E", 29, 54);

    // Apply proportional exemption to indirect expenses (rows 29-54)
    for (let i = 29; i <= 54; i++) {
      this.data[`D${i}`] = this.getValue(`C${i}`) * this.getValue("D7");
      this.data[`E${i}`] = this.getValue(`C${i}`) - this.getValue(`D${i}`);
    }

    // 8. OTHER REVENUES CALCULATIONS
    // ⚠️ CHANGED: Added Row 11 (Rebates) back in here as a positive inflow!
    this.data["C56"] = this.sumRange("C", 57, 65) + this.getValue("C11");
    this.data["D56"] = this.sumRange("D", 57, 65) + this.getValue("D11");
    this.data["E56"] = this.sumRange("E", 57, 65) + this.getValue("E11");

    // Apply proportional exemption to other revenues (rows 57-65)
    for (let i = 57; i <= 65; i++) {
      this.data[`D${i}`] = this.getValue(`C${i}`) * this.getValue("D7");
      this.data[`E${i}`] = this.getValue(`C${i}`) - this.getValue(`D${i}`);
    }

    // 9. ACCOUNTING PROFIT CALCULATION
    this.data["C66"] = this.getValue("C26") - this.getValue("C28") + this.getValue("C56");
    this.data["D66"] = this.getValue("D26") - this.getValue("D28") + this.getValue("D56");
    this.data["E66"] = this.getValue("E26") - this.getValue("E28") + this.getValue("E56");

    // 10. INADMISSIBLE DEDUCTIONS CALCULATIONS 
    for (let i = 69; i <= 99; i++) {
      this.data[`D${i}`] = this.getValue(`C${i}`) * this.getValue("D7");
      this.data[`E${i}`] = this.getValue(`C${i}`) - this.getValue(`D${i}`);
    }

    this.data["C68"] = this.sumRange("C", 69, 99);
    this.data["D68"] = this.sumRange("D", 69, 99);
    this.data["E68"] = this.sumRange("E", 69, 99);
    this.data["C94"] = this.getValue("C51");
    this.data["C95"] = this.getValue("C52");
    this.data["C96"] = this.getValue("C53") + this.getValue("C24");
    this.data["C97"] = this.getValue("C54") + this.getValue("C25");
    this.data["C98"] = this.getValue("C63");
    this.data["C99"] = this.getValue("C64");

    /// 11. ADMISSIBLE DEDUCTIONS CALCULATIONS

    // NEW: Auto-pull Accounting Gains from Other Revenues
    this.data["C102"] = this.getValue("C63"); // FBR Code 3245
    this.data["C103"] = this.getValue("C64"); // FBR Code 3246

    // Pehle loop chala kar D aur E columns ki values calculate karein
    for (let i = 102; i <= 106; i++) {
      this.data[`D${i}`] = this.getValue(`C${i}`) * this.getValue("D7");
      this.data[`E${i}`] = this.getValue(`C${i}`) - this.getValue(`D${i}`);
    }

    // Phir un updated values ka total nikal kar 101 mein save karein
    this.data["C101"] = this.sumRange("C", 102, 106);
    this.data["D101"] = this.sumRange("D", 102, 106);
    this.data["E101"] = this.sumRange("E", 102, 106);

    // 12. INCOME BEFORE DEPRECIATION 
    this.data["C108"] = this.getValue("C66") + this.getValue("C68") - this.getValue("C101");
    this.data["D108"] = this.getValue("D66") + this.getValue("D68") - this.getValue("D101");
    this.data["E108"] = this.getValue("E66") + this.getValue("E68") - this.getValue("E101");

    // 13. TAX DEPRECIATION CALCULATIONS 
    this.data["C110"] = this.sumRange("C", 111, 113);
    this.data["D110"] = this.sumRange("D", 111, 113);
    this.data["E110"] = this.sumRange("E", 111, 113);

    for (let i = 111; i <= 113; i++) {
      this.data[`D${i}`] = this.getValue(`C${i}`) * this.getValue("D7");
      this.data[`E${i}`] = this.getValue(`C${i}`) - this.getValue(`D${i}`);
    }

    // 14. BUSINESS INCOME CALCULATION 
    this.data["C115"] = this.getValue("C108") - this.getValue("C110");
    this.data["D115"] = this.getValue("D108") - this.getValue("D110");
    this.data["E115"] = this.getValue("E108") - this.getValue("E110");

    // 15. OTHER INCOMES CALCULATIONS 
    for (let i = 116; i <= 120; i++) {
      this.data[`E${i}`] = this.getValue(`C${i}`) - this.getValue(`D${i}`);
    }

    // 16. TOTAL INCOME CALCULATION 
    this.data["C121"] = this.sumRange("C", 115, 120);
    this.data["D121"] = this.sumRange("D", 115, 120);
    this.data["E121"] = this.sumRange("E", 115, 120);

    // 17. DEDUCTIBLE ALLOWANCES CALCULATIONS
    this.data["C123"] = this.getValue("C124");
    this.data["E123"] = this.getValue("E124");
    this.data["E124"] = this.getValue("C124") - this.getValue("D124");

    // 18. TAXABLE INCOME CALCULATION (NTR Bucket)
    this.data["C126"] = this.getValue("C121") > 0 ? this.getValue("C121") - this.getValue("C123") : 0;

    // Column E represents the pure Domestic (NTR) portion
    const ntrTaxableIncome = this.getValue("E121") - this.getValue("E123");
    this.data["E126"] = ntrTaxableIncome > 0 ? ntrTaxableIncome : 0;

    // ========== TAX CALCULATIONS SECTION (FBR IRIS LOGIC) ==========

    const isStartup = this.data["C142"] === "Yes"; // Check if it's a Startup (Sec 65F)

    // E130: FINAL/FIXED TAX (FTR Bucket)
    let ftrTax = 0;
    if (!isStartup) {
      ftrTax = this.psebRegistered ? this.getValue("C5") * 0.0025 : this.getValue("C5") * 0.01;
    }
    this.data["E130"] = ftrTax;

    // E129: NORMAL INCOME TAX (NTR Bucket)
    const taxableIncome = this.getValue("E126");
    const taxRate = 0.29; // ⚠️ FIXED: Strictly 29% for all normal companies
    this.data["E129"] = taxableIncome > 0 ? taxableIncome * taxRate : 0;

    // E131: ALTERNATE CORPORATE TAX @ 17% (Sec 113C)
    let actTax = 0;
    if (!isStartup) { 
      // ACT Base is purely the NTR Accounting Profit (E66)
      const actBase = this.getValue("E66"); 
      actTax = actBase > 0 ? actBase * 0.17 : 0;
    }
    this.data["E131"] = actTax;

    // E132: MINIMUM TAX @ 1.25% (Sec 113)
    let minTax = 0;
    if (!isStartup) { 
      const ntrTurnover = this.getValue("C4");
      minTax = ntrTurnover > 0 ? ntrTurnover * 0.0125 : 0;
    }
    this.data["E132"] = minTax;

    // Differences & Chargeable
    this.data["E133"] = this.data["E132"] > this.data["E129"] ? this.data["E132"] - this.data["E129"] : 0;
    this.data["E134"] = 0;
    this.data["E135"] = 0;
    this.data["E136"] = this.data["E131"] > this.data["E129"] ? this.data["E131"] - this.data["E129"] : 0;
    this.data["E137"] = 0;

    // E128: TAX CHARGEABLE (Base for Credits)
    // ⚠️ FBR FIXED: Take the highest of Normal, ACT, or Min Tax, then add FTR. Do NOT add differences again.
    const highestNTRTax = Math.max(
      this.getValue("E129"),
      this.getValue("E131"),
      this.getValue("E132") 
    );
    this.data["E128"] = highestNTRTax + this.getValue("E130");

    // ========== TAX CREDITS ==========
    
    // E140: Charitable Donations Credit u/s 61
    const normalTaxAmt = this.getValue("E129"); 
    const baseTaxableIncome2 = this.getValue("E126"); 
    const donationAmt = this.getValue("C140"); 
    
    let charitableCredit = 0;
    if (donationAmt > 0 && baseTaxableIncome2 > 0 && normalTaxAmt > 0) {
      // ITO Rule: Max allowable donation is 20% of Taxable Income for Companies
      const allowableDonation = Math.min(donationAmt, 0.10 * baseTaxableIncome2); 
      charitableCredit = (normalTaxAmt / baseTaxableIncome2) * allowableDonation;
    }
    this.data["E140"] = charitableCredit;

    // E141: Other Credits (Startup Exemption u/s 65F)
    this.data["E141"] = isStartup ? this.getValue("E128") : this.getValue("C141");

    // E139: Total Tax Credits
    this.data["E139"] = this.getValue("E140") + this.getValue("E141");

    // E144: Net Tax Liability
    this.data["E144"] = Math.max(0, this.getValue("E128") - this.getValue("E139"));

    // ========== ADVANCE TAX PAYMENTS & ADMITTED TAX ==========
    this.data["E146"] =
      this.getValue("E147") +
      this.getValue("E148") +
      this.getValue("E149") +
      this.getValue("E150");

    // E152: ADMITTED INCOME TAX
    this.data["E152"] = this.getValue("E146") >= this.getValue("E144") ? 0 : this.getValue("E144") - this.getValue("E146");

    // E153: REFUNDABLE INCOME TAX
    this.data["E153"] = this.getValue("E146") > this.getValue("E144") ? this.getValue("E146") - this.getValue("E144") : 0;
  }

  // Load test data
  loadTestData() {
    this.initializeAllData();

    this.setValue("C4", 6000000);
    this.setValue("C5", 15000000);
    this.setValue("C9", 1000000);
    this.setValue("C10", 1000000);
    this.setValue("C11", 1000000);

    for (let i = 17; i <= 25; i++) this.setValue(`C${i}`, 1500000);
    for (let i = 29; i <= 54; i++) this.setValue(`C${i}`, 1500000);
    for (let i = 57; i <= 65; i++) this.setValue(`C${i}`, 1500000);
    for (let i = 69; i <= 99; i++) this.setValue(`C${i}`, 1000000);
    for (let i = 102; i <= 106; i++) this.setValue(`C${i}`, 1500000);
    for (let i = 111; i <= 113; i++) this.setValue(`C${i}`, 1500000);
    for (let i = 116; i <= 120; i++) this.setValue(`C${i}`, 0);

    this.setValue("C124", 1500000);
    this.setValue("C140", 1500000);
    this.setValue("C141", 0);
    this.setValue("C142", "No"); // Startup
    this.setValue("C143", "No"); // Small Company Status
    this.setValue("E147", 1000000);
    this.setValue("E148", 10000000);
    this.setValue("E149", 0);
    this.setValue("E150", 0);
    this.setValue("D6", "Yes"); // PSEB

    this.calculateAll();
  }

  // Reset all data to default values
  resetAll() {
    this.initializeAllData();
    this.setValue("D6", "Yes");
    this.setValue("C142", "No");
    this.setValue("C143", "No");
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
      isSmallCompany: this.data["C143"] === "Yes",
      exportRatio: this.getValue("D7"),
      taxableIncome: this.getValue("E126"),
      accountingProfit: this.getValue("C66"),
      domesticSales: this.getValue("C4"),
      exportSales: this.getValue("C5"),
      totalRevenue: this.getValue("C3"),
    };
  }
}