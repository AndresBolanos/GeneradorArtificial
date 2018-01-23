var newTaxonomy = [];
var sheetPositions = [];
var disponibles = 0;
var nombresPadres = [];
var toDelete = [];
//Funcion para copar la taxonomia
function CopyTaxonomy(){
	newTaxonomy = nodesLeft;
	console.log("Cantidad Inicial "+newTaxonomy.length);
	//Obtenemos los valores de los porcentajes
	var valueSplits =  document.getElementById('Select_Splts').value;
	var valueMoves =  document.getElementById('Select_Moves').value;
	var valueRenames =  document.getElementById('Select_Renames').value;
	var valueNews =  document.getElementById('Select_News').value;
	var valueExclusions =  document.getElementById('Select_Exclusions').value;
	var valueMerges =  document.getElementById('Select_Merges').value;

	//Verificamos los datos
	if(valueSplits == ""){
		valueSplits = 0;
	}
	if(valueMoves == ""){
		valueMoves = 0;
	}
	if(valueRenames == ""){
		valueRenames = 0;
	}
	if(valueNews == ""){
		valueNews = 0;
	}
	if(valueExclusions == ""){
		valueExclusions = 0;
	}
	if(valueMerges == ""){
		valueMerges = 0;
	}
	valueMerges = valueMerges * 0.01;
	valueSplits = valueSplits * 0.01;
	valueMoves = valueMoves * 0.01;
	valueRenames = valueRenames * 0.01;
	valueNews = valueNews * 0.01;
	valueExclusions = valueExclusions * 0.01;

	getSheetPosition();
	//DeleteSheetPosition(10);

	disponibles = sheetPositions.length;

	GenerateSplits(valueSplits); //Funcion para generar la cantidad de splits de acuerdo al porcentaje
	GenerateMoves(valueMoves);
	GenerateRenanes(valueRenames);
	GenerateNews(valueNews);
	GenerateExclusions(valueExclusions);
	GenerateMerges(valueMerges);

	toDeleteNodes();
	//Procedimiento para agregar los nuevos nodos al arreglo anterior
	for (var i = 0; i < nuevosNodos.length; i++){
		newTaxonomy.push(nuevosNodos[i]);
	}
	
	console.log("Esta es la cantidad final "+newTaxonomy.length);
	console.log(newTaxonomy);
	createJson(newTaxonomy);
	//createJson(nodesLeft);
}


//Funcion para verificar los nodos que no tienen hijos
var padres = [];
function getPadres(nombre, nodos){
	padres = [];
	for (var i = 0; i < nodos.length; i++){
			if (nodos[i].name == nombre){
				getPadresAux(nodos[i]);
				return padres;
			}
	}
}

function getPadresAux(nodo){
	if(nodo.parent == undefined){
		return;
	}
	else{
		nombresPadres.push(nodo.parent.name);
		getPadreName(nodo.parent);
		getPadresAux(nodo.parent);
	}
}

function getPadreName(nodo){
	padres.push(nodo.name);
}

//Funcion para guardar el nombre de todos los papas en un arreglo
function SaveParentNames(){
	for(var i = 0; i < newTaxonomy.length; i++){
		if(newTaxonomy[i].parent != undefined){
			if ((searchParentName(newTaxonomy[i].parent.name) == false) && newTaxonomy[i].name.indexOf(' ') != -1){
				nombresPadres.push(newTaxonomy[i].parent.name);
			}
		}
	}
}

//Funcion para verificar si un nombre de padre ya esta en el arreglo
function searchParentName(name){
	for(var i = 0; i < nombresPadres.length; i++){
		if (nombresPadres[i] == name){
			return true
		}
	}
	return false;
}
//Terminan las funciones para obtener el padre

/////////////////////////////////////////////////////////////////////////////
//Funcion para guardar las posiciones de los q son hojas
function getSheetPosition(){
	for (var i = 0; i < newTaxonomy.length; i++){
		if (newTaxonomy[i].children == null){
			if(newTaxonomy[i].name.indexOf(' ') != -1){ //Verifica si es un nombre compuesto
				sheetPositions.push(i);
			}
		}
	}
}

////////////////////////////////////////////////////////////////////////////
//Funcion para remover un elemento de las posiciones

