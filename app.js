// app.js - SIMPLIFIED 2-COLUMN STRUCTURE WITH HIDDEN CALCULATION COLUMNS

// Initialize tax engine
const taxEngine = new TaxEngine();

// Row mapping system
const rowMapping = {};

// =========================================================================
// FBR CODE MAPPING
// =========================================================================

const fbrCodeMapping = {
  // Revenue Section
  C3: { field: "GROSS REVENUE", code: "3009" },
  C4: { field: "GROSS DOMESTIC SALES", code: "3004" },
  C5: { field: "GROSS EXPORT SALES", code: "3008" },
  C8: { field: "SELLING EXPENSES", code: "3019" },
  C9: { field: "DOMESTIC COMMISSION", code: "3011" },
  C10: { field: "FOREIGN COMMISSION", code: "3012" },
  C11: { field: "REBATE/DUTY DRAWBACKS", code: "3070" },
  C13: { field: "NET REVENUE", code: "3029" },
  C15: { field: "COST OF SALES", code: "3030" },
  C26: { field: "GROSS PROFIT", code: "3100" },
  C28: { field: "MANAGEMENT EXPENSES", code: "3199" },
  C56: { field: "OTHER REVENUES", code: "3129" },
  C66: { field: "ACCOUNTING PROFIT", code: "3200" },
  C68: { field: "INADMISSIBLE DEDUCTIONS", code: "3239" },
  C101: { field: "ADMISSIBLE DEDUCTIONS", code: "" },
  C108: { field: "INCOME BEFORE DEPRECIATION", code: "3270" },
  C110: { field: "TAX DEPRECIATION", code: "" },
  C115: { field: "INCOME/LOSS FROM BUSINESS", code: "3000" },
  C121: { field: "TOTAL INCOME", code: "9000" },
  C123: { field: "DEDUCTIBLE ALLOWANCES", code: "9009" },
  C126: { field: "TAXABLE INCOME", code: "9100" },

  // Direct Expenses (17-25)
  C17: { field: "SALARIES/WAGES", code: "3071" },
  C18: { field: "POWER", code: "3073" },
  C19: { field: "GAS", code: "3074" },
  C20: { field: "REPAIR/MAINTENANCE", code: "3077" },
  C21: { field: "INSURANCE", code: "3080" },
  C22: { field: "ROYALTY", code: "3081" },
  C23: { field: "OTHER DIRECT EXPENSES", code: "3083" },
  C24: { field: "ACCOUNTING AMORTISATION", code: "3087" },
  C25: { field: "ACCOUNTING DEPRECIATION", code: "3088" },

  // Indirect Expenses (29-54)
  C29: { field: "RENT", code: "3151" },
  C30: { field: "RATES/TAXES/CESS", code: "3152" },
  C31: { field: "SALARIES/WAGES/PERQUISITES", code: "3154" },
  C32: { field: "TRAVELING/CONVEYANCE", code: "3155" },
  C33: { field: "ELECTRICITY/WATER/GAS", code: "3158" },
  C34: { field: "COMMUNICATION", code: "3162" },
  C35: { field: "REPAIR/MAINTENANCE", code: "3165" },
  C36: { field: "STATIONERY/PRINTING", code: "3166" },
  C37: { field: "ADVERTISEMENT/PUBLICITY", code: "3168" },
  C38: { field: "INSURANCE", code: "3170" },
  C39: { field: "PROFESSIONAL CHARGES", code: "3171" },
  C40: { field: "PROFIT ON DEBT", code: "3172" },
  C41: { field: "DONATION/CHARITY", code: "3174" },
  C42: { field: "BROKERAGE/COMMISSION", code: "3178" },
  C43: { field: "OTHER INDIRECT EXPENSES", code: "3180" },
  C44: { field: "DIRECTORS FEE", code: "3183" },
  C45: { field: "WORKERS PROFIT PARTICIPATION FUND", code: "3185" },
  C46: { field: "PROVISION FOR DOUBTFUL DEBTS", code: "3191" },
  C47: { field: "PROVISION FOR OBSOLETE STOCKS", code: "3192" },
  C48: { field: "PROVISION FOR DIMINUTION IN INVESTMENT", code: "3193" },
  C49: { field: "IRRECOVERABLE DEBTS WRITTEN OFF", code: "3186" },
  C50: { field: "OBSOLETE STOCKS WRITTEN OFF", code: "3187" },
  C51: { field: "ACCOUNTING LOSS ON SALE OF INTANGIBLES", code: "3195" },
  C52: { field: "ACCOUNTING LOSS ON SALE OF ASSETS", code: "3196" },
  C53: { field: "ACCOUNTING AMORTIZATION", code: "3197" },
  C54: { field: "ACCOUNTING DEPRECIATION", code: "3198" },

  // Other Revenues (58-65)
  C58: { field: "FEE FOR TECHNICAL/PROFESSIONAL SERVICES", code: "3101" },
  C59: { field: "FEE FOR OTHER SERVICES", code: "3102" },
  C60: { field: "PROFIT ON DEBT", code: "3106" },
  C61: { field: "ROYALTY", code: "3107" },
  C62: { field: "LICENSE/FRANCHISE FEE", code: "3108" },
  C63: { field: "ACCOUNTING GAIN ON SALE OF INTANGIBLES", code: "3115" },
  C64: { field: "ACCOUNTING GAIN ON SALE OF ASSETS", code: "3116" },
  C65: { field: "OTHERS", code: "3128" },

  // Inadmissible Deductions (69-93)
  C69: { field: "PROVISION FOR DOUBTFUL DEBTS", code: "3201" },
  C70: { field: "PROVISION FOR OBSOLETE STOCKS", code: "3202" },
  C71: { field: "PROVISION FOR DIMINUTION", code: "3203" },
  C72: { field: "PROVISION FOR RESERVES", code: "3204" },
  C73: { field: "CESS/RATE/TAX LEVIED", code: "3205" },
  C74: { field: "TAX DEDUCTED AT SOURCE", code: "3206" },
  C75: { field: "PAYMENTS LIABLE TO TAX", code: "3207" },
  C76: { field: "ENTERTAINMENT EXPENDITURE", code: "3208" },
  C77: { field: "CONTRIBUTIONS TO UNRECOGNIZED FUNDS", code: "3209" },
  C78: { field: "CONTRIBUTIONS TO FUNDS", code: "3210" },
  C79: { field: "FINE/PENALTY", code: "3211" },
  C80: { field: "PERSONAL EXPENDITURE", code: "3212" },
  C81: { field: "AOP TO MEMBER", code: "3213" },
  C82: { field: "EXPENDITURE EXCEEDING LIMIT", code: "3125" },
  C83: { field: "EXPENDITURE NOT THROUGH DIGITAL MODE", code: "3228" },
  C84: { field: "SALARY EXCEEDING LIMIT", code: "3216" },
  C85: { field: "CAPITAL EXPENDITURE", code: "3217" },
  C86: {
    field: "EXPENDITURE ATTRIBUTABLE TO NON-BUSINESS INCOME",
    code: "3218",
  },
  C87: { field: "LEASE RENTAL NOT ADMISSIBLE", code: "3220" },
  C88: { field: "TAX GAIN ON SALE OF INTANGIBLES", code: "3225" },
  C89: { field: "TAX GAIN ON SALE OF ASSETS", code: "3226" },
  C90: { field: "UTILITY BILLS EXCEEDING LIMIT", code: "322902" },
  C91: { field: "PROFIT ON DEBIT INADMISSIBLE U/S 106A", code: "322904" },
  C92: { field: "PRE-COMMENCEMENT EXPENDITURE", code: "3230" },
  C93: { field: "OTHER INADMISSIBLE DEDUCTIONS", code: "3234" },

  // Admissible Deductions (102-106)
  C102: { field: "ACCOUNTING GAIN ON SALE OF INTANGIBLES", code: "3245" },
  C103: { field: "ACCOUNTING GAIN ON SALE OF ASSETS", code: "3246" },
  C104: { field: "OTHER ADMISSIBLE DEDUCTIONS", code: "3254" },
  C105: { field: "TAX LOSS ON SALE OF INTANGIBLES", code: "3255" },
  C106: { field: "TAX LOSS ON SALE OF ASSETS", code: "3256" },

  // Tax Depreciation (111-113)
  C111: { field: "TAX AMORTIZATION CURRENT YEAR", code: "3247" },
  C112: { field: "TAX DEPRECIATION CURRENT YEAR", code: "3248" },
  C113: { field: "PRE-COMMENCEMENT EXPENDITURE", code: "3250" },

  // Allowances
  C124: { field: "WORKERS WELFARE FUND", code: "9002" },

  // Tax Section (E column)
  E128: { field: "TAX CHARGEABLE", code: "9200" },
  E129: { field: "NORMAL INCOME TAX @ 29%", code: "920000" },
  E130: { field: "FINAL/FIXED TAX @ 2.5%", code: "920100" },
  E131: { field: "ALTERNATE CORPORATE TAX @ 17%", code: "923173" },
  E132: { field: "MINIMUM TAX @ 1.25%", code: "923195" },
  E133: { field: "DIFFERENCE OF MINIMUM TAX", code: "923194" },
  E139: { field: "TAX CREDIT", code: "9329" },
  E140: { field: "CHARITABLE DONATIONS CREDIT", code: "9311" },
  E141: { field: "TAX CREDIT FOR CERTAIN PERSONS", code: "931901" },
  E144: { field: "NET TAX LIABILITY", code: "" },
  E146: { field: "ADVANCE TAX TOTAL", code: "" },
  E147: { field: "WITHHOLDING INCOME TAX", code: "9201" },
  E148: { field: "ADVANCE INCOME TAX", code: "9202" },
  E149: { field: "ADVANCE INCOME TAX U/S 147(A)", code: "92022" },
  E150: { field: "ADVANCE INCOME TAX U/S 147(5B)", code: "92021" },
  E152: { field: "ADMITTED INCOME TAX", code: "9203" },
  E153: { field: "REFUNDABLE INCOME TAX", code: "9210" },
};

