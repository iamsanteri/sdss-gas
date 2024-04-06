/* IMPLEMENTS CELL-RELATED FUNCTIONS */

export const getSelectedCell = () => {
  const activeSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const activeCell = activeSheet.getActiveCell();
  return activeCell.getA1Notation();
};

export const setCellNote = (cellA1Notation, note) => {
  return new Promise((resolve, reject) => {
    try {
      const activeSheet =
        SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      const cell = activeSheet.getRange(cellA1Notation);
      cell.setNote(note);
      SpreadsheetApp.flush();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const clearCellNote = (cellA1Notation) => {
  return new Promise((resolve, reject) => {
    try {
      const activeSheet =
        SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      const cell = activeSheet.getRange(cellA1Notation);
      cell.clearNote();
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