function DeleteSheetPosition(value){
	var nuevoaareglo = [];
	for (var i = 0; i < sheetPositions.length; i++){
		if (sheetPositions[i] != value){
			nuevoaareglo.push(sheetPositions[i]);
		}
	}
	sheetPositions = nuevoaareglo;
}

//Funcion para eliminar un elemento de la taxonomia de la izquierda
function DeleteNodeTaxnomy(nodes,value){
	var nuevoarreglo = [];
	for (var i = 0; i < nodes.length; i++){
		if (nodes[i].name != value){
			nuevoarreglo.push(nodes[i]);
		}
	}
	nodes = nuevoarreglo;
	return nodes
}

function toDeleteNodes(){
	var nodosNuevos = [];
	for (var i = 0; i < newTaxonomy.length; i++){
		var esta = false;
		for (var j = 0; j < toDelete.length; j++){
			if (toDelete[j] == newTaxonomy[i].name){
				esta = true;
			}
		}
		if (esta == false){
			nodosNuevos.push(newTaxonomy[i]);
		}
	}
	newTaxonomy = nodosNuevos;
}
//////////////////////////////////////////////////////////////////////////////////////
//////////////////////FUNCIONES PARA GENERAR LOS TIPOS /////////////////////////////////////////

var nuevosNodos = [];

//Funciones para generar splits

function GenerateSplits(valueSplits){
	var porcentajeSplits = Math.round(disponibles * valueSplits);
	while(porcentajeSplits > 0){
		var posicion = sheetPositions[(Math.floor(Math.random() * (sheetPositions.length-1 - 0 + 1)) + 0)];
		setSplits(newTaxonomy[posicion]);
		DeleteSheetPosition(posicion);
		disponibles--;
		porcentajeSplits--;
	}
}

function setSplits(nodo){
	var nombre = nodo.name;
	nodo.Synonym.push(nombre);
	var random = Math.floor((Math.random() * 3) + 2); //random entre 2 y 4
	for (var i = 0; i < random; i++){ 
		var nuevo = $.extend( {}, nodo );
		nuevo.name = nombre+"_"+i;
		nuevo.Synonym = nodo.Synonym;
		nuevosNodos.push(nuevo);
	}
	toDelete.push(nodo.name);
}

//////////////////////////////////////////////////////////////////////////////////////
//Funciones para generar moves
 
//Funcion para buscar un pare diferente
function searchParentMoves(parent){
	SaveParentNames();
	var posNombre = Math.floor(Math.random() * (nombresPadres.length-1 - 0 + 1)) + 0;
	if (parent != nombresPadres[posNombre]){
		return nombresPadres[posNombre];
	}
	else{
		searchParentMoves(parent);
	}
}

function GenerateMoves(valueMoves){
	var porcentajeMoves = Math.round(disponibles * valueMoves);
	while(porcentajeMoves > 0){
		var posicion = sheetPositions[(Math.floor(Math.random() * (sheetPositions.length-1 - 0 + 1)) + 0)];
		setMoves(newTaxonomy[posicion]);
		DeleteSheetPosition(posicion);
		disponibles--;
		porcentajeMoves--;
	}
}

function setMoves(nodo){
	var nombre = nodo.name;
	var nuevoNombre = searchParentMoves(nodo.parent.name);
	var nuevo = $.extend( {}, nodo );
	nuevo.Synonym.push(nombre);
	nuevo.name = nuevo.name.replace(nodo.parent.name, nuevoNombre);
	var padreNuevo = $.extend( {},searchNode(nuevoNombre));
	nuevo.parent = padreNuevo;
	nuevosNodos.push(nuevo);
	toDelete.push(nodo.name);
}

function searchNode(name){
	for (var i = 0; i < nodesLeft.length; i++){
		if (nodesLeft[i].name == name){
			return nodesLeft[i];
		}
	}
	return null;
}

//////////////////////////////////////////////////////////////////////////////////////
//Funciones para generar Renames

function GenerateRenanes(valueRenames){
	var porcentajeRenames = Math.round(disponibles * valueRenames);
	while(porcentajeRenames > 0){

		var posicion = sheetPositions[(Math.floor(Math.random() * (sheetPositions.length-1 - 0 + 1)) + 0)];
		setRenames(newTaxonomy[posicion]); 

		DeleteSheetPosition(posicion);
		disponibles--;
		porcentajeRenames--;
	}
}

