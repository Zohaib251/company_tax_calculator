// Initialize tax engine
const taxEngine = new TaxEngine();

// Table structure definition matching the Excel sheet
const tableStructure = [
    // Row 1: Empty
    { type: 'empty' },
    
    // Row 2: Header
    { 
        type: 'header',
        description: 'Description',
        reference: '',
        totalLabel: 'TOTAL AMOUNTS',
        exemptLabel: 'AMOUNT EXEMPT FROM TAX/ SUBJECT TO FIXED/ FINAL TAX',
        taxLabel: 'AMOUNT SUBJECT TO NORMAL TAX'
    },
    
    // Row 3: GROSS REVENUE
    { 
        type: 'total',
        row: 3,
        description: 'GROSS REVENUE ( EXCLUDING SALES TAX & FEDERAL EXCISE DUTY)',
        reference: "a=a'+b'",
        formula: 'C4+C5'
    },
    
    // Row 4: DOMESTIC SALES
    { 
        type: 'input',
        row: 4,
        description: 'GROSS DOMESTIC SALES/ SERVICES FEE',
        reference: "a'"
    },
    
    // Row 5: EXPORT SALES
    { 
        type: 'input',
        row: 5,
        description: 'GROSS EXPORT SALES/ SERVICES FEE',
        reference: "b'"
    },
    
    // Row 6: PSEB Registration
    { 
        type: 'info',
        row: 6,
        description: 'Is Company registered with PSEB',
        reference: '',
        value: 'Yes'
    },
    
    // Row 7: RATIO
    { 
        type: 'ratio',
        row: 7,
        description: 'Ratio',
        reference: '',
        class: 'ratio-row'
    },
    
    // Row 8: SELLING EXPENSES TOTAL
    { 
        type: 'total',
        row: 8,
        description: 'SELLING EXPENSES(FREIGHT OUTWARD, BROKERAGE, COMMISSION, DISCOUNT etc.)',
        reference: "b=e'+d'+f'",
        formula: 'C9+C10+C11'
    },
    
    // Row 9: DOMESTIC COMMISSION
    { 
        type: 'input',
        row: 9,
        description: 'DOMESTIC COMMISSION/ BROKERAGE/ DISCOUNT/ FREIGHT OUTWARD, etc.',
        reference: "e'"
    },
    
    // Row 10: FOREIGN COMMISSION
    { 
        type: 'input',
        row: 10,
        description: 'FOREIGN COMMISSION/ BROKERAGE/ DISCOUNT/ FREIGHT OUTWARD, etc.',
        reference: "d'"
    },
    
    // Row 11: REBATE/DUTY DRAWBACKS
    { 
        type: 'input',
        row: 11,
        description: 'REBATE/ DUTY DRAWBACKS',
        reference: "f'"
    },
    
    // Row 12: Empty
    { type: 'empty' },
    
    // Row 13: NET REVENUE
    { 
        type: 'subtotal',
        row: 13,
        description: 'NET REVENUE (EXCLUDING SALES TAX, FEDERAL EXCISE, BROKERAGE, COMMISSION, DISCOUNT, FREIGHT OUTWARD)',
        reference: 'c=a-b',
        formula: 'C3-C8'
    },
    
    // Row 14: Empty
    { type: 'empty' },
    
    // Row 15: COST OF SALES TOTAL
    { 
        type: 'total',
        row: 15,
        description: 'COST OF SALES/ SERVICES',
        reference: 'd',
        formula: 'C17+C18+C19+C20+C21+C22+C23+C24+C25'
    },
    
    // Row 16: DIRECT EXPENSES HEADER
    { 
        type: 'section',
        row: 16,
        description: 'DIRECT EXPENSES',
        reference: ''
    },
    
    // Rows 17-25: Direct Expenses Items
    { type: 'input', row: 17, description: 'SALARIES/ WAGES', reference: '' },
    { type: 'input', row: 18, description: 'POWER', reference: '' },
    { type: 'input', row: 19, description: 'GAS', reference: '' },
    { type: 'input', row: 20, description: 'REPAIR/ MAINTENANCE', reference: '' },
    { type: 'input', row: 21, description: 'INSURANCE', reference: '' },
    { type: 'input', row: 22, description: 'ROYALTY', reference: '' },
    { type: 'input', row: 23, description: 'OTHER DIRECT EXPENSES', reference: '' },
    { type: 'input', row: 24, description: 'ACCOUNTING AMORTISATION', reference: '' },
    { type: 'input', row: 25, description: 'ACCOUNTING DEPRECIATION', reference: '' },
    
    // Row 26: GROSS PROFIT
    { 
        type: 'subtotal',
        row: 26,
        description: 'GROSS PROFIT/ (LOSS)',
        reference: 'e=c-d',
        formula: 'C13-C15'
    },
    
    // Row 27: Empty
    { type: 'empty' },
    
    // Row 28: INDIRECT EXPENSES TOTAL
    { 
        type: 'total',
        row: 28,
        description: 'MANAGEMENT, ADMINISTRATIVE, SELLING & FINANCIAL EXPENSES',
        reference: 'f',
        formula: 'C29:C54'
    },
    
    // Rows 29-54: Indirect Expenses Items
    { type: 'input', row: 29, description: 'RENT', reference: '' },
    { type: 'input', row: 30, description: 'RATES / TAXES / CESS', reference: '' },
    { type: 'input', row: 31, description: 'SALARIES / WAGES / PERQUISITES / BENEFITS', reference: '' },
    { type: 'input', row: 32, description: 'TRAVELING / CONVEYANCE / VEHICLES RUNNING / MAINTENANCE', reference: '' },
    { type: 'input', row: 33, description: 'ELECTRICITY / WATER / GAS', reference: '' },
    { type: 'input', row: 34, description: 'COMMUNICATION', reference: '' },
    { type: 'input', row: 35, description: 'REPAIR / MAINTENANCE', reference: '' },
    { type: 'input', row: 36, description: 'STATIONERY / PRINTING / PHOTOCOPIES / OFFICE SUPPLIES', reference: '' },
    { type: 'input', row: 37, description: 'ADVERTISEMENT / PUBLICITY / PROMOTION', reference: '' },
    { type: 'input', row: 38, description: 'INSURANCE', reference: '' },
    { type: 'input', row: 39, description: 'PROFESSIONAL CHARGES', reference: '' },
    { type: 'input', row: 40, description: 'PROFIT ON DEBT (FINANCIAL CHARGES / MARKUP / INTEREST)', reference: '' },
    { type: 'input', row: 41, description: 'DONATION / CHARITY', reference: '' },
    { type: 'input', row: 42, description: 'BROKERAGE / COMMISSION', reference: '' },
    { type: 'input', row: 43, description: 'OTHER INDIRECT EXPENSES', reference: '' },
    { type: 'input', row: 44, description: 'DIRECTORS FEE', reference: '' },
    { type: 'input', row: 45, description: 'WORKERS PROFIT PARTICIPATION FUND', reference: '' },
    { type: 'input', row: 46, description: 'PROVISION FOR DOUBTFUL / BAD DEBTS', reference: '' },
    { type: 'input', row: 47, description: 'PROVISION FOR OBSOLETE STOCKS / STORES / SPARES / FIXED ASSETS', reference: '' },
    { type: 'input', row: 48, description: 'PROVISION FOR DIMINUTION IN VALUE OF INVESTMENT', reference: '' },
    { type: 'input', row: 49, description: 'IRRECOVERABLE DEBTS WRITTEN OFF', reference: '' },
    { type: 'input', row: 50, description: 'OBSOLETE STOCKS / STORES / SPARES / FIXED ASSETS WRITTEN OFF', reference: '' },
    { type: 'input', row: 51, description: 'ACCOUNTING (LOSS) ON SALE OF INTANGIBLES', reference: '' },
    { type: 'input', row: 52, description: 'ACCOUNTING (LOSS) ON SALE OF ASSETS', reference: '' },
    { type: 'input', row: 53, description: 'ACCOUNTING AMORTIZATION', reference: '' },
    { type: 'input', row: 54, description: 'ACCOUNTING DEPRECIATION', reference: '' },
    
    // Row 55: Empty
    { type: 'empty' },
    
    // Row 56: OTHER REVENUES TOTAL
    { 
        type: 'total',
        row: 56,
        description: 'ADD: OTHER REVENUES',
        reference: 'g',
        formula: 'C57:C65'
    },
    
    // Rows 57-65: Other Revenues
    { type: 'input', row: 57, description: 'OTHER REVENUES', reference: '' },
    { type: 'input', row: 58, description: 'FEE FOR TECHNICAL / PROFESSIONAL SERVICES', reference: '' },
    { type: 'input', row: 59, description: 'FEE FOR OTHER SERVICES', reference: '' },
    { type: 'input', row: 60, description: 'PROFIT ON DEBT', reference: '' },
    { type: 'input', row: 61, description: 'ROYALTY', reference: '' },
    { type: 'input', row: 62, description: 'LICENSE / FRANCHISE FEE', reference: '' },
    { type: 'input', row: 63, description: 'ACCOUNTING GAIN ON SALE OF INTANGIBLES', reference: '' },
    { type: 'input', row: 64, description: 'ACCOUNTING GAIN ON SALE OF ASSETS', reference: '' },
    { type: 'input', row: 65, description: 'OTHERS', reference: '' },
    
    // Row 66: ACCOUNTING PROFIT
    { 
        type: 'total',
        row: 66,
        description: 'ACCOUNTING PROFIT/ (LOSS)',
        reference: 'h=e-f+g',
        formula: 'C26-C28+C56'
    },
    
    // Row 67: Empty
    { type: 'empty' },
    
    // Row 68: INADMISSIBLE DEDUCTIONS TOTAL
    { 
        type: 'total',
        row: 68,
        description: 'INADMISSIBLE DEDUCTIONS',
        reference: 'i',
        formula: 'C69:C107'
    },
    
    // Rows 69-107: Inadmissible Deductions
    ...Array.from({length: 39}, (_, i) => ({
        type: 'input',
        row: 69 + i,
        description: `Inadmissible Deduction ${i + 1}`,
        reference: ''
    })),
    
    // Row 108: Empty
    { type: 'empty' },
    
    // Row 109: ADMISSIBLE DEDUCTIONS TOTAL
    { 
        type: 'total',
        row: 109,
        description: 'ADMISSIBLE DEDUCTIONS OTHER THAN TAX DEPRECIATION/ INITIAL ALLOANCE/ AMORTISATION FOR CURRENT OR PREVIOUS YEARS',
        reference: 'J',
        formula: 'C110:C114'
    },
    
    // Rows 110-114: Admissible Deductions
    { type: 'input', row: 110, description: 'ACCOUNTING GAIN ON SALE OF INTANGIBLES', reference: '' },
    { type: 'input', row: 111, description: 'ACCOUNTING GAIN ON SALE OF ASSETS', reference: '' },
    { type: 'input', row: 112, description: 'OTHER ADMISSIBLE DEDUCTIONS', reference: '' },
    { type: 'input', row: 113, description: 'TAX (LOSS) ON SALE OF INTANGIBLES', reference: '' },
    { type: 'input', row: 114, description: 'TAX (LOSS) ON SALE OF ASSETS', reference: '' },
    
    // Row 115: Empty
    { type: 'empty' },
    
    // Row 116: INCOME BEFORE DEPRECIATION
    { 
        type: 'subtotal',
        row: 116,
        description: 'INCOME / (LOSS) FROM BUSINESS BEFORE ADJUSTMENT OF ADMISSIBLE DEPRECIATION / INITIAL ALLOWANCE / AMORTIZATION FOR CURRENT / PREVIOUS YEARS',
        reference: 'k=h+i-j',
        formula: 'C66+C68-C109'
    },
    
    // Row 117: Empty
    { type: 'empty' },
    
    // Row 118: TAX DEPRECIATION TOTAL
    { 
        type: 'total',
        row: 118,
        description: 'TAX DEPRECIATION/ INITIAL ALLOWANCE/ AMORTISATION FOR CURRENT OR PREVIOUS YEARS',
        reference: 'l',
        formula: 'C119:C121'
    },
    
    // Rows 119-121: Tax Depreciation Items
    { type: 'input', row: 119, description: 'TAX AMORTIZATION FOR CURRENT YEAR', reference: '' },
    { type: 'input', row: 120, description: 'TAX DEPRECIATION / INITIAL ALLOWANCE FOR CURRENT YEAR', reference: '' },
    { type: 'input', row: 121, description: 'PRE-COMMENCEMENT EXPENDITURE / DEFERRED COST', reference: '' },
    
    // Row 122: Empty
    { type: 'empty' },
    
    // Row 123: BUSINESS INCOME
    { 
        type: 'total',
        row: 123,
        description: 'INCOME/ LOSS FROM BUSINESS',
        reference: 'M=k-l',
        formula: 'C116-C118'
    },
    
    // Additional income types (simplified)
    { type: 'input', row: 124, description: 'INCOME/ LOSS FROM PROPERTY', reference: 'n' },
    { type: 'input', row: 125, description: 'INCOME/ LOSS FROM CAPITAL ASSETS', reference: 'o' },
    { type: 'input', row: 126, description: 'INCOME/ LOSS FROM OTHER SOURCES', reference: 'p' },
    { type: 'input', row: 127, description: 'FOREIGN INCOME', reference: 'q' },
    { type: 'input', row: 128, description: 'AGRICULTURAL INCOME', reference: 'r' },
    
    // Row 129: TOTAL INCOME
    { 
        type: 'total',
        row: 129,
        description: 'TOTAL INCOME',
        reference: 'S=m+n+o+p+q+r',
        formula: 'C123:C128'
    },
    
    // Row 130: Empty
    { type: 'empty' },
    
    // Row 131: DEDUCTIBLE ALLOWANCES TOTAL
    { 
        type: 'total',
        row: 131,
        description: 'DEDUCTIBLE ALLOWANCES',
        reference: 't',
        formula: 'C132:C133'
    },
    
    // Rows 132-133: Allowances
    { type: 'input', row: 132, description: 'WORKERS WELFARE FUND U/S 60A', reference: '' },
    { type: 'input', row: 133, description: 'WORKERS PROFIT PARTICIPATION FUND U/S 60B', reference: '' },
    
    // Row 134: Empty
    { type: 'empty' },
    
     // ROW 135: TAXABLE INCOME
    { 
        type: 'total',
        row: 135,
        description: 'TAXABLE INCOME',
        reference: 'w=s-t',
        formula: 'C129-C131'
    },
    
     // Row 134: TAX CHARGEABLE
    { 
        type: 'tax-header',
        row: 134,
        description: 'TAX CHARGEABLE',
        reference: 'x',
        note: '(Normal income tax will be adjusted against carry forward minimum tax upto the limit of Minimum tax u/s 113 or 113C as after which again minimum will be applied.)'
    },
    
    // Row 136: NORMAL INCOME TAX
    { 
        type: 'tax-calc',
        row: 136,
        description: 'NORMAL INCOME TAX @ 29%',
        reference: '',
        formula: 'E135*0.29'
    },
    
    // Row 137: FINAL/FIXED TAX
    { 
        type: 'tax-calc',
        row: 137,
        description: 'FINAL/ FIXED/ MINIMUM/ AVERAGE/ RELEVANT/ REDUCED INCOME TAX',
        reference: '',
        formula: 'D5*0.025'
    },
    
    // Row 138: WWF
    { 
        type: 'tax-calc',
        row: 138,
        description: 'WWF',
        reference: '',
        formula: ''
    },
    
    // Row 139: TAX ON HIGH EARNERS
    { 
        type: 'tax-calc',
        row: 139,
        description: 'TAX ON HIGH EARNING PERSONS U/S 4C',
        reference: '',
        note: '(4% will be charged on income exceeding Rs. 300M)'
    },
    
    // Row 140: ALTERNATE CORPORATE TAX
    { 
        type: 'tax-calc',
        row: 140,
        description: 'ACCOUNTING PROFIT / TAX CHARGEABLE 113C @ 17%',
        reference: '',
        formula: 'C66*0.17'
    },
    
    // Row 141: MINIMUM TAX
    { 
        type: 'tax-calc',
        row: 141,
        description: 'TURNOVER/ TAX CHARGEABLE UNDER SECTION 113 @ 1.25%',
        reference: '',
        formula: 'E3*0.0125'
    },
    
    // Row 142: DIFFERENCE OF MINIMUM TAX
    { 
        type: 'tax-calc',
        row: 142,
        description: 'DIFFERENCE OF MINIMUM TAX CHARGEABLE U/S 113',
        reference: '',
        formula: 'IF((E141>E137),(E141-E137),0)'
    },
    
    // Row 143: TAX ON DEEMED INCOME
    { 
        type: 'tax-calc',
        row: 143,
        description: 'TAX ON DEEMED INCOME U/S 7E @ 20% (OF 5% OF FMV)',
        reference: '',
        note: '(Treated to have derived as income an amount equal to 5% of FMV of Capital Assets having FMV in aggregate above Rs. 25M)'
    },
    
    // Row 144: DIFFERENCE OF ALTERNATE CORPORATE TAX
    { 
        type: 'tax-calc',
        row: 144,
        description: 'DIFFERENCE OF ALTERNATE CORPORATE TAX U/S 113C',
        reference: '',
        formula: 'IF(E140>E137,(E140-E137),0)'
    },
    
    // Row 145: DIFFERENCE OF MINIMUM TAX CHARGEABLE
    { 
        type: 'tax-calc',
        row: 145,
        description: 'DIFFERENCE OF MINIMUM TAX CHARGEABLE',
        reference: '',
        formula: ''
    },
    
    // Row 146: TAX REDUCTION
    { 
        type: 'tax-calc',
        row: 146,
        description: 'TAX REDUCTION',
        reference: '',
        formula: ''
    },
    
    // Row 147: Empty row
    { type: 'empty' },
    
    // Row 148: TAX CREDIT HEADER
    { 
        type: 'tax-header',
        row: 148,
        description: 'TAX CREDIT -',
        reference: 'Y'
    },
    
    // Row 149: CHARITABLE DONATIONS CREDIT
    { 
        type: 'tax-input',
        row: 149,
        description: 'Tax Credit for Charitable Donations u/s 61',
        reference: '',
        formula: 'MIN((E136/E135*C149),(0.2*E135))'
    },
    
    // Row 150: OTHER CREDITS
    { 
        type: 'tax-input',
        row: 150,
        description: 'Tax Credit for Certain Persons (Coal Mining Projects, Startups, IT/IT enabled Services) u/s 65F',
        reference: '',
        formula: 'C150'
    },
    
    // Row 151: TAX CREDIT U/S 103
    { 
        type: 'tax-input',
        row: 151,
        description: 'Tax Credit u/s 103',
        reference: '',
        formula: ''
    },
    
    // Row 152: WITHHOLDING INCOME TAX
    { 
        type: 'd-input',
        row: 152,
        description: 'WITHHOLDING INCOME TAX',
        reference: ''
    },
    
    // Row 153: ADVANCE INCOME TAX
    { 
        type: 'd-input',
        row: 153,
        description: 'ADVANCE INCOME TAX',
        reference: ''
    },
    
    // Row 154: ADVANCE TAX U/S 147(A)
    { 
        type: 'd-input',
        row: 154,
        description: 'ADVANCE INCOME TAX U/S 147(A)',
        reference: ''
    },
    
    // Row 155: ADVANCE TAX U/S 147(5B)
    { 
        type: 'd-input',
        row: 155,
        description: 'ADVANCE INCOME TAX U/S 147(5B)',
        reference: ''
    },
    
    // Empty row
    { type: 'empty' },
    
    // Row 156: ADMITTED INCOME TAX
    { 
        type: 'tax-result',
        row: 156,
        description: 'ADMITTED INCOME TAX',
        reference: '',
        formula: 'IF(SUM(D152:D155)>E136,0,E136-SUM(D152:D155))'
    },
    
    // Row 157: REFUNDABLE INCOME TAX
    { 
        type: 'tax-result',
        row: 157,
        description: 'REFUNDABLE INCOME TAX',
        reference: '',
        formula: 'IF(E156>0,0,SUM(D152:D155)-E136)'
    }
];

