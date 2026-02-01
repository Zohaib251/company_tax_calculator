class TaxEngine {
    constructor() {
        this.data = {};
        this.ratio = 0; // Export ratio from row 7
        this.psebRegistered = true; // Default to "Yes" for PSEB registration
        this.initializeData();
    }

    initializeData() {
        // Initialize all data points with default values
        for (let i = 1; i <= 160; i++) {
            this.data[`C${i}`] = 0;
            this.data[`D${i}`] = 0;
            this.data[`E${i}`] = 0;
        }
        
        // Set default values
        this.data['C7'] = 1; // Always 1 as per Excel
    }

    getValue(cell) {
        return this.data[cell] || 0;
    }

    setValue(cell, value) {
        const numericValue = parseFloat(value) || 0;
        this.data[cell] = numericValue;
        this.calculateAll();
    }

    calculateRatio() {
        const c3 = this.getValue('C3');
        const c5 = this.getValue('C5');
        
        if (c3 > 0) {
            this.ratio = c5 / c3;
            this.data['D7'] = this.ratio;
            this.data['E7'] = 1 - this.ratio;
        } else {
            this.ratio = 0;
            this.data['D7'] = 0;
            this.data['E7'] = 1;
        }
    }

    calculateAll() {
        // Calculate ratio first
        this.calculateRatio();
        
        // ROW 3: GROSS REVENUE
        this.data['C3'] = this.getValue('C4') + this.getValue('C5');
        this.data['D3'] = this.getValue('D4') + this.getValue('D5');
        this.data['E3'] = this.getValue('E4') + this.getValue('E5');
        
        // ROW 4: DOMESTIC SALES
        this.data['D4'] = 0;
        this.data['E4'] = this.getValue('C4') - this.getValue('D4');
        
        // ROW 5: EXPORT SALES (PSEB logic)
        this.data['D5'] = this.psebRegistered ? this.getValue('C5') : 0;
        this.data['E5'] = this.getValue('C5') - this.getValue('D5');
        
        // ROW 7: RATIO
        // Already calculated in calculateRatio()
        
        // ROW 8: SELLING EXPENSES TOTAL
        this.data['C8'] = this.getValue('C9') + this.getValue('C10') + this.getValue('C11');
        this.data['D8'] = this.getValue('D9') + this.getValue('D10') + this.getValue('D11');
        this.data['E8'] = this.getValue('E9') + this.getValue('E10') + this.getValue('E11');
        
        // ROW 9: DOMESTIC COMMISSION
        this.data['D9'] = 0;
        this.data['E9'] = this.getValue('C9') - this.getValue('D9');
        
        // ROW 10: FOREIGN COMMISSION
        this.data['D10'] = this.getValue('C10');
        this.data['E10'] = this.getValue('C10') - this.getValue('D10');
        
        // ROW 11: REBATE/DUTY DRAWBACKS
        this.data['D11'] = this.getValue('C11') * this.ratio;
        this.data['E11'] = this.getValue('C11') - this.getValue('D11');
        
        // ROW 13: NET REVENUE
        this.data['C13'] = this.getValue('C3') - this.getValue('C8');
        this.data['E13'] = this.getValue('E3') - this.getValue('E8');
        
        // ROW 15: COST OF SALES TOTAL
        this.calculateSumRows(15, [17, 18, 19, 20, 21, 22, 23, 24, 25]);
        
        // ROWS 17-25: DIRECT EXPENSES
        for (let i = 17; i <= 25; i++) {
            this.data[`D${i}`] = this.getValue(`C${i}`) * this.ratio;
            this.data[`E${i}`] = this.getValue(`C${i}`) - this.getValue(`D${i}`);
        }
        
        // ROW 26: GROSS PROFIT
        this.data['C26'] = this.getValue('C13') - this.getValue('C15');
        this.data['E26'] = this.getValue('E13') - this.getValue('E15');
        
        // ROW 28: INDIRECT EXPENSES TOTAL
        this.calculateSumRows(28, Array.from({length: 26}, (_, i) => 29 + i));
        
        // ROWS 29-54: INDIRECT EXPENSES
        for (let i = 29; i <= 54; i++) {
            this.data[`D${i}`] = this.getValue(`C${i}`) * this.ratio;
            this.data[`E${i}`] = this.getValue(`C${i}`) - this.getValue(`D${i}`);
        }
        
        // ROW 56: OTHER REVENUES TOTAL
        this.calculateSumRows(56, Array.from({length: 9}, (_, i) => 57 + i));
        
        // ROWS 57-65: OTHER REVENUES
        for (let i = 57; i <= 65; i++) {
            this.data[`D${i}`] = this.getValue(`C${i}`) * this.ratio;
            this.data[`E${i}`] = this.getValue(`C${i}`) - this.getValue(`D${i}`);
        }
        
        // ROW 66: ACCOUNTING PROFIT
        this.data['C66'] = this.getValue('C26') - this.getValue('C28') + this.getValue('C56');
        this.data['E66'] = this.getValue('E26') - this.getValue('E28') + this.getValue('E56');
        
        // ROW 68: INADMISSIBLE DEDUCTIONS TOTAL
        this.calculateSumRows(68, Array.from({length: 39}, (_, i) => 69 + i));
        
        // ROWS 69-107: INADMISSIBLE DEDUCTIONS
        for (let i = 69; i <= 107; i++) {
            this.data[`D${i}`] = this.getValue(`C${i}`) * this.ratio;
            this.data[`E${i}`] = this.getValue(`C${i}`) - this.getValue(`D${i}`);
        }
        
        // ROW 109: ADMISSIBLE DEDUCTIONS TOTAL
        this.calculateSumRows(109, [110, 111, 112, 113, 114]);
        
        // ROWS 110-114: ADMISSIBLE DEDUCTIONS
        for (let i = 110; i <= 114; i++) {
            this.data[`D${i}`] = this.getValue(`C${i}`) * this.ratio;
            this.data[`E${i}`] = this.getValue(`C${i}`) - this.getValue(`D${i}`);
        }
        
        // ROW 116: INCOME BEFORE DEPRECIATION
        this.data['C116'] = this.getValue('C66') + this.getValue('C68') - this.getValue('C109');
        this.data['E116'] = this.getValue('E66') + this.getValue('E68') - this.getValue('E109');
        
        // ROW 118: TAX DEPRECIATION TOTAL
        this.calculateSumRows(118, [119, 120, 121]);
        
        // ROWS 119-121: TAX DEPRECIATION ITEMS
        for (let i = 119; i <= 121; i++) {
            this.data[`D${i}`] = this.getValue(`C${i}`) * this.ratio;
            this.data[`E${i}`] = this.getValue(`C${i}`) - this.getValue(`D${i}`);
        }
        
        // ROW 123: BUSINESS INCOME
        this.data['C123'] = this.getValue('C116') - this.getValue('C118');
        this.data['E123'] = this.getValue('E116') - this.getValue('E118');
        
        // ROW 129: TOTAL INCOME
        this.data['C129'] = this.getValue('C123');
        this.data['E129'] = this.getValue('E123');
        
        // ROW 131: DEDUCTIBLE ALLOWANCES TOTAL
        this.calculateSumRows(131, [132, 133]);
        
        // ROWS 132-133: ALLOWANCES
        this.data['E132'] = this.getValue('C132') - this.getValue('D132');
        this.data['E133'] = this.getValue('C133') - this.getValue('D133');
        
      ;
        
          // ROW 135: TAXABLE INCOME
        this.data['C135'] = this.getValue('C129') - this.getValue('C131');
        this.data['E135'] = this.getValue('E129') - this.getValue('E131');
        
        // ========== TAX CALCULATIONS SECTION ==========
        
         // ROW 136: NORMAL INCOME TAX @ 29%
        this.data['E136'] = this.getValue('E135') * 0.29;
        
        // ROW 137: FINAL/FIXED TAX @ 2.5%
        this.data['E137'] = this.getValue('D5') * 0.025;
        
        // ROW 138: WWF (Worker's Welfare Fund) - 0 for now
        this.data['E138'] = 0;
        
        // ROW 139: TAX ON HIGH EARNERS - 0 for now
        this.data['E139'] = 0;
        
        // ROW 140: ALTERNATE CORPORATE TAX @ 17%
        this.data['E140'] = this.getValue('C66') * 0.17;
        
        // ROW 141: MINIMUM TAX @ 1.25%
        this.data['E141'] = this.getValue('E3') * 0.0125;
        
        // ROW 142: DIFFERENCE OF MINIMUM TAX
        this.data['E142'] = this.getValue('E141') > this.getValue('E137') 
            ? this.getValue('E141') - this.getValue('E137') 
            : 0;
        
        // ROW 143: TAX ON DEEMED INCOME - 0 for now
        this.data['E143'] = 0;
        
        // ROW 144: DIFFERENCE OF ALTERNATE CORPORATE TAX
        this.data['E144'] = this.getValue('E140') > this.getValue('E137')
            ? this.getValue('E140') - this.getValue('E137')
            : 0;
        
        // ROW 145: DIFFERENCE OF MINIMUM TAX CHARGEABLE - 0
        this.data['E145'] = 0;
        
        // ROW 146: TAX REDUCTION - 0
        this.data['E146'] = 0;
        
        // ROW 148: TAX CREDIT TOTAL
        this.data['E148'] = this.getValue('E149') + this.getValue('E150') + this.getValue('E151');
        
        // ROW 149: CHARITABLE DONATIONS CREDIT
        const e136 = this.getValue('E136');
        const e135 = this.getValue('E135');
        const c149 = this.getValue('C149');
        if (e135 > 0) {
            const credit149 = Math.min((e136 / e135 * c149), (0.2 * e135));
            this.data['E149'] = isNaN(credit149) ? 0 : credit149;
        } else {
            this.data['E149'] = 0;
        }
        
        // ROW 150: OTHER CREDITS
        this.data['E150'] = this.getValue('C150');
        
        // ROW 151: TAX CREDIT U/S 103 - 0
        this.data['E151'] = 0;
        
        // ========== TAX CHARGEABLE CALCULATION (ROW 134) ==========
        const maxTax = Math.max(
            this.getValue('E137'),  // Final tax
            this.getValue('E140'),  // Alternate tax
            this.getValue('E141')   // Minimum tax
        );
        
        const baseTax = maxTax + this.getValue('E138') + this.getValue('E139');
        const withDifferences = baseTax + 
                              this.getValue('E142') + 
                              this.getValue('E143') + 
                              this.getValue('E144') + 
                              this.getValue('E145') + 
                              this.getValue('E146');
        
        this.data['E134'] = Math.max(0, withDifferences - this.getValue('E148'));
        
        // ========== TAX PAYMENTS AND BALANCES ==========
        
        // Total tax paid
        const totalTaxPaid = this.getValue('D152') + 
                            this.getValue('D153') + 
                            this.getValue('D154') + 
                            this.getValue('D155');
        
        // ROW 156: ADMITTED INCOME TAX
        this.data['E156'] = totalTaxPaid > this.getValue('E136') 
            ? 0 
            : (this.getValue('E136') - totalTaxPaid);
        
        // ROW 157: REFUNDABLE INCOME TAX
        this.data['E157'] = this.getValue('E156') > 0 
            ? 0 
            : (totalTaxPaid - this.getValue('E136'));
    }

    calculateSumRows(totalRow, componentRows) {
        let sumC = 0;
        let sumD = 0;
        let sumE = 0;
        
        for (const row of componentRows) {
            sumC += this.getValue(`C${row}`);
            sumD += this.getValue(`D${row}`);
            sumE += this.getValue(`E${row}`);
        }
        
        this.data[`C${totalRow}`] = sumC;
        this.data[`D${totalRow}`] = sumD;
        this.data[`E${totalRow}`] = sumE;
    }

    loadTestData() {
        const testData = {
            'C4': 100000000,
            'C5': 15000000,
            'C9': 1000000,
            'C10': 1000000,
            'C11': 1000000,
            
            // Direct Expenses (17-25)
            'C17': 1500000, 'C18': 1500000, 'C19': 1500000,
            'C20': 1500000, 'C21': 1500000, 'C22': 1500000,
            'C23': 1500000, 'C24': 1500000, 'C25': 1500000,
            
            // Indirect Expenses (29-54)
            'C29': 1500000, 'C30': 1500000, 'C31': 1500000,
            'C32': 1500000, 'C33': 1500000, 'C34': 1500000,
            'C35': 1500000, 'C36': 1500000, 'C37': 1500000,
            'C38': 1500000, 'C39': 1500000, 'C40': 1500000,
            'C41': 1500000, 'C42': 1500000, 'C43': 1500000,
            'C44': 1500000, 'C45': 1500000, 'C46': 1500000,
            'C47': 1500000, 'C48': 1500000, 'C49': 1500000,
            'C50': 1500000, 'C51': 1500000, 'C52': 1500000,
            'C53': 1500000, 'C54': 1500000,
            
            // Other Revenues (57-65)
            'C57': 1500000, 'C58': 1500000, 'C59': 1500000,
            'C60': 1500000, 'C61': 1500000, 'C62': 1500000,
            'C63': 1500000, 'C64': 1500000, 'C65': 1500000,
            
            // Inadmissible Deductions (69-107)
            'C69': 1000000, 'C70': 1000000, 'C71': 1000000,
            'C72': 1000000, 'C73': 1000000, 'C74': 1000000,
            'C75': 1000000, 'C76': 1000000, 'C77': 1000000,
            'C78': 1000000, 'C79': 1000000, 'C80': 1000000,
            'C81': 1000000, 'C82': 1000000, 'C83': 1000000,
            'C84': 1000000, 'C85': 1000000, 'C86': 1000000,
            'C87': 1000000, 'C88': 1000000, 'C89': 1000000,
            'C90': 1000000, 'C91': 1000000, 'C92': 1000000,
            'C93': 1000000, 'C94': 1000000, 'C95': 1000000,
            'C96': 1000000, 'C97': 1000000, 'C98': 1000000,
            'C99': 1000000, 'C100': 1000000, 'C101': 1000000,
            'C102': 1000000, 'C103': 1000000, 'C104': 1000000,
            'C105': 1000000, 'C106': 1000000, 'C107': 1000000,
            
            // Admissible Deductions (110-114)
            'C110': 1500000, 'C111': 1500000, 'C112': 1500000,
            'C113': 1500000, 'C114': 1500000,
            
            // Tax Depreciation (119-121)
            'C119': 1500000, 'C120': 1500000, 'C121': 1500000,
            
            // Allowances (132-133)
            'C132': 1500000, 'C133': 1500000,
            
            // Tax Credits
            'C149': 1500000,
            'C150': 0, // Empty in test data
            
            // Withholding and Advance Tax (D column inputs)
            'D152': 1000000,
            'D153': 10000000,
            'D154': 0,
            'D155': 0
        };
        
        for (const [cell, value] of Object.entries(testData)) {
            this.setValue(cell, value);
        }
        
        this.psebRegistered = true;
        this.calculateAll();
    }

    resetAll() {
        this.initializeData();
        this.psebRegistered = true;
        this.calculateAll();
    }

    formatNumber(num) {
        return num.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
    }

    getTaxResults() {
        return {
             taxChargeable: this.getValue('E134'),
            normalTax: this.getValue('E136'),
            finalTax: this.getValue('E137'),
            wwf: this.getValue('E138'),
            highEarnersTax: this.getValue('E139'),
            alternateTax: this.getValue('E140'),
            minimumTax: this.getValue('E141'),
            minTaxDifference: this.getValue('E142'),
            deemedIncomeTax: this.getValue('E143'),
            altTaxDifference: this.getValue('E144'),
            minTaxChargeableDiff: this.getValue('E145'),
            taxReduction: this.getValue('E146'),
            totalTaxCredits: this.getValue('E148'),
            charitableCredit: this.getValue('E149'),
            otherCredits: this.getValue('E150'),
            admittedTax: this.getValue('E156'),
            refundableTax: this.getValue('E157'),
            totalTaxPaid: this.getValue('D152') + this.getValue('D153') + 
                         this.getValue('D154') + this.getValue('D155')
        };
    }
}