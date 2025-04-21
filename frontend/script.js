//json-server --watch datos.json --port 3000

const operation = document.getElementById("operation");

const button1 = document.getElementById("option1");
const button2 = document.getElementById("option2");
const button3 = document.getElementById("option3");
const button4 = document.getElementById("option4");

const respuesta = document.getElementById("respuesta");
const contador = document.getElementById("contador");

const contenedor = document.getElementById("contenedor4");

let objetoJson = {
  cuenta: "",
  resultado: "",
  color: ""
};

document.querySelectorAll(".boton-respuesta").forEach((button) => {
  button.addEventListener("click", () => {
    console.log(`Hiciste clic en el botón ${button.textContent} ${button.id}`);
    objetoJson.resultado = button.textContent;

    if (button.textContent == respuestaCorrecta) {
      bool = true;
      objetoJson.color = "Green";
    } else {
      bool = false;
      objetoJson.color = "Red";
    }

    respuestaBoton(bool);
    agregarAJson(objetoJson);
    leerDatosDirectos(objetoJson);
    main();
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

  objetoJson.cuenta = `${num1} ${operador} ${num2}`;

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

function respuestaBoton(resultado) {
  if (resultado) {
    contadorRespuestas++;
    contador.textContent = `Cantidad de respuestas correctas de la sesión: ${contadorRespuestas}`;
    return (respuesta.textContent = "Respuesta Correcta ✅");
  }
  return (respuesta.textContent = "Respuesta Incorrecta ❌");
}

function leerDatosDirectos(objeto) {
  const div = document.createElement("div");
  if (objeto.color === "Green") {
    div.className = "contenedor verde";
  } else {
    div.className = "contenedor rojo";
  }
  div.textContent = `${objeto.cuenta} = ${objeto.resultado}`;
  contenedor.prepend(div);
}

async function agregarAJson(objeto) {
  try {
    const res = await fetch("http://localhost:3000/datos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(objeto)
    });
    if (!res.ok) throw new Error("Error al agregar post");
  } catch (err) {
    console.error(err);
  }

  leerDatos();
}

async function eliminarDeJson(id) {
  try {
    const res = await fetch(`http://localHost:3000/datos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (!res.ok) throw new Error("Error al eliminar dato");
  } catch (err) {
    console.error(err);
  }

  leerDatos();
}

async function leerDatos() {
  try {
    const res = await fetch("http://localhost:3000/datos");
    if (!res.ok) throw new Error("Error al cargar datos");
    const datos = await res.json();

    contenedor.innerHTML = "";

    datos
      .slice()
      .reverse()
      .forEach((dato) => {
        const divGrande = document.createElement("div");
        divGrande.className = "contenedor";
        const div = document.createElement("div");
        if (dato.color === "Green") {
          div.className = "contenedor verde";
        } else {
          div.className = "contenedor rojo";
        }
        div.textContent = `${dato.cuenta} = ${dato.resultado}`;

        const bot = document.createElement("button");
        bot.className = "boton-eliminar";
        bot.value = dato.id;
        bot.textContent = "Eliminar";
        contenedor.appendChild(divGrande);
        divGrande.appendChild(div);
        divGrande.appendChild(bot);
      });
    document.querySelectorAll(".boton-eliminar").forEach((button) => {
      button.addEventListener("click", (e) => {
        const id = e.target.value;
        eliminarDeJson(id);
      });
    });
  } catch (err) {
    console.error(err);
  }
}

main();
leerDatos();
