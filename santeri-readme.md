- When implementing new distributions, there are three things to keep in mind.
    1. Make sure the backend can accept the distributions and relevant functionality is implemented for sampling, especially in simulate.js
    2. Make sure the front end can handle receiving the data from the user in DistrSelection, InputPane and in the actual distribution's own component handling the input collection. 
    3. Make sure the front end validates the inputs with this logic being implemented in the inputpane component.