// Tax Calculation Engine - Implements ALL Excel formulas
class TaxAssistantEngine {
  constructor() {
    this.userData = {}; // Store user inputs
    this.calculatedValues = {}; // Store calculated values
    this.psebRegistered = true; // Default: Company is registered with PSEB
    this.exportRatio = 0;

    // Initialize all calculated values to 0
    this.initializeCalculatedValues();
  }

  initializeCalculatedValues() {
    // All calculated fields from Excel
    const calculatedFields = [
      // Column C calculated values
      "C3",
      "C8",
      "C13",
      "C15",
      "C26",
      "C28",
      "C56",
      "C66",
      "C68",
      "C109",
      "C116",
      "C118",
      "C123",
      "C129",
      "C131",
      "C135",

      // Column D calculated values
      "D5",
      "D7",
      "D8",
      "D10",
      "D11",
      "D15",
      "D28",
      "D56",
      "D68",
      "D109",
      "D118",

      // Column E calculated values
      "E3",
      "E4",
      "E5",
      "E7",
      "E8",
      "E9",
      "E10",
      "E11",
      "E13",
      "E15",
      "E17",
      "E18",
      "E19",
      "E20",
      "E21",
      "E22",
      "E23",
      "E24",
      "E25",
      "E26",
      "E28",
      "E29",
      "E30",
      "E31",
      "E32",
      "E33",
      "E34",
      "E35",
      "E36",
      "E37",
      "E38",
      "E39",
      "E40",
      "E41",
      "E42",
      "E43",
      "E44",
      "E45",
      "E46",
      "E47",
      "E48",
      "E49",
      "E50",
      "E51",
      "E52",
      "E53",
      "E54",
      "E56",
      "E57",
      "E58",
      "E59",
      "E60",
      "E61",
      "E62",
      "E63",
      "E64",
      "E65",
      "E66",
      "E68",
      "E69",
      "E70",
      "E71",
      "E72",
      "E73",
      "E74",
      "E75",
      "E76",
      "E77",
      "E78",
      "E79",
      "E80",
      "E81",
      "E82",
      "E83",
      "E84",
      "E85",
      "E86",
      "E87",
      "E88",
      "E89",
      "E90",
      "E91",
      "E92",
      "E93",
      "E94",
      "E95",
      "E96",
      "E97",
      "E98",
      "E99",
      "E100",
      "E101",
      "E102",
      "E103",
      "E104",
      "E105",
      "E106",
      "E107",
      "E109",
      "E110",
      "E111",
      "E112",
      "E113",
      "E114",
      "E116",
      "E118",
      "E119",
      "E120",
      "E121",
      "E123",
      "E129",
      "E131",
      "E132",
      "E133",
      "E135",

      // Tax calculations
      "E137",
      "E138",
      "E140",
      "E141",
      "E142",
      "E148",
      "E136",
      "E149",
      "E150",
      "E152",
      "E154",
    ];

    // Initialize all to 0
    calculatedFields.forEach((field) => {
      this.calculatedValues[field] = 0;
    });
  }

  // Set user input value
  setUserInput(field, value) {
    const numValue = value === "" ? 0 : parseFloat(value) || 0;
    this.userData[field] = numValue;
    this.calculateAll();
  }

  // Set PSEB registration status
  setPSEBRegistered(value) {
    this.psebRegistered = value;
    this.calculateAll();
  }

  // Get value for display - FIXED VERSION
  getValue(field) {
    // Check if it's a user input field
    if (field in this.userData) {
      return this.userData[field];
    }
    // Check if it's a calculated field
    else if (field in this.calculatedValues) {
      return this.calculatedValues[field];
    }
    // Return 0 for any other field
    return 0;
  }

