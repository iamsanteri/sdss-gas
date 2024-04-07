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

        appState.forEach((item) => {
          const cellRef = Object.keys(item)[0];
          const variableData = item[cellRef];

          if (variableData.type === 'input') {
            const singleDraw =
              Math.random() *
                (Number(variableData.additionalData.max) -
                  Number(variableData.additionalData.min)) +
              Number(variableData.additionalData.min);
            const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
              variableData.additionalData.sheetName
            );
            if (!sheet) {
              reject(
                new Error(
                  `No sheet found with name ${variableData.additionalData.sheetName}`
                )
              );
              return;
            }
            sheet.getRange(cellRef).setValue(singleDraw);
            thisRunSampledValues.push(singleDraw);
            if (i === 0) {
              headers.push(`${cellRef} (input)`);
            }
          }
        });

        sampledValuesArray.push(thisRunSampledValues);

        const thisRunOutputValues = [];

        const outputVariables = appState.filter(
          (item) => item[Object.keys(item)[0]].type === 'output'
        );

        outputVariables.forEach((outputVariable) => {
          const forecastCellRef = Object.keys(outputVariable)[0];
          const forecastSheet =
            SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
              outputVariable[forecastCellRef].additionalData.sheetName
            );
          if (!forecastSheet) {
            reject(
              new Error(
                `No sheet found with name ${outputVariable[forecastCellRef].additionalData.sheetName}`
              )
            );
            return;
          }
          const singleForecastedValue = forecastSheet
            .getRange(forecastCellRef)
            .getValue();
          thisRunOutputValues.push(singleForecastedValue);
          if (i === 0) {
            headers.push(`${forecastCellRef} (output)`);
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
