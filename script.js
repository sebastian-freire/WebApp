const operation = document.getElementById("operation");

const button1 = document.getElementById("option1");
const button2 = document.getElementById("option2");
const button3 = document.getElementById("option3");
const button4 = document.getElementById("option4");

const respuesta = document.getElementById("respuesta");
const contador = document.getElementById("contador");

document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", (event) => {
    console.log(`Hiciste clic en el botón ${button.textContent} ${button.id}`);
    if (button.textContent == respuestaCorrecta) {
      correcto();
    } else {
      incorrecto();
    }
  });
});

let respuestaCorrecta = 0;
let contadorRespuestas = 0;

function main() {
  let num1 = numeroAleatorio();
  let num2 = numeroAleatorio();
  let operador = "";
  let arrayValores = [];

  switch (operadorAleatorio()) {
    case 0: //suma
      respuestaCorrecta = num1 + num2;
      operador = "+";
      break;
    case 1: //resta
      respuestaCorrecta = num1 - num2;
      operador = "-";
      break;
    case 2: //division
      if (num1 < num2) {
        [num1, num2] = [num2, num1];
      }
      respuestaCorrecta = num1 / num2;
      operador = "/";
      break;
    case 3: //multiplicacion
      respuestaCorrecta = num1 * num2;
      operador = "x";
      break;
  }

  respuestaCorrecta = Math.floor(respuestaCorrecta);
  arrayValores.push(respuestaCorrecta);
  arrayValores.push(generarNumeroSimilar(respuestaCorrecta, 25, arrayValores));
  arrayValores.push(generarNumeroSimilar(respuestaCorrecta, 25, arrayValores));
  arrayValores.push(generarNumeroSimilar(respuestaCorrecta, 25, arrayValores));

  let nuevoArray = seleccionarElementosAleatorios(
    arrayValores,
    arrayValores.length
  );
  console.log(respuestaCorrecta);
  console.log(nuevoArray);
  operation.innerHTML = `${num1} <span> ${operador} </span> ${num2}:`;
  button1.textContent = nuevoArray[0];
  button2.textContent = nuevoArray[1];
  button3.textContent = nuevoArray[2];
  button4.textContent = nuevoArray[3];
}

function generarNumeroSimilar(base, variacion, array) {
  let numDev = Math.floor(base + (Math.random() * (variacion * 2) - variacion));
  for (elemento of array) {
    if (numDev === elemento) {
      //Funcion recursiva que se llama si el numero generado ya estaba en la lista
      return generarNumeroSimilar(base, variacion, array);
    }
  }
  return numDev;
}

function numeroAleatorio() {
  return Math.floor(Math.random() * (1000 - 1 + 1)) + 1;
}

function seleccionarElementosAleatorios(arr, cantidad) {
  return arr.sort(() => Math.random() - 0.5).slice(0, cantidad);
}

function operadorAleatorio() {
  const num = Math.floor(Math.random() * 4);
  return num;
}

function correcto() {
  main();
  contadorRespuestas++;
  contador.textContent = `Cantidad de respuestas correctas: ${contadorRespuestas}`;
  return (respuesta.textContent = "Respuesta Correcta ✅");
}

function incorrecto() {
  main();
  contador.textContent = `Cantidad de respuestas correctas: ${contadorRespuestas}`;
  return (respuesta.textContent = "Respuesta Incorrecta ❌");
}

main();
