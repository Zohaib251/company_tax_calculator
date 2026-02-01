// Initialize formula engine
const formulaEngine = new FormulaEngine();

// DOM Elements
const inputContainer = document.getElementById('inputContainer');
const resultsContainer = document.getElementById('resultsContainer');
const formulasContainer = document.getElementById('formulasContainer');
const calculateBtn = document.getElementById('calculateBtn');
const resetBtn = document.getElementById('resetBtn');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderInputs();
    renderFormulasList();
    calculateAll();
    
    // Event Listeners
    calculateBtn.addEventListener('click', calculateAll);
    resetBtn.addEventListener('click', resetAll);
    
    // Auto-calculate on input
    document.addEventListener('input', function(e) {
        if (e.target.type === 'number') {
            setTimeout(calculateAll, 100);
        }
    });
});

// Render input fields for user inputs
function renderInputs() {
    let html = '';
    const userInputs = [];
    
    // Find all formulas that are user inputs (no calculation function)
    for (const [key, formula] of Object.entries(formulaEngine.formulas)) {
        if (!formula.calculate && formula.dependsOn.length === 0) {
            userInputs.push({ key, formula });
        }
    }
    
    // Group by category
    const categories = {
        'Revenue': ['a\'', 'b\'', 'e\'', 'd\'', 'f\''],
        'Cost of Sales': ['direct_expenses', 'salaries_wages', 'power', 'gas', 'repair_maintenance', 
                         'insurance', 'royalty', 'other_direct_expenses', 'accounting_amortisation', 
                         'accounting_depreciation'],
        'Management Expenses': ['rent', 'rates_taxes_cess', 'salaries_wages_perquisites', 
                               'traveling_conveyance', 'electricity_water_gas', 'communication', 
                               'repair_maintenance_admin'],
        'Other Revenues': ['other_revenues', 'fee_technical_services', 'fee_other_services', 
                          'profit_on_debt_rev'],
        'Inadmissible Deductions': ['provision_doubtful_debts', 'provision_obsolete_stocks', 
                                   'entertainment_expenditure', 'personal_expenditure'],
        'Admissible Deductions': ['accounting_gain_intangibles', 'accounting_gain_assets', 
                                 'other_admissible_deductions'],
        'Tax Depreciation': ['tax_amortization', 'tax_depreciation', 'pre_commencement_expenditure'],
        'Other Income': ['n', 'o', 'p', 'q', 'r'],
        'Deductible Allowances': ['workers_welfare_fund', 'workers_profit_participation']
    };
    
    // Render each category
    for (const [category, keys] of Object.entries(categories)) {
        html += `<div class="input-group" style="grid-column: 1 / -1; background: #f8f9fa; padding: 20px; margin-bottom: 20px; border-radius: 10px;">`;
        html += `<h3 style="margin-bottom: 15px; color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 8px;">${category}</h3>`;
        html += `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px;">`;
        
        for (const key of keys) {
            const formula = formulaEngine.formulas[key];
            if (formula) {
                const currentValue = formulaEngine.values[key] || '';
                html += `
                    <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #ddd;">
                        <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #2c3e50;">
                            ${formula.name}
                            <span class="excel-formula">${formula.excelRef || key}</span>
                        </label>
                        <input type="number" 
                               data-key="${key}"
                               value="${currentValue}"
                               placeholder="Enter amount"
                               step="0.01"
                               style="width: 100%; padding: 10px; border: 1px solid #ccc; border-radius: 4px;">
                    </div>
                `;
            }
        }
        
        html += `</div></div>`;
    }
    
    inputContainer.innerHTML = html;
    
    // Add event listeners to inputs
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('input', function() {
            const key = this.dataset.key;
            const value = this.value;
            formulaEngine.setValue(key, value);
        });
    });
}

// Calculate all formulas
function calculateAll() {
    // Update values from inputs
    document.querySelectorAll('input[type="number"]').forEach(input => {
        const key = input.dataset.key;
        const value = input.value;
        if (value !== '') {
            formulaEngine.setValue(key, value);
        }
    });
    
    // Calculate all
    formulaEngine.calculateAll();
    
    // Display results
    displayResults();
}

// Display calculated results
function displayResults() {
    const results = formulaEngine.getResults();
    let html = '';
    
    results.forEach(result => {
        html += `
            <div class="result-card" style="background: linear-gradient(135deg, #${getColor(result.id)};">
                <h3>${result.name}</h3>
                <div class="result-value">${formatCurrency(result.value)}</div>
                <div class="result-formula">
                    <strong>Formula:</strong> ${result.excelRef}
                </div>
                <div style="margin-top: 10px; font-size: 0.9em; opacity: 0.9;">
                    ${result.description}
                </div>
            </div>
        `;
    });
    
    resultsContainer.innerHTML = html;
}

// Render all formulas list
function renderFormulasList() {
    let html = '';
    let formulaCount = 0;
    
    for (const [key, formula] of Object.entries(formulaEngine.formulas)) {
        if (formula.calculate) {
            formulaCount++;
            html += `
                <div class="formula-item">
                    <div class="formula-header">
                        <span class="formula-name">${formula.name}</span>
                        <span class="formula-excel">${key}</span>
                    </div>
                    <div class="formula-expression">
                        ${formula.excelRef || 'User Input'}
                    </div>
                    ${formula.description ? `<div style="margin-top: 8px; font-size: 0.9em; color: #666;">${formula.description}</div>` : ''}
                </div>
            `;
        }
    }
    
    formulasContainer.innerHTML = `<p style="margin-bottom: 15px;"><strong>Total Formulas Implemented: ${formulaCount}</strong></p>` + html;
}

// Reset all
function resetAll() {
    formulaEngine.reset();
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = '';
    });
    calculateAll();
    alert('All values have been reset.');
}

// Helper functions
function formatCurrency(amount) {
    if (amount === undefined || amount === null) return 'PKR 0.00';
    const formatted = Math.abs(amount).toLocaleString('en-PK', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
    const sign = amount < 0 ? '-' : '';
    return `${sign}PKR ${formatted}`;
}

function getColor(id) {
    const colors = {
        'a': '3498db', 'b': '2ecc71', 'c': 'e74c3c', 'd': '9b59b6',
        'e': '1abc9c', 'f': '34495e', 'g': 'f39c12', 'h': '16a085',
        'i': '8e44ad', 'j': '27ae60', 'k': '2980b9', 'l': 'd35400',
        'M': 'c0392b', 'S': '7f8c8d', 't': '2c3e50', 'w': 'e67e22'
    };
    return colors[id] || '95a5a6';
}