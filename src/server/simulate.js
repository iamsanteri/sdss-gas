export const saveSimData = (inputs) => {
  const documentProperties = PropertiesService.getDocumentProperties();
  documentProperties.setProperty('simData', JSON.stringify(inputs));
};

export const loadSimData = () => {
  const documentProperties = PropertiesService.getDocumentProperties();
  // documentProperties.deleteAllProperties(); USE THIS TO DELETE ALL PROPERTIES IN DEV IF NEEDED
  const savedSimData = documentProperties.getProperty('simData');
  return savedSimData ? JSON.parse(savedSimData) : [];
};

/* IMPORTED SIMULATION BASED CODE */

// Declare initial data

/*
var uncertainVariableCell, uncertainForecastCell, uncertainMin, uncertainMax
var numSimulationRuns = 50;
*/

/* 
// Set range for uncertain variable as called by HTML sidebar
function simulationSetup(formData) {
    uncertainVariableCell = activeSpreadsheet.getRange(formData.uncertainCellRef)
    uncertainForecastCell = activeSpreadsheet.getRange(formData.forecastCellRef)
    uncertainMin = Number(formData.valueMin)
    uncertainMax = Number(formData.valueMax)
    runSimulation()
  }
  
  // Simulate
  function runSimulation() {
  
    // Initialize simulation data
    var forecastedValuesArray = [];
    var singleDraw = null;
    var singleForecastedValue = null;
  
    // Respect users preference if simulation sheet open or hidden
    var hiddenSheet = activeSpreadsheet.getSheetByName('HiddenSimulationSheet');
  
    if (hiddenSheet) {
  
      // Check if sheet exists and clear it
      hiddenSheet.clear();
    } else {
    
      // If the hidden sheet doesn't exist, create it and hide it
      hiddenSheet = activeSpreadsheet.insertSheet('HiddenSimulationSheet');
      hiddenSheet.hideSheet();
    }
  
    // Run the simulation
    for (var i = 0; i < numSimulationRuns; i++) {
      
      // Draw one uncertain value
      singleDraw = Math.random() * (uncertainMax - uncertainMin) + uncertainMin;
  
      // Set the value into uncertain cell
      uncertainVariableCell.setValue(singleDraw);
  
      // Capture the value from forecast cell
      singleForecastedValue = uncertainForecastCell.getValue();
  
      // Store forecasted value
      forecastedValuesArray.push(singleForecastedValue);
    }
  
    // Write samples to hidden sheet for later processing
    hiddenSheet.getRange(1, 1, forecastedValuesArray.length, 1).setValues(forecastedValuesArray.map(function(i) { return [i]; }));
  }

  
  
// HELPERS IMPORTED FROM PREVIOUS VERSION 

/* 
function onSelectionChange(e) {
  PropertiesService.getDocumentProperties().setProperty("SelectedCell", e.range.getA1Notation());
}

function getSelectedCell() {
  return PropertiesService.getDocumentProperties().getProperty("SelectedCell");
}
*/
