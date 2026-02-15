// app.js - SIMPLIFIED 2-COLUMN STRUCTURE WITH HIDDEN CALCULATION COLUMNS

// Initialize tax engine
const taxEngine = new TaxEngine();

// Row mapping system
const rowMapping = {};

// Initialize all row mappings
function initializeRowMapping() {
    // Clear existing mapping
    Object.keys(rowMapping).forEach(key => delete rowMapping[key]);
    
    // Define all calculation rows based on NEW Excel structure
    const calcRows = [
        3, 4, 5, 7, 8, 9, 10, 11, 13, 15, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,
        28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45,
        46, 47, 48, 49, 50, 51, 52, 53, 54, 56, 57, 58, 59, 60, 61, 62, 63, 64,
        65, 66, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83,
        84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, // 31 inadmissible rows
        101, 102, 103, 104, 105, 106, // Admissible deductions
        108, // Income before depreciation
        110, 111, 112, 113, // Tax depreciation
        115, 116, 117, 118, 119, 120, // Business and other incomes
        121, // Total income
        123, 124, // Allowances
        126, // Taxable income
        128, 129, 130, 131, 132, 133, 134, 135, 136, 137, // Tax calculations
        139, 140, 141, 142, // Tax credits and startup
        144, 146, 147, 148, 149, 150, 152, 153 // Final tax calculations
    ];
    
    // Map display rows to calculation rows
    calcRows.forEach(calcRow => {
        rowMapping[calcRow] = calcRow;
    });
}

