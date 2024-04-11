/* 
Persisted in Google Apps Script PropertiesService
Application state schema is being updated ongoingly, it's an array of objects:

[
  {
    "id": "id12345",
    "type": "input",
    "timestamp": "2022-03-14T15:09:26.535Z",
    "sheetName": "Sheet1",
    "cellNotation": "A1",
    "additionalData": {
      "min": "1",
      "max": "10",
      "distributionType": "uniformContinuous"
    }
  },
  {
    "id": "id67890",
    "type": "output",
    "timestamp": "2022-03-14T15:09:26.535Z",
    "sheetName": "Sheet1",
    "cellNotation": "B1",
    "additionalData": {
      "formula": "=A1*2"
    }
  },
  // More variables...
]
*/

export const saveSimData = (appState) => {
  return new Promise((resolve, reject) => {
    try {
      const documentProperties = PropertiesService.getDocumentProperties();
      documentProperties.setProperty('simData', JSON.stringify(appState));
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export const loadSimData = () => {
  return new Promise((resolve, reject) => {
    try {
      const documentProperties = PropertiesService.getDocumentProperties();
      const savedSimData = documentProperties.getProperty('simData');
      resolve(savedSimData ? JSON.parse(savedSimData) : {});
    } catch (error) {
      reject(error);
    }
  });
};