// =========================================================================
// INITIALIZE ROW MAPPING
// =========================================================================

function initializeRowMapping() {
  // Clear existing mapping
  Object.keys(rowMapping).forEach((key) => delete rowMapping[key]);

  // Define all calculation rows
  const calcRows = [
    3, 4, 5, 7, 8, 9, 10, 11, 13, 15, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
    28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46,
    47, 48, 49, 50, 51, 52, 53, 54, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66,
    68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86,
    87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 101, 102, 103, 104, 105,
    106, 108, 110, 111, 112, 113, 115, 116, 117, 118, 119, 120, 121, 123, 124,
    126, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 139, 140, 141, 142,
    144, 146, 147, 148, 149, 150, 152, 153,
  ];

  calcRows.forEach((calcRow) => {
    rowMapping[calcRow] = calcRow;
  });
}

// =========================================================================
// TABLE STRUCTURE (YOUR EXISTING TABLE)
// =========================================================================

const tableStructure = [
  // Row 1: Empty
  { type: "empty" },
  { type: "empty" },

  // Row 3: GROSS REVENUE
  {
    type: "total",
    displayRow: 3,
    description: "GROSS REVENUE ( EXCLUDING SALES TAX & FEDERAL EXCISE DUTY)",
    formula: "C4+C5",
  },

  // Row 4: DOMESTIC SALES
  {
    type: "input",
    displayRow: 4,
    description: "GROSS DOMESTIC SALES/ SERVICES FEE",
    tooltip: "Enter the total sales revenue or services fee earned inside Pakistan",
  },

  // Row 5: EXPORT SALES
  {
    type: "input",
    displayRow: 5,
    description: "GROSS EXPORT SALES/ SERVICES FEE",
    tooltip: "Enter total export sales/IT services revenue earned outside Pakistan.",
  },

  // Row 6: PSEB Registration (Dropdown)
  {
    type: "pseb-dropdown",
    displayRow: 6,
    description: "Is Company registered with PSEB",
  },
  { type: "empty" },
  { type: "empty" },

  // Row 8: SELLING EXPENSES TOTAL
  {
    type: "total",
    displayRow: 8,
    description:
      "SELLING EXPENSES(FREIGHT OUTWARD, BROKERAGE, COMMISSION, DISCOUNT etc.)",
    formula: "C9+C10+C11",
  },

  // Row 9: DOMESTIC COMMISSION
  {
    type: "input",
    displayRow: 9,
    description:
      "DOMESTIC COMMISSION/ BROKERAGE/ DISCOUNT/ FREIGHT OUTWARD, etc.",
    tooltip:
      "Enter the commission, brokerage, or discount given on local sales.",
  },

  // Row 10: FOREIGN COMMISSION
  {
    type: "input",
    displayRow: 10,
    description:
      "FOREIGN COMMISSION/ BROKERAGE/ DISCOUNT/ FREIGHT OUTWARD, etc.",
    tooltip:
      "Enter the commission, brokerage, or discount given on foreign sales.",
  },

  // Row 11: REBATE/DUTY DRAWBACKS
  {
    type: "input",
    displayRow: 11,
    description: "REBATE/ DUTY DRAWBACKS",
  },

  { type: "empty" },
  { type: "empty" },

  // Row 15: COST OF SALES TOTAL
  {
    type: "total",
    displayRow: 15,
    description: "COST OF SALES/ SERVICES",
    formula: "C17+C18+C19+C20+C21+C22+C23+C24+C25",
  },

  // Row 16: DIRECT EXPENSES HEADER
  {
    type: "section",
    displayRow: 16,
    description: "DIRECT EXPENSES",
  },

  // Rows 17-25: Direct Expenses Items
  { type: "input", displayRow: 17, description: "SALARIES/ WAGES" },
  { type: "input", displayRow: 18, description: "POWER" },
  { type: "input", displayRow: 19, description: "GAS" },
  { type: "input", displayRow: 20, description: "REPAIR/ MAINTENANCE" },
  { type: "input", displayRow: 21, description: "INSURANCE" },
  { type: "input", displayRow: 22, description: "ROYALTY" },
  { type: "input", displayRow: 23, description: "OTHER DIRECT EXPENSES" },
  {
    type: "input",
    displayRow: 24,
    description: "ACCOUNTING AMORTISATION",
    tooltip:
      "Enter the annual amortization amount for intangible assets. Example: If a software license costs 500,000 for 5 years, enter 100,000.",
  },
  {
    type: "input",
    displayRow: 25,
    description: "ACCOUNTING DEPRECIATION",
    tooltip:
      "Enter the annual depreciation amount for physical assets. Example: If a machine costs 1,000,000 with 5-year life, enter 200,000.",
  },

  // Row 26: GROSS PROFIT
  {
    type: "subtotal",
    displayRow: 26,
    description: "GROSS PROFIT/ (LOSS)",
    formula: "C13-C15",
  },

  { type: "empty" },
  { type: "empty" },

  // Row 28: INDIRECT EXPENSES TOTAL
  {
    type: "total",
    displayRow: 28,
    description: "MANAGEMENT, ADMINISTRATIVE, SELLING & FINANCIAL EXPENSES",
    formula: "C29:C54",
  },

  // Rows 29-54: Indirect Expenses Items
  { type: "input", displayRow: 29, description: "RENT" },
  { type: "input", displayRow: 30, description: "RATES / TAXES / CESS" },
  {
    type: "input",
    displayRow: 31,
    description: "SALARIES / WAGES / PERQUISITES / BENEFITS",
  },
  {
    type: "input",
    displayRow: 32,
    description: "TRAVELING / CONVEYANCE / VEHICLES RUNNING / MAINTENANCE",
  },
  { type: "input", displayRow: 33, description: "ELECTRICITY / WATER / GAS" },
  { type: "input", displayRow: 34, description: "COMMUNICATION" },
  { type: "input", displayRow: 35, description: "REPAIR / MAINTENANCE" },
  {
    type: "input",
    displayRow: 36,
    description: "STATIONERY / PRINTING / PHOTOCOPIES / OFFICE SUPPLIES",
  },
  {
    type: "input",
    displayRow: 37,
    description: "ADVERTISEMENT / PUBLICITY / PROMOTION",
  },
  { type: "input", displayRow: 38, description: "INSURANCE" },
  { type: "input", displayRow: 39, description: "PROFESSIONAL CHARGES" },
  {
    type: "input",
    displayRow: 40,
    description: "PROFIT ON DEBT (FINANCIAL CHARGES / MARKUP / INTEREST)",
    tooltip: "Enter the total interest, markup, or finance cost PAID on bank loans or borrowings. (Do not enter earned income here).",
  },
  { type: "input", displayRow: 41, description: "DONATION / CHARITY" },
  { type: "input", displayRow: 42, description: "BROKERAGE / COMMISSION" },
  { type: "input", displayRow: 43, description: "OTHER INDIRECT EXPENSES" },
  { type: "input", displayRow: 44, description: "DIRECTORS FEE" },
  {
    type: "input",
    displayRow: 45,
    description: "WORKERS PROFIT PARTICIPATION FUND",
    tooltip: "Enter the amount contributed to workers' profit sharing fund.",
  },
  {
    type: "input",
    displayRow: 46,
    description: "PROVISION FOR DOUBTFUL / BAD DEBTS",
    tooltip:
      "Enter the amount of debts that may not be recovered. Example: If customer owes 100,000 and may not pay, enter 100,000.",
  },
  {
    type: "input",
    displayRow: 47,
    description:
      "PROVISION FOR OBSOLETE STOCKS / STORES / SPARES / FIXED ASSETS",
    tooltip:
      "Enter the value of old/useless stock that may not be sold. Example: If you have 200,000 worth of slow-moving stock, enter 200,000.",
  },
  {
    type: "input",
    displayRow: 48,
    description: "PROVISION FOR DIMINUTION IN VALUE OF INVESTMENT",
    tooltip:
      "Enter the decrease in value of your investments. Example: If investment of 500,000 is now worth 400,000, enter 100,000.",
  },
  {
    type: "input",
    displayRow: 49,
    description: "IRRECOVERABLE DEBTS WRITTEN OFF",
    tooltip:
      "Enter the debts that cannot be recovered and are removed from accounts.",
  },
  {
    type: "input",
    displayRow: 50,
    description: "OBSOLETE STOCKS / STORES / SPARES / FIXED ASSETS WRITTEN OFF",
    tooltip: "Enter the old/useless stock removed from accounts.",
  },
  {
    type: "input",
    displayRow: 51,
    description: "ACCOUNTING (LOSS) ON SALE OF INTANGIBLES",
    tooltip:
      "Enter the loss from selling non-physical assets for less than book value. Example: Bought for 200,000 sold for 150,000, enter 50,000.",
  },
  {
    type: "input",
    displayRow: 52,
    description: "ACCOUNTING (LOSS) ON SALE OF ASSETS",
    tooltip:
      "Enter the loss from selling physical assets for less than book value. Example: Bought for 500,000 sold for 300,000, enter 200,000.",
  },
  {
    type: "input",
    displayRow: 53,
    description: "ACCOUNTING AMORTIZATION",
    tooltip: "Enter the annual amortization amount for intangible assets.",
  },
  {
    type: "input",
    displayRow: 54,
    description: "ACCOUNTING DEPRECIATION",
    tooltip: "Enter the annual depreciation amount for physical assets.",
  },

  { type: "empty" },
  { type: "empty" },

  // Row 56: OTHER REVENUES TOTAL
  {
    type: "total",
    displayRow: 56,
    description: "ADD: OTHER REVENUES",
    formula: "C57:C65",
  },

  // Rows 58-65: Other Revenues
  {
    type: "input",
    displayRow: 58,
    description: "FEE FOR TECHNICAL / PROFESSIONAL SERVICES",
    tooltip: "Enter the fees earned from technical or professional services.",
  },
  { type: "input", displayRow: 59, description: "FEE FOR OTHER SERVICES" },
  { type: "input", displayRow: 60, description: "PROFIT ON DEBT" },
  { type: "input", displayRow: 61, description: "ROYALTY" },
  { type: "input", displayRow: 62, description: "LICENSE / FRANCHISE FEE" },
  {
    type: "input",
    displayRow: 63,
    description: "ACCOUNTING GAIN ON SALE OF INTANGIBLES",
    tooltip:
      "Enter the profit from selling non-physical assets for more than book value. Example: Bought for 200,000 sold for 300,000, enter 100,000.",
  },
  {
    type: "input",
    displayRow: 64,
    description: "ACCOUNTING GAIN ON SALE OF ASSETS",
    tooltip:
      "Enter the profit from selling physical assets for more than book value. Example: Bought for 500,000 sold for 700,000, enter 200,000.",
  },
  { type: "input", displayRow: 65, description: "OTHERS" },

  // Row 66: ACCOUNTING PROFIT
  {
    type: "total",
    displayRow: 66,
    description: "ACCOUNTING PROFIT/ (LOSS)",
    formula: "C26-C28+C56",
    tooltip: "Auto-calculated. Profit shown in the company's accounting books.",
  },

  { type: "empty" },
  { type: "empty" },

  // Row 68: INADMISSIBLE DEDUCTIONS TOTAL
  {
    type: "total",
    displayRow: 68,
    description: "INADMISSIBLE DEDUCTIONS",
    formula: "C69:C99",
    tooltip: "Enter the deductions that are not allowed as per tax laws.",
  },

  // Rows 69-93: Inadmissible Deductions
  {
    type: "input",
    displayRow: 69,
    description: "PROVISION FOR DOUBTFUL DEBTS",
    tooltip:
      "Enter the amount of debts that may not be recovered. Example: If customer owes 100,000 and may not pay, enter 100,000.",
  },
  {
    type: "input",
    displayRow: 70,
    description: "PROVISION FOR OBSOLETE STOCKS",
    tooltip: "Enter the value of old/useless stocks that may not be sold.",
  },
  {
    type: "input",
    displayRow: 71,
    description: "PROVISION FOR DIMINUTION IN VALUE OF INVESTMENT",
    tooltip: "Enter the decrease in value of your investments.",
  },
  {
    type: "input",
    displayRow: 72,
    description: "PROVISION FOR RESERVES / FUNDS",
    tooltip: "Enter the amount set aside for future expenses or reserves.",
  },
  {
    type: "input",
    displayRow: 73,
    description: "CESS / RATE / TAX LEVIED ON PROFITS",
    tooltip: "Enter the additional tax like education cess charged on profits.",
  },
  {
    type: "input",
    displayRow: 74,
    description: "AMOUNT OF TAX DEDUCTED AT SOURCE",
    tooltip: "Only enter withholding tax here if it was mistakenly charged as an expense in your accounting P&L.",
  },
  {
    type: "input",
    displayRow: 75,
    description: "PAYMENTS LIABLE TO TAX NOT DEDUCTED",
    tooltip:
      "Enter the amount of payments where tax should have been deducted but was not.",
  },
  {
    type: "input",
    displayRow: 76,
    description: "ENTERTAINMENT EXPENDITURE",
    tooltip: "Enter the expenses on client dinners, lunches, or entertainment.",
  },
  {
    type: "input",
    displayRow: 77,
    description: "CONTRIBUTIONS TO UNRECOGNIZED FUNDS",
    tooltip: "Enter the amounts given to funds not approved by FBR.",
  },
  {
    type: "input",
    displayRow: 78,
    description: "CONTRIBUTIONS TO FUNDS",
    tooltip: "Enter the amounts given to approved funds like pension funds.",
  },
  {
    type: "input",
    displayRow: 79,
    description: "FINE / PENALTY",
    tooltip: "Enter the penalties paid for violating any law or regulation.",
  },
  {
    type: "input",
    displayRow: 80,
    description: "PERSONAL EXPENDITURE",
    tooltip:
      "Enter the owner or partner's personal expenses not related to business.",
  },
  {
    type: "input",
    displayRow: 81,
    description: "AOP TO ITS MEMBER",
    tooltip:
      "Enter the amount paid by an Association of Persons (AOP) to its member.",
  },
  {
    type: "input",
    displayRow: 82,
    description: "EXPENDITURE EXCEEDING LIMIT",
    tooltip: "Enter the cash payments made above FBR's prescribed limit.",
  },
  {
    type: "input",
    displayRow: 83,
    description: "EXPENDITURE NOT THROUGH DIGITAL MODE",
    tooltip:
      "Enter the payments not made through digital modes like bank transfer.",
  },
  {
    type: "input",
    displayRow: 84,
    description: "SALARY EXCEEDING LIMIT",
    tooltip:
      "Enter the salary paid above FBR's limit without proper documentation.",
  },
  {
    type: "input",
    displayRow: 85,
    description: "CAPITAL EXPENDITURE",
    tooltip:
      "Enter the expenses on purchasing assets like machinery or buildings.",
  },
  {
    type: "input",
    displayRow: 86,
    description: "EXPENDITURE ATTRIBUTABLE TO NON-BUSINESS INCOME",
    tooltip:
      "Enter the expenses related to non-business income like personal property.",
  },
  {
    type: "input",
    displayRow: 87,
    description: "LEASE RENTAL NOT ADMISSIBLE",
    tooltip:
      "Enter the lease rental expenses that are not allowed under tax laws.",
  },
  {
    type: "input",
    displayRow: 88,
    description: "TAX GAIN ON SALE OF INTANGIBLES",
    tooltip:
      "Enter the profit from selling non-physical assets like software or patents.",
  },
  {
    type: "input",
    displayRow: 89,
    description: "TAX GAIN ON SALE OF ASSETS",
    tooltip:
      "Enter the profit from selling physical assets like machinery or buildings.",
  },
  {
    type: "input",
    displayRow: 90,
    description: "UTILITY BILLS EXCEEDING LIMIT",
    tooltip:
      "Enter the utility bills (electricity, gas) paid above FBR's limit.",
  },
  {
    type: "input",
    displayRow: 91,
    description: "PROFIT ON DEBIT INADMISSIBLE U/S 106A",
    tooltip:
      "Enter the profit that is inadmissible under Section 106A of tax law.",
  },
  {
    type: "input",
    displayRow: 92,
    description: "PRE-COMMENCEMENT EXPENDITURE",
    tooltip:
      "Enter the expenses incurred before starting the business (registration, licenses).",
  },
  {
    type: "input",
    displayRow: 93,
    description: "OTHER INADMISSIBLE DEDUCTIONS",
    tooltip: "Enter other deductions that are not admissible under tax laws.",
  },

  { type: "empty" },
  { type: "empty" },

  // Row 101: ADMISSIBLE DEDUCTIONS TOTAL
  {
    type: "total",
    displayRow: 101,
    description: "ADMISSIBLE DEDUCTIONS",
    formula: "C102:C106",
    tooltip: "Enter the deductions that are allowed as per tax laws.",
  },

  // Rows 102-106: Admissible Deductions
  {
    type: "input",
    displayRow: 102,
    description: "ACCOUNTING GAIN ON SALE OF INTANGIBLES",
    tooltip:
      "Enter the profit from selling non-physical assets for more than book value.",
  },
  {
    type: "input",
    displayRow: 103,
    description: "ACCOUNTING GAIN ON SALE OF ASSETS",
    tooltip:
      "Enter the profit from selling physical assets for more than book value.",
  },
  {
    type: "input",
    displayRow: 104,
    description: "OTHER ADMISSIBLE DEDUCTIONS",
  },
  {
    type: "input",
    displayRow: 105,
    description: "TAX (LOSS) ON SALE OF INTANGIBLES",
    tooltip:
      "Enter the tax loss on sale of non-physical assets like software or patents.",
  },
  {
    type: "input",
    displayRow: 106,
    description: "TAX (LOSS) ON SALE OF ASSETS",
    tooltip:
      "Enter the tax loss on sale of physical assets like machinery or buildings.",
  },

  { type: "empty" },
  { type: "empty" },

  // Row 110: TAX DEPRECIATION TOTAL
  {
    type: "total",
    displayRow: 110,
    description: "TAX DEPRECIATION/ INITIAL ALLOWANCE/ AMORTISATION",
    formula: "C111:C113",
  },

  // Rows 111-113: Tax Depreciation
  {
    type: "input",
    displayRow: 111,
    description: "TAX AMORTIZATION FOR CURRENT YEAR",
    tooltip:
      "Enter the amortization amount claimed for tax purposes this year.",
  },
  {
    type: "input",
    displayRow: 112,
    description: "TAX DEPRECIATION / INITIAL ALLOWANCE",
    tooltip:
      "Enter the depreciation or initial allowance claimed for tax purposes this year.",
  },
  {
    type: "input",
    displayRow: 113,
    description: "PRE-COMMENCEMENT EXPENDITURE",
    tooltip: "Enter the expenses incurred before starting the business.",
  },

  // Row 115: BUSINESS INCOME
  {
    type: "calculated",
    displayRow: 115,
    description: "INCOME/ LOSS FROM BUSINESS",
    formula: "C108-C110",
  },

  // Row 121: TOTAL INCOME
  {
    type: "total",
    displayRow: 121,
    description: "TOTAL INCOME",
    formula: "C115",
  },

  { type: "empty" },
  { type: "empty" },

  // Row 123: DEDUCTIBLE ALLOWANCES TOTAL
  {
    type: "total",
    displayRow: 123,
    description: "DEDUCTIBLE ALLOWANCES",
    formula: "C124",
  },

  // Row 124: Workers Welfare Fund
  {
    type: "input",
    displayRow: 124,
    description: "WORKERS WELFARE FUND U/S 60A",
    tooltip: "Enter the amount paid to the workers welfare fund.",
  },

  { type: "empty" },
  { type: "empty" },

  // Row 126: TAXABLE INCOME
  {
    type: "total",
    displayRow: 126,
    description: "TAXABLE INCOME",
    formula: "C121-C123",
  },

  // ========== TAX CALCULATION SECTION ==========

  { type: "empty", displayRow: 127 },

  // Row 128: TAX CHARGEABLE
  {
    type: "tax-header",
    displayRow: 128,
    description: "TAX CHARGEABLE",
  },

  // Row 129: NORMAL INCOME TAX
  {
    type: "tax-calc",
    displayRow: 129,
    description: "NORMAL INCOME TAX",
    formula: "IF(E126>0,E126*0.29,0)",
  },

  // Row 130: FINAL/FIXED TAX
  {
    type: "tax-calc",
    displayRow: 130,
    description: "FINAL/ FIXED INCOME TAX",
    formula: "D5*0.025",
  },

  // Row 131: ALTERNATE CORPORATE TAX
  {
    type: "tax-calc",
    displayRow: 131,
    description: "ALTERNATE CORPORATE TAX",
    formula: "IF(C66>0,C66*0.17,0)",
  },

  // Row 132: MINIMUM TAX
  {
    type: "tax-calc",
    displayRow: 132,
    description: "MINIMUM TAX",
    formula: "IF(E3>100000000,E3*0.0125,0)",
  },

  // Row 133: DIFFERENCE OF MINIMUM TAX
  {
    type: "tax-calc",
    displayRow: 133,
    description: "DIFFERENCE OF MINIMUM TAX",
    formula: "IF((E132>E129),(E132-E129),0)",
  },

  { type: "empty", displayRow: 138 },

  // Row 139: TAX CREDIT
  {
    type: "tax-result",
    displayRow: 139,
    description: "TAX CREDIT -",
  },

  // Row 140: CHARITABLE DONATIONS CREDIT
  {
    type: "tax-input",
    displayRow: 140,
    description: "Tax Credit for Charitable Donations",
    tooltip: "Enter the tax credit received for making charitable donations.",
  },

  // Row 141: OTHER CREDITS
  {
    type: "tax-calc-fixed",
    displayRow: 141,
    description: "Tax Credit for Certain Persons",
    value: 0,
  },

  // Row 142: STARTUP QUESTION
  {
    type: "startup-dropdown",
    displayRow: 142,
    description: "Are you a startup or IT services Exporter?",
  },

  { type: "empty", displayRow: 143 },

  // Row 144: NET TAX LIABILITY
  {
    type: "tax-result",
    displayRow: 144,
    description: "Net TAX LIABILITY",
    formula: "E128-E139",
  },

  { type: "empty", displayRow: 145 },

  // Row 146: ADVANCE TAX TOTAL
  {
    type: "tax-result",
    displayRow: 146,
    description: "Advance Tax Total",
    formula: "SUM(E147:E150)",
  },

  // Row 147-150: Advance Tax Inputs
  {
    type: "e-input",
    displayRow: 147,
    description: "WITHHOLDING INCOME TAX",
    tooltip:
      "Enter the total adjustable withholding tax (WHT) deducted from company payments (e.g., imports, utilities, bank transactions)",
  },
  {
    type: "e-input",
    displayRow: 148,
    description: "ADVANCE INCOME TAX",
    tooltip: "Enter the total advance tax paid through quarterly challans during the year. This includes all 4 regular installments (Sep, Dec, Mar, Jun). Example: If you paid 250,000 each quarter, enter 1,000,000.",
  },
  {
    type: "e-input",
    displayRow: 149,
    description: "ADVANCE INCOME TAX U/S 147(A)",
    tooltip: "Section 147(A): Enter voluntary extra advance tax paid outside quarterly installments. Example: Paid 200,000 extra, enter 200,000.",
  },
  {
    type: "e-input",
    displayRow: 150,
    description: "ADVANCE INCOME TAX U/S 147(5B)",
    tooltip: "Section 147(5B): Enter advance tax paid on specific transactions like property sale, vehicle sale, etc. This is separate from regular advance tax.",
  },
];

