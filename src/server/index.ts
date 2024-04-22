// UI SETUP
import {
  onInstall,
  onOpen,
  openSimulate,
  // openDialogMUI, COMMENTED OUT FOR NOW
} from './ui';

// STATE PERSISTENCE
import { 
  saveSimData, 
  loadSimData,
  resetSimData,
} from './state';

// SHEET OPERATIONS
import { 
  addSheet,
  deleteSheet,
  getSheetsData,
  setActiveSheet,
  getSheetNameOfSelectedCell,
  goToSimulationOutputSheet,
} from './sheets';

// CELL OPERATIONS
import { 
  getSelectedCell,
  setCellNote,
  clearCellNote,
  getCellFormula,
} from './cells';

// SIMULATION LOGIC
import { 
  runSimulation,
  stopSimulation
} from './simulate';

// PUBLIC FUNCTIONS MUST BE EXPORTED AS NAMED EXPORTS
export {
  onInstall,
  onOpen,
  // openDialogMUI, COMMENTED OUT FOR NOW
  openSimulate,
  getSheetsData,
  addSheet,
  deleteSheet,
  setActiveSheet,
  goToSimulationOutputSheet,
  saveSimData,
  loadSimData,
  resetSimData,
  getSelectedCell,
  getSheetNameOfSelectedCell,
  setCellNote,
  clearCellNote,
  getCellFormula,
  runSimulation,
  stopSimulation,
};
