import { uniformDistribution } from './distributions/uniformContinuous';
import { triangularDistribution } from './distributions/triangularContinuous';
import { normalDistribution } from './distributions/normalContinuous';

/* Define a function to handle the distribution sampling. 
  For server-side add new imported distributions here */

// Define the number of decimals used in simulation for both inputs and outputs
const settingDecimals = 4;
const nameOfHiddenSheet = 'HiddenSimulationSheet'; // Remember to define also in sheets.js

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
  return Number(singleDraw.toFixed(settingDecimals)); // Adjust number of decimals used in simulation
}

function writeUserNote(hiddenSheet, lastColumn) {
  const userNote = [
    'Automatic note:',
    'Each row is a single simulation run or a scenario. You can use the full output data to the left for drawing desired figures or exporting it to be visualized in other software.',
    'If you need more than 1000 runs, you can rename this sheet and run a new simulation. This will keep your previous data and create a new output sheet.',
    'Additional distributions or other functionality, as well as improved analytics and visualizations are coming soon and are planned to be released in the future.',
    'If you have any feedback or would like to add something to the wishlist, please let me know by email: santeri@simdss.com',
  ];

  // Write each line of the user note to the spreadsheet, starting two cells to the right of the last column
  userNote.forEach((line, index) => {
    hiddenSheet.getRange(index + 3, lastColumn + 3).setValue(line);
  });

  return userNote;
}

function createHistogram(sheet, firstOutputColumn, startRow, title) {
  // Get the range of cells containing the data
  const dataRange = sheet.getRange(
    1,
    firstOutputColumn,
    sheet.getLastRow() - 1
  );

  // Create a new chart builder
  const chartBuilder = sheet.newChart();

  // Configure the chart
  chartBuilder
    .addRange(dataRange)
    .setChartType(Charts.ChartType.HISTOGRAM)
    .setOption('title', `Example outcome chart: ${title} histogram`)
    .setOption(
      'hAxis.title',
      'Samples from one of your outputs grouped into bins'
    )
    .setOption('vAxis.title', 'Frequency');

  // Calculate the position for the chart
  const lastColumn = sheet.getLastColumn();
  const chartColumn = lastColumn;

  // Set the position of the chart
  chartBuilder.setPosition(startRow, chartColumn, 0, 0);

  // Insert the chart into the sheet
  sheet.insertChart(chartBuilder.build());
}

// Generate output statistics
function calculateOutputStatistics(values, name) {
  values.sort((a, b) => a - b); // For median calculation
  const sum = values.reduce((a, b) => a + b, 0);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const mean = sum / values.length;
  return {
    name,
    min,
    max,
    mean,
  };
}
// eslint-disable-next-line import/prefer-default-export
export const runSimulation = (appState, numSimulationRuns) => {
  return new Promise((resolve, reject) => {
    try {
      const forecastedValuesArray = [];
      const sampledValuesArray = [];
      const headers = [];

      let hiddenSheet =
        SpreadsheetApp.getActiveSpreadsheet().getSheetByName(nameOfHiddenSheet);

      if (hiddenSheet) {
        // Before creating a new histogram, remove any existing charts
        const charts = hiddenSheet.getCharts();
        charts.forEach((chart) => {
          hiddenSheet.removeChart(chart);
        });
        hiddenSheet.clear();
      } else {
        hiddenSheet =
          SpreadsheetApp.getActiveSpreadsheet().insertSheet(nameOfHiddenSheet);
        hiddenSheet.hideSheet();
      }

      const outputVariablesForHistogram = appState.filter(
        (variable) => variable.type === 'output'
      );

      const outputValues = appState
        .filter((variable) => variable.type === 'output')
        .map((variable) => ({
          values: [],
          additionalData: variable.additionalData,
        }));

      for (let i = 0; i < numSimulationRuns; i += 1) {
        const thisRunSampledValues = [];

        let outputIndex = 0;
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
              headers.push(`Input ${cellNotation}`);
            }
          } else if (type === 'output') {
            const sheet =
              SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
            if (!sheet) {
              reject(new Error(`No sheet found with name ${sheetName}`));
              return;
            }

            let singleForecastedValue = sheet.getRange(cellNotation).getValue();

            // Adjust number of decimals for output variables
            singleForecastedValue = Number(
              singleForecastedValue.toFixed(settingDecimals)
            );

            outputValues[outputIndex].values.push(singleForecastedValue);
            outputIndex += 1;
          }
        });

        sampledValuesArray.push(thisRunSampledValues);

        const thisRunOutputValues = [];

        const outputVariables = appState.filter(
          (variable) => variable.type === 'output'
        );

        if (!hiddenSheet) {
          reject(
            new Error(
              'The simulation output presentation was interrupted because a sheet was deleted during simulation.'
            )
          );
          return;
        }

        outputVariables.forEach((outputVariable) => {
          const { cellNotation, sheetName, additionalData } = outputVariable;

          const forecastSheet =
            SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
          if (!forecastSheet) {
            reject(new Error(`No sheet found with name ${sheetName}`));
            return;
          }
          let singleForecastedValue = forecastSheet
            .getRange(cellNotation)
            .getValue();

          // Adjust number of decimals for output variables
          singleForecastedValue = Number(
            singleForecastedValue.toFixed(settingDecimals)
          );

          thisRunOutputValues.push(singleForecastedValue);
          if (i === 0) {
            headers.push(`${additionalData.name}`);
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

      const userNote = writeUserNote(hiddenSheet, headers.length);

      // Get the title of the first output
      const firstOutputTitle =
        headers[headers.length - outputVariablesForHistogram.length];

      // Get the column of the first output
      const firstOutputColumn = headers.indexOf(firstOutputTitle) + 1;

      // Calculate the starting row for the histogram
      const startRow = userNote.length + 5;

      // Create a histogram from the first output column
      createHistogram(
        hiddenSheet,
        firstOutputColumn,
        startRow,
        firstOutputTitle
      );

      const outputStatistics = outputValues.map(
        ({ values, additionalData }, index) => {
          if (!additionalData || typeof additionalData.name === 'undefined') {
            console.error(
              `Invalid additional data for output variable at index ${index}`
            );
            return null;
          }

          return calculateOutputStatistics(values, additionalData.name);
        }
      );

      resolve({
        statistics: outputStatistics,
      });
    } catch (error) {
      reject(error);
    }
  });
};
