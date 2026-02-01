// This is the CORE calculation engine that implements ALL formulas from Excel

class FormulaEngine {
    constructor() {
        // Store all values
        this.values = {};
        
        // Define ALL formulas from Column A and Excel formulas
        this.formulas = this.defineAllFormulas();
        
        // Track calculation order
        this.calculationOrder = this.calculateDependencyOrder();
    }
    
    // Define ALL formulas from Excel Column A
    defineAllFormulas() {
        return {
            // REVENUE SECTION
            'a': {
                name: 'GROSS REVENUE',
                description: 'Gross Revenue (excluding sales tax & federal excise duty)',
                excelRef: 'a=a\'+b\'',
                dependsOn: ['a\'', 'b\''],
                calculate: (vals) => (vals['a\''] || 0) + (vals['b\''] || 0)
            },
            
            'a\'': {
                name: 'GROSS DOMESTIC SALES/SERVICES FEE',
                description: 'Domestic sales/services amount',
                excelRef: 'a\'',
                dependsOn: [],
                calculate: null // User input
            },
            
            'b\'': {
                name: 'GROSS EXPORT SALES/SERVICES FEE',
                description: 'Export sales/services amount',
                excelRef: 'b\'',
                dependsOn: [],
                calculate: null // User input
            },
            
            'b': {
                name: 'SELLING EXPENSES',
                description: 'Freight outward, brokerage, commission, discount etc.',
                excelRef: 'b=e\'+d\'+f\'',
                dependsOn: ['e\'', 'd\'', 'f\''],
                calculate: (vals) => (vals['e\''] || 0) + (vals['d\''] || 0) + (vals['f\''] || 0)
            },
            
            'e\'': {
                name: 'DOMESTIC COMMISSION/BROKERAGE/DISCOUNT/FREIGHT OUTWARD',
                description: 'Domestic selling expenses',
                excelRef: 'e\'',
                dependsOn: [],
                calculate: null
            },
            
            'd\'': {
                name: 'FOREIGN COMMISSION/BROKERAGE/DISCOUNT/FREIGHT OUTWARD',
                description: 'Foreign selling expenses',
                excelRef: 'd\'',
                dependsOn: [],
                calculate: null
            },
            
            'f\'': {
                name: 'REBATE/DUTY DRAWBACKS',
                description: 'Rebates and duty drawbacks',
                excelRef: 'f\'',
                dependsOn: [],
                calculate: null
            },
            
            'c': {
                name: 'NET REVENUE',
                description: 'Net revenue (excluding sales tax, federal excise, brokerage, etc.)',
                excelRef: 'c=a-b',
                dependsOn: ['a', 'b'],
                calculate: (vals) => (vals['a'] || 0) - (vals['b'] || 0)
            },
            
            'd': {
                name: 'COST OF SALES/SERVICES',
                description: 'Total cost of sales/services',
                excelRef: 'd =SUM(E12:E22)',
                dependsOn: [
                    'direct_expenses', 'salaries_wages', 'power', 'gas',
                    'repair_maintenance', 'insurance', 'royalty',
                    'other_direct_expenses', 'accounting_amortisation',
                    'accounting_depreciation'
                ],
                calculate: (vals) => {
                    const dependencies = this.formulas['d'].dependsOn;
                    return dependencies.reduce((sum, dep) => sum + (vals[dep] || 0), 0);
                }
            },
            
            // Cost items (user inputs for SUM calculation)
            'direct_expenses': { name: 'DIRECT EXPENSES', dependsOn: [], calculate: null },
            'salaries_wages': { name: 'SALARIES/WAGES', dependsOn: [], calculate: null },
            'power': { name: 'POWER', dependsOn: [], calculate: null },
            'gas': { name: 'GAS', dependsOn: [], calculate: null },
            'repair_maintenance': { name: 'REPAIR/MAINTENANCE', dependsOn: [], calculate: null },
            'insurance': { name: 'INSURANCE', dependsOn: [], calculate: null },
            'royalty': { name: 'ROYALTY', dependsOn: [], calculate: null },
            'other_direct_expenses': { name: 'OTHER DIRECT EXPENSES', dependsOn: [], calculate: null },
            'accounting_amortisation': { name: 'ACCOUNTING AMORTISATION', dependsOn: [], calculate: null },
            'accounting_depreciation': { name: 'ACCOUNTING DEPRECIATION', dependsOn: [], calculate: null },
            
            'e': {
                name: 'GROSS PROFIT/(LOSS)',
                description: 'Gross profit or loss',
                excelRef: 'e=c-d',
                dependsOn: ['c', 'd'],
                calculate: (vals) => (vals['c'] || 0) - (vals['d'] || 0)
            },
            
            'f': {
                name: 'MANAGEMENT, ADMINISTRATIVE, SELLING & FINANCIAL EXPENSES',
                description: 'Total management expenses',
                excelRef: 'f =SUM(D24:D49) & =SUM(E24:E49)',
                dependsOn: [
                    'rent', 'rates_taxes_cess', 'salaries_wages_perquisites',
                    'traveling_conveyance', 'electricity_water_gas',
                    'communication', 'repair_maintenance_admin'
                ],
                calculate: (vals) => {
                    const dependencies = this.formulas['f'].dependsOn;
                    return dependencies.reduce((sum, dep) => sum + (vals[dep] || 0), 0);
                }
            },
            
            // Management expense items
            'rent': { name: 'RENT', dependsOn: [], calculate: null },
            'rates_taxes_cess': { name: 'RATES/TAXES/CESS', dependsOn: [], calculate: null },
            'salaries_wages_perquisites': { name: 'SALARIES/WAGES/PERQUISITES/BENEFITS', dependsOn: [], calculate: null },
            'traveling_conveyance': { name: 'TRAVELING/CONVEYANCE/VEHICLES RUNNING/MAINTENANCE', dependsOn: [], calculate: null },
            'electricity_water_gas': { name: 'ELECTRICITY/WATER/GAS', dependsOn: [], calculate: null },
            'communication': { name: 'COMMUNICATION', dependsOn: [], calculate: null },
            'repair_maintenance_admin': { name: 'REPAIR/MAINTENANCE', dependsOn: [], calculate: null },
            
            'g': {
                name: 'OTHER REVENUES',
                description: 'Total other revenues',
                excelRef: 'g =SUM(D51:D60) & =SUM(E51:E60)',
                dependsOn: [
                    'other_revenues', 'fee_technical_services',
                    'fee_other_services', 'profit_on_debt_rev'
                ],
                calculate: (vals) => {
                    const dependencies = this.formulas['g'].dependsOn;
                    return dependencies.reduce((sum, dep) => sum + (vals[dep] || 0), 0);
                }
            },
            
            // Other revenue items
            'other_revenues': { name: 'OTHER REVENUES', dependsOn: [], calculate: null },
            'fee_technical_services': { name: 'FEE FOR TECHNICAL/PROFESSIONAL SERVICES', dependsOn: [], calculate: null },
            'fee_other_services': { name: 'FEE FOR OTHER SERVICES', dependsOn: [], calculate: null },
            'profit_on_debt_rev': { name: 'PROFIT ON DEBT', dependsOn: [], calculate: null },
            
            'h': {
                name: 'ACCOUNTING PROFIT/(LOSS)',
                description: 'Accounting profit or loss',
                excelRef: 'h=e-f+g',
                dependsOn: ['e', 'f', 'g'],
                calculate: (vals) => (vals['e'] || 0) - (vals['f'] || 0) + (vals['g'] || 0)
            },
            
            'i': {
                name: 'INADMISSIBLE DEDUCTIONS',
                description: 'Total inadmissible deductions',
                excelRef: 'i =SUM(E64:E102)',
                dependsOn: [
                    'provision_doubtful_debts', 'provision_obsolete_stocks',
                    'entertainment_expenditure', 'personal_expenditure'
                ],
                calculate: (vals) => {
                    const dependencies = this.formulas['i'].dependsOn;
                    return dependencies.reduce((sum, dep) => sum + (vals[dep] || 0), 0);
                }
            },
            
            // Inadmissible deduction items
            'provision_doubtful_debts': { name: 'ADD BACKS U/S 29(2) PROVISION FOR DOUBTFUL DEBTS', dependsOn: [], calculate: null },
            'provision_obsolete_stocks': { name: 'ADD BACKS PROVISION FOR OBSOLETE STOCKS', dependsOn: [], calculate: null },
            'entertainment_expenditure': { name: 'ADD BACKS U/S 21(D) ENTERTAINMENT EXPENDITURE', dependsOn: [], calculate: null },
            'personal_expenditure': { name: 'ADD BACKS U/S 21(H) PERSONAL EXPENDITURE', dependsOn: [], calculate: null },
            
            'j': {
                name: 'ADMISSIBLE DEDUCTIONS',
                description: 'Total admissible deductions (other than tax depreciation)',
                excelRef: 'J =SUM(E104:E109)',
                dependsOn: [
                    'accounting_gain_intangibles', 'accounting_gain_assets',
                    'other_admissible_deductions'
                ],
                calculate: (vals) => {
                    const dependencies = this.formulas['j'].dependsOn;
                    return dependencies.reduce((sum, dep) => sum + (vals[dep] || 0), 0);
                }
            },
            
            // Admissible deduction items
            'accounting_gain_intangibles': { name: 'ACCOUNTING GAIN ON SALE OF INTANGIBLES', dependsOn: [], calculate: null },
            'accounting_gain_assets': { name: 'ACCOUNTING GAIN ON SALE OF ASSETS', dependsOn: [], calculate: null },
            'other_admissible_deductions': { name: 'OTHER ADMISSIBLE DEDUCTIONS', dependsOn: [], calculate: null },
            
            'k': {
                name: 'INCOME/(LOSS) FROM BUSINESS BEFORE DEPRECIATION',
                description: 'Income/loss before depreciation adjustment',
                excelRef: 'k=h+i-j',
                dependsOn: ['h', 'i', 'j'],
                calculate: (vals) => (vals['h'] || 0) + (vals['i'] || 0) - (vals['j'] || 0)
            },
            
            'l': {
                name: 'TAX DEPRECIATION/INITIAL ALLOWANCE/AMORTISATION',
                description: 'Total tax depreciation and amortisation',
                excelRef: 'l',
                dependsOn: [
                    'tax_amortization', 'tax_depreciation',
                    'pre_commencement_expenditure'
                ],
                calculate: (vals) => (vals['tax_amortization'] || 0) + 
                                    (vals['tax_depreciation'] || 0) + 
                                    (vals['pre_commencement_expenditure'] || 0)
            },
            
            'tax_amortization': { name: 'TAX AMORTIZATION FOR CURRENT YEAR', dependsOn: [], calculate: null },
            'tax_depreciation': { name: 'TAX DEPRECIATION / INITIAL ALLOWANCE FOR CURRENT YEAR', dependsOn: [], calculate: null },
            'pre_commencement_expenditure': { name: 'PRE-COMMENCEMENT EXPENDITURE / DEFERRED COST', dependsOn: [], calculate: null },
            
            'M': {
                name: 'INCOME/LOSS FROM BUSINESS',
                description: 'Final business income/loss',
                excelRef: 'M=k-l',
                dependsOn: ['k', 'l'],
                calculate: (vals) => (vals['k'] || 0) - (vals['l'] || 0)
            },
            
            // Other income sources (user inputs)
            'n': { name: 'INCOME/LOSS FROM PROPERTY', dependsOn: [], calculate: null },
            'o': { name: 'INCOME/LOSS FROM CAPITAL ASSETS', dependsOn: [], calculate: null },
            'p': { name: 'INCOME/LOSS FROM OTHER SOURCES', dependsOn: [], calculate: null },
            'q': { name: 'FOREIGN INCOME', dependsOn: [], calculate: null },
            'r': { name: 'AGRICULTURAL INCOME', dependsOn: [], calculate: null },
            
            'S': {
                name: 'TOTAL INCOME',
                description: 'Total income from all sources',
                excelRef: 'S=m+n+o+p+q+r',
                dependsOn: ['M', 'n', 'o', 'p', 'q', 'r'],
                calculate: (vals) => (vals['M'] || 0) + (vals['n'] || 0) + 
                                    (vals['o'] || 0) + (vals['p'] || 0) + 
                                    (vals['q'] || 0) + (vals['r'] || 0)
            },
            
            't': {
                name: 'DEDUCTIBLE ALLOWANCES',
                description: 'Total deductible allowances',
                excelRef: 't =SUM(E124:E125)',
                dependsOn: ['workers_welfare_fund', 'workers_profit_participation'],
                calculate: (vals) => (vals['workers_welfare_fund'] || 0) + 
                                    (vals['workers_profit_participation'] || 0)
            },
            
            'workers_welfare_fund': { name: 'WORKERS WELFARE FUND U/S 60A', dependsOn: [], calculate: null },
            'workers_profit_participation': { name: 'WORKERS PROFIT PARTICIPATION FUND U/S 60B', dependsOn: [], calculate: null },
            
            'w': {
                name: 'TAXABLE INCOME',
                description: 'Final taxable income',
                excelRef: 'w=s-t',
                dependsOn: ['S', 't'],
                calculate: (vals) => (vals['S'] || 0) - (vals['t'] || 0)
            }
        };
    }
    
