// Initialize Engine
const engine = new TaxAssistantEngine();

// DOM Elements
const questionSection = document.getElementById('questionSection');
const resultsGrid = document.getElementById('resultsGrid');
const testBtn = document.getElementById('testBtn');
const resetBtn = document.getElementById('resetBtn');
const submitBtn = document.getElementById('submitBtn');

// Remove navigation buttons
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
prevBtn.style.display = 'none';
nextBtn.style.display = 'none';

// All questions in one long form - COMPLETE VERSION
const allQuestions = [
    {
        section: "Company Information",
        description: "Basic company details for tax calculation",
        questions: [
            {
                id: 'psebRegistered',
                type: 'radio',
                question: "Is your company registered with PSEB (Pakistan Software Export Board)?",
                options: [
                    { value: true, label: "Yes, registered with PSEB" },
                    { value: false, label: "No, not registered" }
                ],
                defaultValue: true,
                excelRef: "D6 = 'Yes' or 'No'"
            }
        ]
    },
    {
        section: "Revenue Details",
        description: "Enter your sales and revenue figures (excluding Sales Tax & Federal Excise Duty)",
        questions: [
            {
                id: 'C4',
                type: 'number',
                question: "Gross Domestic Sales/Services Fee (a')",
                placeholder: "Enter amount in PKR",
                excelRef: "C4"
            },
            {
                id: 'C5',
                type: 'number',
                question: "Gross Export Sales/Services Fee (b')",
                placeholder: "Enter amount in PKR",
                excelRef: "C5"
            }
        ]
    },
    {
        section: "Selling Expenses",
        description: "Commission, brokerage, and selling-related expenses",
        questions: [
            {
                id: 'C9',
                type: 'number',
                question: "Domestic Commission/Brokerage/Discount/Freight Outward (e')",
                placeholder: "Enter amount in PKR",
                excelRef: "C9"
            },
            {
                id: 'C10',
                type: 'number',
                question: "Foreign Commission/Brokerage/Discount/Freight Outward (d')",
                placeholder: "Enter amount in PKR",
                excelRef: "C10"
            },
            {
                id: 'C11',
                type: 'number',
                question: "Rebate/Duty Drawbacks (f')",
                placeholder: "Enter amount in PKR",
                excelRef: "C11"
            },
            {
                id: 'C12',
                type: 'number',
                question: "Other Selling Expenses (g')",
                placeholder: "Enter amount in PKR",
                excelRef: "C12"
            }
        ]
    },
    {
        section: "Cost of Sales",
        description: "Direct expenses related to sales/services (C17:C25)",
        questions: [
            {
                id: 'C17',
                type: 'number',
                question: "Salaries/Wages for direct expenses",
                placeholder: "Enter amount in PKR",
                excelRef: "C17"
            },
            {
                id: 'C18',
                type: 'number',
                question: "Power expenses",
                placeholder: "Enter amount in PKR",
                excelRef: "C18"
            },
            {
                id: 'C19',
                type: 'number',
                question: "Gas expenses",
                placeholder: "Enter amount in PKR",
                excelRef: "C19"
            },
            {
                id: 'C20',
                type: 'number',
                question: "Repair/Maintenance",
                placeholder: "Enter amount in PKR",
                excelRef: "C20"
            },
            {
                id: 'C21',
                type: 'number',
                question: "Insurance",
                placeholder: "Enter amount in PKR",
                excelRef: "C21"
            },
            {
                id: 'C22',
                type: 'number',
                question: "Royalty",
                placeholder: "Enter amount in PKR",
                excelRef: "C22"
            },
            {
                id: 'C23',
                type: 'number',
                question: "Other Direct Expenses",
                placeholder: "Enter amount in PKR",
                excelRef: "C23"
            },
            {
                id: 'C24',
                type: 'number',
                question: "Accounting Amortisation",
                placeholder: "Enter amount in PKR",
                excelRef: "C24"
            },
            {
                id: 'C25',
                type: 'number',
                question: "Accounting Depreciation",
                placeholder: "Enter amount in PKR",
                excelRef: "C25"
            }
        ]
    },
    {
        section: "Management & Administrative Expenses",
        description: "General and administrative business expenses (C29:C54)",
        questions: [
            {
                id: 'C29',
                type: 'number',
                question: "Rent expenses",
                placeholder: "Enter amount in PKR",
                excelRef: "C29"
            },
            {
                id: 'C30',
                type: 'number',
                question: "Rates/Taxes/Cess",
                placeholder: "Enter amount in PKR",
                excelRef: "C30"
            },
            {
                id: 'C31',
                type: 'number',
                question: "Salaries/Wages/Perquisites/Benefits",
                placeholder: "Enter amount in PKR",
                excelRef: "C31"
            },
            {
                id: 'C32',
                type: 'number',
                question: "Traveling/Conveyance/Vehicles running/Maintenance",
                placeholder: "Enter amount in PKR",
                excelRef: "C32"
            },
            {
                id: 'C33',
                type: 'number',
                question: "Electricity/Water/Gas",
                placeholder: "Enter amount in PKR",
                excelRef: "C33"
            },
            {
                id: 'C34',
                type: 'number',
                question: "Communication",
                placeholder: "Enter amount in PKR",
                excelRef: "C34"
            },
            {
                id: 'C35',
                type: 'number',
                question: "Repair/Maintenance",
                placeholder: "Enter amount in PKR",
                excelRef: "C35"
            },
            {
                id: 'C36',
                type: 'number',
                question: "Stationery/Printing/Photocopies/Office supplies",
                placeholder: "Enter amount in PKR",
                excelRef: "C36"
            },
            {
                id: 'C37',
                type: 'number',
                question: "Advertisement/Publicity/Promotion",
                placeholder: "Enter amount in PKR",
                excelRef: "C37"
            },
            {
                id: 'C38',
                type: 'number',
                question: "Insurance",
                placeholder: "Enter amount in PKR",
                excelRef: "C38"
            },
            {
                id: 'C39',
                type: 'number',
                question: "Professional charges",
                placeholder: "Enter amount in PKR",
                excelRef: "C39"
            },
            {
                id: 'C40',
                type: 'number',
                question: "Profit on debt (Financial charges/Markup/Interest)",
                placeholder: "Enter amount in PKR",
                excelRef: "C40"
            },
            {
                id: 'C41',
                type: 'number',
                question: "Donation/Charity",
                placeholder: "Enter amount in PKR",
                excelRef: "C41"
            },
            {
                id: 'C42',
                type: 'number',
                question: "Brokerage/Commission",
                placeholder: "Enter amount in PKR",
                excelRef: "C42"
            },
            {
                id: 'C43',
                type: 'number',
                question: "Other indirect expenses",
                placeholder: "Enter amount in PKR",
                excelRef: "C43"
            },
            {
                id: 'C44',
                type: 'number',
                question: "Directors fee",
                placeholder: "Enter amount in PKR",
                excelRef: "C44"
            },
            {
                id: 'C45',
                type: 'number',
                question: "Workers profit participation fund",
                placeholder: "Enter amount in PKR",
                excelRef: "C45"
            },
            {
                id: 'C46',
                type: 'number',
                question: "Provision for doubtful/bad debts",
                placeholder: "Enter amount in PKR",
                excelRef: "C46"
            },
            {
                id: 'C47',
                type: 'number',
                question: "Provision for obsolete stocks/stores/spares/fixed assets",
                placeholder: "Enter amount in PKR",
                excelRef: "C47"
            },
            {
                id: 'C48',
                type: 'number',
                question: "Provision for diminution in value of investment",
                placeholder: "Enter amount in PKR",
                excelRef: "C48"
            },
            {
                id: 'C49',
                type: 'number',
                question: "Irrecoverable debts written off",
                placeholder: "Enter amount in PKR",
                excelRef: "C49"
            },
            {
                id: 'C50',
                type: 'number',
                question: "Obsolete stocks/stores/spares/fixed assets written off",
                placeholder: "Enter amount in PKR",
                excelRef: "C50"
            },
            {
                id: 'C51',
                type: 'number',
                question: "Accounting (Loss) on sale of intangibles",
                placeholder: "Enter amount in PKR",
                excelRef: "C51"
            },
            {
                id: 'C52',
                type: 'number',
                question: "Accounting (Loss) on sale of assets",
                placeholder: "Enter amount in PKR",
                excelRef: "C52"
            },
            {
                id: 'C53',
                type: 'number',
                question: "Accounting amortization",
                placeholder: "Enter amount in PKR",
                excelRef: "C53"
            },
            {
                id: 'C54',
                type: 'number',
                question: "Accounting depreciation",
                placeholder: "Enter amount in PKR",
                excelRef: "C54"
            }
        ]
    },
    {
        section: "Other Revenues",
        description: "Other income and revenue items (C57:C65)",
        questions: [
            {
                id: 'C57',
                type: 'number',
                question: "Other revenues",
                placeholder: "Enter amount in PKR",
                excelRef: "C57"
            },
            {
                id: 'C58',
                type: 'number',
                question: "Fee for technical/professional services",
                placeholder: "Enter amount in PKR",
                excelRef: "C58"
            },
            {
                id: 'C59',
                type: 'number',
                question: "Fee for other services",
                placeholder: "Enter amount in PKR",
                excelRef: "C59"
            },
            {
                id: 'C60',
                type: 'number',
                question: "Profit on debt",
                placeholder: "Enter amount in PKR",
                excelRef: "C60"
            },
            {
                id: 'C61',
                type: 'number',
                question: "Royalty",
                placeholder: "Enter amount in PKR",
                excelRef: "C61"
            },
            {
                id: 'C62',
                type: 'number',
                question: "License/Franchise fee",
                placeholder: "Enter amount in PKR",
                excelRef: "C62"
            },
            {
                id: 'C63',
                type: 'number',
                question: "Accounting gain on sale of intangibles",
                placeholder: "Enter amount in PKR",
                excelRef: "C63"
            },
            {
                id: 'C64',
                type: 'number',
                question: "Accounting gain on sale of assets",
                placeholder: "Enter amount in PKR",
                excelRef: "C64"
            },
            {
                id: 'C65',
                type: 'number',
                question: "Others",
                placeholder: "Enter amount in PKR",
                excelRef: "C65"
            }
        ]
    },
    {
        section: "Admissible Deductions",
        description: "Deductions allowed for tax purposes (C110:C114)",
        questions: [
            {
                id: 'C110',
                type: 'number',
                question: "Accounting gain on sale of intangibles",
                placeholder: "Enter amount in PKR",
                excelRef: "C110"
            },
            {
                id: 'C111',
                type: 'number',
                question: "Accounting gain on sale of assets",
                placeholder: "Enter amount in PKR",
                excelRef: "C111"
            },
            {
                id: 'C112',
                type: 'number',
                question: "Other admissible deductions",
                placeholder: "Enter amount in PKR",
                excelRef: "C112"
            },
            {
                id: 'C113',
                type: 'number',
                question: "Tax (Loss) on sale of intangibles",
                placeholder: "Enter amount in PKR",
                excelRef: "C113"
            },
            {
                id: 'C114',
                type: 'number',
                question: "Tax (Loss) on sale of assets",
                placeholder: "Enter amount in PKR",
                excelRef: "C114"
            }
        ]
    },
    {
        section: "Tax Depreciation",
        description: "Depreciation as per tax laws (C119:C121)",
        questions: [
            {
                id: 'C119',
                type: 'number',
                question: "Tax amortization for current year",
                placeholder: "Enter amount in PKR",
                excelRef: "C119"
            },
            {
                id: 'C120',
                type: 'number',
                question: "Tax depreciation/Initial allowance for current year",
                placeholder: "Enter amount in PKR",
                excelRef: "C120"
            },
            {
                id: 'C121',
                type: 'number',
                question: "Pre-commencement expenditure/Deferred cost",
                placeholder: "Enter amount in PKR",
                excelRef: "C121"
            }
        ]
    },
    {
        section: "Allowances & Credits",
        description: "Deductible allowances and tax credits",
        questions: [
            {
                id: 'C132',
                type: 'number',
                question: "Workers Welfare Fund u/s 60A",
                placeholder: "Enter amount in PKR",
                excelRef: "C132"
            },
            {
                id: 'C133',
                type: 'number',
                question: "Workers Profit Participation Fund u/s 60B",
                placeholder: "Enter amount in PKR",
                excelRef: "C133"
            },
            {
                id: 'C134',
                type: 'number',
                question: "Other Deductible Allowances",
                placeholder: "Enter amount in PKR",
                excelRef: "C134"
            },
            {
                id: 'C149',
                type: 'number',
                question: "Tax Credit for Charitable Donations u/s 61",
                placeholder: "Enter amount in PKR",
                excelRef: "C149"
            },
            {
                id: 'C150',
                type: 'number',
                question: "Tax Credit for Startups u/s 65F",
                placeholder: "Enter amount in PKR",
                excelRef: "C150"
            }
        ]
    },
    {
        section: "Tax Payments",
        description: "Taxes already paid or withheld",
        questions: [
            {
                id: 'D152',
                type: 'number',
                question: "Withholding Income Tax Paid",
                placeholder: "Enter amount in PKR",
                excelRef: "D152"
            },
            {
                id: 'D153',
                type: 'number',
                question: "Advance Income Tax Paid",
                placeholder: "Enter amount in PKR",
                excelRef: "D153"
            },
            {
                id: 'D154',
                type: 'number',
                question: "Advance Income Tax u/s 147(A)",
                placeholder: "Enter amount in PKR",
                excelRef: "D154"
            },
            {
                id: 'D155',
                type: 'number',
                question: "Advance Income Tax u/s 147(5B)",
                placeholder: "Enter amount in PKR",
                excelRef: "D155"
            }
        ]
    }
];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderAllQuestions();
    updateResults();
    
    // Event Listeners with proper Firefox handling
    testBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        loadTestData();
    });
    
    resetBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        resetAll();
    });
    
    submitBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        submitAndCalculate();
    });
    
    // Optional: Run verification on load (for debugging)
    // setTimeout(verifyExcelResults, 500);
});