// SIMPLIFIED TABLE STRUCTURE - 2 columns for input section, 3 columns for tax results
const tableStructure = [
    // Row 1: Empty

    { type: 'empty'},
    { type: 'empty'},
    
    // Row 3: GROSS REVENUE
    { 
        type: 'total',
        displayRow: 3,
        description: 'GROSS REVENUE ( EXCLUDING SALES TAX & FEDERAL EXCISE DUTY)',
        formula: 'C4+C5'
    },
    
    // Row 4: DOMESTIC SALES
    { 
        type: 'input',
        displayRow: 4,
        description: 'GROSS DOMESTIC SALES/ SERVICES FEE',
    },
    
    // Row 5: EXPORT SALES
    { 
        type: 'input',
        displayRow: 5,
        description: 'GROSS EXPORT SALES/ SERVICES FEE',
    },
    
    // Row 6: PSEB Registration (Dropdown)
    { 
        type: 'pseb-dropdown',
        displayRow: 6,
        description: 'Is Company registered with PSEB',
    },
    { type: 'empty'},
    { type: 'empty'},
    // Row 8: SELLING EXPENSES TOTAL
    { 
        type: 'total',
        displayRow: 8,
        description: 'SELLING EXPENSES(FREIGHT OUTWARD, BROKERAGE, COMMISSION, DISCOUNT etc.)',
        formula: 'C9+C10+C11'
    },
    
    // Row 9: DOMESTIC COMMISSION
    { 
        type: 'input',
        displayRow: 9,
        description: 'DOMESTIC COMMISSION/ BROKERAGE/ DISCOUNT/ FREIGHT OUTWARD, etc.',
    },
    
    // Row 10: FOREIGN COMMISSION
    { 
        type: 'input',
        displayRow: 10,
        description: 'FOREIGN COMMISSION/ BROKERAGE/ DISCOUNT/ FREIGHT OUTWARD, etc.',
    },
    
    // Row 11: REBATE/DUTY DRAWBACKS
    { 
        type: 'input',
        displayRow: 11,
        description: 'REBATE/ DUTY DRAWBACKS',
    },
    
   { type: 'empty'},
    { type: 'empty'},
    
    // Row 15: COST OF SALES TOTAL
    { 
        type: 'total',
        displayRow: 15,
        description: 'COST OF SALES/ SERVICES',
        formula: 'C17+C18+C19+C20+C21+C22+C23+C24+C25'
    },
    
    // Row 16: DIRECT EXPENSES HEADER
    { 
        type: 'section',
        displayRow: 16,
        description: 'DIRECT EXPENSES',
    },
    
    // Rows 17-25: Direct Expenses Items
    { type: 'input', displayRow: 17, description: 'SALARIES/ WAGES' },
    { type: 'input', displayRow: 18, description: 'POWER' },
    { type: 'input', displayRow: 19, description: 'GAS' },
    { type: 'input', displayRow: 20, description: 'REPAIR/ MAINTENANCE' },
    { type: 'input', displayRow: 21, description: 'INSURANCE' },
    { type: 'input', displayRow: 22, description: 'ROYALTY' },
    { type: 'input', displayRow: 23, description: 'OTHER DIRECT EXPENSES' },
    { type: 'input', displayRow: 24, description: 'ACCOUNTING AMORTISATION' },
    { type: 'input', displayRow: 25, description: 'ACCOUNTING DEPRECIATION' },
    
    // Row 26: GROSS PROFIT
    { 
        type: 'subtotal',
        displayRow: 26,
        description: 'GROSS PROFIT/ (LOSS)',
        formula: 'C13-C15'
    },
    
    { type: 'empty'},
    { type: 'empty'},
    
    // Row 28: INDIRECT EXPENSES TOTAL
    { 
        type: 'total',
        displayRow: 28,
        description: 'MANAGEMENT, ADMINISTRATIVE, SELLING & FINANCIAL EXPENSES',
        formula: 'C29:C54'
    },
    
    // Rows 29-54: Indirect Expenses Items (26 items)
    { type: 'input', displayRow: 29, description: 'RENT' },
    { type: 'input', displayRow: 30, description: 'RATES / TAXES / CESS' },
    { type: 'input', displayRow: 31, description: 'SALARIES / WAGES / PERQUISITES / BENEFITS' },
    { type: 'input', displayRow: 32, description: 'TRAVELING / CONVEYANCE / VEHICLES RUNNING / MAINTENANCE' },
    { type: 'input', displayRow: 33, description: 'ELECTRICITY / WATER / GAS' },
    { type: 'input', displayRow: 34, description: 'COMMUNICATION' },
    { type: 'input', displayRow: 35, description: 'REPAIR / MAINTENANCE' },
    { type: 'input', displayRow: 36, description: 'STATIONERY / PRINTING / PHOTOCOPIES / OFFICE SUPPLIES' },
    { type: 'input', displayRow: 37, description: 'ADVERTISEMENT / PUBLICITY / PROMOTION' },
    { type: 'input', displayRow: 38, description: 'INSURANCE' },
    { type: 'input', displayRow: 39, description: 'PROFESSIONAL CHARGES' },
    { type: 'input', displayRow: 40, description: 'PROFIT ON DEBT (FINANCIAL CHARGES / MARKUP / INTEREST)' },
    { type: 'input', displayRow: 41, description: 'DONATION / CHARITY' },
    { type: 'input', displayRow: 42, description: 'BROKERAGE / COMMISSION' },
    { type: 'input', displayRow: 43, description: 'OTHER INDIRECT EXPENSES' },
    { type: 'input', displayRow: 44, description: 'DIRECTORS FEE' },
    { type: 'input', displayRow: 45, description: 'WORKERS PROFIT PARTICIPATION FUND' },
    { type: 'input', displayRow: 46, description: 'PROVISION FOR DOUBTFUL / BAD DEBTS' },
    { type: 'input', displayRow: 47, description: 'PROVISION FOR OBSOLETE STOCKS / STORES / SPARES / FIXED ASSETS' },
    { type: 'input', displayRow: 48, description: 'PROVISION FOR DIMINUTION IN VALUE OF INVESTMENT' },
    { type: 'input', displayRow: 49, description: 'IRRECOVERABLE DEBTS WRITTEN OFF' },
    { type: 'input', displayRow: 50, description: 'OBSOLETE STOCKS / STORES / SPARES / FIXED ASSETS WRITTEN OFF' },
    { type: 'input', displayRow: 51, description: 'ACCOUNTING (LOSS) ON SALE OF INTANGIBLES' },
    { type: 'input', displayRow: 52, description: 'ACCOUNTING (LOSS) ON SALE OF ASSETS' },
    { type: 'input', displayRow: 53, description: 'ACCOUNTING AMORTIZATION' },
    { type: 'input', displayRow: 54, description: 'ACCOUNTING DEPRECIATION' },
    
   { type: 'empty'},
    { type: 'empty'},
    
    // Row 56: OTHER REVENUES TOTAL
    { 
        type: 'total',
        displayRow: 56,
        description: 'ADD: OTHER REVENUES',
        formula: 'C57:C65'
    },
    
    // Rows 57-65: Other Revenues (9 items)
    { type: 'input', displayRow: 57, description: 'OTHER REVENUES' },
    { type: 'input', displayRow: 58, description: 'FEE FOR TECHNICAL / PROFESSIONAL SERVICES' },
    { type: 'input', displayRow: 59, description: 'FEE FOR OTHER SERVICES' },
    { type: 'input', displayRow: 60, description: 'PROFIT ON DEBT' },
    { type: 'input', displayRow: 61, description: 'ROYALTY' },
    { type: 'input', displayRow: 62, description: 'LICENSE / FRANCHISE FEE' },
    { type: 'input', displayRow: 63, description: 'ACCOUNTING GAIN ON SALE OF INTANGIBLES' },
    { type: 'input', displayRow: 64, description: 'ACCOUNTING GAIN ON SALE OF ASSETS' },
    { type: 'input', displayRow: 65, description: 'OTHERS' },
    
    // Row 66: ACCOUNTING PROFIT
    { 
        type: 'total',
        displayRow: 66,
        description: 'ACCOUNTING PROFIT/ (LOSS)',
        formula: 'C26-C28+C56'
    },
    
    { type: 'empty'},
    { type: 'empty'},
    
    // Row 68: INADMISSIBLE DEDUCTIONS TOTAL
    { 
        type: 'total',
        displayRow: 68,
        description: 'INADMISSIBLE DEDUCTIONS',
        formula: 'C69:C99'
    },
    
    // Rows 69-93: Inadmissible Deductions (input fields)
    { type: 'input', displayRow: 69, description: 'PROVISION FOR DOUBTFUL DEBTS (Excess of actual bad debts over amount written off in accounts )' },
    { type: 'input', displayRow: 70, description: 'PROVISION FOR OBSOLETE STOCKS / STORES / SPARES / FIXED ASSETS' },
    { type: 'input', displayRow: 71, description: 'PROVISION FOR DIMINUTION IN VALUE OF INVESTMENT' },
    { type: 'input', displayRow: 72, description: 'PROVISION FOR RESERVES / FUNDS / AMOUNT CARRIED TO RESERVES / FUNDS OR CAPITALIZED' },
    { type: 'input', displayRow: 73, description: 'CESS / RATE / TAX LEVIED ON PROFITS / GAINS' },
    { type: 'input', displayRow: 74, description: 'AMOUNT OF TAX DEDUCTED AT SOURCE' },
    { type: 'input', displayRow: 75, description: 'PAYMENTS LIABLE TO DEDUCTION OF TAX AT SOURCE BUT TAX NOT DEDUCTED / PAID' },
    { type: 'input', displayRow: 76, description: 'ENTERTAINMENT EXPENDITURE ABOVE PRESCRIBED LIMIT' },
    { type: 'input', displayRow: 77, description: 'CONTRIBUTIONS TO UNRECOGNIZED / UNAPPROVED FUNDS' },
    { type: 'input', displayRow: 78, description: 'CONTRIBUTIONS TO FUNDS NOT UNDER EFFECTIVE ARRANGEMENT FOR DEDUCTION OF TAX AT SOURCE' },
    { type: 'input', displayRow: 79, description: 'FINE / PENALTY FOR VIOLATION OF ANY LAW / RULE / REGULATION' },
    { type: 'input', displayRow: 80, description: 'PERSONAL EXPENDITURE' },
    { type: 'input', displayRow: 81, description: 'PROFIT ON DEBT / BROKERAGE / COMMISSION / SALARY / REMUNERATION PAID BY AN AOP TO ITS MEMBER' },
    { type: 'input', displayRow: 82, description: 'EXPENDITURE UNDER A SINGLE ACCOUNT HEAD EXCEEDING PRESCRIBED AMOUNT NOT PAID THROUGH PRESCRIBED MODE' },
    { type: 'input', displayRow: 83, description: 'EXPENDITURE UNDER A SINGLE ACCOUNT HEAD EXCEEDING PRESCRIBED AMOUNT NOT PAID THROUGH DIGITAL MODE' },
    { type: 'input', displayRow: 84, description: 'SALARY EXCEEDING PRESCRIBED AMOUNT NOT PAID THROUGH PRESCRIBED MODE' },
    { type: 'input', displayRow: 85, description: 'CAPITAL EXPENDITURE' },
    { type: 'input', displayRow: 86, description: 'EXPENDITURE ATTRIBUTABLE TO NON-BUSINESS INCOME' },
    { type: 'input', displayRow: 87, description: 'LEASE RENTAL NOT ADMISSIBLE' },
    { type: 'input', displayRow: 88, description: 'TAX GAIN ON SALE OF INTANGIBLES' },
    { type: 'input', displayRow: 89, description: 'TAX GAIN ON SALE OF ASSETS' },
    { type: 'input', displayRow: 90, description: 'UTILITY BILLS EXCEEDING PRESCRIBED AMOUNT NOT PAID THROUGH PRESCRIBED MODE' },
    { type: 'input', displayRow: 91, description: 'DEDUCTION ON PROFIT ON DEBIT INADMISSIBLE U/S 106A' },
    { type: 'input', displayRow: 92, description: 'ADD BACKS PRE-COMMENCEMENT EXPENDITURE / DEFERRED COST' },
    { type: 'input', displayRow: 93, description: 'OTHER INADMISSIBLE DEDUCTIONS' },
    
    
    { type: 'empty'},
    { type: 'empty'},
    // Row 101: ADMISSIBLE DEDUCTIONS TOTAL
    { 
        type: 'total',
        displayRow: 101,
        description: 'ADMISSIBLE DEDUCTIONS OTHER THAN TAX DEPRECIATION/ INITIAL ALLOANCE/ AMORTISATION FOR CURRENT OR PREVIOUS YEARS',
        formula: 'C102:C106'
    },
    
    // Rows 102-106: Admissible Deductions (5 items)
    { type: 'input', displayRow: 102, description: 'ACCOUNTING GAIN ON SALE OF INTANGIBLES' },
    { type: 'input', displayRow: 103, description: 'ACCOUNTING GAIN ON SALE OF ASSETS' },
    { type: 'input', displayRow: 104, description: 'OTHER ADMISSIBLE DEDUCTIONS' },
    { type: 'input', displayRow: 105, description: 'TAX (LOSS) ON SALE OF INTANGIBLES' },
    { type: 'input', displayRow: 106, description: 'TAX (LOSS) ON SALE OF ASSETS' },
    
    { type: 'empty'},
    { type: 'empty'},
    
    // Row 110: TAX DEPRECIATION TOTAL
    { 
        type: 'total',
        displayRow: 110,
        description: 'TAX DEPRECIATION/ INITIAL ALLOWANCE/ AMORTISATION FOR CURRENT OR PREVIOUS YEARS',
        formula: 'C111:C113'
    },
    
    // Rows 111-113: Tax Depreciation Items (3 items)
    { type: 'input', displayRow: 111, description: 'TAX AMORTIZATION FOR CURRENT YEAR' },
    { type: 'input', displayRow: 112, description: 'TAX DEPRECIATION / INITIAL ALLOWANCE FOR CURRENT YEAR' },
    { type: 'input', displayRow: 113, description: 'PRE-COMMENCEMENT EXPENDITURE / DEFERRED COST' },
    
    // Row 115: BUSINESS INCOME (NON-EDITABLE)
    { 
        type: 'calculated',
        displayRow: 115,
        description: 'INCOME/ LOSS FROM BUSINESS',
        formula: 'C108-C110'
    },
    

    
    // Row 121: TOTAL INCOME
    { 
        type: 'total',
        displayRow: 121,
        description: 'TOTAL INCOME',
        formula: 'C115:C120'
    },
    
    { type: 'empty'},
    { type: 'empty'},
    
    // Row 123: DEDUCTIBLE ALLOWANCES TOTAL
    { 
        type: 'total',
        displayRow: 123,
        description: 'DEDUCTIBLE ALLOWANCES',
        formula: 'C124:C124'
    },
    
    // Row 124: Workers Welfare Fund
    { 
        type: 'input',
        displayRow: 124,
        description: 'WORKERS WELFARE FUND U/S 60A',
    },
    
  { type: 'empty'},
    { type: 'empty'},
    
    // Row 126: TAXABLE INCOME
    { 
        type: 'total',
        displayRow: 126,
        description: 'TAXABLE INCOME',
        formula: 'C121-C123'
    },
    
    // ========== TAX CALCULATION SECTION ==========
    // FROM ROW 128 ONWARDS, SHOW 3 COLUMNS FOR RESULTS
    
    // Row 127: Empty
    { type: 'empty', displayRow: 127 },
    
    // Row 128: TAX CHARGEABLE HEADER - 3 COLUMNS
    { 
        type: 'tax-header',
        displayRow: 128,
        description: 'TAX CHARGEABLE',
    },
    
    // Row 129: NORMAL INCOME TAX - 3 COLUMNS
    { 
        type: 'tax-calc',
        displayRow: 129,
        description: 'NORMAL INCOME TAX',
        formula: 'IF(E126>0,E126*0.29,0)'
    },
    
    // Row 130: FINAL/FIXED TAX - 3 COLUMNS
    { 
        type: 'tax-calc',
        displayRow: 130,
        description: 'FINAL/ FIXED/ MINIMUM/ AVERAGE/ RELEVANT/ REDUCED INCOME TAX',
        formula: 'D5*0.025'
    },
    
    // Row 131: ALTERNATE CORPORATE TAX - 3 COLUMNS
    { 
        type: 'tax-calc',
        displayRow: 131,
        description: 'ACCOUNTING PROFIT / TAX CHARGEABLE',
        formula: 'IF(C66>0,C66*0.17,0)'
    },
    
    // Row 132: MINIMUM TAX - 3 COLUMNS
    { 
        type: 'tax-calc',
        displayRow: 132,
        description: 'TURNOVER/ TAX CHARGEABLE',
        formula: 'IF(E3>100000000,E3*0.0125,0)'
    },
    
    // Row 133: DIFFERENCE OF MINIMUM TAX - 3 COLUMNS
    { 
        type: 'tax-calc',
        displayRow: 133,
        description: 'DIFFERENCE OF MINIMUM TAX CHARGEABLE',
        formula: 'IF((E132>E129),(E132-E129),0)'
    },
    
    
    // Row 138: Empty
    { type: 'empty', displayRow: 138 },
    
    // Row 139: TAX CREDIT HEADER - 3 COLUMNS
    { 
        type: 'tax-result',
        displayRow: 139,
        description: 'TAX CREDIT -',
    },
    
    // Row 140: CHARITABLE DONATIONS CREDIT - 3 COLUMNS
    { 
        type: 'tax-input',
        displayRow: 140,
        description: 'Tax Credit for Charitable Donations',
    },
    
    // Row 141: OTHER CREDITS - 3 COLUMNS
    { 
        type: 'tax-calc-fixed',
        displayRow: 141,
        description: 'Tax Credit for Certain Persons (Coal Mining Projects, Startups, IT/IT enabled Services)',
        value: 0
    },
    
    // Row 142: STARTUP QUESTION - 3 COLUMNS
    { 
        type: 'startup-dropdown',
        displayRow: 142,
        description: 'Are you a startup(Define as per Income Tax) or IT services Exportor?',
    },
    
    // Row 143: Empty
    { type: 'empty', displayRow: 143 },
    
    // Row 144: NET TAX LIABILITY - 3 COLUMNS
    { 
        type: 'tax-result',
        displayRow: 144,
        description: 'Net TAX LIABILITY',
        formula: 'E128-E139'
    },
    
    // Row 145: Empty
    { type: 'empty', displayRow: 145 },
    
    // Row 146: ADVANCE TAX TOTAL - 3 COLUMNS
    { 
        type: 'tax-result',
        displayRow: 146,
        description: 'Advance Tax Total',
        formula: 'SUM(E147:E150)'
    },
    
    // Row 147: WITHHOLDING INCOME TAX - 3 COLUMNS (E column input)
    { 
        type: 'e-input',
        displayRow: 147,
        description: 'WITHHOLDING INCOME TAX',
    },
    
    // Row 148: ADVANCE INCOME TAX - 3 COLUMNS (E column input)
    { 
        type: 'e-input',
        displayRow: 148,
        description: 'ADVANCE INCOME TAX',
    },
    
    // Row 149: ADVANCE TAX U/S 147(A) - 3 COLUMNS (E column input)
    { 
        type: 'e-input',
        displayRow: 149,
        description: 'ADVANCE INCOME TAX U/S 147(A)',
    },
    
    // Row 150: ADVANCE TAX U/S 147(5B) - 3 COLUMNS (E column input)
    { 
        type: 'e-input',
        displayRow: 150,
        description: 'ADVANCE INCOME TAX U/S 147(5B)',
    },
    
 
];

