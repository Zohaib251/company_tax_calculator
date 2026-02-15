"""
main.py - FastAPI backend for Tax Calculator
Handles API requests and serves the HTML interface
"""

from fastapi import FastAPI, Request, HTTPException
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Dict, Any, Optional
import uvicorn

from tax_engine import TaxEngine

# Initialize FastAPI app
app = FastAPI(title="Tax Calculator API", description="Backend for Tax Calculation System")

# Mount static files (CSS)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Setup templates
templates = Jinja2Templates(directory="templates")

# Create a single tax engine instance (for simplicity)
# In production, you might want session-based instances
tax_engine = TaxEngine()

# Pydantic models for request/response
class CellUpdate(BaseModel):
    cell: str
    value: Any

class CalculationResponse(BaseModel):
    success: bool
    data: Dict[str, Any]
    message: Optional[str] = None

@app.get("/")
async def read_root(request: Request):
    """Serve the main HTML page"""
    return templates.TemplateResponse(
        "index.html", 
        {
            "request": request,
            "title": "Tax Calculation System"
        }
    )

@app.get("/api/initial-data")
async def get_initial_data():
    """Get initial data for all cells"""
    try:
        # Load test data by default
        tax_engine.load_test_data()
        
        # Get all cell values
        all_data = {}
        for i in range(1, 161):
            for col in ['C', 'D', 'E']:
                cell = f"{col}{i}"
                all_data[cell] = tax_engine.get_value(cell)
        
        # Also get special dropdown values
        all_data['D6'] = tax_engine.data.get('D6', 'Yes')
        all_data['C142'] = tax_engine.data.get('C142', 'No')
        
        return CalculationResponse(
            success=True,
            data=all_data,
            message="Initial data loaded successfully"
        )
    except Exception as e:
        return CalculationResponse(
            success=False,
            data={},
            message=f"Error loading initial data: {str(e)}"
        )

@app.post("/api/update-cell")
async def update_cell(update: CellUpdate):
    """Update a single cell value"""
    try:
        tax_engine.set_value(update.cell, update.value)
        
        # Get updated values for related cells
        updated_cells = {}
        
        # Return key calculated values
        results = tax_engine.get_tax_results()
        updated_cells['results'] = results
        
        # Also return specific cells that might have changed
        important_cells = ['C3', 'D3', 'E3', 'C13', 'E13', 'C66', 'E66', 
                          'C126', 'E126', 'E128', 'E129', 'E130', 'E131',
                          'E132', 'E139', 'E144', 'E146', 'E152', 'E153']
        
        for cell in important_cells:
            updated_cells[cell] = tax_engine.get_value(cell)
        
        return CalculationResponse(
            success=True,
            data=updated_cells,
            message=f"Cell {update.cell} updated successfully"
        )
    except Exception as e:
        return CalculationResponse(
            success=False,
            data={},
            message=f"Error updating cell: {str(e)}"
        )

@app.post("/api/calculate-all")
async def calculate_all():
    """Run all calculations and return results"""
    try:
        tax_engine.calculate_all()
        results = tax_engine.get_tax_results()
        
        return CalculationResponse(
            success=True,
            data=results,
            message="Calculations completed successfully"
        )
    except Exception as e:
        return CalculationResponse(
            success=False,
            data={},
            message=f"Error calculating: {str(e)}"
        )

@app.post("/api/load-test-data")
async def load_test_data():
    """Load test data"""
    try:
        tax_engine.load_test_data()
        
        # Get all updated values
        all_data = {}
        for i in range(1, 161):
            for col in ['C', 'D', 'E']:
                cell = f"{col}{i}"
                all_data[cell] = tax_engine.get_value(cell)
        
        all_data['D6'] = tax_engine.data.get('D6', 'Yes')
        all_data['C142'] = tax_engine.data.get('C142', 'No')
        
        return CalculationResponse(
            success=True,
            data=all_data,
            message="Test data loaded successfully"
        )
    except Exception as e:
        return CalculationResponse(
            success=False,
            data={},
            message=f"Error loading test data: {str(e)}"
        )

@app.post("/api/reset-all")
async def reset_all():
    """Reset all data to default"""
    try:
        tax_engine.reset_all()
        
        # Get all reset values
        all_data = {}
        for i in range(1, 161):
            for col in ['C', 'D', 'E']:
                cell = f"{col}{i}"
                all_data[cell] = tax_engine.get_value(cell)
        
        all_data['D6'] = tax_engine.data.get('D6', 'Yes')
        all_data['C142'] = tax_engine.data.get('C142', 'No')
        
        return CalculationResponse(
            success=True,
            data=all_data,
            message="All data reset successfully"
        )
    except Exception as e:
        return CalculationResponse(
            success=False,
            data={},
            message=f"Error resetting data: {str(e)}"
        )

@app.get("/api/results")
async def get_results():
    """Get only the tax results"""
    try:
        results = tax_engine.get_tax_results()
        return CalculationResponse(
            success=True,
            data=results,
            message="Results retrieved successfully"
        )
    except Exception as e:
        return CalculationResponse(
            success=False,
            data={},
            message=f"Error getting results: {str(e)}"
        )

@app.get("/api/cell/{cell_id}")
async def get_cell(cell_id: str):
    """Get value of a specific cell"""
    try:
        value = tax_engine.get_value(cell_id)
        return CalculationResponse(
            success=True,
            data={cell_id: value},
            message=f"Cell {cell_id} retrieved successfully"
        )
    except Exception as e:
        return CalculationResponse(
            success=False,
            data={},
            message=f"Error getting cell: {str(e)}"
        )

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)