// Render all questions in one long form
function renderAllQuestions() {
    let html = '<div class="form-sections">';
    
    allQuestions.forEach((section, sectionIndex) => {
        html += `
            <div class="section-header">
                <h2><i class="fas fa-folder${sectionIndex + 1}"></i> ${section.section}</h2>
                <p>${section.description}</p>
            </div>
            <div class="questions-grid">
        `;
        
        section.questions.forEach((q, qIndex) => {
            let currentValue;
            if (q.id === 'psebRegistered') {
                currentValue = engine.psebRegistered;
            } else {
                currentValue = engine.getValue(q.id);
            }
            
            // Format display value
            let displayValue;
            if (currentValue === 0 || currentValue === false) {
                displayValue = '';
            } else if (currentValue === true) {
                displayValue = 'true';
            } else {
                displayValue = currentValue;
            }
            
            html += `
                <div class="question-card">
                    <label>${q.question} <span class="excel-ref">${q.excelRef}</span></label>
            `;
            
            if (q.type === 'radio') {
                html += '<div class="radio-group">';
                q.options.forEach(option => {
                    const checked = (q.id === 'psebRegistered') ? 
                        (engine.psebRegistered === option.value) : 
                        (currentValue === option.value);
                        
                    html += `
                        <div class="radio-option">
                            <input type="radio" 
                                   name="${q.id}" 
                                   value="${option.value}"
                                   ${checked ? 'checked' : ''}
                                   onchange="handleRadioChange('${q.id}', ${option.value})">
                            <label>${option.label}</label>
                        </div>
                    `;
                });
                html += '</div>';
            } else if (q.type === 'number') {
                html += `
                    <input type="number" 
                           class="question-input"
                           id="input-${q.id}"
                           value="${displayValue}"
                           placeholder="${q.placeholder || 'Enter amount'}"
                           oninput="handleInputChange('${q.id}', this.value)">
                `;
            }
            
            html += `
                <div class="input-info">
                    <i class="fas fa-info-circle"></i> Excel reference: ${q.excelRef}
                </div>
            </div>
            `;
        });
        
        html += '</div>'; // Close questions-grid
    });
    
    html += '</div>'; // Close form-sections
    questionSection.innerHTML = html;
    
    // Make sure buttons are visible
    showAllButtons();
}