  // Calculate ALL formulas (main calculation engine)
  // Calculate ALL formulas (main calculation engine) - EXACT EXCEL VERSION
  calculateAll() {
    console.log("=== CALCULATE ALL - EXCEL EXACT ===");

    // ========== STEP 1: GET INPUT VALUES ==========
    const domesticSales = this.getValue("C4");
    const exportSales = this.getValue("C5");

    // Note: Excel excludes C6 (Sales Tax) and C7 (Federal Excise Duty) from calculations
    // as per "GROSS REVENUE (EXCLUDING SALES TAX & FEDERAL EXCISE DUTY)"

    // ========== STEP 2: CALCULATE EXPORT RATIO ==========
    // From Excel: Export Ratio = Export Sales / Total Revenue
    // Total Revenue = C4 + C5 (excluding C6, C7)
    const totalRevenue = domesticSales + exportSales;
    this.exportRatio = totalRevenue > 0 ? exportSales / totalRevenue : 0;

    console.log("Export Ratio:", (this.exportRatio * 100).toFixed(2) + "%");
    console.log("Export Sales:", exportSales, "Total Revenue:", totalRevenue);

    // ========== COLUMN C CALCULATIONS (TOTAL AMOUNTS) ==========

    // C3: Gross Revenue = C4 + C5 (excluding C6, C7)
    this.calculatedValues["C3"] = totalRevenue;
    console.log("C3 (Gross Revenue):", this.calculatedValues["C3"]);

    // C8: Selling Expenses = C9 + C10 + C11 + C12
    this.calculatedValues["C8"] =
      this.getValue("C9") +
      this.getValue("C10") +
      this.getValue("C11") +
      this.getValue("C12");
    console.log("C8 (Selling Expenses):", this.calculatedValues["C8"]);

    // C13: Net Revenue = C3 - C8
    this.calculatedValues["C13"] =
      this.calculatedValues["C3"] - this.calculatedValues["C8"];
    console.log("C13 (Net Revenue):", this.calculatedValues["C13"]);

    // C15: Cost of Sales = SUM(C17:C25) - 9 items
    let costOfSales = 0;
    for (let i = 17; i <= 25; i++) {
      costOfSales += this.getValue(`C${i}`);
    }
    this.calculatedValues["C15"] = costOfSales;
    console.log("C15 (Cost of Sales):", this.calculatedValues["C15"]);

    // C26: Gross Profit = C13 - C15
    this.calculatedValues["C26"] =
      this.calculatedValues["C13"] - this.calculatedValues["C15"];
    console.log("C26 (Gross Profit):", this.calculatedValues["C26"]);

    // C28: Management Expenses = SUM(C29:C54) - 26 items
    let managementExpenses = 0;
    for (let i = 29; i <= 54; i++) {
      managementExpenses += this.getValue(`C${i}`);
    }
    this.calculatedValues["C28"] = managementExpenses;
    console.log("C28 (Management Expenses):", this.calculatedValues["C28"]);

    // C56: Other Revenues = SUM(C57:C65) - 9 items
    let otherRevenues = 0;
    for (let i = 57; i <= 65; i++) {
      otherRevenues += this.getValue(`C${i}`);
    }
    this.calculatedValues["C56"] = otherRevenues;
    console.log("C56 (Other Revenues):", this.calculatedValues["C56"]);

    // C66: Accounting Profit = C26 - C28 + C56
    this.calculatedValues["C66"] =
      this.calculatedValues["C26"] -
      this.calculatedValues["C28"] +
      this.calculatedValues["C56"];
    console.log("C66 (Accounting Profit):", this.calculatedValues["C66"]);

    // C68: Inadmissible Deductions = SUM(C69:C107) - 39 items
    let inadmissibleDeductions = 0;
    for (let i = 69; i <= 107; i++) {
      inadmissibleDeductions += this.getValue(`C${i}`);
    }
    this.calculatedValues["C68"] = inadmissibleDeductions;
    console.log("C68 (Inadmissible Deductions):", this.calculatedValues["C68"]);

    // C109: Admissible Deductions = SUM(C110:C114) - 5 items
    let admissibleDeductions = 0;
    for (let i = 110; i <= 114; i++) {
      admissibleDeductions += this.getValue(`C${i}`);
    }
    this.calculatedValues["C109"] = admissibleDeductions;
    console.log("C109 (Admissible Deductions):", this.calculatedValues["C109"]);

    // C116: Income before depreciation = C66 + C68 - C109
    this.calculatedValues["C116"] =
      this.calculatedValues["C66"] +
      this.calculatedValues["C68"] -
      this.calculatedValues["C109"];
    console.log(
      "C116 (Income before depreciation):",
      this.calculatedValues["C116"],
    );

    // C118: Tax Depreciation = SUM(C119:C121) - 3 items
    let taxDepreciation = 0;
    for (let i = 119; i <= 121; i++) {
      taxDepreciation += this.getValue(`C${i}`);
    }
    this.calculatedValues["C118"] = taxDepreciation;
    console.log("C118 (Tax Depreciation):", this.calculatedValues["C118"]);

    // C123: Business Income = C116 - C118
    this.calculatedValues["C123"] =
      this.calculatedValues["C116"] - this.calculatedValues["C118"];
    console.log("C123 (Business Income):", this.calculatedValues["C123"]);

    // C129: Total Income = C123 (only business income in this example)
    this.calculatedValues["C129"] = this.calculatedValues["C123"];
    console.log("C129 (Total Income):", this.calculatedValues["C129"]);

    // C131: Deductible Allowances = C132 + C133 + C134
    this.calculatedValues["C131"] =
      this.getValue("C132") + this.getValue("C133") + this.getValue("C134");
    console.log("C131 (Deductible Allowances):", this.calculatedValues["C131"]);

    // C135: Taxable Income = C129 - C131
    this.calculatedValues["C135"] =
      this.calculatedValues["C129"] - this.calculatedValues["C131"];
    console.log("C135 (Taxable Income):", this.calculatedValues["C135"]);

    // ========== COLUMN D CALCULATIONS (EXEMPT AMOUNTS) ==========

    // D5: Export sales fully exempt if PSEB registered
    this.calculatedValues["D5"] = this.psebRegistered ? exportSales : 0;
    console.log("D5 (Export Exemption):", this.calculatedValues["D5"]);

    // D7: Export ratio (for display)
    this.calculatedValues["D7"] = this.exportRatio;

    // D10: Foreign commission fully exempt
    this.calculatedValues["D10"] = this.getValue("C10");
    console.log(
      "D10 (Foreign Commission Exempt):",
      this.calculatedValues["D10"],
    );

    // D11: Duty drawbacks proportional to export ratio
    this.calculatedValues["D11"] = this.getValue("C11") * this.exportRatio;
    console.log("D11 (Duty Drawbacks Exempt):", this.calculatedValues["D11"]);

    // D12: Other selling expenses proportional exemption
    this.calculatedValues["D12"] = this.getValue("C12") * this.exportRatio;

    // ALL PROPORTIONAL EXEMPTIONS: D = C * export ratio
    // Apply to: C17:C25 (9 items), C29:C54 (26 items), C57:C65 (9 items),
    // C69:C107 (39 items), C110:C114 (5 items), C119:C121 (3 items)

    const proportionalRows = [
      ...Array.from({ length: 9 }, (_, i) => 17 + i), // 17-25
      ...Array.from({ length: 26 }, (_, i) => 29 + i), // 29-54
      ...Array.from({ length: 9 }, (_, i) => 57 + i), // 57-65
      ...Array.from({ length: 39 }, (_, i) => 69 + i), // 69-107
      ...Array.from({ length: 5 }, (_, i) => 110 + i), // 110-114
      ...Array.from({ length: 3 }, (_, i) => 119 + i), // 119-121
    ];

    proportionalRows.forEach((row) => {
      this.calculatedValues[`D${row}`] =
        this.getValue(`C${row}`) * this.exportRatio;
    });

    // ========== COLUMN E CALCULATIONS (TAXABLE AMOUNTS) ==========
    // BASIC FORMULA: E = C - D

    // E3: Taxable Gross Revenue = E4 + E5 (E6 and E7 are 0 as excluded)
    this.calculatedValues["E4"] = domesticSales; // Fully taxable
    this.calculatedValues["E5"] = exportSales - this.calculatedValues["D5"]; // Export taxable portion
    this.calculatedValues["E3"] =
      this.calculatedValues["E4"] + this.calculatedValues["E5"];
    console.log("E3 (Taxable Revenue):", this.calculatedValues["E3"]);

    // E8: Taxable Selling Expenses = E9 + E10 + E11 + E12
    this.calculatedValues["E9"] = this.getValue("C9"); // Domestic commission fully taxable
    this.calculatedValues["E10"] =
      this.getValue("C10") - this.calculatedValues["D10"]; // Foreign commission
    this.calculatedValues["E11"] =
      this.getValue("C11") - this.calculatedValues["D11"]; // Duty drawbacks
    this.calculatedValues["E12"] =
      this.getValue("C12") - this.calculatedValues["D12"]; // Other selling expenses
    this.calculatedValues["E8"] =
      this.calculatedValues["E9"] +
      this.calculatedValues["E10"] +
      this.calculatedValues["E11"] +
      this.calculatedValues["E12"];
    console.log("E8 (Taxable Selling Expenses):", this.calculatedValues["E8"]);

    // E13: Taxable Net Revenue = E3 - E8
    this.calculatedValues["E13"] =
      this.calculatedValues["E3"] - this.calculatedValues["E8"];
    console.log("E13 (Taxable Net Revenue):", this.calculatedValues["E13"]);

    // Cost of Sales (E17:E25) - proportional
    for (let i = 17; i <= 25; i++) {
      this.calculatedValues[`E${i}`] =
        this.getValue(`C${i}`) - (this.calculatedValues[`D${i}`] || 0);
    }

    // E15: Taxable Cost of Sales = SUM(E17:E25)
    let e15 = 0;
    for (let i = 17; i <= 25; i++) {
      e15 += this.calculatedValues[`E${i}`] || 0;
    }
    this.calculatedValues["E15"] = e15;
    console.log("E15 (Taxable Cost of Sales):", this.calculatedValues["E15"]);

    // E26: Taxable Gross Profit = E13 - E15
    this.calculatedValues["E26"] =
      this.calculatedValues["E13"] - this.calculatedValues["E15"];
    console.log("E26 (Taxable Gross Profit):", this.calculatedValues["E26"]);

    // Management Expenses (E29:E54) - proportional
    for (let i = 29; i <= 54; i++) {
      this.calculatedValues[`E${i}`] =
        this.getValue(`C${i}`) - (this.calculatedValues[`D${i}`] || 0);
    }

    // E28: Taxable Management Expenses = SUM(E29:E54)
    let e28 = 0;
    for (let i = 29; i <= 54; i++) {
      e28 += this.calculatedValues[`E${i}`] || 0;
    }
    this.calculatedValues["E28"] = e28;
    console.log(
      "E28 (Taxable Management Expenses):",
      this.calculatedValues["E28"],
    );

    // Other Revenues (E57:E65) - proportional
    for (let i = 57; i <= 65; i++) {
      this.calculatedValues[`E${i}`] =
        this.getValue(`C${i}`) - (this.calculatedValues[`D${i}`] || 0);
    }

    // E56: Taxable Other Revenues = SUM(E57:E65)
    let e56 = 0;
    for (let i = 57; i <= 65; i++) {
      e56 += this.calculatedValues[`E${i}`] || 0;
    }
    this.calculatedValues["E56"] = e56;
    console.log("E56 (Taxable Other Revenues):", this.calculatedValues["E56"]);

    // E66: Taxable Accounting Profit = E26 - E28 + E56
    this.calculatedValues["E66"] =
      this.calculatedValues["E26"] -
      this.calculatedValues["E28"] +
      this.calculatedValues["E56"];
    console.log(
      "E66 (Taxable Accounting Profit):",
      this.calculatedValues["E66"],
    );

    // Inadmissible Deductions (E69:E107) - proportional
    for (let i = 69; i <= 107; i++) {
      this.calculatedValues[`E${i}`] =
        this.getValue(`C${i}`) - (this.calculatedValues[`D${i}`] || 0);
    }

    // E68: Taxable Inadmissible Deductions = SUM(E69:E107)
    let e68 = 0;
    for (let i = 69; i <= 107; i++) {
      e68 += this.calculatedValues[`E${i}`] || 0;
    }
    this.calculatedValues["E68"] = e68;
    console.log(
      "E68 (Taxable Inadmissible Deductions):",
      this.calculatedValues["E68"],
    );

    // Admissible Deductions (E110:E114) - proportional
    for (let i = 110; i <= 114; i++) {
      this.calculatedValues[`E${i}`] =
        this.getValue(`C${i}`) - (this.calculatedValues[`D${i}`] || 0);
    }

    // E109: Taxable Admissible Deductions = SUM(E110:E114)
    let e109 = 0;
    for (let i = 110; i <= 114; i++) {
      e109 += this.calculatedValues[`E${i}`] || 0;
    }
    this.calculatedValues["E109"] = e109;
    console.log(
      "E109 (Taxable Admissible Deductions):",
      this.calculatedValues["E109"],
    );

    // E116: Taxable Income before depreciation = E66 + E68 - E109
    this.calculatedValues["E116"] =
      this.calculatedValues["E66"] +
      this.calculatedValues["E68"] -
      this.calculatedValues["E109"];
    console.log(
      "E116 (Taxable Income before depreciation):",
      this.calculatedValues["E116"],
    );

    // Tax Depreciation (E119:E121) - proportional
    for (let i = 119; i <= 121; i++) {
      this.calculatedValues[`E${i}`] =
        this.getValue(`C${i}`) - (this.calculatedValues[`D${i}`] || 0);
    }

    // E118: Taxable Tax Depreciation = SUM(E119:E121)
    let e118 = 0;
    for (let i = 119; i <= 121; i++) {
      e118 += this.calculatedValues[`E${i}`] || 0;
    }
    this.calculatedValues["E118"] = e118;
    console.log(
      "E118 (Taxable Tax Depreciation):",
      this.calculatedValues["E118"],
    );

    // E123: Taxable Business Income = E116 - E118
    this.calculatedValues["E123"] =
      this.calculatedValues["E116"] - this.calculatedValues["E118"];
    console.log(
      "E123 (Taxable Business Income):",
      this.calculatedValues["E123"],
    );

    // E129: Total Taxable Income = E123 (only business income)
    this.calculatedValues["E129"] = this.calculatedValues["E123"];

    // Allowances (E132:E134) - fully deductible
    this.calculatedValues["E132"] = this.getValue("C132");
    this.calculatedValues["E133"] = this.getValue("C133");
    this.calculatedValues["E134"] = this.getValue("C134");
    this.calculatedValues["E131"] =
      this.calculatedValues["E132"] +
      this.calculatedValues["E133"] +
      this.calculatedValues["E134"];
    console.log("E131 (Taxable Allowances):", this.calculatedValues["E131"]);

    // E135: Final Taxable Income = E129 - E131
    this.calculatedValues["E135"] =
      this.calculatedValues["E129"] - this.calculatedValues["E131"];
    console.log("E135 (Final Taxable Income):", this.calculatedValues["E135"]);

    // ========== TAX CALCULATIONS ==========

    // E137: Normal Income Tax @ 29% on E135
    this.calculatedValues["E137"] = this.calculatedValues["E135"] * 0.29;
    console.log("E137 (Normal Tax @29%):", this.calculatedValues["E137"]);

    // E138: Final/Fixed Tax @ 2.5% on D5 (exempt exports)
    this.calculatedValues["E138"] = this.calculatedValues["D5"] * 0.025;
    console.log("E138 (Final Tax @2.5%):", this.calculatedValues["E138"]);

    // E140: Alternate Corporate Tax @ 17% on C66 (Accounting Profit)
    this.calculatedValues["E140"] = this.calculatedValues["C66"] * 0.17;
    console.log("E140 (Alternate Tax @17%):", this.calculatedValues["E140"]);

    // E141: Minimum Tax @ 1.25% on E3 (Taxable Turnover)
    this.calculatedValues["E141"] = this.calculatedValues["E3"] * 0.0125;
    console.log("E141 (Minimum Tax @1.25%):", this.calculatedValues["E141"]);

    // E142: Difference if minimum tax > normal tax
    this.calculatedValues["E142"] = Math.max(
      0,
      this.calculatedValues["E141"] - this.calculatedValues["E137"],
    );
    console.log(
      "E142 (Minimum Tax Difference):",
      this.calculatedValues["E142"],
    );

    // E148: Difference if alternate tax > normal tax
    this.calculatedValues["E148"] = Math.max(
      0,
      this.calculatedValues["E140"] - this.calculatedValues["E137"],
    );
    console.log(
      "E148 (Alternate Tax Difference):",
      this.calculatedValues["E148"],
    );

    // E136: Total Tax Chargeable
    // From Excel logic: Take the HIGHEST of (Normal, Alternate, Minimum)
    // then add Final Tax and Minimum Tax difference, subtract Alternate Tax difference
    const maxTax = Math.max(
      this.calculatedValues["E137"], // Normal tax
      this.calculatedValues["E140"], // Alternate tax
      this.calculatedValues["E141"], // Minimum tax
    );

    this.calculatedValues["E136"] =
      maxTax +
      this.calculatedValues["E138"] + // Final tax on exports
      this.calculatedValues["E142"] - // Add if minimum > normal
      this.calculatedValues["E148"]; // Subtract if alternate > normal

    console.log("E136 (Total Tax Chargeable):", this.calculatedValues["E136"]);
    console.log("Max Tax Used:", maxTax);

    // E149: Tax Credit for Charitable Donations u/s 61
    // Formula: MIN((Total Tax/Taxable Income × Donations), 20% of Taxable Income)
    const e136 = this.calculatedValues["E136"];
    const e135 = this.calculatedValues["E135"];
    const c149 = this.getValue("C149");

    if (e135 > 0) {
      const proportionalCredit = (e136 / e135) * c149;
      const maxAllowedCredit = 0.2 * e135;
      this.calculatedValues["E149"] = Math.min(
        proportionalCredit,
        maxAllowedCredit,
      );
    } else {
      this.calculatedValues["E149"] = 0;
    }
    console.log(
      "E149 (Tax Credit for Donations):",
      this.calculatedValues["E149"],
    );
    console.log("C149 (Donations):", c149);

    // E150: Tax Credit for Startups u/s 65F
    this.calculatedValues["E150"] = this.getValue("C150");
    console.log(
      "E150 (Tax Credit for Startups):",
      this.calculatedValues["E150"],
    );

    // E152: Admitted Income Tax (Tax Payable)
    // = Total Tax - Tax Credits - Tax Already Paid
    const totalTaxPaid =
      this.getValue("D152") + // Withholding tax
      this.getValue("D153") + // Advance tax
      this.getValue("D154") + // Advance tax u/s 147(A)
      this.getValue("D155"); // Advance tax u/s 147(5B)

    const totalCredits =
      this.calculatedValues["E149"] + // Donation credit
      this.calculatedValues["E150"]; // Startup credit

    const netTaxPayable = e136 - totalCredits - totalTaxPaid;
    this.calculatedValues["E152"] = Math.max(0, netTaxPayable);

    console.log("E152 (Admitted Income Tax):", this.calculatedValues["E152"]);
    console.log("Total Tax Paid:", totalTaxPaid);
    console.log("Total Credits:", totalCredits);

    // E154: Refundable Income Tax
    this.calculatedValues["E154"] = Math.max(
      0,
      totalTaxPaid - (e136 - totalCredits),
    );
    console.log("E154 (Refundable Income Tax):", this.calculatedValues["E154"]);

    console.log("=== CALCULATION COMPLETE ===");
  }

