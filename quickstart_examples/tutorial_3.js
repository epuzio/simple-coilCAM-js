// INITIALIZATION PARAMETERS
var position = [0, 0, 0];
var layerHeight = 4.8;
var radius = 40;
var nbLayers = 30;
var nbPointsInLayer = 50;

// SHAPING PARAMETERS
var radiusShapingParameter = sinusoidal(10, 10, 20, nbPointsInLayer, 0, "");
var scaleShapingParameter = sinusoidal(15, 50, 20, nbLayers, 0, "");

// GENERATE TOOLPATH
var toolpath = toolpathUnitGenerator(position, radius, layerHeight, nbLayers, nbPointsInLayer, radiusShapingParameter, scaleShapingParameter, [], [], []);
updatePath(toolpath);