// Show all action buttons
function showAllButtons() {
    testBtn.style.display = 'flex';
    resetBtn.style.display = 'flex';
    submitBtn.style.display = 'flex';
}

// Hide action buttons
function hideButtons() {
    testBtn.style.display = 'none';
    resetBtn.style.display = 'none';
    submitBtn.style.display = 'none';
}

// Handle input changes
function handleInputChange(field, value) {
    engine.setUserInput(field, value);
    updateResults();
}

// Handle radio changes
function handleRadioChange(field, value) {
    if (field === 'psebRegistered') {
        engine.setPSEBRegistered(value);
    } else {
        engine.setUserInput(field, value);
    }
    updateResults();
}

// Update results display
function updateResults() {
    const results = engine.getResults();
    
    let html = '';
    
    // Always show key results
    const grossRevenue = engine.getValue('C3');
    const netRevenue = engine.getValue('C13');
    const grossProfit = engine.getValue('C26');
    const accountingProfit = engine.getValue('C66');
    const taxableIncome = results.taxableIncome;
    const totalTax = results.totalTax;
    const netTaxPayable = results.netTaxPayable;
    
    html = `
        <div class="result-item">
            <h4>Gross Revenue <span class="excel-ref">C3</span></h4>
            <div class="result-value">${formatCurrency(grossRevenue)}</div>
            <div class="result-formula">= Domestic + Export Sales</div>
        </div>
        <div class="result-item">
            <h4>Export Ratio <span class="excel-ref">D7</span></h4>
            <div class="result-value">${(results.exportRatio * 100).toFixed(2)}%</div>
            <div class="result-formula">= Export Sales / Total Revenue</div>
        </div>
        <div class="result-item">
            <h4>Net Revenue <span class="excel-ref">C13</span></h4>
            <div class="result-value">${formatCurrency(netRevenue)}</div>
            <div class="result-formula">= Gross Revenue - Selling Expenses</div>
        </div>
        <div class="result-item">
            <h4>Gross Profit <span class="excel-ref">C26</span></h4>
            <div class="result-value">${formatCurrency(grossProfit)}</div>
            <div class="result-formula">= Net Revenue - Cost of Sales</div>
        </div>
        <div class="result-item">
            <h4>Accounting Profit <span class="excel-ref">C66</span></h4>
            <div class="result-value">${formatCurrency(accountingProfit)}</div>
            <div class="result-formula">= Gross Profit - Expenses + Other Revenues</div>
        </div>
        <div class="result-item">
            <h4>Taxable Income <span class="excel-ref">E135</span></h4>
            <div class="result-value">${formatCurrency(taxableIncome)}</div>
        </div>
        <div class="result-item">
            <h4>Total Tax Chargeable <span class="excel-ref">E136</span></h4>
            <div class="result-value">${formatCurrency(totalTax)}</div>
        </div>
        <div class="result-item">
            <h4>Net Tax ${netTaxPayable > 0 ? 'Payable' : 'Refundable'} <span class="excel-ref">E152</span></h4>
            <div class="result-value" style="color: ${netTaxPayable > 0 ? 'var(--danger-color)' : 'var(--success-color)'}">
                ${formatCurrency(Math.abs(netTaxPayable))}
            </div>
        </div>
    `;
    
    resultsGrid.innerHTML = html;
}

