const nameOfHiddenSheet = 'HiddenSimulationSheet'; // Remember to define also in simulate.js

const getSheets = () => SpreadsheetApp.getActive().getSheets();

const getActiveSheetName = () => SpreadsheetApp.getActive().getSheetName();

export const getSheetsData = () => {
  const activeSheetName = getActiveSheetName();
  const sheets = getSheets();
  return sheets.map((sheet, index) => {
    const name = sheet.getName();
    return {
      name,
      index,
      isActive: name === activeSheetName,
    };
  });
};

export const getSheetNameOfSelectedCell = () => {
  const activeSheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  return activeSheet.getName();
};

export const addSheet = (sheetTitle) => {
  SpreadsheetApp.getActive().insertSheet(sheetTitle);
  return getSheetsData();
};

export const deleteSheet = (sheetIndex) => {
  const sheets = getSheets();
  SpreadsheetApp.getActive().deleteSheet(sheets[sheetIndex]);
  return getSheetsData();
};

export const setActiveSheet = (sheetName) => {
  SpreadsheetApp.getActive().getSheetByName(sheetName).activate();
  return getSheetsData();
};

export const goToSimulationOutputSheet = () => {
  SpreadsheetApp.getActiveSpreadsheet()
    .getSheetByName(nameOfHiddenSheet)
    .activate();
};
