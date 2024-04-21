export const onOpen = () => {
  const menu = SpreadsheetApp.getUi()
    .createMenu('Simulation')
    .addItem('Dialog (MUI)', 'openDialogMUI')
    .addItem('Simulate DSS (Beta)', 'openSimulate');

  menu.addToUi();
};

export const openDialogMUI = () => {
  const html = HtmlService.createHtmlOutputFromFile('dialog-mui')
    .setWidth(600)
    .setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, 'Dialog (MUI)');
};

export const openSimulate = () => {
  const html = HtmlService.createHtmlOutputFromFile('simulate').setTitle(
    'Simulate DSS (Beta)'
  );
  SpreadsheetApp.getUi().showSidebar(html);
};
