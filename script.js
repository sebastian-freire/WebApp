const operation = document.getElementById("operation");

const button1 = document.getElementById("option1");
const button2 = document.getElementById("option2");
const button3 = document.getElementById("option3");
const button4 = document.getElementById("option4");

document.querySelectorAll("button").forEach((button) => {
  // button.id.innerHTML = `hola${button.id}`;
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

function main() {
  const num1 = numeroAleatorio();
  const num2 = numeroAleatorio();
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
      respuestaCorrecta = num1 / num2;
      operador = "/";
      break;
    case 3: //multiplicacion
      respuestaCorrecta = num1 * num2;
      operador = "*";
      break;
  }

  respuestaCorrecta = Math.floor(respuestaCorrecta);
  arrayValores.push(respuestaCorrecta);
  arrayValores.push(generarNumeroSimilar(respuestaCorrecta, 25));
  arrayValores.push(generarNumeroSimilar(respuestaCorrecta, 25));
  arrayValores.push(generarNumeroSimilar(respuestaCorrecta, 25));

  let nuevoArray = seleccionarElementosAleatorios(
    arrayValores,
    arrayValores.length
  );
  console.log(respuestaCorrecta);
  console.log(nuevoArray);
  operation.innerHTML = `${num1} ${operador} ${num2}:`;
  button1.innerHTML = nuevoArray[0];
  button2.innerHTML = nuevoArray[1];
  button3.innerHTML = nuevoArray[2];
  button4.innerHTML = nuevoArray[3];
}

function generarNumeroSimilar(base, variacion) {
  return Math.floor(base + (Math.random() * (variacion * 2) - variacion));
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

const respuesta = document.getElementById("respuesta");

function correcto() {
  main();
  return (respuesta.textContent = "Respuesta Correcta ✅");
}

function incorrecto() {
  main();
  return (respuesta.textContent = "Respuesta Incorrecta ❌");
}

main();
