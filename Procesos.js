
var newTaxonomy = [];
var sheetPositions = [];
var disponibles = 0;
var nombresPadres = [];
var toDelete = [];
//Funcion para copar la taxonomia
function CopyTaxonomy(){
	newTaxonomy = nodesLeft;
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
	GenerateMerges(valueMerges);
	GenerateMoves(valueMoves);
	GenerateRenanes(valueRenames);
	GenerateNews(valueNews);
	GenerateExclusions(valueExclusions);
	

	toDeleteNodes();
	//Procedimiento para agregar los nuevos nodos al arreglo anterior
	for (var i = 0; i < nuevosNodos.length; i++){
		newTaxonomy.push(nuevosNodos[i]);
	}
	console.log(newTaxonomy[0].c[0]);
	//console.log("Esta es la cantidad final "+newTaxonomy.length);
	createJson(newTaxonomy);
	//createJson(nodesLeft);
}


//Funcion para verificar los nodos que no tienen hijos
var padres = [];
function getPadres(nombre, nodos){
	padres = [];
	for (var i = 0; i < nodos.length; i++){
			if (nodos[i].n == nombre){
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
		nombresPadres.push(nodo.parent.n);
		getPadreName(nodo.parent);
		getPadresAux(nodo.parent);
	}
}

function getPadreName(nodo){
	padres.push(nodo.n);
}

//Funcion para guardar el nombre de todos los papas en un arreglo
function SaveParentNames(){
	for(var i = 0; i < newTaxonomy.length; i++){
		if(newTaxonomy[i].parent != undefined){
			if ((searchParentName(newTaxonomy[i].parent.n) == false) && newTaxonomy[i].n.indexOf(' ') != -1){
				nombresPadres.push(newTaxonomy[i].parent.n);
			}
		}
	}
}

//Funcion para verificar si un nombre de padre ya esta en el arreglo
function searchParentName(n){
	for(var i = 0; i < nombresPadres.length; i++){
		if (nombresPadres[i] == n){
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
		if (newTaxonomy[i].c == null){
			if(newTaxonomy[i].n.indexOf(' ') != -1){ //Verifica si es un nombre compuesto
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
		if (nodes[i].n != value){
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
			if (toDelete[j] == newTaxonomy[i].n){
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
	console.log("Porcentaje de splits "+porcentajeSplits);
	while(porcentajeSplits > 0){

		var padre = false;
		if (porcentajeSplits%2 == 0){
			padre = true;
		}
		var posicion = sheetPositions[(Math.floor(Math.random() * (sheetPositions.length-1 - 0 + 1)) + 0)];
		setSplits(newTaxonomy[posicion],padre);
		DeleteSheetPosition(posicion);
		disponibles--;
		porcentajeSplits--;
	}
}

function setSplits(nodo,padre){
	SaveParentNames();
	var nombre = nodo.n;
	nodo.s.push(nombre);
	var random = Math.floor((Math.random() * 3) + 2); //random entre 2 y 4
	for (var i = 0; i <= random; i++){ 
		var nuevo = $.extend( {}, nodo );
		nuevo.n = nombre+".sp"+i;
		if (padre == false){
			console.log("////////////////////////////////////");
			var nuevoNombre = searchParentMoves(nodo.parent, nodo.parent.parent.parent.n);
			
			/*
			console.log("Nombre del nodo "+nombre);
			console.log("Nombre del bis "+nodo.parent.parent.parent.n);
			*/

			var padreNuevo = $.extend( {},searchNode(nuevoNombre));
			nuevo.n = nuevo.n.replace(nodo.parent.n, nuevoNombre);
			nuevo.parent = padreNuevo;
		}
		nuevo.s = nodo.s;
		nuevosNodos.push(nuevo);
	}
	toDelete.push(nodo.n);
}

//////////////////////////////////////////////////////////////////////////////////////
//Funciones para generar moves
 
//Funcion para buscar un pare diferente
function searchParentMoves(parent, family){
	var posNombre = Math.floor(Math.random() * (nombresPadres.length-1 - 0 + 1)) + 0;
	/*console.log("Nombre del padre "+ parent.n);
	console.log("Nombre de la familia "+family);
	console.log("Padre seleccionado "+nombresPadres[posNombre]);
	search_family(searchNode(nombresPadres[posNombre]),family);*/
	if (parent.n != nombresPadres[posNombre] && search_family(searchNode(nombresPadres[posNombre]),family)){
		return nombresPadres[posNombre];
	}
	else{
		return searchParentMoves(parent,family);
	}
}

function search_family(parent, family){
	if (parent == undefined || parent == null){
		return false;
	}
	else if (parent.n == family){
		return true;
	}
	else{
		 return search_family(parent.parent, family);
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
	var nombre = nodo.n;
	var nuevoNombre = searchParentMoves(nodo.parent.n, nodo.parent.parent.parent.n);
	var nuevo = $.extend( {}, nodo );
	nuevo.s.push(nombre);
	nuevo.n = nuevo.n.replace(nodo.parent, nuevoNombre);
	var padreNuevo = $.extend( {},searchNode(nuevoNombre));
	nuevo.parent = padreNuevo;
	nuevo.n = nuevo.n+" m";
	nuevosNodos.push(nuevo);
	toDelete.push(nodo.n);
}

function searchNode(n){
	for (var i = 0; i < nodesLeft.length; i++){
		if (nodesLeft[i].n == n){
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
	var nombre = nodo.n;
	nodo.s.push(nombre);
	nombre = nombre+" r";
	var nuevo = $.extend( {}, nodo );
	nuevo.n = nombre;
	nuevosNodos.push(nuevo);
	toDelete.push(nodo.n);
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
		var posicion = sheetPositions[(Math.floor(Math.random() * (sheetPositions.length-1 - 0 + 1)) + 0)];
		DeleteSheetPosition(posicion);
		disponibles--;
		porcentajeExclusions--;
		toDelete.push(newTaxonomy[posicion].n);
	}
}

function setNews(nodo,pos,nuevo){
	//Definimos al nuevo padre
	var indexPadre = Math.floor(Math.random() * (nombresPadres.length-1 - 0 + 1)) + 0;
	var nombrePadre = nombresPadres[indexPadre];

	//Definimos el autor
	var a = "System";

	//Definimos la fecha de creacion
	var date = new Date();
	date = date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();

	//Definimos los sinonimos
	var s = [];

	//Hacemos la copia del nodo
	var nuevo = $.extend( {}, nodo );
	nuevo.n = nodo.parent.n+" n";
	nuevo.a = a;
	nuevo.rsd = date;
	nuevo.s = s;
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
		if (nodosRetorno.length >= 2 ){
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
		if (newTaxonomy[sheetPositions[i]].parent.n == node.parent.n){
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
	var nombre = nodo.n;
	for (var i = 0; i < nodos.length; i++){
		nodo.s.push(nodos[i].n);
		toDelete.push(nodos[i].n);	
	}
	nodo.s.push(nodo.n);
	var nuevo = $.extend( {}, nodo );
	nuevo.n = nombre;
	nuevo.s = nodo.s;
	nuevosNodos.push(nuevo);
	toDelete.push(nodo.n);
}