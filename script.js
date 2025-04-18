/*
Se desea implementar una aplicación web para hacer ejercicios de cálculo sencillos.
La página debe definir una expresión aritmética simple y aleatoria, e.g. 32 + 179.
Se le pregunta al usuario cuál es la evaluación de dicha expresión.
Se muestran opciones de respuesta aleatorias, en forma de botones.
Cuando el usuario presiona uno de esos botones, se le muestra al usuario si respondió bien o mal.
Se muestra otra pregunta aleatoria, y así sucesivamente.
*/

// Para instalar el servidor npm install json-server
// Para correr el servidor json-server --watch db.json --port 3000 

const buttons = document.querySelectorAll("#contenido-principal .btn"); // Selecciona todos los botones dentro del contenedor principal para que no agarre el de borrar historial
const p1 = document.querySelector("#pregunta"); 
const p2 = document.querySelector("#respuesta");
let score = 0; // Variable para llevar el puntaje

function generarPregunta() {

    const primerNumero = Math.floor(Math.random() * 100) + 1;
    const segundoNumero = Math.floor(Math.random() * 100) + 1;
    const operador = ["+", "-", "*", "/"];
    const randomOperador = operador[Math.floor(Math.random() * operador.length)];

    const cuenta = eval(`${primerNumero} ${randomOperador} ${segundoNumero}`); //eval evalua una cadena como si fuera código JS
    const cuentaRedondeada = redondearResultado(cuenta);


    p1.textContent = `¿Cuánto es ${primerNumero} ${randomOperador} ${segundoNumero}?`;

    // Elegir 1 botón aleatorio para la respuesta correcta
    const correctIndex = Math.floor(Math.random() * buttons.length);
    buttons[correctIndex].textContent = cuentaRedondeada;

    // Lleno el resto de los botones con números random diferentes
    for (let i=0; i<buttons.length; i++){
        if (i !== correctIndex) {
            let randomNumber;
            do {
                randomNumber = Math.floor(Math.random() * 200) + 1; // Número aleatorio entre 1 y 200
            } while (randomNumber === cuentaRedondeada); // Asegurarse de que no sea el mismo número
            buttons[i].textContent = randomNumber;
        }
        // Verificar que la respuesta sea correcta
        buttons[i].onclick = () => {
            const valor = parseFloat(buttons[i].textContent);
            if (valor === cuentaRedondeada) {
              p2.textContent = "✅Correcto";
              score++; // Incrementar el puntaje
            } else {
              p2.textContent = "❌Intenta de nuevo.";
            }

            // Guardar el resultado en el servidor
            const resultado = {
              cuenta: `${primerNumero} ${randomOperador} ${segundoNumero}`,
              respuesta: valor,
              color: valor === cuentaRedondeada ? 'Green' : 'Red'
            };
            
            agregarResultado(resultado).then(mostrarResultados);

            // Actualizar el puntaje en la interfaz
            document.querySelector("#puntaje").textContent =
            `Cantidad de respuestas correctas de la sesión: ${score}`;
            
      
            // Nueva pregunta en cada clic
            setTimeout(() => {
              p2.textContent = ""; // Limpiar mensaje anterior
              generarPregunta();
            }, 1000); // Sleep de 1 seg para que se pueda ver el resultado
          };        
    };
}

// Redondea si es float, si no lo deja como está
function redondearResultado(num) {
  if (Number.isInteger(num)) {
    return num;
  } else {
    return Math.floor(num * 100) / 100; // 2 decimales
  }
}

// Lógica para eliminar el historial de resultados
document.getElementById("btn-reiniciar").addEventListener("click", reiniciarResultados);

// POST al servidor para agregar un resultado
async function agregarResultado(resultado) {
  try {
    await fetch('http://localhost:3000/resultados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(resultado)
    });
  } catch (error) {
    console.error('Error al agregar resultado:', error);
  }
}

// GET al servidor para obtener los resultados
async function mostrarResultados() {
  try {
    const response = await fetch('http://localhost:3000/resultados');
    const resultados = await response.json();

    const contenedorHistorial = document.getElementById('contenedor-historial');
    contenedorHistorial.innerHTML = '';

    // Da vuelta los resultados para que el último resultado esté arriba
    resultados.reverse().forEach((resultado) => {
      const div = document.createElement('div'); // Crear un nuevo div para cada resultado
      div.className = resultado.color === 'Green' ? 'contenedor verde' : 'contenedor rojo'; // Cambia el color del contenedor según el resultado con las clases CSS contenedor y rojo/verde
      div.textContent = `${resultado.cuenta} = ${resultado.respuesta}`; // Muestra la cuenta y la respuesta
      contenedorHistorial.appendChild(div); // Agrega el nuevo div al contenedor de historial
    });
  } catch (error) {
    console.error('Error al obtener resultados:', error);
  }
}

async function reiniciarResultados() {
  try {
    const response = await fetch('http://localhost:3000/resultados');
    const resultados = await response.json();

    for (const resultado of resultados) {
      await fetch(`http://localhost:3000/resultados/${resultado.id}`, { //Se usa el id para eliminar el resultado específico. El id fue seteado en el servidor al crear el resultado por el propio servidor.
        method: 'DELETE'
      });
    }

    mostrarResultados(); // Actualizar la lista de resultados en la interfaz
    score = 0; // Reiniciar el puntaje
    document.querySelector("#puntaje").textContent = "Cantidad de respuestas correctas de la sesión: 0";

  } catch (error) {
    console.error("Error al reiniciar historial:", error);
  }
}




generarPregunta();