// =========================================================================
// UTILITY FUNCTIONS
// =========================================================================

function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return "0";
  return Math.round(num).toLocaleString("en-US");
}


// =========================================================================
// CREATE TABLE ROW
// =========================================================================

function createTableRow(item, index) {
  const row = document.createElement("tr");
  const calcRow = rowMapping[item.displayRow] || item.displayRow;

  if (item.class) {
    row.className = item.class;
  }

  row.setAttribute("data-row", item.displayRow);

  const showEValueInAmount = item.displayRow >= 128;
  const amountColumnValue = showEValueInAmount
    ? taxEngine.getValue(`E${calcRow}`)
    : taxEngine.getValue(`C${calcRow}`);

  // Helper function to render description with tooltip
  const renderDescription = (description, tooltip) => {
    if (tooltip) {
      return `${description} <span class="info-icon" data-tooltip="${tooltip.replace(/"/g, '&quot;')}">?</span>`;
    }
    return description;
  };

  switch (item.type) {
    case "empty":
      row.innerHTML = `<td colspan="2" style="height: 10px;"></td>`;
      break;

    case "header":
      row.innerHTML = `
        <td><strong>${item.description}</strong></td>
        <td class="input-col"><strong>Amount</strong></td>
      `;
      break;

    case "input":
      if (item.displayRow >= 128) {
        row.innerHTML = `
          <td>${renderDescription(item.description, item.tooltip)}</td>
          <td class="input-col calculated-cell tax-cell" id="C${item.displayRow}">
            ${formatNumber(amountColumnValue)}
          </td>
        `;
      } else {
        row.innerHTML = `
          <td>${renderDescription(item.description, item.tooltip)}</td>
          <td class="input-col">
            <input type="text" 
                   id="C${item.displayRow}" 
                   data-calc-row="${calcRow}"
                   data-column="C"
                   value="${formatNumber(taxEngine.getValue(`C${calcRow}`))}"
                   placeholder="Enter amount">
          </td>
        `;
      }
      break;

    case "calculated":
    case "calculated-special":
      if (item.displayRow >= 128) {
        row.innerHTML = `
          <td>${renderDescription(item.description, item.tooltip)}</td>
          <td class="input-col calculated-cell tax-cell" id="C${item.displayRow}">
            ${formatNumber(amountColumnValue)}
          </td>
        `;
      } else {
        row.innerHTML = `
          <td>${renderDescription(item.description, item.tooltip)}</td>
          <td class="input-col calculated-cell" id="C${item.displayRow}">
            ${formatNumber(amountColumnValue)}
          </td>
        `;
      }
      break;

    case "pseb-dropdown":
      const psebValue = taxEngine.getValue("D6") || "Yes";
      row.innerHTML = `
        <td><strong>${item.description}</strong></td>
        <td class="input-col">
          <select id="D6" data-calc-row="6" data-column="D" style="width: 100%; border: none; background: transparent; font-family: Consolas; font-size: 11px; color: #52c41a; padding: 2px 4px;">
            <option value="Yes" ${psebValue === "Yes" ? "selected" : ""}>Yes</option>
            <option value="No" ${psebValue === "No" ? "selected" : ""}>No</option>
          </select>
        </td>
      `;
      break;

    case "startup-dropdown":
      const startupValue = taxEngine.getValue("C142") || "No";
      row.innerHTML = `
        <td><strong>${item.description}</strong></td>
        <td class="input-col">
          <select id="C142" data-calc-row="142" data-column="C" style="width: 100%; border: none; background: transparent; font-family: Consolas; font-size: 11px; color: #1890ff; padding: 2px 4px;">
            <option value="Yes" ${startupValue === "Yes" ? "selected" : ""}>Yes</option>
            <option value="No" ${startupValue === "No" ? "selected" : ""}>No</option>
          </select>
        </td>
      `;
      break;

    case "ratio":
      row.innerHTML = `
        <td><strong>${item.description}</strong></td>
        <td class="input-col calculated-cell" id="C${item.displayRow}">
          ${taxEngine.getValue("D7") ? taxEngine.getValue("D7").toFixed(4) : "0.0000"} / 
          ${taxEngine.getValue("D7") ? (1 - taxEngine.getValue("D7")).toFixed(4) : "1.0000"}
        </td>
      `;
      break;

    case "total":
    case "subtotal":
      if (item.displayRow >= 128) {
        row.innerHTML = `
          <td><strong>${renderDescription(item.description, item.tooltip)}</strong></td>
          <td class="input-col calculated-cell tax-cell" id="C${item.displayRow}">
            ${formatNumber(amountColumnValue)}
          </td>
        `;
      } else {
        row.innerHTML = `
          <td><strong>${renderDescription(item.description, item.tooltip)}</strong></td>
          <td class="input-col calculated-cell" id="C${item.displayRow}">
            ${formatNumber(amountColumnValue)}
          </td>
        `;
      }
      break;

    case "tax-header":
    case "tax-calc":
    case "tax-calc-zero":
    case "tax-result":
      row.innerHTML = `
        <td>${renderDescription(item.description, item.tooltip)}</td>
        <td class="input-col calculated-cell tax-cell" id="C${item.displayRow}">
          ${formatNumber(taxEngine.getValue(`E${calcRow}`))}
        </td>
      `;
      break;

    case "tax-input":
      row.innerHTML = `
        <td>${renderDescription(item.description, item.tooltip)}</td>
        <td class="input-col">
          <input type="text" 
                 id="C${item.displayRow}" 
                 data-calc-row="${calcRow}"
                 data-column="C"
                 value="${formatNumber(taxEngine.getValue(`C${calcRow}`))}"
                 placeholder="Enter amount">
        </td>
      `;
      break;

    case "tax-input-zero":
      row.innerHTML = `
        <td>${renderDescription(item.description, item.tooltip)}</td>
        <td class="input-col">
          <input type="text" 
                 id="C${item.displayRow}" 
                 data-calc-row="${calcRow}"
                 data-column="C"
                 value="${formatNumber(item.value)}"
                 placeholder="Enter amount">
        </td>
      `;
      break;

    case "e-input":
      row.innerHTML = `
        <td><strong>${renderDescription(item.description, item.tooltip)}</strong></td>
        <td class="input-col">
          <input type="text" 
                 id="E${item.displayRow}" 
                 data-calc-row="${calcRow}"
                 data-column="E"
                 value="${formatNumber(taxEngine.getValue(`E${calcRow}`))}"
                 placeholder="Enter amount">
        </td>
      `;
      break;
  }

  return row;
}

