import {
  onOpen,
  openDialog,
  openDialogBootstrap,
  openDialogMUI,
  openDialogTailwindCSS,
  openSimulate,
} from './ui';

import { getSheetsData, addSheet, deleteSheet, setActiveSheet } from './sheets';

// IMPORT YOUR SERVER-SIDE LOGIC HERE - REMEMBER TO ALSO EXPORT BELOW
import { testSimulate  } from './simulate';
import { getSelectedCell, setCellColor, clearCellColor } from './cells';

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
  testSimulate,
  getSelectedCell,
  setCellColor,
  clearCellColor
};