// Format number with commas
function formatNumber(num) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return Math.round(num).toLocaleString('en-US');
}

// Create table row based on structure definition
function createTableRow(item, index) {
    const row = document.createElement('tr');
    
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
                           id="C${item.row}" 
                           data-row="${item.row}"
                           value="${formatNumber(taxEngine.getValue(`C${item.row}`))}"
                           placeholder="Enter amount">
                </td>
                <td class="calculated-col" id="D${item.row}">${formatNumber(taxEngine.getValue(`D${item.row}`))}</td>
                <td class="calculated-col" id="E${item.row}">${formatNumber(taxEngine.getValue(`E${item.row}`))}</td>
            `;
            break;
            
        case 'total':
        case 'subtotal':
            row.innerHTML = `
                <td><strong>${item.description}</strong></td>
                <td><strong>${item.reference}</strong></td>
                <td class="input-col calculated-cell" id="C${item.row}">${formatNumber(taxEngine.getValue(`C${item.row}`))}</td>
                <td class="calculated-col" id="D${item.row}">${formatNumber(taxEngine.getValue(`D${item.row}`))}</td>
                <td class="calculated-col" id="E${item.row}">${formatNumber(taxEngine.getValue(`E${item.row}`))}</td>
            `;
            break;
            
        case 'ratio':
            row.innerHTML = `
                <td><strong>${item.description}</strong></td>
                <td></td>
                <td class="input-col calculated-cell" id="C${item.row}">${formatNumber(taxEngine.getValue(`C${item.row}`))}</td>
                <td class="calculated-col" id="D${item.row}">${taxEngine.ratio.toFixed(4)}</td>
                <td class="calculated-col" id="E${item.row}">${(1 - taxEngine.ratio).toFixed(4)}</td>
            `;
            break;
            
        case 'info':
            row.innerHTML = `
                <td><strong>${item.description}</strong></td>
                <td></td>
                <td class="input-col"></td>
                <td class="calculated-col"><strong>${item.value}</strong></td>
                <td class="calculated-col"></td>
            `;
            break;
            
        case 'tax':
            row.innerHTML = `
                <td><strong>${item.description}</strong></td>
                <td><strong>${item.reference}</strong></td>
                <td class="input-col"></td>
                <td class="calculated-col"></td>
                <td class="calculated-col" id="E${item.row}">${formatNumber(taxEngine.getValue(`E${item.row}`))}</td>
            `;
            break;
     case 'tax-header':
            row.innerHTML = `
                <td><strong>${item.description}</strong><br><small>${item.note || ''}</small></td>
                <td><strong>${item.reference}</strong></td>
                <td class="input-col"></td>
                <td class="calculated-col"></td>
                <td class="calculated-col tax-cell" id="E${item.row}">${formatNumber(taxEngine.getValue(`E${item.row}`))}</td>
            `;
            break;
            
        case 'tax-calc':
            row.innerHTML = `
                <td>${item.description}<br><small>${item.note || ''}</small></td>
                <td>${item.reference}</td>
                <td class="input-col"></td>
                <td class="calculated-col"></td>
                <td class="calculated-col tax-cell" id="E${item.row}">${formatNumber(taxEngine.getValue(`E${item.row}`))}</td>
            `;
            break;
            
        case 'tax-input':
            row.innerHTML = `
                <td>${item.description}</td>
                <td>${item.reference}</td>
                <td class="input-col">
                    <input type="text" 
                           id="C${item.row}" 
                           data-row="${item.row}"
                           value="${formatNumber(taxEngine.getValue(`C${item.row}`))}"
                           placeholder="Enter amount">
                </td>
                <td class="calculated-col"></td>
                <td class="calculated-col tax-cell" id="E${item.row}">${formatNumber(taxEngine.getValue(`E${item.row}`))}</td>
            `;
            break;
            
        case 'd-input':
            row.innerHTML = `
                <td><strong>${item.description}</strong></td>
                <td>${item.reference}</td>
                <td class="input-col"></td>
                <td class="calculated-col">
                    <input type="text" 
                           id="D${item.row}" 
                           data-row="${item.row}"
                           value="${formatNumber(taxEngine.getValue(`D${item.row}`))}"
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
                <td class="calculated-col tax-result" id="E${item.row}"><strong>${formatNumber(taxEngine.getValue(`E${item.row}`))}</strong></td>
            `;
            break;
    }
    
    return row;
}

// Render the complete table
function renderTable() {
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    tableStructure.forEach((item, index) => {
        const row = createTableRow(item, index);
        tableBody.appendChild(row);
    });
    
    // Add event listeners to input fields
    document.querySelectorAll('#tableBody input').forEach(input => {
        input.addEventListener('input', handleInputChange);
    });
}

// Handle input changes
function handleInputChange(event) {
    const input = event.target;
    const cellId = input.id;
    const value = input.value.replace(/,/g, '');
    
    // Update tax engine
    taxEngine.setValue(cellId, value);
    
    // Update display
    updateDisplay();
}

// Update all calculated cells
function updateDisplay() {
    // Update all calculated cells
    for (let i = 1; i <= 160; i++) {
        const dCell = document.getElementById(`D${i}`);
        const eCell = document.getElementById(`E${i}`);
        
        if (dCell && !dCell.querySelector('input')) {
            dCell.textContent = formatNumber(taxEngine.getValue(`D${i}`));
        }
        
        if (eCell && !eCell.querySelector('input')) {
            eCell.textContent = formatNumber(taxEngine.getValue(`E${i}`));
        }
    }
    
    // Update ratio display
    const d7Cell = document.getElementById('D7');
    const e7Cell = document.getElementById('E7');
    if (d7Cell) d7Cell.textContent = taxEngine.ratio.toFixed(4);
    if (e7Cell) e7Cell.textContent = (1 - taxEngine.ratio).toFixed(4);
    
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
        
        // Show results panel
        document.getElementById('resultsPanel').style.display = 'block';
    });
    
    // Initialize with test data
    taxEngine.loadTestData();
    renderTable();
    updateResultsPanel();
}

// Start the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);