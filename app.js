// app.js - COMPLETE WITH EXACT EXCEL SEQUENCE INCLUDING EMPTY ROWS

// Initialize tax engine
const taxEngine = new TaxEngine();

// Row mapping system
const rowMapping = {};

// Initialize all row mappings
function initializeRowMapping() {
    // Clear existing mapping
    Object.keys(rowMapping).forEach(key => delete rowMapping[key]);
    
    // Define all calculation rows based on Excel structure
    const calcRows = [
        3, 4, 5, 7, 8, 9, 10, 11, 13, 15, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
        28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45,
        46, 47, 48, 49, 50, 51, 52, 53, 54, 56, 57, 58, 59, 60, 61, 62, 63, 64,
        65, 66, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83,
        84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101,
        102, 103, 104, 105, 106, 107, 109, 110, 111, 112, 113, 114, 116, 118, 119,
        120, 121, 123, 124, 125, 126, 127, 128, 129, 131, 132, 133, 135, 136, 137,
        138, 140, 141, 142, 146,148 , 149, 150, 152, 153, 154, 155, 156, 157
    ];
    
    // Map display rows to calculation rows (they are the same in this case)
    calcRows.forEach(calcRow => {
        rowMapping[calcRow] = calcRow;
    });
}

// EXACT TABLE STRUCTURE MATCHING EXCEL
const tableStructure = [
    // Row 1: Empty
    { type: 'empty', displayRow: 1 },
    
    // Row 2: Header
    { 
        type: 'header',
        displayRow: 2,
        description: 'Description',
        reference: '',
        totalLabel: 'TOTAL AMOUNTS',
        exemptLabel: 'AMOUNT EXEMPT FROM TAX/ SUBJECT TO FIXED/ FINAL TAX',
        taxLabel: 'AMOUNT SUBJECT TO NORMAL TAX'
    },
    
    // Row 3: GROSS REVENUE
    { 
        type: 'total',
        displayRow: 3,
        description: 'GROSS REVENUE ( EXCLUDING SALES TAX & FEDERAL EXCISE DUTY)',
        reference: "a=a'+b'",
        formula: 'C4+C5'
    },
    
    // Row 4: DOMESTIC SALES
    { 
        type: 'input',
        displayRow: 4,
        description: 'GROSS DOMESTIC SALES/ SERVICES FEE',
        reference: "a'"
    },
    
    // Row 5: EXPORT SALES
    { 
        type: 'input',
        displayRow: 5,
        description: 'GROSS EXPORT SALES/ SERVICES FEE',
        reference: "b'"
    },
    
    // Row 6: PSEB Registration (Dropdown)
    { 
        type: 'pseb-dropdown',
        displayRow: 6,
        description: 'Is Company registered with PSEB',
        reference: ''
    },
    
    // Row 7: RATIO
    { 
        type: 'ratio',
        displayRow: 7,
        description: 'Ratio',
        reference: '',
        class: 'ratio-row'
    },
    
    // Row 8: SELLING EXPENSES TOTAL
    { 
        type: 'total',
        displayRow: 8,
        description: 'SELLING EXPENSES(FREIGHT OUTWARD, BROKERAGE, COMMISSION, DISCOUNT etc.)',
        reference: "b=e'+d'+f'",
        formula: 'C9+C10+C11'
    },
    
    // Row 9: DOMESTIC COMMISSION
    { 
        type: 'input',
        displayRow: 9,
        description: 'DOMESTIC COMMISSION/ BROKERAGE/ DISCOUNT/ FREIGHT OUTWARD, etc.',
        reference: "e'"
    },
    
    // Row 10: FOREIGN COMMISSION
    { 
        type: 'input',
        displayRow: 10,
        description: 'FOREIGN COMMISSION/ BROKERAGE/ DISCOUNT/ FREIGHT OUTWARD, etc.',
        reference: "d'"
    },
    
    // Row 11: REBATE/DUTY DRAWBACKS
    { 
        type: 'input',
        displayRow: 11,
        description: 'REBATE/ DUTY DRAWBACKS',
        reference: "f'"
    },
    
    // Row 12: Empty
    { type: 'empty', displayRow: 12 },
    
    // Row 13: NET REVENUE
    { 
        type: 'subtotal',
        displayRow: 13,
        description: 'NET REVENUE (EXCLUDING SALES TAX, FEDERAL EXCISE, BROKERAGE, COMMISSION, DISCOUNT, FREIGHT OUTWARD)',
        reference: 'c=a-b',
        formula: 'C3-C8'
    },
    
    // Row 14: Empty
    { type: 'empty', displayRow: 14 },
    
    // Row 15: COST OF SALES TOTAL
    { 
        type: 'total',
        displayRow: 15,
        description: 'COST OF SALES/ SERVICES',
        reference: 'd',
        formula: 'C17+C18+C19+C20+C21+C22+C23+C24+C25'
    },
    
    // Row 16: DIRECT EXPENSES HEADER
    { 
        type: 'section',
        displayRow: 16,
        description: 'DIRECT EXPENSES',
        reference: ''
    },
    
    // Rows 17-25: Direct Expenses Items
    { type: 'input', displayRow: 17, description: 'SALARIES/ WAGES', reference: '' },
    { type: 'input', displayRow: 18, description: 'POWER', reference: '' },
    { type: 'input', displayRow: 19, description: 'GAS', reference: '' },
    { type: 'input', displayRow: 20, description: 'REPAIR/ MAINTENANCE', reference: '' },
    { type: 'input', displayRow: 21, description: 'INSURANCE', reference: '' },
    { type: 'input', displayRow: 22, description: 'ROYALTY', reference: '' },
    { type: 'input', displayRow: 23, description: 'OTHER DIRECT EXPENSES', reference: '' },
    { type: 'input', displayRow: 24, description: 'ACCOUNTING AMORTISATION', reference: '' },
    { type: 'input', displayRow: 25, description: 'ACCOUNTING DEPRECIATION', reference: '' },
    
    // Row 26: GROSS PROFIT
    { 
        type: 'subtotal',
        displayRow: 26,
        description: 'GROSS PROFIT/ (LOSS)',
        reference: 'e=c-d',
        formula: 'C13-C15'
    },
    
    // Row 27: Empty
    { type: 'empty', displayRow: 27 },
    
    // Row 28: INDIRECT EXPENSES TOTAL
    { 
        type: 'total',
        displayRow: 28,
        description: 'MANAGEMENT, ADMINISTRATIVE, SELLING & FINANCIAL EXPENSES',
        reference: 'f',
        formula: 'C29:C54'
    },
    
    // Rows 29-54: Indirect Expenses Items
    { type: 'input', displayRow: 29, description: 'RENT', reference: '' },
    { type: 'input', displayRow: 30, description: 'RATES / TAXES / CESS', reference: '' },
    { type: 'input', displayRow: 31, description: 'SALARIES / WAGES / PERQUISITES / BENEFITS', reference: '' },
    { type: 'input', displayRow: 32, description: 'TRAVELING / CONVEYANCE / VEHICLES RUNNING / MAINTENANCE', reference: '' },
    { type: 'input', displayRow: 33, description: 'ELECTRICITY / WATER / GAS', reference: '' },
    { type: 'input', displayRow: 34, description: 'COMMUNICATION', reference: '' },
    { type: 'input', displayRow: 35, description: 'REPAIR / MAINTENANCE', reference: '' },
    { type: 'input', displayRow: 36, description: 'STATIONERY / PRINTING / PHOTOCOPIES / OFFICE SUPPLIES', reference: '' },
    { type: 'input', displayRow: 37, description: 'ADVERTISEMENT / PUBLICITY / PROMOTION', reference: '' },
    { type: 'input', displayRow: 38, description: 'INSURANCE', reference: '' },
    { type: 'input', displayRow: 39, description: 'PROFESSIONAL CHARGES', reference: '' },
    { type: 'input', displayRow: 40, description: 'PROFIT ON DEBT (FINANCIAL CHARGES / MARKUP / INTEREST)', reference: '' },
    { type: 'input', displayRow: 41, description: 'DONATION / CHARITY', reference: '' },
    { type: 'input', displayRow: 42, description: 'BROKERAGE / COMMISSION', reference: '' },
    { type: 'input', displayRow: 43, description: 'OTHER INDIRECT EXPENSES', reference: '' },
    { type: 'input', displayRow: 44, description: 'DIRECTORS FEE', reference: '' },
    { type: 'input', displayRow: 45, description: 'WORKERS PROFIT PARTICIPATION FUND', reference: '' },
    { type: 'input', displayRow: 46, description: 'PROVISION FOR DOUBTFUL / BAD DEBTS', reference: '' },
    { type: 'input', displayRow: 47, description: 'PROVISION FOR OBSOLETE STOCKS / STORES / SPARES / FIXED ASSETS', reference: '' },
    { type: 'input', displayRow: 48, description: 'PROVISION FOR DIMINUTION IN VALUE OF INVESTMENT', reference: '' },
    { type: 'input', displayRow: 49, description: 'IRRECOVERABLE DEBTS WRITTEN OFF', reference: '' },
    { type: 'input', displayRow: 50, description: 'OBSOLETE STOCKS / STORES / SPARES / FIXED ASSETS WRITTEN OFF', reference: '' },
    { type: 'input', displayRow: 51, description: 'ACCOUNTING (LOSS) ON SALE OF INTANGIBLES', reference: '' },
    { type: 'input', displayRow: 52, description: 'ACCOUNTING (LOSS) ON SALE OF ASSETS', reference: '' },
    { type: 'input', displayRow: 53, description: 'ACCOUNTING AMORTIZATION', reference: '' },
    { type: 'input', displayRow: 54, description: 'ACCOUNTING DEPRECIATION', reference: '' },
    
    // Row 55: Empty
    { type: 'empty', displayRow: 55 },
    
    // Row 56: OTHER REVENUES TOTAL
    { 
        type: 'total',
        displayRow: 56,
        description: 'ADD: OTHER REVENUES',
        reference: 'g',
        formula: 'C57:C65'
    },
    
    // Rows 57-65: Other Revenues
    { type: 'input', displayRow: 57, description: 'OTHER REVENUES', reference: '' },
    { type: 'input', displayRow: 58, description: 'FEE FOR TECHNICAL / PROFESSIONAL SERVICES', reference: '' },
    { type: 'input', displayRow: 59, description: 'FEE FOR OTHER SERVICES', reference: '' },
    { type: 'input', displayRow: 60, description: 'PROFIT ON DEBT', reference: '' },
    { type: 'input', displayRow: 61, description: 'ROYALTY', reference: '' },
    { type: 'input', displayRow: 62, description: 'LICENSE / FRANCHISE FEE', reference: '' },
    { type: 'input', displayRow: 63, description: 'ACCOUNTING GAIN ON SALE OF INTANGIBLES', reference: '' },
    { type: 'input', displayRow: 64, description: 'ACCOUNTING GAIN ON SALE OF ASSETS', reference: '' },
    { type: 'input', displayRow: 65, description: 'OTHERS', reference: '' },
    
    // Row 66: ACCOUNTING PROFIT
    { 
        type: 'total',
        displayRow: 66,
        description: 'ACCOUNTING PROFIT/ (LOSS)',
        reference: 'h=e-f+g',
        formula: 'C26-C28+C56'
    },
    
    // Row 67: Empty
    { type: 'empty', displayRow: 67 },
    
    // Row 68: INADMISSIBLE DEDUCTIONS TOTAL
    { 
        type: 'total',
        displayRow: 68,
        description: 'INADMISSIBLE DEDUCTIONS',
        reference: 'i',
        formula: 'C69:C107'
    },
    
    // Rows 69-107: Inadmissible Deductions (39 rows as per Excel)
    { type: 'input', displayRow: 69, description: 'ADD BACKS U/S 29(2) PROVISION FOR DOUBTFUL DEBTS (Excess of actual bad debts over amount written off in accounts )', reference: '' },
    { type: 'input', displayRow: 70, description: 'ADD BACKS PROVISION FOR OBSOLETE STOCKS / STORES / SPARES / FIXED ASSETS', reference: '' },
    { type: 'input', displayRow: 71, description: 'ADD BACKS PROVISION FOR DIMINUTION IN VALUE OF INVESTMENT', reference: '' },
    { type: 'input', displayRow: 72, description: 'ADD BACKS U/S 21(I) PROVISION FOR RESERVES / FUNDS / AMOUNT CARRIED TO RESERVES / FUNDS OR CAPITALIZED', reference: '' },
    { type: 'input', displayRow: 73, description: 'ADD BACKS U/S 21(A) CESS / RATE / TAX LEVIED ON PROFITS / GAINS', reference: '' },
    { type: 'input', displayRow: 74, description: 'ADD BACKS U/S 21(B) AMOUNT OF TAX DEDUCTED AT SOURCE', reference: '' },
    { type: 'input', displayRow: 75, description: 'ADD BACKS U/S 21(C) PAYMENTS LIABLE TO DEDUCTION OF TAX AT SOURCE BUT TAX NOT DEDUCTED / PAID', reference: '' },
    { type: 'input', displayRow: 76, description: 'ADD BACKS U/S 21(D) ENTERTAINMENT EXPENDITURE ABOVE PRESCRIBED LIMIT', reference: '' },
    { type: 'input', displayRow: 77, description: 'ADD BACKS U/S 21(E) CONTRIBUTIONS TO UNRECOGNIZED / UNAPPROVED FUNDS', reference: '' },
    { type: 'input', displayRow: 78, description: 'ADD BACKS U/S 21(F) CONTRIBUTIONS TO FUNDS NOT UNDER EFFECTIVE ARRANGEMENT FOR DEDUCTION OF TAX AT SOURCE', reference: '' },
    { type: 'input', displayRow: 79, description: 'ADD BACKS U/S 21(G) FINE / PENALTY FOR VIOLATION OF ANY LAW / RULE / REGULATION', reference: '' },
    { type: 'input', displayRow: 80, description: 'ADD BACKS U/S 21(H) PERSONAL EXPENDITURE', reference: '' },
    { type: 'input', displayRow: 81, description: 'ADD BACKS U/S 21(J) PROFIT ON DEBT / BROKERAGE / COMMISSION / SALARY / REMUNERATION PAID BY AN AOP TO ITS MEMBER', reference: '' },
    { type: 'input', displayRow: 82, description: 'ADD BACKS U/S 21(L) EXPENDITURE UNDER A SINGLE ACCOUNT HEAD EXCEEDING PRESCRIBED AMOUNT NOT PAID THROUGH PRESCRIBED MODE', reference: '' },
    { type: 'input', displayRow: 83, description: 'ADD BACKS U/S 21(L)(A) EXPENDITURE UNDER A SINGLE ACCOUNT HEAD EXCEEDING PRESCRIBED AMOUNT NOT PAID THROUGH DIGITAL MODE', reference: '' },
    { type: 'input', displayRow: 84, description: 'ADD BACKS U/S 21(M) SALARY EXCEEDING PRESCRIBED AMOUNT NOT PAID THROUGH PRESCRIBED MODE', reference: '' },
    { type: 'input', displayRow: 85, description: 'ADD BACKS U/S 21(N) CAPITAL EXPENDITURE', reference: '' },
    { type: 'input', displayRow: 86, description: 'ADD BACKS U/S 67(1) EXPENDITURE ATTRIBUTABLE TO NON-BUSINESS INCOME', reference: '' },
    { type: 'input', displayRow: 87, description: 'ADD BACKS U/S 34(5) LIABILITIES ALLOWED PREVIOUSLY AS DEDUCTION NOT PAID WITHIN THREE YEARS', reference: '' },
    { type: 'input', displayRow: 88, description: 'ADD BACKS U/S 100C(1)(D) - ADMINISTRATIVE AND MANAGEMENT EXPENSES EXCEEDING 15% OF TOTAL RECEIPTS OF NPOS, TRUSTS, &WELFARE INSTITUTIONS', reference: '' },
    { type: 'input', displayRow: 89, description: 'ADD BACKS U/S 28(1)(B) LEASE RENTAL NOT ADMISSIBLE', reference: '' },
    { type: 'input', displayRow: 90, description: 'ADD BACKS U/S 21(O) SALES PROMOTION, ADVERTISEMENT AND PUBLICITY EXPENSES OF PHARMACEUTICAL MANUFACTURERS EXCEEDING PRESCRIBED LIMIT', reference: '' },
    { type: 'input', displayRow: 91, description: 'ADD BACKS TAX GAIN ON SALE OF INTANGIBLES', reference: '' },
    { type: 'input', displayRow: 92, description: 'ADD BACKS TAX GAIN ON SALE OF ASSETS', reference: '' },
    { type: 'input', displayRow: 93, description: 'ADD BACKS U/S 21(P) UTILITY BILLS EXCEEDING PRESCRIBED AMOUNT NOT PAID THROUGH PRESCRIBED MODE', reference: '' },
    { type: 'input', displayRow: 94, description: 'ADD BACKS U/S 21(Q) EXPENDITURE ATTRIBUTABLE TO SALE TO PERSON REQUIRED TO BE REGISTERED UNDER SALE TAX BUT NOT REGISTERED', reference: '' },
    { type: 'input', displayRow: 95, description: 'ADD BACKS U/S 28(1)(B) LEASE RENTAL NOT ADMISSIBLE ON ACCOUNT OF COST OF PASSENGER TRANSPORT VEHICLE EXCEEDING 2.5M RS.', reference: '' },
    { type: 'input', displayRow: 96, description: 'ADD BACKS U/S 21(CA) COMMISSION IN EXCESS OF 0.2% OF GROSS AMOUNT OF SUPPLIES TO A PERSON NOT APPEARING IN ATL IN THIRD SCHEDULE OF SALE TAX ACT', reference: '' },
    { type: 'input', displayRow: 97, description: 'DEDUCTION ON PROFIT ON DEBIT INADMISSIBLE U/S 106A', reference: '' },
    { type: 'input', displayRow: 98, description: 'ADD BACKS PRE-COMMENCEMENT EXPENDITURE / DEFERRED COST', reference: '' },
    { type: 'input', displayRow: 99, description: '7.50% OF SALES DEALERS OF PRODUCTS LISTED IN THIRD SCHEDULE TO SALE TAX ACT, 1990 WHO ARE NOT REGISTERED UNDER THE STA 1990 AND NOT APPEARING IN ATL LIST UNDER THE ITO 2001', reference: '' },
    { type: 'input', displayRow: 100, description: 'OTHER INADMISSIBLE DEDUCTIONS', reference: '' },
    { type: 'input', displayRow: 101, description: 'ADD BACKS ACCOUNTING (LOSS) ON SALE OF INTANGIBLES', reference: '' },
    { type: 'input', displayRow: 102, description: 'ADD BACKS ACCOUNTING (LOSS) ON SALE OF ASSETS', reference: '' },
    { type: 'input', displayRow: 103, description: 'ADD BACKS ACCOUNTING AMORTIZATION', reference: '' },
    { type: 'input', displayRow: 104, description: 'ADD BACKS ACCOUNTING DEPRECIATION', reference: '' },
    { type: 'input', displayRow: 105, description: 'ADD BACKS TAX GAIN ON SALE OF INTANGIBLES', reference: '' },
    { type: 'input', displayRow: 106, description: 'ADD BACKS TAX GAIN ON SALE OF ASSETS', reference: '' },
    { type: 'input', displayRow: 107, description: 'ADD BACKS PRE-COMMENCEMENT EXPENDITURE / DEFERRED COST', reference: '' },
    
    // Row 108: Empty
    { type: 'empty', displayRow: 108 },
    
    // Row 109: ADMISSIBLE DEDUCTIONS TOTAL
    { 
        type: 'total',
        displayRow: 109,
        description: 'ADMISSIBLE DEDUCTIONS OTHER THAN TAX DEPRECIATION/ INITIAL ALLOANCE/ AMORTISATION FOR CURRENT OR PREVIOUS YEARS',
        reference: 'J',
        formula: 'C110:C114'
    },
    
    // Rows 110-114: Admissible Deductions
    { type: 'input', displayRow: 110, description: 'ACCOUNTING GAIN ON SALE OF INTANGIBLES', reference: '' },
    { type: 'input', displayRow: 111, description: 'ACCOUNTING GAIN ON SALE OF ASSETS', reference: '' },
    { type: 'input', displayRow: 112, description: 'OTHER ADMISSIBLE DEDUCTIONS', reference: '' },
    { type: 'input', displayRow: 113, description: 'TAX (LOSS) ON SALE OF INTANGIBLES', reference: '' },
    { type: 'input', displayRow: 114, description: 'TAX (LOSS) ON SALE OF ASSETS', reference: '' },
    
    // Row 115: Empty
    { type: 'empty', displayRow: 115 },
    
    // Row 116: INCOME BEFORE DEPRECIATION
    { 
        type: 'subtotal',
        displayRow: 116,
        description: 'INCOME / (LOSS) FROM BUSINESS BEFORE ADJUSTMENT OF ADMISSIBLE DEPRECIATION / INITIAL ALLOWANCE / AMORTIZATION FOR CURRENT / PREVIOUS YEARS',
        reference: 'k=h+i-j',
        formula: 'C66+C68-C109'
    },
    
    // Row 117: Empty
    { type: 'empty', displayRow: 117 },
    
    // Row 118: TAX DEPRECIATION TOTAL
    { 
        type: 'total',
        displayRow: 118,
        description: 'TAX DEPRECIATION/ INITIAL ALLOWANCE/ AMORTISATION FOR CURRENT OR PREVIOUS YEARS',
        reference: 'l',
        formula: 'C119:C121'
    },
    
    // Rows 119-121: Tax Depreciation Items
    { type: 'input', displayRow: 119, description: 'TAX AMORTIZATION FOR CURRENT YEAR', reference: '' },
    { type: 'input', displayRow: 120, description: 'TAX DEPRECIATION / INITIAL ALLOWANCE FOR CURRENT YEAR', reference: '' },
    { type: 'input', displayRow: 121, description: 'PRE-COMMENCEMENT EXPENDITURE / DEFERRED COST', reference: '' },
    
    // Row 122: Empty
    { type: 'empty', displayRow: 122 },
    
    // Row 123: BUSINESS INCOME
    { 
        type: 'total',
        displayRow: 123,
        description: 'INCOME/ LOSS FROM BUSINESS',
        reference: 'M=k-l',
        formula: 'C116-C118'
    },
    
    // Additional income types (Rows 124-128)
    { type: 'input', displayRow: 124, description: 'INCOME/ LOSS FROM PROPERTY', reference: 'n' },
    { type: 'input', displayRow: 125, description: 'INCOME/ LOSS FROM CAPITAL ASSETS', reference: 'o' },
    { type: 'input', displayRow: 126, description: 'INCOME/ LOSS FROM OTHER SOURCES', reference: 'p' },
    { type: 'input', displayRow: 127, description: 'FOREIGN INCOME', reference: 'q' },
    { type: 'input', displayRow: 128, description: 'AGRICULTURAL INCOME', reference: 'r' },
    
    // Row 129: TOTAL INCOME
    { 
        type: 'total',
        displayRow: 129,
        description: 'TOTAL INCOME',
        reference: 'S=m+n+o+p+q+r',
        formula: 'C123:C128'
    },
    
    // Row 130: Empty
    { type: 'empty', displayRow: 130 },
    
    // Row 131: DEDUCTIBLE ALLOWANCES TOTAL
    { 
        type: 'total',
        displayRow: 131,
        description: 'DEDUCTIBLE ALLOWANCES',
        reference: 't',
        formula: 'C132:C133'
    },
    
    // Rows 132-133: Allowances
    { type: 'input', displayRow: 132, description: 'WORKERS WELFARE FUND U/S 60A', reference: '' },
    { type: 'input', displayRow: 133, description: 'WORKERS PROFIT PARTICIPATION FUND U/S 60B', reference: '' },
    
    // Row 134: Empty
    { type: 'empty', displayRow: 134 },
    
    // Row 135: TAXABLE INCOME
    { 
        type: 'total',
        displayRow: 135,
        description: 'TAXABLE INCOME',
        reference: 'w=s-t',
        formula: 'C129-C131'
    },
    
    // ========== TAX CALCULATION SECTION ==========
    
    // Row 136: TAX CHARGEABLE HEADER
    { 
        type: 'tax-header',
        displayRow: 136,
        description: 'TAX CHARGEABLE (Normal income tax will be adjusted against carry forward minimum tax upto the limit of Minimum tax u/s 113 or 113C as after which again minimum will be applied.)',
        reference: 'x'
    },
    
    // Row 137: NORMAL INCOME TAX
    { 
        type: 'tax-calc',
        displayRow: 137,
        description: 'NORMAL INCOME TAX @ 29%',
        reference: '',
        formula: 'E135*0.29'
    },
    
    // Row 138: FINAL/FIXED TAX
    { 
        type: 'tax-calc',
        displayRow: 138,
        description: 'FINAL/ FIXED/ MINIMUM/ AVERAGE/ RELEVANT/ REDUCED INCOME TAX',
        reference: '',
        formula: 'D5*0.025'
    },
    
    // Row 139: WWF (Empty - no calculation)
    { type: 'empty', displayRow: 139 },
    
    // Row 140: ALTERNATE CORPORATE TAX
    { 
        type: 'tax-calc',
        displayRow: 140,
        description: 'ACCOUNTING PROFIT / TAX CHARGEABLE 113C @ 17%',
        reference: '',
        formula: 'C66*0.17'
    },
    
    // Row 141: MINIMUM TAX
    { 
        type: 'tax-calc',
        displayRow: 141,
        description: 'TURNOVER/ TAX CHARGEABLE UNDER SECTION 113 @ 1.25%',
        reference: '',
        formula: 'E3*0.0125'
    },
    
    // Row 142: DIFFERENCE OF MINIMUM TAX (Put zero by default)
    { 
        type: 'tax-calc-zero',
        displayRow: 142,
        description: 'DIFFERENCE OF MINIMUM TAX CHARGEABLE U/S 113',
        reference: '',
        value: 0
    },
    
    // Row 143: TAX ON HIGH EARNERS (Don't use - leave empty)
    { type: 'empty', displayRow: 143 },
    
    // Row 144: TAX ON DEEMED INCOME (Don't use - leave empty)
    { type: 'empty', displayRow: 144 },
    
    // Row 145: DIFFERENCE OF ALTERNATE TAX (Put zero by default)
    { 
        type: 'tax-calc-zero',
        displayRow: 145,
        description: 'DIFFERENCE OF ALTERNATE CORPORATE TAX U/S 113C',
        reference: '',
        value: 0
    },
    
    // Row 146: DIFFERENCE OF MINIMUM TAX CHARGEABLE (Empty - no calculation)
    { type: 'empty', displayRow: 146 },
    
    // Row 147: TAX REDUCTION (Empty - no calculation)
    { type: 'empty', displayRow: 147 },
    
    // Row 148: TAX CREDIT HEADER
    { 
        type: 'tax-result',
        displayRow: 148,
        description: 'TAX CREDIT -',
        reference: 'Y'
    },
    
    // Row 149: CHARITABLE DONATIONS CREDIT
    { 
        type: 'tax-input',
        displayRow: 149,
        description: 'Tax Credit for Charitable Donations u/s 61',
        reference: ''
    },
    
    // Row 150: OTHER CREDITS (Put zero by default)
    { 
        type: 'tax-input-zero',
        displayRow: 150,
        description: 'Tax Credit for Certain Persons (Coal Mining Projects, Startups, IT/IT enabled Services) u/s 65F',
        reference: '',
        value: 0
    },
    
    // Row 151: TAX CREDIT U/S 103 (Don't use - leave empty)
    { type: 'empty', displayRow: 151 },
    
    // Row 152: WITHHOLDING INCOME TAX (D column input)
    { 
        type: 'd-input',
        displayRow: 152,
        description: 'WITHHOLDING INCOME TAX',
        reference: ''
    },
    
    // Row 153: ADVANCE INCOME TAX (D column input)
    { 
        type: 'd-input',
        displayRow: 153,
        description: 'ADVANCE INCOME TAX',
        reference: ''
    },
    
    // Row 154: ADVANCE TAX U/S 147(A) (D column input)
    { 
        type: 'd-input',
        displayRow: 154,
        description: 'ADVANCE INCOME TAX U/S 147(A)',
        reference: ''
    },
    
    // Row 155: ADVANCE TAX U/S 147(5B) (D column input)
    { 
        type: 'd-input',
        displayRow: 155,
        description: 'ADVANCE INCOME TAX U/S 147(5B)',
        reference: ''
    },
    
    // Row 156: ADMITTED INCOME TAX
    { 
        type: 'tax-result',
        displayRow: 156,
        description: 'ADMITTED INCOME TAX',
        reference: '',
        formula: 'IF(((SUM(D152:D154)+D155)>E136),0,(E136-(SUM(D152:D154)+D155)))'
    },
    
    // Row 157: DEMANDED INCOME TAX (Don't use - leave empty)
    
    // Row 157: REFUNDABLE INCOME TAX
    { 
        type: 'tax-result',
        displayRow: 157,
        description: 'REFUNDABLE INCOME TAX',
        reference: '',
        formula: 'IF(E156>0,0,(SUM(D152:D154)+D155)-E136)'
    },
    { type: 'empty', displayRow: 158 },
];