// Format number with commas
function formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return Math.round(num).toLocaleString('en-US');
}

// Create table row - UPDATED FOR 2-COLUMN / 3-COLUMN STRUCTURE
// In the createTableRow() function, update the relevant cases:

function createTableRow(item, index) {
    const row = document.createElement('tr');
    const calcRow = rowMapping[item.displayRow] || item.displayRow;
    
    if (item.class) {
        row.className = item.class;
    }
    
    // Set data-row attribute for CSS targeting
    row.setAttribute('data-row', item.displayRow);
    
    // Determine which column value to show in Amount column
    // For tax calculation rows (128+), show E column value
    // For other rows, show C column value
    const showEValueInAmount = item.displayRow >= 128;
    const amountColumnValue = showEValueInAmount 
        ? taxEngine.getValue(`E${calcRow}`)
        : taxEngine.getValue(`C${calcRow}`);
    
  switch (item.type) {
    case 'empty':
        // ALWAYS use colspan="2" - never 3
        row.innerHTML = `<td colspan="2" style="height: 10px;"></td>`;
        break;
        
    case 'header':
        // ALWAYS show only 2 columns
        row.innerHTML = `
            <td><strong>${item.description}</strong></td>
            <td class="input-col"><strong>Amount</strong></td>
        `;
        break;
        
    case 'input':
        if (item.displayRow >= 128) {
            // For tax calculation rows, show E value in Amount column (NO 3rd column)
            row.innerHTML = `
                <td>${item.description}</td>
                <td class="input-col calculated-cell tax-cell" id="C${item.displayRow}">
                    ${formatNumber(amountColumnValue)}
                </td>
            `;
        } else {
            // For regular input rows, show input field
            row.innerHTML = `
                <td>${item.description}</td>
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
        
    case 'calculated':
    case 'calculated-special':
        if (item.displayRow >= 128) {
            row.innerHTML = `
                <td>${item.description}</td>
                <td class="input-col calculated-cell tax-cell" id="C${item.displayRow}">
                    ${formatNumber(amountColumnValue)}
                </td>
            `;
        } else {
            row.innerHTML = `
                <td>${item.description}</td>
                <td class="input-col calculated-cell" id="C${item.displayRow}">
                    ${formatNumber(amountColumnValue)}
                </td>
            `;
        }
        break;
        
    case 'pseb-dropdown':
        const psebValue = taxEngine.getValue('D6') || 'Yes';
        // ALWAYS show only 2 columns
        row.innerHTML = `
            <td><strong>${item.description}</strong></td>
            <td class="input-col">
                <select id="D6" data-calc-row="6" data-column="D" style="width: 100%; border: none; background: transparent; font-family: Consolas; font-size: 11px; color: #52c41a; padding: 2px 4px;">
                    <option value="Yes" ${psebValue === 'Yes' ? 'selected' : ''}>Yes</option>
                    <option value="No" ${psebValue === 'No' ? 'selected' : ''}>No</option>
                </select>
            </td>
        `;
        break;
        
    case 'startup-dropdown':
        const startupValue = taxEngine.getValue('C142') || 'No';
        // ALWAYS show only 2 columns
        row.innerHTML = `
            <td><strong>${item.description}</strong></td>
            <td class="input-col">
                <select id="C142" data-calc-row="142" data-column="C" style="width: 100%; border: none; background: transparent; font-family: Consolas; font-size: 11px; color: #1890ff; padding: 2px 4px;">
                    <option value="Yes" ${startupValue === 'Yes' ? 'selected' : ''}>Yes</option>
                    <option value="No" ${startupValue === 'No' ? 'selected' : ''}>No</option>
                </select>
            </td>
        `;
        break;
        
    case 'ratio':
        // Special handling for ratio row (7) - ALWAYS 2 columns
        row.innerHTML = `
            <td><strong>${item.description}</strong></td>
            <td class="input-col calculated-cell" id="C${item.displayRow}">
                ${taxEngine.getValue('D7') ? taxEngine.getValue('D7').toFixed(4) : '0.0000'} / 
                ${taxEngine.getValue('D7') ? (1 - taxEngine.getValue('D7')).toFixed(4) : '1.0000'}
            </td>
        `;
        break;
        
    case 'total':
    case 'subtotal':
        if (item.displayRow >= 128) {
            row.innerHTML = `
                <td><strong>${item.description}</strong></td>
                <td class="input-col calculated-cell tax-cell" id="C${item.displayRow}">
                    ${formatNumber(amountColumnValue)}
                </td>
            `;
        } else {
            row.innerHTML = `
                <td><strong>${item.description}</strong></td>
                <td class="input-col calculated-cell" id="C${item.displayRow}">
                    ${formatNumber(amountColumnValue)}
                </td>
            `;
        }
        break;
        
    case 'tax-header':
        row.innerHTML = `
            <td><strong>${item.description}</strong></td>
            <td class="input-col calculated-cell tax-cell" id="C${item.displayRow}">
                ${formatNumber(taxEngine.getValue(`E${calcRow}`))}
            </td>
        `;
        break;
        
    case 'tax-calc':
    case 'tax-calc-zero':
        row.innerHTML = `
            <td>${item.description}</td>
            <td class="input-col calculated-cell tax-cell" id="C${item.displayRow}">
                ${formatNumber(taxEngine.getValue(`E${calcRow}`))}
            </td>
        `;
        break;
        
    case 'tax-empty':
        row.innerHTML = `
            <td>${item.description}</td>
            <td class="input-col"></td>
        `;
        break;
        
    case 'tax-input':
        row.innerHTML = `
            <td>${item.description}</td>
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
        
    case 'tax-input-zero':
        row.innerHTML = `
            <td>${item.description}</td>
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
        
    case 'e-input':
        row.innerHTML = `
            <td><strong>${item.description}</strong></td>
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
        
    case 'tax-result':
        row.innerHTML = `
            <td><strong>${item.description}</strong></td>
            <td class="input-col calculated-cell tax-result" id="C${item.displayRow}">
                <strong>${formatNumber(taxEngine.getValue(`E${calcRow}`))}</strong>
            </td>
        `;
        break;
}
    
    return row;
}

// Input validation
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

// Render the complete table
function renderTable() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    tableStructure.forEach((item, index) => {
        const row = createTableRow(item, index);
        tableBody.appendChild(row);
    });
    
    // Add event listeners ONLY to editable inputs
    document.querySelectorAll('#tableBody input').forEach(input => {
        // Skip inputs that are in calculated cells (they have no input element anyway)
        if (!input.closest('td').classList.contains('calculated-cell')) {
            input.addEventListener('input', validateInput);
            input.addEventListener('input', handleInputChange);
            input.addEventListener('blur', formatInputValue);
        }
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
        
        // Update C column (Amount column)
        const cCell = document.getElementById(`C${displayRow}`);
        if (cCell && cCell.classList.contains('calculated-cell')) {
            // For tax calculation rows (128+), show E value
            // For other rows, show C value
            const valueToShow = displayRow >= 128 
                ? taxEngine.getValue(`E${calcRow}`)
                : taxEngine.getValue(`C${calcRow}`);
            
            // Special handling for ratio row
            if (displayRow === 7) {
                cCell.textContent = `${taxEngine.getValue('D7') ? taxEngine.getValue('D7').toFixed(4) : '0.0000'} / ${taxEngine.getValue('D7') ? (1 - taxEngine.getValue('D7')).toFixed(4) : '1.0000'}`;
            } else {
                cCell.textContent = formatNumber(valueToShow);
            }
        }
        
        // Update E column for tax calculation rows (row 128 and above)
        if (displayRow >= 128) {
            const eCell = document.getElementById(`E${displayRow}`);
            if (eCell && !eCell.querySelector('input')) {
                eCell.textContent = formatNumber(taxEngine.getValue(`E${calcRow}`));
            }
        }
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
    
    // Initially hide the results panel
    const resultsPanel = document.getElementById('resultsPanel');
    resultsPanel.style.display = 'none';
    
    document.getElementById('calculateTax').addEventListener('click', function(event) {
        const panel = document.getElementById('resultsPanel');
        const button = event.target;
        
        if (panel.style.display === 'none') {
            // Calculate tax and show panel
            taxEngine.calculateAll();
            updateDisplay();
            
            // Show panel with animation
            panel.style.display = 'block';
            panel.style.opacity = '0';
            panel.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                panel.style.transition = 'all 0.3s ease';
                panel.style.opacity = '1';
                panel.style.transform = 'translateY(0)';
            }, 10);
            
            // Scroll to panel for better UX
            panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Change button text
            button.textContent = 'Hide Tax Results';
            button.classList.remove('btn-success');
            button.classList.add('btn-secondary');
        } else {
            // Hide panel
            panel.style.opacity = '0';
            panel.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                panel.style.display = 'none';
                // Change button text back
                button.textContent = 'Calculate Final Tax';
                button.classList.remove('btn-secondary');
                button.classList.add('btn-success');
            }, 300);
        }
    });
    

}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);