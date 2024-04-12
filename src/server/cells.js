export const getSelectedCell = () => {
  return new Promise((resolve, reject) => {
    try {
      const activeSheet =
        SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      const activeCell = activeSheet.getActiveCell();
      resolve(activeCell.getA1Notation());
    } catch (error) {
      reject(error);
    }
  });
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

export const clearCellNote = (sheetName, cellA1Notation) => {
  return new Promise((resolve, reject) => {
    try {
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = spreadsheet.getSheetByName(sheetName);
      const cell = sheet.getRange(cellA1Notation);
      cell.clearNote();
      SpreadsheetApp.flush();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const getCellFormula = (cellA1Notation) => {
  return new Promise((resolve, reject) => {
    try {
      const activeSheet =
        SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
      const cell = activeSheet.getRange(cellA1Notation);
      resolve(cell.getFormula());
    } catch (error) {
      reject(error);
    }
  });
};