// Format number with commas
function formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return Math.round(num).toLocaleString('en-US');
}

// Create table row
function createTableRow(item, index) {
    const row = document.createElement('tr');
    const calcRow = rowMapping[item.displayRow] || item.displayRow;
    
    if (item.class) {
        row.className = item.class;
    }
    
    switch (item.type) {
        case 'empty':
            row.innerHTML = `<td colspan="5" style="height: 10px;"></td>`;
            break;
            
        case 'header':
            row.innerHTML = `
                <td><strong>${item.description}</strong></td>
                <td></td>
                <td class="input-col"><strong>${item.totalLabel}</strong></td>
                <td class="calculated-col"><strong>${item.exemptLabel}</strong></td>
                <td class="calculated-col"><strong>${item.taxLabel}</strong></td>
            `;
            break;
            
        case 'section':
            row.innerHTML = `
                <td><strong>${item.description}</strong></td>
                <td>${item.reference}</td>
                <td class="input-col"></td>
                <td class="calculated-col"></td>
                <td class="calculated-col"></td>
            `;
            break;
            
        case 'input':
            row.innerHTML = `
                <td>${item.description}</td>
                <td>${item.reference}</td>
                <td class="input-col">
                    <input type="text" 
                           id="C${item.displayRow}" 
                           data-calc-row="${calcRow}"
                           data-column="C"
                           value="${formatNumber(taxEngine.getValue(`C${calcRow}`))}"
                           placeholder="Enter amount">
                </td>
                <td class="calculated-col" id="D${item.displayRow}">${formatNumber(taxEngine.getValue(`D${calcRow}`))}</td>
                <td class="calculated-col" id="E${item.displayRow}">${formatNumber(taxEngine.getValue(`E${calcRow}`))}</td>
            `;
            break;
            
        case 'pseb-dropdown':
            const psebValue = taxEngine.getValue('D6') || 'Yes';
            row.innerHTML = `
                <td><strong>${item.description}</strong></td>
                <td></td>
                <td class="input-col"></td>
                <td class="calculated-col">
                    <select id="D6" data-calc-row="6" data-column="D" style="width: 100%; border: none; background: transparent; font-family: Consolas; font-size: 11px; color: #52c41a; padding: 2px 4px;">
                        <option value="Yes" ${psebValue === 'Yes' ? 'selected' : ''}>Yes</option>
                        <option value="No" ${psebValue === 'No' ? 'selected' : ''}>No</option>
                    </select>
                </td>
                <td class="calculated-col"></td>
            `;
            break;
            
        case 'ratio':
            row.innerHTML = `
                <td><strong>${item.description}</strong></td>
                <td></td>
                <td class="input-col calculated-cell" id="C${item.displayRow}">${formatNumber(taxEngine.getValue(`C${calcRow}`))}</td>
                <td class="calculated-col" id="D${item.displayRow}">${taxEngine.getValue('D7') ? taxEngine.getValue('D7').toFixed(4) : '0.0000'}</td>
                <td class="calculated-col" id="E${item.displayRow}">${taxEngine.getValue('D7') ? (1 - taxEngine.getValue('D7')).toFixed(4) : '1.0000'}</td>
            `;
            break;
            
        case 'total':
        case 'subtotal':
            row.innerHTML = `
                <td><strong>${item.description}</strong></td>
                <td><strong>${item.reference}</strong></td>
                <td class="input-col calculated-cell" id="C${item.displayRow}">${formatNumber(taxEngine.getValue(`C${calcRow}`))}</td>
                <td class="calculated-col" id="D${item.displayRow}">${formatNumber(taxEngine.getValue(`D${calcRow}`))}</td>
                <td class="calculated-col" id="E${item.displayRow}">${formatNumber(taxEngine.getValue(`E${calcRow}`))}</td>
            `;
            break;
            
        case 'tax-header':
            row.innerHTML = `
                <td><strong>${item.description}</strong></td>
                <td><strong>${item.reference}</strong></td>
                <td class="input-col"></td>
                <td class="calculated-col"></td>
                <td class="calculated-col tax-cell" id="E${item.displayRow}">${formatNumber(taxEngine.getValue(`E${calcRow}`))}</td>
            `;
            break;
            
        case 'tax-calc':
            row.innerHTML = `
                <td>${item.description}</td>
                <td>${item.reference}</td>
                <td class="input-col"></td>
                <td class="calculated-col"></td>
                <td class="calculated-col tax-cell" id="E${item.displayRow}">${formatNumber(taxEngine.getValue(`E${calcRow}`))}</td>
            `;
            break;
            
        case 'tax-calc-zero':
            row.innerHTML = `
                <td>${item.description}</td>
                <td>${item.reference}</td>
                <td class="input-col"></td>
                <td class="calculated-col"></td>
                <td class="calculated-col tax-cell" id="E${item.displayRow}">${formatNumber(item.value)}</td>
            `;
            break;
            
        case 'tax-input':
            row.innerHTML = `
                <td>${item.description}</td>
                <td>${item.reference}</td>
                <td class="input-col">
                    <input type="text" 
                           id="C${item.displayRow}" 
                           data-calc-row="${calcRow}"
                           data-column="C"
                           value="${formatNumber(taxEngine.getValue(`C${calcRow}`))}"
                           placeholder="Enter amount">
                </td>
                <td class="calculated-col"></td>
                <td class="calculated-col tax-cell" id="E${item.displayRow}">${formatNumber(taxEngine.getValue(`E${calcRow}`))}</td>
            `;
            break;
            
        case 'tax-input-zero':
            row.innerHTML = `
                <td>${item.description}</td>
                <td>${item.reference}</td>
                <td class="input-col">
                    <input type="text" 
                           id="C${item.displayRow}" 
                           data-calc-row="${calcRow}"
                           data-column="C"
                           value="${formatNumber(item.value)}"
                           placeholder="Enter amount">
                </td>
                <td class="calculated-col"></td>
                <td class="calculated-col tax-cell" id="E${item.displayRow}">${formatNumber(taxEngine.getValue(`E${calcRow}`))}</td>
            `;
            break;
            
        case 'd-input':
            row.innerHTML = `
                <td><strong>${item.description}</strong></td>
                <td>${item.reference}</td>
                <td class="input-col"></td>
                <td class="calculated-col">
                    <input type="text" 
                           id="D${item.displayRow}" 
                           data-calc-row="${calcRow}"
                           data-column="D"
                           value="${formatNumber(taxEngine.getValue(`D${calcRow}`))}"
                           placeholder="Enter amount">
                </td>
                <td class="calculated-col"></td>
            `;
            break;
            
        case 'tax-result':
            row.innerHTML = `
                <td><strong>${item.description}</strong></td>
                <td><strong>${item.reference}</strong></td>
                <td class="input-col"></td>
                <td class="calculated-col"></td>
                <td class="calculated-col tax-result" id="E${item.displayRow}"><strong>${formatNumber(taxEngine.getValue(`E${calcRow}`))}</strong></td>
            `;
            break;
    }
    
    return row;
}
// app.js - Add this function for input validation
function validateInput(event) {
    const input = event.target;
    let value = input.value.replace(/,/g, '');
    
    // Remove any negative signs
    value = value.replace(/-/g, '');
    
    // Parse as float and ensure it's not negative
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue < 0) {
        input.value = '0';
    } else if (value === '' || value === '-') {
        input.value = '';
    } else {
        input.value = value;
    }
}
// Update the event listeners in renderTable() function:
function renderTable() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    tableStructure.forEach((item, index) => {
        const row = createTableRow(item, index);
        tableBody.appendChild(row);
    });
    
    // Add event listeners
    document.querySelectorAll('#tableBody input').forEach(input => {
        input.addEventListener('input', validateInput);  // Add validation on input
        input.addEventListener('input', handleInputChange);
        input.addEventListener('blur', formatInputValue);
    });
    
    document.querySelectorAll('#tableBody select').forEach(select => {
        select.addEventListener('change', handleDropdownChange);
    });
}