// =========================================================================
// INPUT VALIDATION & HANDLERS
// =========================================================================

function validateInput(event) {
  const input = event.target;
  let value = input.value.replace(/,/g, "");
  value = value.replace(/-/g, "");

  const numValue = parseFloat(value);
  if (!isNaN(numValue) && numValue < 0) {
    input.value = "0";
  } else if (value === "" || value === "-") {
    input.value = "";
  } else {
    input.value = value;
  }
}

function formatInputValue(event) {
  const input = event.target;
  const value = input.value.replace(/,/g, "");
  const numValue = parseFloat(value);
  if (!isNaN(numValue)) {
    input.value = formatNumber(numValue);
  }
}

function handleInputChange(event) {
  const input = event.target;
  const column = input.dataset.column;
  const calcRow = input.dataset.calcRow;
  const value = input.value.replace(/,/g, "");

  if (value === "") {
    taxEngine.setValue(`${column}${calcRow}`, 0);
  } else {
    const numValue = parseFloat(value);
    taxEngine.setValue(`${column}${calcRow}`, Math.max(0, numValue));
  }
  updateDisplay();
}

function handleDropdownChange(event) {
  const select = event.target;
  const column = select.dataset.column;
  const calcRow = select.dataset.calcRow;
  const value = select.value;

  taxEngine.setValue(`${column}${calcRow}`, value);
  updateDisplay();
}

