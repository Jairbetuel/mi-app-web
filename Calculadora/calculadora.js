function calcular(operacion){

let a = parseFloat(document.getElementById("a").value);
let b = parseFloat(document.getElementById("b").value);

let resultado;

if(operacion == "+"){
resultado = a + b;
}

if(operacion == "-"){
resultado = a - b;
}

if(operacion == "*"){
resultado = a * b;
}

if(operacion == "/"){
resultado = a / b;
}

document.getElementById("resultado").innerText = resultado;

}