// Format input value with commas
function formatInputValue(event) {
    const input = event.target;
    const value = input.value.replace(/,/g, '');
    const numValue = parseFloat(value);
    
    if (!isNaN(numValue)) {
        input.value = formatNumber(numValue);
    }
}

function handleInputChange(event) {
    const input = event.target;
    const column = input.dataset.column;
    const calcRow = input.dataset.calcRow;
    const value = input.value.replace(/,/g, '');
    
    // If empty string, set to 0
    if (value === '') {
        taxEngine.setValue(`${column}${calcRow}`, 0);
    } else {
        const numValue = parseFloat(value);
        // Ensure value is not negative
        taxEngine.setValue(`${column}${calcRow}`, Math.max(0, numValue));
    }
    updateDisplay();
}

// Handle dropdown changes
function handleDropdownChange(event) {
    const select = event.target;
    const column = select.dataset.column;
    const calcRow = select.dataset.calcRow;
    const value = select.value;
    
    taxEngine.setValue(`${column}${calcRow}`, value);
    updateDisplay();
}

// Update all calculated cells
function updateDisplay() {
    // Update all cells
    for (const displayRow of Object.keys(rowMapping)) {
        const calcRow = rowMapping[displayRow];
        
        // Update D column
        const dCell = document.getElementById(`D${displayRow}`);
        if (dCell && !dCell.querySelector('input') && !dCell.querySelector('select')) {
            dCell.textContent = formatNumber(taxEngine.getValue(`D${calcRow}`));
        }
        
        // Update E column
        const eCell = document.getElementById(`E${displayRow}`);
        if (eCell && !eCell.querySelector('input')) {
            eCell.textContent = formatNumber(taxEngine.getValue(`E${calcRow}`));
        }
        
        // Update C column if it's a calculated cell
        const cCell = document.getElementById(`C${displayRow}`);
        if (cCell && !cCell.querySelector('input') && cCell.classList.contains('calculated-cell')) {
            cCell.textContent = formatNumber(taxEngine.getValue(`C${calcRow}`));
        }
    }
    
    // Update ratio row specifically
    const d7Cell = document.getElementById('D7');
    const e7Cell = document.getElementById('E7');
    if (d7Cell) {
        d7Cell.textContent = taxEngine.getValue('D7').toFixed(4);
    }
    if (e7Cell) {
        e7Cell.textContent = (1 - taxEngine.getValue('D7')).toFixed(4);
    }
    
    // Update results panel
    updateResultsPanel();
}