// Load test data - Firefox compatible
function loadTestData() {
    console.log('Loading test data...');
    
    if (confirm("Load test data? This will populate all fields with EXACT values from the Excel sheet.")) {
        console.log('User confirmed - loading test data');
        
        // Load test data from engine
        const success = engine.loadTestData();
        console.log('Engine loadTestData result:', success);
        
        // Use setTimeout for Firefox compatibility
        setTimeout(() => {
            // Update all form inputs
            updateAllFormInputsFromEngine();
            
            // Recalculate and update results
            engine.calculateAll();
            updateResults();
            
            console.log('Test data loaded successfully');
            alert("✅ EXACT Excel test data loaded! All fields now contain values from the Excel sheet.");
        }, 10);
    }
}

// Reset all - Firefox compatible
function resetAll() {
    console.log('Resetting all data...');
    
    if (confirm("Are you sure you want to reset all data? This will clear ALL input fields.")) {
        console.log('User confirmed - resetting');
        
        // Reset the engine
        engine.resetAll();
        
        // Use setTimeout for Firefox compatibility
        setTimeout(() => {
            // Clear all form inputs
            clearAllFormInputs();
            
            // Update results to show zeros
            updateResults();
            
            // Make sure buttons are visible
            showAllButtons();
            
            console.log('Reset complete');
            alert("✅ All data has been reset. All fields are now empty.");
        }, 10);
    }
}

