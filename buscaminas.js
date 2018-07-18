var DIMENSION = 8;
window.onload = function(){
    tablero = document.getElementById("tablero");
    llenaTablero();
    matriz = new Array(DIMENSION);
    for(x=0; x<DIMENSION; x++){
        matriz[x] = new Array(DIMENSION);
        for(y=0; y<DIMENSION; y++){
            matriz[x][y] = new Array(2);
            matriz[x][y]['clicado'] = false;
            matriz[x][y]['tieneMina'] = false;
            matriz[x][y]['minasAdyacentes'] = 0;
        }
    }
    colocaMinas(10);
    for(y =(DIMENSION-1); y>=0; y--){
        for(x = 0; x<DIMENSION; x++){
            var celda = new Array(2);
            celda['x']=x;
            celda['y']=y;
            if(matriz[x][y]['tieneMina']==false){
                matriz[x][y]['minasAdyacentes'] = minasAdyacentes(celda);
                if(matriz[x][y]['minasAdyacentes']>0){
                    var textoCelda = document.createTextNode(matriz[x][y]['minasAdyacentes']);
                    document.getElementById(x + "-" + y).appendChild(textoCelda);
                }
            }
        }
    }
};

function llenaTablero(){
    for(i = 0; i<DIMENSION; i++){
        var nuevaFila = document.createElement("tr");
        for(j = 0; j<DIMENSION; j++){
            var nuevaCasilla = document.createElement("td");
            nuevaCasilla.id = (j) + "-" + (DIMENSION-1-i);
            //console.log(nuevaCasilla.id);
            nuevaCasilla.onclick = click;
            nuevaCasilla.oncontextmenu = click;
            nuevaFila.appendChild(nuevaCasilla);
        }
        tablero.appendChild(nuevaFila);
    }
}

function click(event){
    //console.log(event.type);
    var coordenadas = new Array(2);
    coordenadas['x'] = parseInt(event.target.id.charAt(0));  
    coordenadas['y'] = parseInt(event.target.id.charAt(2));
    console.log(coordenadas['x'] + " " + coordenadas['y']);
    celdaMatriz = matriz[coordenadas['x']][coordenadas['y']];
    if(event.type == "click"){
        event.target.style.backgroundColor = "blue";
        //celdaMatriz['clicado'] = true; mejor activar esto después de revelarla
        if(celdaMatriz['tieneMina'] == true){
            alert("BOOM");
        } else if(celdaMatriz['minasAdyacentes']>0){
            //revelar celda
            document.getElementById(coordenadas['x']+"-"+coordenadas['y']).style.backgroundColor = 'yellow';
            matriz[coordenadas['x']][coordenadas['y']]['clicado'] = true;
        } else {
            //revelar adyacentes que tengan 0 minas
            revelarAdyacentes(coordenadas);
        }
    } else if (event.type == "contextmenu"){
        event.target.style.backgroundColor = "pink";
    }
    return false;
}

function colocaMinas(numero, coordenadasInicio){
    var randX;
    var randY;
    for(var i = 0; i<numero; i++){
        randY = Math.trunc(Math.random() * DIMENSION);
        randX = Math.trunc(Math.random() * DIMENSION);
        //console.log(randX + " " + randY);
        if (matriz[randX][randY]['tieneMina'] == false){
            matriz[randX][randY]['tieneMina'] = true;
            var textoMina = document.createTextNode("M");
            document.getElementById(randX + "-" + randY).appendChild(textoMina);
        } else {
            i-=1;
        }
    }
}

//estos dos métodos se podrían juntar en uno, pasar una acción (revelar o contar minas)

function minasAdyacentes(coordenadas){
    //console.log(typeof(coordenadas['x']));
    var minas = 0;
    //console.log("---Comprobando minas adyacentes a " + coordenadas['x'] + " " + coordenadas['y']);
    for(var testY=coordenadas['y']+1; testY>=coordenadas['y']-1; testY--){
        for(var testX=coordenadas['x']-1; testX<=coordenadas['x']+1; testX++){
            //console.log("Probando en " + testX + " " + testY);
            var celdaPrueba = new Array(2);
            celdaPrueba['x'] = testX;
            celdaPrueba['y'] = testY;
            if(existeCelda(celdaPrueba)){
                if(matriz[celdaPrueba['x']][celdaPrueba['y']]['tieneMina'] == true) {
                    //console.log("mina!");
                    minas++;
                }
            }
        }
    }
    //console.log("La casilla " + coordenadas['x'] + " " + coordenadas['y'] + " tiene " + minas + " minas adyacentes");
    return minas;
}

function revelarAdyacentes(coordenadas){
    //console.log(typeof(coordenadas['x'])); DEVUELVE STRING!!
    for(var revelarY=parseInt(coordenadas['y'])+1; revelarY>=parseInt(coordenadas['y'])-1; revelarY--){
        for(var revelarX=parseInt(coordenadas['x'])-1; revelarX<=parseInt(coordenadas['x'])+1; revelarX++){
            var celdaPruebaRevelar = new Array(2);
            celdaPruebaRevelar['x'] = revelarX;
            celdaPruebaRevelar['y'] = revelarY;
            console.log("Probando adyacentes a " + coordenadas['x'] + " " + coordenadas['y'] + ": " + revelarX + " " + revelarY);
            if(existeCelda(celdaPruebaRevelar) && matriz[celdaPruebaRevelar['x']][celdaPruebaRevelar['y']]['clicado'] == false){
                console.log("existe la celda " + celdaPruebaRevelar['x'] + " " +  celdaPruebaRevelar['y']);
                if(matriz[celdaPruebaRevelar['x']][celdaPruebaRevelar['y']]['minasAdyacentes'] == 0){
                    matriz[celdaPruebaRevelar['x']][celdaPruebaRevelar['y']]['clicado'] = true;
                    document.getElementById(revelarX + "-" + revelarY).style.backgroundColor = 'yellow';
                    revelarAdyacentes(celdaPruebaRevelar);
                } else if (matriz[celdaPruebaRevelar['x']][celdaPruebaRevelar['y']]['minasAdyacentes'] >0){
                    matriz[celdaPruebaRevelar['x']][celdaPruebaRevelar['y']]['clicado'] = true;
                    document.getElementById(revelarX + "-" + revelarY).style.backgroundColor = 'yellow';
                }
            }
        }
    }
}

function existeCelda(coordenadas){
    if(coordenadas['x']>=0 && coordenadas['x']<DIMENSION && coordenadas['y']>=0 && coordenadas['y']<DIMENSION){
        return true;
    } else {
        //console.log(coordenadas['x'] + " " + coordenadas['y'] + " no existe");
        return false;
    }
}