// =========================================================================
// UPDATE FUNCTIONS
// =========================================================================

function updateDisplay() {
  for (const displayRow of Object.keys(rowMapping)) {
    const calcRow = rowMapping[displayRow];

    const cCell = document.getElementById(`C${displayRow}`);
    if (cCell && cCell.classList.contains("calculated-cell")) {
      const valueToShow =
        displayRow >= 128
          ? taxEngine.getValue(`E${calcRow}`)
          : taxEngine.getValue(`C${calcRow}`);

      if (displayRow === 7) {
        cCell.textContent = `${taxEngine.getValue("D7") ? taxEngine.getValue("D7").toFixed(4) : "0.0000"} / ${taxEngine.getValue("D7") ? (1 - taxEngine.getValue("D7")).toFixed(4) : "1.0000"}`;
      } else {
        cCell.textContent = formatNumber(valueToShow);
      }
    }

    if (displayRow >= 128) {
      const eCell = document.getElementById(`E${displayRow}`);
      if (eCell && !eCell.querySelector("input")) {
        eCell.textContent = formatNumber(taxEngine.getValue(`E${calcRow}`));
      }
    }
  }

  updateResultsPanel();
}

function updateResultsPanel() {
  const results = taxEngine.getTaxResults();

  document.getElementById("normalTax").textContent = formatNumber(
    results.normalTax,
  );
  document.getElementById("finalTax").textContent = formatNumber(
    results.finalTax,
  );
  document.getElementById("alternateTax").textContent = formatNumber(
    results.alternateTax,
  );
  document.getElementById("minimumTax").textContent = formatNumber(
    results.minimumTax,
  );
  document.getElementById("taxChargeable").textContent = formatNumber(
    results.taxChargeable,
  );
  document.getElementById("admittedTax").textContent = formatNumber(
    results.admittedTax,
  );
  document.getElementById("refundableTax").textContent = formatNumber(
    results.refundableTax,
  );
}

