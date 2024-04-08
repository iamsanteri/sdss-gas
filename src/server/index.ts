// UI SETUP
import {
  onOpen,
  openDialog,
  openDialogMUI,
  openDialogBootstrap,
  openDialogTailwindCSS,
  openSimulate,
} from './ui';

// STATE PERSISTENCE
import { 
  saveSimData, 
  loadSimData  
} from './state';

// SHEET OPERATIONS
import { 
  addSheet,
  deleteSheet,
  getSheetsData,
  setActiveSheet,
  getSheetNameOfSelectedCell,
} from './sheets';

// CELL OPERATIONS
import { 
  getSelectedCell,
  setCellNote,
  clearCellNote,
  getCellFormula
} from './cells';

// SIMULATION LOGIC
import { 
  runSimulation
} from './simulate';

// PUBLIC FUNCTIONS MUST BE EXPORTED AS NAMED EXPORTS
export {
  onOpen,
  openDialog,
  openDialogBootstrap,
  openDialogMUI,
  openDialogTailwindCSS,
  openSimulate,
  getSheetsData,
  addSheet,
  deleteSheet,
  setActiveSheet,
  saveSimData,
  loadSimData,
  getSelectedCell,
  getSheetNameOfSelectedCell,
  setCellNote,
  clearCellNote,
  getCellFormula,
  runSimulation,
};
