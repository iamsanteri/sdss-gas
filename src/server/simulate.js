import { uniformDistribution } from './distributions/uniformContinuous';
import { triangularDistribution } from './distributions/triangularContinuous';
import { normalDistribution } from './distributions/normalContinuous';

/* Define a function to handle the distribution sampling. 
  For server side add new imported distributions here */

function sampleFromDistribution(distributionType, additionalData) {
  let singleDraw;
  switch (distributionType) {
    case 'uniformContinuous':
      singleDraw = uniformDistribution(
        Number(additionalData.min),
        Number(additionalData.max)
      );
      break;
    case 'triangularContinuous':
      singleDraw = triangularDistribution(
        Number(additionalData.min),
        Number(additionalData.mode),
        Number(additionalData.max)
      );
      break;
    case 'normalContinuous':
      singleDraw = normalDistribution(
        Number(additionalData.mean),
        Number(additionalData.stdDev)
      );
      break;
    default:
      throw new Error(`Invalid distribution type: ${distributionType}`);
  }
  return singleDraw;
}

// eslint-disable-next-line import/prefer-default-export
export const runSimulation = (appState) => {
  return new Promise((resolve, reject) => {
    try {
      const numSimulationRuns = 500;
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
            const singleDraw = sampleFromDistribution(
              additionalData.distributionType,
              additionalData
            );

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
