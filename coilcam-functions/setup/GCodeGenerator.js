//Helper functions for generateGCode
function extrude(nozzleDiameter, layerHeight, segmentLen, thickness){
    let points = [];
    let extrusion_multiplier = (nozzleDiameter/1.91)**2; //extrusion multiplier for correct filament thickness
    let totalExtruded = 0;
    let thicknessConstant = 0.25; //thickness is normalized between -1 and 1 
    points.push(0);
    console.log("T", thickness);
    for(var i = 0; i < segmentLen.length; i++){
        var newPoint = (segmentLen[i]*layerHeight/nozzleDiameter) * (4/Math.PI + layerHeight/nozzleDiameter);
        // newPoint += (newPoint * thickness[i] * thicknessConstant);
        points.push(((newPoint + totalExtruded) * extrusion_multiplier).toFixed(3));
        totalExtruded += newPoint;
    }
    // E = SegmentLen*LayerHeight/NozzleWidth * (4/math.pi + LayerHeight/NozzleWidth)
    return points;
}

let round2pt = (value) => Math.floor(value*100)/100.0;
let euclideanDist = (p1, p2) => Math.sqrt((p1[0]-p2[0])**2 + (p1[1]-p2[1])**2 + (p1[2]-p2[2])**2);


//Main functions to generate GCode, calculate clay height, calculate number of tubes
function generateGCode(path, nozzleDiameter, printSpeed){ //main function
    let layerHeight = path[2]; //change this
    let printSpeeds = [10000]; //First move should be 10000
    let segmentLen = [];
    
    for(var i = 0; i < path.length - 4; i+=4){
        segmentLen.push(euclideanDist(path.slice(i, i+4), path.slice(i+4, i+8))); //path is array of #s, not points
        printSpeeds.push(Math.floor(printSpeed*60));
    };
    let thicknesses = path.filter((_, index) => (index + 1) % 4 === 0);
    console.log(thicknesses.length);
    let extr = extrude(nozzleDiameter, layerHeight, segmentLen, thicknesses);
    
    let startGcodePrefix = ";;; START GCODE ;;;\nM82 ;absolute extrusion mode\nG28 ;Home\nG1 X207.5 Y202.5 Z20 F10000 ;Move X and Y to center, Z to 20mm high\nG1 E2000 F20000 ; !!Prime Extruder\nG92 E0\n;;; ======\n";
    let endGcodePostfix = ";;; === END GCODE ===\nM83 ;Set to Relative Extrusion Mode\nG28 Z ;Home Z\n; === DEPRESSURIZE ===\nG91\nG91\nG1 E-200 F4000\nG90\nG90\n";
    let gcode = startGcodePrefix;
    let ctr = 0;
    for(var i = 0; i < (path.length); i+=4){ //path is an array of ints, not represented as tuples
        x = round2pt(path[i]);
        y = round2pt(path[i+1]);
        z = round2pt(path[i+2]);
        gcode += "G1 F" + printSpeeds[ctr]+ " X"+ x +" Y" + y + " Z" + z + " E" + extr[ctr] +"\n";
        ctr++; 
    }
    gcode += endGcodePostfix;
    return gcode;
}

function downloadGCode(gcode_string, fileName) { //pass in gcode string, filename
    const blob = new Blob([gcode_string], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName; 
    link.style.display = 'none';
  
    document.body.appendChild(link);
    link.click();
  
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

//Not fully implemented in Rhino, may not be correct
function getNumTubes(path, nozzleDiameter, layerHeight){ 
    let segmentLen = [];
    for(var i = 1; i < len(path); i++){
        segmentLen.push(euclideanDist(path[i], path[i-1]));
    }    
    let extrusions = extrude(nozzleDiameter, layerHeight, segmentLen);
    let totalExtrusion = extrusions[extrusions.length - 1];
    return ((nozzleDiameter/2)^2*totalExtrusion)/((95.5/2)^2)/430; //multiplier from original gcode
}

// //Stub: using preset values
// function calculateClayHeight(path, preset){ 
//     return calculateClayHeight(path, preset.nozzleDiameter, preset.layerHeight);
// }

// //Stub: not fully implemented in Rhino, not sure what the value of multiplier should be
// function calculateClayHeight(nozzleDiameter, path, layerHeight, extrusionMultiplier){ 
//     extrusionMultiplier = 0; //Extrusion multiplier exists for Super Potterbot but is unused
//     return getNumTubes(nozzleDiameter, path, layerHeight)*extrusionMultiplier;
// }