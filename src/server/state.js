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
  const documentProperties = PropertiesService.getDocumentProperties();
  documentProperties.setProperty('simData', JSON.stringify(appState));
};

export const loadSimData = () => {
  const documentProperties = PropertiesService.getDocumentProperties();
  // documentProperties.deleteAllProperties(); USE THIS TO DELETE ALL PROPERTIES IN DEV IF NEEDED
  const savedSimData = documentProperties.getProperty('simData');
  return savedSimData ? JSON.parse(savedSimData) : {};
};