function setRenames(nodo){
	var nombre = nodo.name;
	nodo.Synonym.push(nombre);
	nombre = nombre+"_R";
	var nuevo = $.extend( {}, nodo );
	nuevo.name = nombre;
	nuevosNodos.push(nuevo);
	toDelete.push(nodo.name);
}

//////////////////////////////////////////////////////////////////////////////////////
//Funciones para generar News y Exclusions

function GenerateNews(valueNews){
	var porcentajeNews = Math.round(disponibles * valueNews);
	while(porcentajeNews > 0){
		var posicion = sheetPositions[(Math.floor(Math.random() * (sheetPositions.length-1 - 0 + 1)) + 0)];
		setNews(newTaxonomy[posicion],posicion,true);
		DeleteSheetPosition(posicion);
		disponibles--;
		porcentajeNews--;
	}
}

function GenerateExclusions(valueExclusions){
	var porcentajeExclusions = Math.round(disponibles * valueExclusions);
	while(porcentajeExclusions > 0){
		console.log("Oraleee pasaaa");
		var posicion = sheetPositions[(Math.floor(Math.random() * (sheetPositions.length-1 - 0 + 1)) + 0)];
		DeleteSheetPosition(posicion);
		disponibles--;
		porcentajeExclusions--;
		toDelete.push(newTaxonomy[posicion].name);
	}
}

function setNews(nodo,pos,nuevo){
	//Definimos al nuevo padre
	var indexPadre = Math.floor(Math.random() * (nombresPadres.length-1 - 0 + 1)) + 0;
	var nombrePadre = nombresPadres[indexPadre];

	//Definimos el autor
	var author = "System";

	//Definimos la fecha de creacion
	var date = new Date();
	date = date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();

	//Definimos los sinonimos
	var synonym = [];

	//Hacemos la copia del nodo
	var nuevo = $.extend( {}, nodo );
	nuevo.name = nodo.parent.name+" nodo_N";
	nuevo.author = author;
	nuevo.record_scrutiny_date = date;
	nuevo.Synonym = synonym;
	if (nuevo == true){
		nuevosNodos.push(nuevo); //Lo agregamos a la nueva lista de nodos
	}
	else{
		newTaxonomy.push(nuevo);
	}
}


//////////////////////////////////////////////////////////////////////////////////////
//Funciones para generar Merges

function GenerateMerges(valueMerges){
	var porcentajeMerges = Math.round(disponibles * valueMerges);
	var nodosMerges = [];
	while(porcentajeMerges > 0){
		var posicion = sheetPositions[(Math.floor(Math.random() * (sheetPositions.length-1 - 0 + 1)) + 0)];
		DeleteSheetPosition(posicion);
		var nodosRetorno = SearchMerges(newTaxonomy[posicion]);
		if (nodosRetorno.length >= 1){
			nodosMerges.push(newTaxonomy[posicion]);
			setMerges(newTaxonomy[posicion],nodosRetorno);
		}

		else{
			sheetPositions.push(posicion);
		}
		disponibles--;
		porcentajeMerges--;
	}
}

function SearchMerges (node){
	var cont = 1;
	var nodosRetorno = [];
	for (var i = 0; i < sheetPositions.length; i++){
		if (newTaxonomy[sheetPositions[i]].parent.name == node.parent.name){
			nodosRetorno.push(newTaxonomy[sheetPositions[i]]);
			DeleteSheetPosition(sheetPositions[i]);
			if (nodosRetorno.length >= 3){
				return nodosRetorno;
			}
		}
	}
	return nodosRetorno;
}

function setMerges(nodo,nodos){
	var nombre = nodo.name;
	for (var i = 0; i < nodos.length; i++){
		nodo.Synonym.push(nodos[i].name);
		toDelete.push(nodos[i].name);	
	}
	nodo.Synonym.push(nodo.name);
	var nuevo = $.extend( {}, nodo );
	nuevo.name = nombre;
	nuevo.Synonym = nodo.Synonym;
	nuevosNodos.push(nuevo);
	toDelete.push(nodo.name);
}