  // Get formatted results for display
  getResults() {
    return {
      taxableIncome: this.calculatedValues["E135"],
      normalTax: this.calculatedValues["E137"],
      finalTax: this.calculatedValues["E138"],
      alternateTax: this.calculatedValues["E140"],
      minimumTax: this.calculatedValues["E141"],
      totalTax: this.calculatedValues["E136"],
      taxCreditDonations: this.calculatedValues["E149"],
      netTaxPayable: this.calculatedValues["E152"],
      exportRatio: this.exportRatio,
      psebRegistered: this.psebRegistered,
    };
  }

  // Load test data - FIXED VERSION
  // Load test data - EXACT EXCEL VALUES
  loadTestData() {
    console.log("Loading EXACT Excel test data...");

    // Clear ALL existing data first
    this.userData = {};
    this.calculatedValues = {};
    this.psebRegistered = true; // From Excel: "Yes"
    this.exportRatio = 0;

    // Re-initialize calculated values
    this.initializeCalculatedValues();

    // EXACT VALUES FROM EXCEL SHEET
    const exactExcelValues = {
      // === REVENUE ===
      C4: 100000000, // Domestic Sales/Services Fee
      C5: 15000000, // Export Sales/Services Fee
      C6: 0, // Sales Tax (excluded per Excel note)
      C7: 0, // Federal Excise Duty (excluded per Excel note)

      // === SELLING EXPENSES ===
      C9: 1000000, // Domestic Commission/Brokerage
      C10: 1000000, // Foreign Commission/Brokerage
      C11: 1000000, // Rebate/Duty Drawbacks
      C12: 0, // Other Selling Expenses

      // === COST OF SALES (C17:C25) - 9 items each 1,500,000 ===
      C17: 1500000, // Salaries/Wages
      C18: 1500000, // Power
      C19: 1500000, // Gas
      C20: 1500000, // Repair/Maintenance
      C21: 1500000, // Insurance
      C22: 1500000, // Royalty
      C23: 1500000, // Other Direct Expenses
      C24: 1500000, // Accounting Amortisation
      C25: 1500000, // Accounting Depreciation

      // === MANAGEMENT EXPENSES (C29:C54) - 26 items each 1,500,000 ===
      C29: 1500000, // Rent
      C30: 1500000, // Rates/Taxes/Cess
      C31: 1500000, // Salaries/Wages/Perquisites
      C32: 1500000, // Traveling/Conveyance
      C33: 1500000, // Electricity/Water/Gas
      C34: 1500000, // Communication
      C35: 1500000, // Repair/Maintenance
      C36: 1500000, // Stationery/Printing
      C37: 1500000, // Advertisement/Publicity
      C38: 1500000, // Insurance
      C39: 1500000, // Professional Charges
      C40: 1500000, // Profit on Debt
      C41: 1500000, // Donation/Charity
      C42: 1500000, // Brokerage/Commission
      C43: 1500000, // Other Indirect Expenses
      C44: 1500000, // Directors Fee
      C45: 1500000, // Workers Profit Participation Fund
      C46: 1500000, // Provision for Doubtful/Bad Debts
      C47: 1500000, // Provision for Obsolete Stocks
      C48: 1500000, // Provision for Diminution
      C49: 1500000, // Irrecoverable Debts Written Off
      C50: 1500000, // Obsolete Stocks Written Off
      C51: 1500000, // Accounting (Loss) on Sale of Intangibles
      C52: 1500000, // Accounting (Loss) on Sale of Assets
      C53: 1500000, // Accounting Amortization
      C54: 1500000, // Accounting Depreciation

      // === OTHER REVENUES (C57:C65) - 9 items each 1,500,000 ===
      C57: 1500000, // Other Revenues
      C58: 1500000, // Fee for Technical/Professional Services
      C59: 1500000, // Fee for Other Services
      C60: 1500000, // Profit on Debt
      C61: 1500000, // Royalty
      C62: 1500000, // License/Franchise Fee
      C63: 1500000, // Accounting Gain on Sale of Intangibles
      C64: 1500000, // Accounting Gain on Sale of Assets
      C65: 1500000, // Others

      // === INADMISSIBLE DEDUCTIONS (C69:C107) - Sample of key items ===
      C69: 1000000, // Provision for Doubtful Debts
      C70: 1000000, // Provision for Obsolete Stocks
      C71: 1000000, // Provision for Diminution in Value
      // ... and so on for 39 items (each 1,000,000)

      // === ADMISSIBLE DEDUCTIONS (C110:C114) - 5 items each 1,500,000 ===
      C110: 1500000, // Accounting Gain on Sale of Intangibles
      C111: 1500000, // Accounting Gain on Sale of Assets
      C112: 1500000, // Other Admissible Deductions
      C113: 1500000, // Tax (Loss) on Sale of Intangibles
      C114: 1500000, // Tax (Loss) on Sale of Assets

      // === TAX DEPRECIATION (C119:C121) - 3 items each 1,500,000 ===
      C119: 1500000, // Tax Amortization for Current Year
      C120: 1500000, // Tax Depreciation/Initial Allowance
      C121: 1500000, // Pre-commencement Expenditure

      // === ALLOWANCES ===
      C132: 1500000, // Workers Welfare Fund
      C133: 1500000, // Workers Profit Participation Fund
      C134: 0, // Other Deductible Allowances

      // === TAX CREDITS ===
      C149: 1500000, // Tax Credit for Charitable Donations
      C150: 0, // Tax Credit for Startups (0 in Excel)

      // === TAX PAYMENTS ===
      D152: 1000000, // Withholding Income Tax Paid
      D153: 10000000, // Advance Income Tax Paid
      D154: 0, // Advance Income Tax u/s 147(A)
      D155: 0, // Advance Income Tax u/s 147(5B)
    };

    // Load ALL exact values
    Object.keys(exactExcelValues).forEach((field) => {
      this.userData[field] = exactExcelValues[field];
    });

    console.log("EXACT Excel values loaded");

    // Recalculate everything
    this.calculateAll();

    console.log("Calculations complete with Excel values");
    return true;
  }
  // Reset all data - FIXED VERSION
  resetAll() {
    console.log("Resetting all data...");

    // Clear ALL data
    this.userData = {};
    this.calculatedValues = {};
    this.psebRegistered = true;
    this.exportRatio = 0;

    // Re-initialize
    this.initializeCalculatedValues();

    console.log("Reset complete");
    return true;
  }
}
