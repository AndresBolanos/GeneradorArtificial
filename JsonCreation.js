//Funcion para crear el json a partir de un arreglo
var estructura = [];
var jsonObj = [];
var finalJson = [];
var vistos = [];
function createJson(arreglo){
	estructura = arreglo;
	createJsonAux(arreglo);
  	var jsonObj = JSON.stringify(finalJson);
  	var final = "";
  	for (var i = 0; i < jsonObj.length; i++){
  		if (i > 0 && i < jsonObj.length-1){
  			if (jsonObj[i] == ","){
  				final = final + jsonObj[i];
  				final = final + "\n";
  			}
  			else{
  				final = final + jsonObj[i];
  			}
  			
  		}
  	}
	var blob = new Blob([final], {type: "text/plain;charset=utf-8"});
  	saveAs(blob, "NewJson"+".json");
}

function createJsonAux(arreglo){
	var json = [];
	//Creamos el nodo raiz
	for (var i = 0; i < arreglo.length; i++){
		if (isView(arreglo[i].n) == false){
			vistos.push(arreglo[i].n);
			var item = {};
			item["n"] = arreglo[i].n;
			item["s"] = arreglo[i].s;
			item["a"] = arreglo[i].a;
			item["rsd"] = arreglo[i].rsd;
			if ((SelectParents(arreglo[i].n).length) > 0){
				item["c"] = createJsonAux(SelectParents(arreglo[i].n));
			}
			json.push(item);
		}
	}
	var jsonObj = JSON.stringify(json);
	console.log(jsonObj);
  	
  	finalJson = json;
	return json;
}

function SelectParents(n){
	var hijos = [];
	for (var i = 0; i < estructura.length; i++){
		if (estructura[i].parent != undefined){
			if (estructura[i].parent.n == n){
				var nuevo = $.extend( {}, estructura[i]);
				hijos.push(nuevo);
			}
		}
	}
	return hijos;
}

function isView(n){
	for (var i = 0; i < vistos.length; i++){
		if (vistos[i] == n){
			return true;
		}
	}
	return false;
}