// Update all form inputs from engine data
function updateAllFormInputsFromEngine() {
    console.log('Updating form inputs from engine...');
    
    // Update all number input fields
    const inputs = document.querySelectorAll('.question-input');
    inputs.forEach(input => {
        const fieldId = input.id.replace('input-', '');
        const value = engine.getValue(fieldId);
        
        if (value !== 0 && value !== undefined && !isNaN(value)) {
            input.value = value;
        } else {
            input.value = '';
        }
    });
    
    // Update radio buttons for PSEB registration
    const psebYes = document.querySelector('input[name="psebRegistered"][value="true"]');
    const psebNo = document.querySelector('input[name="psebRegistered"][value="false"]');
    
    if (psebYes && psebNo) {
        psebYes.checked = engine.psebRegistered;
        psebNo.checked = !engine.psebRegistered;
    }
    
    console.log('Form inputs updated from engine');
}

// Clear all form inputs
function clearAllFormInputs() {
    console.log('Clearing all form inputs...');
    
    // Clear all number inputs
    const numberInputs = document.querySelectorAll('.question-input');
    numberInputs.forEach(input => {
        input.value = '';
    });
    
    // Reset radio buttons to default
    const psebYes = document.querySelector('input[name="psebRegistered"][value="true"]');
    const psebNo = document.querySelector('input[name="psebRegistered"][value="false"]');
    
    if (psebYes && psebNo) {
        psebYes.checked = true;
        psebNo.checked = false;
    }
    
    // Re-render form to ensure everything is fresh
    renderAllQuestions();
    
    console.log('All form inputs cleared');
}