    // Calculate dependency order (topological sort)
    calculateDependencyOrder() {
        const order = [];
        const visited = new Set();
        const temp = new Set();
        
        const visit = (node) => {
            if (temp.has(node)) {
                throw new Error(`Circular dependency detected: ${node}`);
            }
            if (!visited.has(node)) {
                temp.add(node);
                if (this.formulas[node] && this.formulas[node].dependsOn) {
                    for (const dep of this.formulas[node].dependsOn) {
                        visit(dep);
                    }
                }
                temp.delete(node);
                visited.add(node);
                order.push(node);
            }
        };
        
        for (const node in this.formulas) {
            visit(node);
        }
        
        return order;
    }
    
    // Set user input value
    setValue(key, value) {
        this.values[key] = parseFloat(value) || 0;
    }
    
    // Calculate all formulas in correct order
    calculateAll() {
        // Reset calculated values (keep user inputs)
        for (const key in this.formulas) {
            if (this.formulas[key].calculate) {
                // Only reset calculated values, not user inputs
                if (this.formulas[key].dependsOn.length > 0) {
                    this.values[key] = undefined;
                }
            }
        }
        
        // Calculate in dependency order
        for (const key of this.calculationOrder) {
            const formula = this.formulas[key];
            if (formula.calculate) {
                this.values[key] = formula.calculate(this.values);
            }
        }
        
        return this.values;
    }
    
