export const onOpen = () => {
  const menu = SpreadsheetApp.getUi()
    .createMenu('Simulate')
    .addItem('Open', 'openSimulate');
  // .addItem('Dialog (MUI)', 'openDialogMUI');

  menu.addToUi();
};

export const onInstall = () => {
  onOpen();
};

// export const openDialogMUI = () => {
//   const html = HtmlService.createHtmlOutputFromFile('dialog-mui')
//     .setWidth(600)
//     .setHeight(600);
//   SpreadsheetApp.getUi().showModalDialog(html, 'Dialog (MUI)');
// };

export const openSimulate = () => {
  const html =
    HtmlService.createHtmlOutputFromFile('simulate').setTitle(
      'Simulate (Beta)'
    );
  SpreadsheetApp.getUi().showSidebar(html);
};