// Submit and calculate final tax
function submitAndCalculate() {
    const results = engine.getResults();
    
    // Create final results display
    const html = `
        <div class="final-results">
            <h3><i class="fas fa-check-circle"></i> Tax Calculation Complete</h3>
            
            <div class="results-summary">
                <div class="summary-item">
                    <h4>Taxable Income</h4>
                    <div class="summary-value" style="color: var(--primary-color);">
                        ${formatCurrency(results.taxableIncome)}
                    </div>
                    <div style="font-size: 0.8rem; color: #666; margin-top: 5px;">E135</div>
                </div>
                
                <div class="summary-item">
                    <h4>Total Tax Chargeable</h4>
                    <div class="summary-value" style="color: var(--danger-color);">
                        ${formatCurrency(results.totalTax)}
                    </div>
                    <div style="font-size: 0.8rem; color: #666; margin-top: 5px;">E136</div>
                </div>
                
                <div class="summary-item">
                    <h4>Tax Credit for Donations</h4>
                    <div class="summary-value" style="color: var(--success-color);">
                        ${formatCurrency(results.taxCreditDonations)}
                    </div>
                    <div style="font-size: 0.8rem; color: #666; margin-top: 5px;">E149</div>
                </div>
            </div>
            
            <div class="tax-breakdown">
                <h4>Tax Breakdown</h4>
                <div class="breakdown-grid">
                    <div class="breakdown-item">
                        <span>Normal Tax @ 29%</span>
                        <span>${formatCurrency(results.normalTax)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Final Tax @ 2.5%</span>
                        <span>${formatCurrency(results.finalTax)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Alternate Corporate Tax</span>
                        <span>${formatCurrency(results.alternateTax)}</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Minimum Tax</span>
                        <span>${formatCurrency(results.minimumTax)}</span>
                    </div>
                </div>
            </div>
            
            <div class="net-tax-box">
                <h4>${results.netTaxPayable > 0 ? 'TAX PAYABLE' : 'TAX REFUNDABLE'}</h4>
                <div class="net-tax-amount">
                    ${formatCurrency(Math.abs(results.netTaxPayable))}
                </div>
                <p>${results.netTaxPayable > 0 ? 'Amount to be paid' : 'Amount to be refunded'}</p>
            </div>
            
            <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid var(--border-color);">
                <p style="color: #666; font-size: 0.9rem;">
                    <i class="fas fa-lightbulb"></i> 
                    All calculations follow Excel formulas exactly as per your tax template.
                </p>
                <div style="display: flex; gap: 15px; margin-top: 20px;">
                    <button class="btn btn-primary" onclick="returnToForm()">
                        <i class="fas fa-edit"></i> Edit Data
                    </button>
                    <button class="btn btn-test" onclick="loadTestData()">
                        <i class="fas fa-vial"></i> Load Test Data Again
                    </button>
                    <button class="btn btn-danger" onclick="resetAll()">
                        <i class="fas fa-redo"></i> Reset All
                    </button>
                </div>
            </div>
        </div>
    `;
    
    // Replace the form with final results
    questionSection.innerHTML = html;
    
    // Update results section to show detailed breakdown
    resultsGrid.innerHTML = `
        <div class="result-item">
            <h4>Export Sales Exemption</h4>
            <div class="result-value">${formatCurrency(engine.getValue('D5'))}</div>
            <div class="result-formula">${results.psebRegistered ? 'Exempt (PSEB Registered)' : 'Not Exempt'}</div>
        </div>
        <div class="result-item">
            <h4>Export Ratio Used</h4>
            <div class="result-value">${(results.exportRatio * 100).toFixed(2)}%</div>
            <div class="result-formula">For proportional exemptions</div>
        </div>
        <div class="result-item">
            <h4>Withholding Tax Paid</h4>
            <div class="result-value">${formatCurrency(engine.getValue('D152'))}</div>
            <div class="result-formula">Already paid tax</div>
        </div>
        <div class="result-item">
            <h4>Advance Tax Paid</h4>
            <div class="result-value">${formatCurrency(engine.getValue('D153'))}</div>
            <div class="result-formula">Pre-paid tax</div>
        </div>
    `;
    
    // Hide the main action buttons (they're now in the results)
    hideButtons();
}

