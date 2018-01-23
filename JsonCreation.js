//Funcion para crear el json a partir de un arreglo
var estructura = [];
var jsonObj = [];
var finalJson = [];
var vistos = [];
function createJson(arreglo){
	estructura = arreglo;
	createJsonAux(arreglo);
	console.log("Este es el final ");
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
  	console.log(final);
	var blob = new Blob([final], {type: "text/plain;charset=utf-8"});
  	saveAs(blob, "NewJson"+".json");
}

function createJsonAux(arreglo){
	var json = [];
	//Creamos el nodo raiz
	for (var i = 0; i < arreglo.length; i++){
		if (isView(arreglo[i].name) == false){
			vistos.push(arreglo[i].name);
			var item = {};
			item["name"] = arreglo[i].name;
			item["Synonym"] = arreglo[i].Synonym;
			item["author"] = arreglo[i].author;
			item["record_scrutiny_date"] = arreglo[i].record_scrutiny_date;
			if ((SelectParents(arreglo[i].name).length) > 0){
				console.log("Nodo "+arreglo[i].name);
				console.log(SelectParents(arreglo[i].name));
				item["children"] = createJsonAux(SelectParents(arreglo[i].name));
			}
			json.push(item);
		}
	}
	/*var jsonObj = JSON.stringify(json);
	console.log(jsonObj);
	//var blob = new Blob([jsonObj], {type: "text/plain;charset=utf-8"});
  	//saveAs(blob, "MyFile"+".json");*/
  	
  	finalJson = json;
	return json;
}


function SelectParents(name){
	var hijos = [];
	for (var i = 0; i < estructura.length; i++){
		if (estructura[i].parent != undefined){
			if (estructura[i].parent.name == name){
				var nuevo = $.extend( {}, estructura[i]);
				hijos.push(nuevo);
			}
		}
	}
	return hijos;
}

function isView(name){
	for (var i = 0; i < vistos.length; i++){
		if (vistos[i] == name){
			return true;
		}
	}
	return false;
}