// Persisted in Google Apps Script PropertiesService
// Application state schema as updated ongoingly, it's an array of objects:
/*
[
  { 
    "A1": {
      "type": "input",
      "timestamp": "2022-03-14T15:09:26.535Z",
      "additionalData": {
        "min": "1",
        "max": "10"
      
      } <- Object
      // More properties...
    } 
  },
  // More inputs...
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
