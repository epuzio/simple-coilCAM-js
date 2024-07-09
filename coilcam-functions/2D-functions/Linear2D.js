function linear2D(amplitudeX1, offsetX1, amplitudeX2, offsetX2, nbPoints, values0x, values0y, mode){
    let pointsX = [];
    let pointsY = [];

    if(offsetX1.length === 0){
        offsetX1 = new Array(nbPoints).fill(0);
    } else if(!Array.isArray(offsetX1)){
        offsetX1 = new Array(nbPoints).fill(offsetX1);
    } else if(offsetX1.length !== nbPoints){
        throw new Error("Length of offset in Linear2D must be 0 or 1 or equal to nbPoints");
    }

    if(offsetX2.length === 0){
        offsetX2 = new Array(nbPoints).fill(0);
    } else if(!Array.isArray(offsetX2)){
        offsetX2 = new Array(nbPoints).fill(offsetX2);
    } else if(offsetX2.length !== nbPoints){
        throw new Error("Length of offsetX2 in Linear2D must be 0 or 1 or equal to nbPoints");
    }

    if(values0x.length === 0){
        values0x = new Array(nbPoints).fill(0);
    } else if(!Array.isArray(values0x)){
        values0x = new Array(nbPoints).fill(values0x);
    } else if(values0x.length !== nbPoints){
        throw new Error("Length of values0x in Linear2D must be 0 or 1 or equal to nbPoints");
    }

    if(values0y.length === 0){
        values0y = new Array(nbPoints).fill(0);
    } else if(!Array.isArray(values0y)){
        values0y = new Array(nbPoints).fill(values0y);
    } else if(values0y.length !== nbPoints){
        throw new Error("Length of values0y in Sinusoidal2D must be 0 or 1 or equal to nbPoints");
    }

    if(mode != "additive" || mode != "multiplicative"){ mode = "additive"; }
    for (let i = 0; i < nbPoints; i++){
        if (mode == "additive" || mode == ""){
            pointsX.push((amplitudeX1 * i + offsetX1[i]) + values0x[i]);
            pointsY.push((amplitudeX2 * i + offsetX2[i]) + values0y[i]);
        } else if (mode == "multiplicative"){
            pointsX.push((amplitudeX1 * i + offsetX1[i]) * values0x[i]);
            pointsY.push((amplitudeX2 * i + offsetX2[i]) * values0y[i]);
        }
    }
    return new Array(pointsX, pointsY);
}