// Update results panel
function updateResultsPanel() {
    const results = taxEngine.getTaxResults();
    
    document.getElementById('normalTax').textContent = formatNumber(results.normalTax);
    document.getElementById('finalTax').textContent = formatNumber(results.finalTax);
    document.getElementById('alternateTax').textContent = formatNumber(results.alternateTax);
    document.getElementById('minimumTax').textContent = formatNumber(results.minimumTax);
    document.getElementById('taxChargeable').textContent = formatNumber(results.taxChargeable);
    document.getElementById('admittedTax').textContent = formatNumber(results.admittedTax);
    document.getElementById('refundableTax').textContent = formatNumber(results.refundableTax);
}

// Initialize the application
function init() {
    initializeRowMapping();
    renderTable();
    
    // Add button event listeners
    document.getElementById('loadTestData').addEventListener('click', () => {
        taxEngine.loadTestData();
        renderTable();
        updateResultsPanel();
    });
    
    document.getElementById('resetAll').addEventListener('click', () => {
        taxEngine.resetAll();
        renderTable();
        updateResultsPanel();
    });
    
    document.getElementById('calculateTax').addEventListener('click', () => {
        taxEngine.calculateAll();
        updateDisplay();
        
        const panel = document.getElementById('resultsPanel');
        panel.style.display = 'block';
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            panel.style.transition = 'all 0.3s ease';
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0)';
        }, 10);
    });
    
    // Load test data initially
    taxEngine.loadTestData();
    updateResultsPanel();
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);