// =========================================================================
// RENDER TABLE
// =========================================================================

function renderTable() {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  tableStructure.forEach((item, index) => {
    const row = createTableRow(item, index);
    tableBody.appendChild(row);
  });

  document.querySelectorAll("#tableBody input").forEach((input) => {
    if (!input.closest("td").classList.contains("calculated-cell")) {
      input.addEventListener("input", validateInput);
      input.addEventListener("input", handleInputChange);
      input.addEventListener("blur", formatInputValue);
    }
  });

  document.querySelectorAll("#tableBody select").forEach((select) => {
    select.addEventListener("change", handleDropdownChange);
  });
}

// =========================================================================
// INITIALIZATION
// =========================================================================

function init() {
  initializeRowMapping();
  renderTable();

  const resultsPanel = document.getElementById("resultsPanel");
  resultsPanel.style.display = "none";

  document
    .getElementById("calculateTax")
    .addEventListener("click", function (event) {
      // 1. Run engine calculations
      taxEngine.calculateAll();
      updateDisplay();

      // 2. Open the guide window
      console.log("📖 Opening Filing Guide...");
      const guideWindow = window.open("tax-filing-guide.html", "_blank");

      if (guideWindow) {
        let syncInterval = null;

        // 3. Send data to guide
        const sendData = () => {
          console.log("📤 Sending data to guide...");
          guideWindow.postMessage(
            {
              type: "POPULATE_FBR_GUIDE",
              payload: taxEngine.data,
            },
            "*",
          );
        };

        // Start polling
        syncInterval = setInterval(sendData, 200);

        // 4. Stop polling when guide acknowledges
        const receiveAck = (e) => {
          if (e.data.type === "DATA_RECEIVED") {
            console.log("✅ Guide received data. Stopping polling.");
            clearInterval(syncInterval);
            window.removeEventListener("message", receiveAck);
          }
        };
        window.addEventListener("message", receiveAck);

        // 5. Clean up if guide is closed
        const checkClosed = setInterval(() => {
          if (guideWindow.closed) {
            console.log("🔒 Guide window closed.");
            clearInterval(checkClosed);
            clearInterval(syncInterval);
            window.removeEventListener("message", receiveAck);
          }
        }, 500);
      } else {
        console.warn("⚠️ Popup blocked! Please allow popups for this site.");
        alert("Please allow popups to open the Filing Guide.");
      }

      // 6. Hide results panel (if it exists)
      const panel = document.getElementById("resultsPanel");
      if (panel) {
        panel.style.display = "none";
      }

      // 7. Button text stays the same - NO CHANGE
      // Button will always show "Calculate Final Tax"
    });
}

document.addEventListener("DOMContentLoaded", init);


