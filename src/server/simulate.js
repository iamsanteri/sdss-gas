// eslint-disable-next-line import/prefer-default-export
export const runSimulation = (appState) => {
  return new Promise((resolve, reject) => {
    try {
      const numSimulationRuns = 50;
      const forecastedValuesArray = [];
      const sampledValuesArray = [];
      const headers = [];

      let hiddenSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
        'HiddenSimulationSheet'
      );

      if (hiddenSheet) {
        hiddenSheet.clear();
      } else {
        hiddenSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(
          'HiddenSimulationSheet'
        );
        hiddenSheet.hideSheet();
      }

      for (let i = 0; i < numSimulationRuns; i += 1) {
        const thisRunSampledValues = [];

        appState.forEach((variable) => {
          const { type, cellNotation, sheetName, additionalData } = variable;

          if (type === 'input') {
            const singleDraw =
              Math.random() *
                (Number(additionalData.max) - Number(additionalData.min)) +
              Number(additionalData.min);
            const sheet =
              SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
            if (!sheet) {
              reject(new Error(`No sheet found with name ${sheetName}`));
              return;
            }
            sheet.getRange(cellNotation).setValue(singleDraw);
            thisRunSampledValues.push(singleDraw);
            if (i === 0) {
              headers.push(`${cellNotation} (input)`);
            }
          }
        });

        sampledValuesArray.push(thisRunSampledValues);

        const thisRunOutputValues = [];

        const outputVariables = appState.filter(
          (variable) => variable.type === 'output'
        );

        outputVariables.forEach((outputVariable) => {
          const { cellNotation, sheetName } = outputVariable;

          const forecastSheet =
            SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
          if (!forecastSheet) {
            reject(new Error(`No sheet found with name ${sheetName}`));
            return;
          }
          const singleForecastedValue = forecastSheet
            .getRange(cellNotation)
            .getValue();
          thisRunOutputValues.push(singleForecastedValue);
          if (i === 0) {
            headers.push(`${cellNotation} (output)`);
          }
        });

        forecastedValuesArray.push(thisRunOutputValues);
      }

      const combinedArray = sampledValuesArray.map((sampledValues, index) => {
        return [...sampledValues, ...forecastedValuesArray[index]];
      });

      hiddenSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      hiddenSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      hiddenSheet
        .getRange(2, 1, combinedArray.length, combinedArray[0].length)
        .setValues(combinedArray);

      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