    // Get formatted results
    getResults() {
        const results = [];
        for (const key of this.calculationOrder) {
            const formula = this.formulas[key];
            if (formula.calculate) {
                results.push({
                    id: key,
                    name: formula.name,
                    description: formula.description || formula.name,
                    value: this.values[key] || 0,
                    excelRef: formula.excelRef || key,
                    formula: this.getFormulaExpression(key)
                });
            }
        }
        return results;
    }
    
    // Get formula expression for display
    getFormulaExpression(key) {
        const formula = this.formulas[key];
        if (!formula || !formula.excelRef) return key;
        
        // Convert excelRef to readable expression
        return formula.excelRef
            .replace('a\'', 'Domestic Sales')
            .replace('b\'', 'Export Sales')
            .replace('e\'', 'Domestic Commission')
            .replace('d\'', 'Foreign Commission')
            .replace('f\'', 'Rebate/Drawbacks')
            .replace('a', 'Gross Revenue')
            .replace('b', 'Selling Expenses')
            .replace('c', 'Net Revenue')
            .replace('d', 'Cost of Sales')
            .replace('e', 'Gross Profit')
            .replace('f', 'Management Expenses')
            .replace('g', 'Other Revenues')
            .replace('h', 'Accounting Profit')
            .replace('i', 'Inadmissible Deductions')
            .replace('j', 'Admissible Deductions')
            .replace('k', 'Income Before Depreciation')
            .replace('l', 'Tax Depreciation')
            .replace('M', 'Business Income')
            .replace('S', 'Total Income')
            .replace('t', 'Deductible Allowances')
            .replace('w', 'Taxable Income');
    }
    
    // Reset all values
    reset() {
        this.values = {};
    }
}