// Return to form from results
function returnToForm() {
    renderAllQuestions();
    updateResults();
    showAllButtons();
}

// Helper function to format currency
function formatCurrency(amount) {
    if (amount === undefined || amount === null || isNaN(amount)) return 'PKR 0';
    return 'PKR ' + amount.toLocaleString('en-PK', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

// Verify against EXACT Excel results
function verifyExcelResults() {
    console.log("=== VERIFYING AGAINST EXCEL ===");
    
    // Load test data
    engine.loadTestData();
    
    // Give time for calculations
    setTimeout(() => {
        console.log("\n=== KEY CALCULATIONS (From Excel) ===");
        console.log("1. Gross Revenue (C3):", formatCurrency(engine.getValue('C3')), 
                    "Expected: 115,000,000");
        
        console.log("2. Selling Expenses (C8):", formatCurrency(engine.getValue('C8')), 
                    "Expected: 3,000,000");
        
        console.log("3. Net Revenue (C13):", formatCurrency(engine.getValue('C13')), 
                    "Expected: 112,000,000");
        
        console.log("4. Gross Profit (C26):", formatCurrency(engine.getValue('C26')), 
                    "Expected: 98,500,000");
        
        console.log("5. Accounting Profit (C66):", formatCurrency(engine.getValue('C66')), 
                    "Expected: 73,000,000");
        
        console.log("6. Taxable Income (E135):", formatCurrency(engine.getValue('E135')), 
                    "Expected: 97,000,000");
        
        console.log("7. Normal Tax @29% (E137):", formatCurrency(engine.getValue('E137')), 
                    "Expected: 24,561,739");
        
        console.log("8. Final Tax @2.5% (E138):", formatCurrency(engine.getValue('E138')), 
                    "Expected: 375,000");
        
        console.log("9. Alternate Tax @17% (E140):", formatCurrency(engine.getValue('E140')), 
                    "Expected: 12,410,000");
        
        console.log("10. Minimum Tax @1.25% (E141):", formatCurrency(engine.getValue('E141')), 
                    "Expected: 1,250,000");
        
        console.log("11. Total Tax (E136):", formatCurrency(engine.getValue('E136')), 
                    "Expected: 24,502,783");
        
        console.log("12. Tax Credit (E149):", formatCurrency(engine.getValue('E149')), 
                    "Expected: 433,956");
        
        console.log("13. Admitted Tax (E152):", formatCurrency(engine.getValue('E152')), 
                    "Expected: 13,502,783");
        
        console.log("\n=== EXPORT RATIO ===");
        console.log("Export Ratio:", (engine.exportRatio * 100).toFixed(2) + "%", 
                    "Expected: 13.04%");
        
        console.log("\n=== DIFFERENCES TO INVESTIGATE ===");
        console.log("If any values don't match Excel, check:");
        console.log("1. Export ratio calculation");
        console.log("2. Proportional exemption logic (13% exempt, 87% taxable)");
        console.log("3. Tax calculation formulas (E136, E149, E152)");
    }, 100);
}

// Make functions global for inline event handlers
window.handleInputChange = handleInputChange;
window.handleRadioChange = handleRadioChange;
window.renderAllQuestions = renderAllQuestions;
window.loadTestData = loadTestData;
window.resetAll = resetAll;
window.returnToForm = returnToForm;
window.verifyExcelResults = verifyExcelResults; // For debugging