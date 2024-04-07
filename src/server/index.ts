import {
  onOpen,
  openDialog,
  openDialogBootstrap,
  openDialogMUI,
  openDialogTailwindCSS,
  openSimulate,
} from './ui';

import { getSheetsData, getSheetNameOfSelectedCell, addSheet, deleteSheet, setActiveSheet } from './sheets';

// IMPORT YOUR SERVER-SIDE LOGIC HERE - REMEMBER TO ALSO EXPORT BELOW
import { saveSimData, loadSimData  } from './state';
import { getSelectedCell, setCellNote, clearCellNote, getCellFormula } from './cells';
import { runSimulation } from './simulate';

// Public functions must be exported as named exports
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
