let tamaño = 300;

function aumentar(){

tamaño = tamaño + 40;

document.getElementById("imagenJuego").style.width = tamaño + "px";

}

function disminuir(){

tamaño = tamaño - 40;

document.getElementById("imagenJuego").style.width = tamaño + "px";

}