
var nodesLeft = [];
$("#ErrorMessage").hide("slow"); 

function showname () {
    try{
        var name = document.getElementById("file1").files[0].name; 
        LoadFile(name);
    }
    catch(err){
        alert("Error, Invalid file");
    }
     
};
//Lectura de los archivos json
function LoadFile(name){
    try{
        d3.json(name, function (err, data) {

        if (err){
            alert("Error, Invalid file");
            $("#file1").val('');
        }
        else{
            var Ltree = d3.layout.treelist()
                .childIndent(20)
                .nodeHeight(20);
            function render(data, parent) {
                    var nodes = Ltree.nodes(data),
                    duration = 1000;
                    nodesLeft = nodes;
                }
                render(data, data);
            console.log(nodesLeft);
            }
        });
    }
    catch(err){
       console.log("Error, Invalid file"); 
    }

}


//Funcion de cambio de combo box
var acumulado = 0;
var splits = 0;
var merges = 0;
var renames = 0;
var moves = 0;
var news = 0;
var exclusions = 0;
var typos = 0;
function UpdateCB_Splits(nombre){
    var congruence = document.getElementById("Select_Congruence").value;
    var cambio = 0;
    if (nombre == "Splits"){
        if (document.getElementById("Select_Splts").value == "") {  
            cambio = 0;
        }
        else{
            cambio = document.getElementById("Select_Splts").value;
        }
    }
    if (nombre == "Merges"){
        if (document.getElementById("Select_Merges").value == "") {  
            cambio = 0;
        }
        else{
            cambio = document.getElementById("Select_Merges").value;
        }
    }
    if (nombre == "Moves"){
         if (document.getElementById("Select_Moves").value == "") {  
            cambio = 0;
        }
        else{
            cambio = document.getElementById("Select_Moves").value;
        }
    }
    if (nombre == "Renames"){
         if (document.getElementById("Select_Renames").value == "") {  
            cambio = 0;
        }
        else{
            cambio = document.getElementById("Select_Renames").value;
        }
    }
    if (nombre == "News"){
        if (document.getElementById("Select_News").value == "") {  
            cambio = 0;
        }
        else{
            cambio = document.getElementById("Select_News").value;
        }
    }
    if (nombre == "Exclusions"){
        if (document.getElementById("Select_Exclusions").value == "") {  
            cambio = 0;
        }
        else{
            cambio = document.getElementById("Select_Exclusions").value;
        }
    }
    if (nombre == "Typos"){
        if (document.getElementById("Select_Typos").value == "") {  
            cambio = 0;
        }
        else{
            cambio = document.getElementById("Select_Typos").value;
        }
    }


    if (nombre == "Splits"){
        console.log(cambio);
        congruence = parseInt(congruence) - (parseInt(cambio) - parseInt(splits));
        console.log(splits);
        acumulado = parseInt(acumulado) - parseInt(splits);
        splits = cambio;
        acumulado = parseInt(acumulado) + parseInt(splits);
        console.log("Acumulado "+acumulado);
    }
     if (nombre == "Merges"){
        congruence = parseInt(congruence) - (parseInt(cambio) - parseInt(merges));
        acumulado = parseInt(acumulado) - parseInt(merges);
        merges = cambio;
        acumulado = parseInt(acumulado) + parseInt(merges);
        console.log("Acumulado "+acumulado);
    }
     if (nombre == "Moves"){
        congruence = parseInt(congruence) - (parseInt(cambio) - parseInt(moves));
        acumulado = parseInt(acumulado) - parseInt(moves);
        moves = cambio;
        acumulado = parseInt(acumulado) + parseInt(moves);
        console.log("Acumulado "+acumulado);
    }
    if (nombre == "Renames"){
        congruence = parseInt(congruence) - (parseInt(cambio) - parseInt(renames));
        acumulado = parseInt(acumulado) - parseInt(renames);
        renames = cambio;
        acumulado = parseInt(acumulado) + parseInt(renames);
        console.log("Acumulado "+acumulado);
    }
    if (nombre == "News"){
        congruence = parseInt(congruence) - (parseInt(cambio) - parseInt(news));
        acumulado = parseInt(acumulado) - parseInt(news);
        news = cambio;
        acumulado = parseInt(acumulado) + parseInt(news);
        console.log("Acumulado "+acumulado);
    }
    if (nombre == "Exclusions"){
        congruence = parseInt(congruence) - (parseInt(cambio) - parseInt(exclusions));
        acumulado = parseInt(acumulado) - parseInt(exclusions);
        exclusions = cambio;
        acumulado = parseInt(acumulado) + parseInt(exclusions);
        console.log("Acumulado "+acumulado);
    }
    if (nombre == "Typos"){
        congruence = parseInt(congruence) - (parseInt(cambio) - parseInt(typos));
        acumulado = parseInt(acumulado) - parseInt(typos);
        typos = cambio;
        acumulado = parseInt(acumulado) + parseInt(typos);
        console.log("Acumulado "+acumulado);
    }

    if (acumulado <= 70){
        $("#ErrorMessage").hide("slow"); 
        console.log("Esta es la congruencia "+congruence);
        document.getElementById("Select_Congruence").value = congruence;
    }
    else{
        $("#ErrorMessage").show("slow"); 
        if (nombre == "Splits"){
            var actual = document.getElementById('Select_Splts').value;
            document.getElementById('Select_Splts').value = '';
             CalcularAcumulado();
             console.log(acumulado);
        }
        if (nombre == "Merges"){
            document.getElementById('Select_Merges').value = '';
             CalcularAcumulado();
             console.log(acumulado);
        }
        if (nombre == "Moves"){
            document.getElementById('Select_Moves').value = '';
             CalcularAcumulado();
             console.log(acumulado);
        }
        if (nombre == "Renames"){
            document.getElementById('Select_Renames').value = '';
             CalcularAcumulado();
             console.log(acumulado);
        }
        if (nombre == "News"){
            document.getElementById('Select_News').value = '';
             CalcularAcumulado();
             console.log(acumulado);
        }
        if (nombre == "Exclusions"){
            document.getElementById('Select_Exclusions').value = '';
             CalcularAcumulado();
             console.log(acumulado);
        }
        if (nombre == "Typos"){
            document.getElementById('Select_Typos').value = '';
             CalcularAcumulado();
             console.log(acumulado);
        }
    }
    
}


//Funcion para calcular el acumulado
function CalcularAcumulado(){
    splits =  document.getElementById('Select_Splts').value;
    moves =  document.getElementById('Select_Moves').value;
    renames =  document.getElementById('Select_Renames').value;
    news =  document.getElementById('Select_News').value;
    exclusions =  document.getElementById('Select_Exclusions').value;
    merges =  document.getElementById('Select_Merges').value;
    typos =  document.getElementById('Select_Typos').value;

    //Verificamos los datos
    var congruencia = 100;
    if(splits == ""){
        splits = 0;
    }
    if(moves == ""){
        moves = 0;
    }
    if(renames == ""){
        renames = 0;
    }
    if(news == ""){
        news = 0;
    }
    if(exclusions == ""){
        exclusions = 0;
    }
    if(merges == ""){
        merges = 0;
    }
    if(typos == ""){
        typos = 0;
    }
    congruencia = congruencia - (parseInt(splits)+parseInt(moves)+parseInt(renames)+parseInt(news)+parseInt(exclusions)+parseInt(merges)+parseInt(typos));
    document.getElementById("Select_Congruence").value = congruencia;
    acumulado = parseInt(splits)+parseInt(moves)+parseInt(renames)+parseInt(news)+parseInt(exclusions)+parseInt(merges)+parseInt(typos);
}