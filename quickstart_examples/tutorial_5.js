// INITIALIZATION PARAMETERS
var position = [0, 0, 0];
var layerHeight = 4.8;
var radius = 40;
var nbLayers = 30;
var nbPointsInLayer = 50;

// SHAPING PARAMETERS
var linearScaleSP = linear(.00002, -.4, nbLayers, 0, "additive");
var radiusShapingParameter = sinusoidal(10, 10, 20, nbPointsInLayer, 0, "");

var scaleShapingParameter = sinusoidal(20, 40, -50, nbLayers, 0, "");
var scalingRadiusParameter = sinusoidal(.5, 20, 1, nbLayers, linearScaleSP, "multiplicative");

// GENERATE TOOLPATH
var toolpath = toolpathUnitGenerator(position, radius, layerHeight, nbLayers, nbPointsInLayer, radiusShapingParameter, scaleShapingParameter, scalingRadiusParameter, [], []);
updatePath(toolpath);
