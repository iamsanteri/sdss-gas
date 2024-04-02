/* IMPLEMENTS CELL-RELATED FUNCTIONS */

export const getSelectedCell = () => {
  const activeSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const activeCell = activeSheet.getActiveCell();
  return activeCell.getA1Notation();
};

export const setCellColor = (cellA1Notation) => {
  const activeSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const cell = activeSheet.getRange(cellA1Notation);
  cell.setBackground('yellow');
};

export const clearCellColor = (cellA1Notation) => {
  const activeSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const cell = activeSheet.getRange(cellA1Notation);
  cell.setBackground(null);
};
