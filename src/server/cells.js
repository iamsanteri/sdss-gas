/* IMPLEMENTS CELL-RELATED FUNCTIONS */

export const getSelectedCell = () => {
  const activeSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const activeCell = activeSheet.getActiveCell();
  return activeCell.getA1Notation();
};

export const setCellColor = (cellA1Notation, color) => {
  return new Promise((resolve, reject) => {
    try {
      const activeSheet =
        SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      const cell = activeSheet.getRange(cellA1Notation);
      cell.setBackground(color);
      SpreadsheetApp.flush();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const clearCellColor = (cellA1Notation) => {
  return new Promise((resolve, reject) => {
    try {
      const activeSheet =
        SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      const cell = activeSheet.getRange(cellA1Notation);
      cell.setBackground(null);
      SpreadsheetApp.flush();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const getCellFormula = (cellA1Notation) => {
  const activeSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const cell = activeSheet.getRange(cellA1Notation);
  return cell.getFormula();
};
