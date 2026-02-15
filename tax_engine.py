"""
tax_engine.py - Python Tax Calculation Engine
Implements ALL formulas from the Excel tax calculator with 31 inadmissible rows
"""

class TaxEngine:
    def __init__(self):
        """Initialize the tax engine with default values"""
        self.data = {}  # Dictionary to store all cell values
        self.pseb_registered = True  # Default PSEB registration status is "Yes"
        self.initialize_all_data()
    
    def initialize_all_data(self):
        """Initialize all data cells with default values"""
        # Initialize ALL cells from row 1 to 160 for columns C, D, and E
        for i in range(1, 161):
            self.data[f'C{i}'] = 0
            self.data[f'D{i}'] = 0
            self.data[f'E{i}'] = 0
        
        # Set special default values
        self.data['C7'] = 1  # Row 7 Column C is always 1
        self.data['D6'] = 'Yes'  # Default PSEB registration
        self.data['C142'] = 'No'  # Default startup question is "No"
        
        # Initialize specific cells that are marked as empty or not used
        self.data['E134'] = 0  # Tax on High Earners (empty)
        self.data['E135'] = 0  # Tax on Deemed Income (empty)
        self.data['E137'] = 0  # Difference of Minimum Tax Chargeable (empty)
        
        # Initialize advance tax payments (in E column!)
        self.data['E147'] = 0  # Withholding Tax
        self.data['E148'] = 0  # Advance Tax
        self.data['E149'] = 0  # Advance Tax 147(A)
        self.data['E150'] = 0  # Advance Tax 147(5B)
    
    def get_value(self, cell):
        """Get value from a specific cell"""
        return self.data.get(cell, 0)
    
    def set_value(self, cell, value):
        """Set value for a specific cell and trigger recalculation"""
        if cell in ['D6', 'C142']:
            # Special handling for dropdowns
            self.data[cell] = value
            if cell == 'D6':
                self.pseb_registered = (value == 'Yes')
        else:
            try:
                numeric_value = float(value) if value else 0
                self.data[cell] = numeric_value
            except (ValueError, TypeError):
                self.data[cell] = 0
        
        self.calculate_all()
    
    def sum_range(self, column, start, end):
        """Helper function to sum a range of cells"""
        total = 0
        for i in range(start, end + 1):
            total += self.get_value(f'{column}{i}')
        return total
    
    def calculate_all(self):
        """Main calculation function - executes ALL formulas in proper order"""
        
        # 1. GROSS REVENUE CALCULATION
        self.data['C3'] = self.get_value('C4') + self.get_value('C5')
        
        # 2. Calculate export ratio (D7 = C5/C3)
        c3 = self.get_value('C3')
        c5 = self.get_value('C5')
        if c3 > 0:
            self.data['D7'] = c5 / c3
        else:
            self.data['D7'] = 0
        self.data['E7'] = self.get_value('C7') - self.get_value('D7')
        
        # 3. Calculate individual row values FIRST
        # Row 4: Domestic Sales (always 0 exempt)
        self.data['D4'] = 0
        self.data['E4'] = self.get_value('C4') - self.get_value('D4')
        
        # Row 5: Export Sales (depends on PSEB)
        self.data['D5'] = self.get_value('C5') if self.pseb_registered else 0
        self.data['E5'] = self.get_value('C5') - self.data['D5']
        
        # 4. Calculate the totals using updated values
        self.data['D3'] = self.get_value('D4') + self.get_value('D5')
        self.data['E3'] = self.get_value('E4') + self.get_value('E5')
        
        # 5. SELLING EXPENSES CALCULATIONS
        self.data['C8'] = self.sum_range('C', 9, 11)
        self.data['D8'] = self.sum_range('D', 9, 11)
        self.data['E8'] = self.sum_range('E', 9, 11)
        
        # Row 9: Domestic Commission
        self.data['D9'] = 0
        self.data['E9'] = self.get_value('C9') - self.get_value('D9')
        
        # Row 10: Foreign Commission
        self.data['D10'] = self.get_value('C10')
        self.data['E10'] = self.get_value('C10') - self.get_value('D10')
        
        # Row 11: Rebate/Duty Drawbacks
        self.data['D11'] = self.get_value('C11') * self.get_value('D7')
        self.data['E11'] = self.get_value('C11') - self.data['D11']
        
        # 6. NET REVENUE CALCULATION
        self.data['C13'] = self.get_value('C3') - self.get_value('C8')
        self.data['E13'] = self.get_value('E3') - self.get_value('E8')
        
        # 7. COST OF SALES CALCULATIONS
        self.data['C15'] = self.sum_range('C', 17, 25)
        self.data['D15'] = self.sum_range('D', 17, 25)
        self.data['E15'] = self.sum_range('E', 17, 25)
        
        # Apply proportional exemption to direct expenses (rows 17-25)
        for i in range(17, 26):
            self.data[f'D{i}'] = self.get_value(f'C{i}') * self.get_value('D7')
            self.data[f'E{i}'] = self.get_value(f'C{i}') - self.data[f'D{i}']
        
        # 8. GROSS PROFIT CALCULATION
        self.data['C26'] = self.get_value('C13') - self.get_value('C15')
        self.data['E26'] = self.get_value('E13') - self.get_value('E15')
        
        # 9. INDIRECT EXPENSES CALCULATIONS
        self.data['C28'] = self.sum_range('C', 29, 54)
        self.data['E28'] = self.sum_range('E', 29, 54)
        
        # Apply proportional exemption to indirect expenses (rows 29-54)
        for i in range(29, 55):
            self.data[f'D{i}'] = self.get_value(f'C{i}') * self.get_value('D7')
            self.data[f'E{i}'] = self.get_value(f'C{i}') - self.data[f'D{i}']
        
        # 10. OTHER REVENUES CALCULATIONS
        self.data['C56'] = self.sum_range('C', 57, 65)
        self.data['E56'] = self.sum_range('E', 57, 65)
        
        # Apply proportional exemption to other revenues (rows 57-65)
        for i in range(57, 66):
            self.data[f'D{i}'] = self.get_value(f'C{i}') * self.get_value('D7')
            self.data[f'E{i}'] = self.get_value(f'C{i}') - self.data[f'D{i}']
        
        # 11. ACCOUNTING PROFIT CALCULATION
        self.data['C66'] = self.get_value('C26') - self.get_value('C28') + self.get_value('C56')
        self.data['E66'] = self.get_value('E26') - self.get_value('E28') + self.get_value('E56')
        
        # 12. INADMISSIBLE DEDUCTIONS CALCULATIONS - 31 rows (69-99)
        self.data['C68'] = self.sum_range('C', 69, 99)
        self.data['E68'] = self.sum_range('E', 69, 99)
        
        # Apply proportional exemption to inadmissible deductions (rows 69-99)
        for i in range(69, 100):
            self.data[f'D{i}'] = self.get_value(f'C{i}') * self.get_value('D7')
            self.data[f'E{i}'] = self.get_value(f'C{i}') - self.data[f'D{i}']
        
        # Special formulas for rows 94-99 that reference other cells
        self.data['C94'] = self.get_value('C51')  # Row 94: C94 = C51
        self.data['C95'] = self.get_value('C52')  # Row 95: C95 = C52
        self.data['C96'] = self.get_value('C53') + self.get_value('C24')  # Row 96: C96 = C53 + C24
        self.data['C97'] = self.get_value('C54') + self.get_value('C25')  # Row 97: C97 = C54 + C25
        self.data['C98'] = self.get_value('C63')  # Row 98: C98 = C63
        self.data['C99'] = self.get_value('C64')  # Row 99: C99 = C64
        
        # 13. ADMISSIBLE DEDUCTIONS CALCULATIONS - Row 101
        self.data['C101'] = self.sum_range('C', 102, 106)
        self.data['E101'] = self.sum_range('E', 102, 106)
        
        # Apply proportional exemption to admissible deductions (rows 102-106)
        for i in range(102, 107):
            self.data[f'D{i}'] = self.get_value(f'C{i}') * self.get_value('D7')
            self.data[f'E{i}'] = self.get_value(f'C{i}') - self.data[f'D{i}']
        
        # 14. INCOME BEFORE DEPRECIATION - Row 108
        self.data['C108'] = self.get_value('C66') + self.get_value('C68') - self.get_value('C101')
        self.data['E108'] = self.get_value('E66') + self.get_value('E68') - self.get_value('E101')
        
        # 15. TAX DEPRECIATION CALCULATIONS - Row 110
        self.data['C110'] = self.sum_range('C', 111, 113)
        self.data['E110'] = self.sum_range('E', 111, 113)
        
        # Apply proportional exemption to tax depreciation items (rows 111-113)
        for i in range(111, 114):
            self.data[f'D{i}'] = self.get_value(f'C{i}') * self.get_value('D7')
            self.data[f'E{i}'] = self.get_value(f'C{i}') - self.data[f'D{i}']
        
        # 16. BUSINESS INCOME CALCULATION - Row 115
        self.data['C115'] = self.get_value('C108') - self.get_value('C110')
        self.data['E115'] = self.get_value('E108') - self.get_value('E110')
        
        # 17. OTHER INCOMES CALCULATIONS - Rows 116-120
        for i in range(116, 121):
            self.data[f'E{i}'] = self.get_value(f'C{i}') - self.get_value(f'D{i}')
        
        # 18. TOTAL INCOME CALCULATION - Row 121
        self.data['C121'] = self.sum_range('C', 115, 120)
        self.data['E121'] = self.sum_range('E', 115, 120)
        
        # 19. DEDUCTIBLE ALLOWANCES CALCULATIONS - Row 123
        self.data['C123'] = self.get_value('C124')  # Only one allowance now
        self.data['E123'] = self.get_value('E124')
        self.data['E124'] = self.get_value('C124') - self.get_value('D124')  # Workers Welfare Fund
        
        # 20. TAXABLE INCOME CALCULATION - Row 126
        self.data['C126'] = self.get_value('C121') - self.get_value('C123')
        self.data['E126'] = self.get_value('E121') - self.get_value('E123')
        
        # ========== TAX CALCULATIONS SECTION ==========
        
        taxable_income = self.get_value('E126')
        self.data['E129'] = taxable_income * 0.29 if taxable_income > 0 else 0  # Normal Income Tax @ 29%
        
        self.data['E130'] = self.get_value('D5') * 0.025  # Final/Fixed Tax @ 2.5%
        
        accounting_profit = self.get_value('C66')
        self.data['E131'] = accounting_profit * 0.17 if accounting_profit > 0 else 0  # Alternate Corporate Tax @ 17%
        
        taxable_revenue = self.get_value('E3')
        self.data['E132'] = taxable_revenue * 0.0125 if taxable_revenue > 100000000 else 0  # Minimum Tax @ 1.25%
        
        # Difference of Minimum Tax
        self.data['E133'] = (self.get_value('E132') - self.get_value('E129')) \
            if self.get_value('E132') > self.get_value('E129') else 0
        
        # Empty tax fields
        self.data['E134'] = 0  # Tax on High Earners
        self.data['E135'] = 0  # Tax on Deemed Income
        
        # Difference of Alternate Tax
        self.data['E136'] = (self.get_value('E131') - self.get_value('E129')) \
            if self.get_value('E131') > self.get_value('E129') else 0
        
        self.data['E137'] = 0  # Difference of Minimum Tax Chargeable
        
        # Tax Chargeable - NEW FORMULA!
        max_tax = max(
            self.get_value('E129'),  # Normal tax
            self.get_value('E131'),  # Alternate tax
            self.get_value('E132')   # Minimum tax
        )
        
        self.data['E128'] = max_tax + \
            self.get_value('E130') + \
            self.get_value('E133') + \
            self.get_value('E134') + \
            self.get_value('E135') + \
            self.get_value('E136') + \
            self.get_value('E137')
        
        # ========== TAX CREDITS ==========
        
        tax_chargeable = self.get_value('E128')
        charitable_donations = self.get_value('C140')
        
        charitable_credit = 0
        if charitable_donations > 0 and taxable_income > 0 and tax_chargeable > 0:
            option1 = (tax_chargeable / taxable_income) * charitable_donations
            option2 = 0.2 * taxable_income
            charitable_credit = min(option1, option2)
            if charitable_credit < 0:
                charitable_credit = 0
        
        self.data['E140'] = charitable_credit  # Charitable Donations Credit
        
        # Other Credits (depends on startup question)
        startup_registered = (self.data['C142'] == 'Yes')
        self.data['E141'] = self.get_value('E128') if startup_registered else self.get_value('C141')
        
        # Total Tax Credits
        self.data['E139'] = self.get_value('E140') + self.get_value('E141')
        
        # Net Tax Liability
        self.data['E144'] = self.get_value('E128') - self.get_value('E139')
        
        # ========== ADVANCE TAX PAYMENTS ==========
        
        self.data['E146'] = self.get_value('E147') + \
                           self.get_value('E148') + \
                           self.get_value('E149') + \
                           self.get_value('E150')
        
        # ========== FINAL TAX CALCULATIONS ==========
        
        # Admitted Income Tax
        self.data['E152'] = 0 if self.get_value('E146') > self.get_value('E144') \
                           else self.get_value('E144') - self.get_value('E146')
        
        # Refundable Income Tax
        self.data['E153'] = 0 if self.get_value('E152') > 0 \
                           else self.get_value('E146') - self.get_value('E144')
    
    def load_test_data(self):
        """Load test data with values from the Excel sample"""
        self.initialize_all_data()
        
        # Set test data exactly as in Excel
        self.set_value('C4', 6000000)    # Domestic Sales: 6,000,000
        self.set_value('C5', 15000000)   # Export Sales: 15,000,000
        
        # Selling Expenses
        self.set_value('C9', 1000000)    # Domestic Commission
        self.set_value('C10', 1000000)   # Foreign Commission
        self.set_value('C11', 1000000)   # Rebate/Duty Drawbacks
        
        # Direct Expenses (17-25)
        for i in range(17, 26):
            self.set_value(f'C{i}', 1500000)
        
        # Indirect Expenses (29-54)
        for i in range(29, 55):
            self.set_value(f'C{i}', 1500000)
        
        # Other Revenues (57-65)
        for i in range(57, 66):
            self.set_value(f'C{i}', 1500000)
        
        # Inadmissible Deductions (69-99) - 31 rows
        for i in range(69, 100):
            self.set_value(f'C{i}', 1000000)
        
        # Admissible Deductions (102-106)
        for i in range(102, 107):
            self.set_value(f'C{i}', 1500000)
        
        # Tax Depreciation (111-113)
        for i in range(111, 114):
            self.set_value(f'C{i}', 1500000)
        
        # Other Incomes (116-120)
        for i in range(116, 121):
            self.set_value(f'C{i}', 0)
        
        # Allowances (only row 124)
        self.set_value('C124', 1500000)
        
        # Tax Credits
        self.set_value('C140', 1500000)  # Charitable Donations
        self.set_value('C141', 0)        # Other Credits
        
        # Startup question
        self.set_value('C142', 'No')
        
        # Advance Tax Payments
        self.set_value('E147', 1000000)   # Withholding Tax
        self.set_value('E148', 10000000)  # Advance Tax
        self.set_value('E149', 0)         # Advance Tax 147(A)
        self.set_value('E150', 0)         # Advance Tax 147(5B)
        
        # PSEB registration
        self.set_value('D6', 'Yes')
        
        self.calculate_all()
    
    def reset_all(self):
        """Reset all data to default values"""
        self.initialize_all_data()
        self.set_value('D6', 'Yes')
        self.set_value('C142', 'No')
        self.calculate_all()
    
    def format_number(self, num):
        """Format numbers with commas for display"""
        return f"{num:,.0f}"
    
    def get_tax_results(self):
        """Get comprehensive tax results for display"""
        return {
            'normalTax': self.get_value('E129'),
            'finalTax': self.get_value('E130'),
            'alternateTax': self.get_value('E131'),
            'minimumTax': self.get_value('E132'),
            'taxChargeable': self.get_value('E128'),
            'admittedTax': self.get_value('E152'),
            'refundableTax': self.get_value('E153'),
            'totalTaxCredits': self.get_value('E139'),
            'netTaxLiability': self.get_value('E144'),
            'advanceTaxTotal': self.get_value('E146'),
            'startupRegistered': (self.data['C142'] == 'Yes'),
            'exportRatio': self.get_value('D7'),
            'taxableIncome': self.get_value('E126'),
            'accountingProfit': self.get_value('C66'),
            'domesticSales': self.get_value('C4'),
            'exportSales': self.get_value('C5'),
            'totalRevenue': self.get_value('C3')
        }


# Example usage:
if __name__ == "__main__":
    # Create tax engine instance
    tax_engine = TaxEngine()
    
    # Load test data
    tax_engine.load_test_data()
    
    # Get results
    results = tax_engine.get_tax_results()
    
    # Print results
    print("Tax Calculation Results:")
    print(f"Normal Income Tax: Rs. {tax_engine.format_number(results['normalTax'])}")
    print(f"Final/Fixed Tax: Rs. {tax_engine.format_number(results['finalTax'])}")
    print(f"Alternate Corporate Tax: Rs. {tax_engine.format_number(results['alternateTax'])}")
    print(f"Minimum Tax: Rs. {tax_engine.format_number(results['minimumTax'])}")
    print(f"Tax Chargeable: Rs. {tax_engine.format_number(results['taxChargeable'])}")
    print(f"Admitted Income Tax: Rs. {tax_engine.format_number(results['admittedTax'])}")
    print(f"Refundable Income Tax: Rs. {tax_engine.format_number(results['refundableTax'])}")