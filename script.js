let angulo;
let velocidadAngulo = 0; // Velocidad angular inicial
let aceleracionAngulo = 0; // Aceleración angular inicial
let amortiguacion = 0.995; // Amortiguación
let gravedad = 0.4; // Fuerza de gravedad
let longitudBrazoPendulo; // Longitud del brazo del péndulo
let origen; // Origen del péndulo (punto de suspensión)
let masa; // Masa del péndulo
let radioMasa; // Radio de la masa del péndulo

// Variables para el arrastre
let arrastrando = false;
let offsetX, offsetY;

function configurar() {
    let lienzo = document.getElementById('lienzo');
    let ctx = lienzo.getContext('2d');

    // Establecer el tamaño del canvas al tamaño de la ventana
    lienzo.width = window.innerWidth;
    lienzo.height = window.innerHeight;

    // Definir el origen del péndulo en el centro de la parte superior del lienzo
    origen = { x: lienzo.width / 2, y: 50 };

    // Obtener los valores iniciales del ángulo y la longitud del péndulo
    angulo = parseFloat(document.getElementById('anguloInicial').value) * Math.PI / 180;
    longitudBrazoPendulo = parseFloat(document.getElementById('longitudPendulo').value);
    radioMasa = parseFloat(document.getElementById('radioMasa').value);

    // Definir la posición inicial de la masa
    masa = { x: origen.x + longitudBrazoPendulo * Math.sin(angulo), y: origen.y + longitudBrazoPendulo * Math.cos(angulo) };

    // Iniciar el bucle de animación
    setInterval(dibujar, 16); // Aproximadamente 60 fps

    // Eventos de ratón para arrastrar
    lienzo.addEventListener('mousedown', onMouseDown);
    lienzo.addEventListener('mouseup', onMouseUp);
    lienzo.addEventListener('mousemove', onMouseMove);

    // Evento input para el campo de entrada del ángulo
    let anguloInput = document.getElementById('anguloInicial');
    anguloInput.addEventListener('input', function () {
        let valor = parseInt(anguloInput.value);
        if (valor < -10) {
            anguloInput.value = -10;
        } else if (valor > 10) {
            anguloInput.value = 10;
        }
    });
}

function dibujar() {
    let lienzo = document.getElementById('lienzo');
    let ctx = lienzo.getContext('2d');

    // Actualizar la aceleración angular, la velocidad y el ángulo
    aceleracionAngulo = (-1 * gravedad / longitudBrazoPendulo) * Math.sin(angulo);
    velocidadAngulo *= amortiguacion;
    velocidadAngulo += aceleracionAngulo;
    angulo += velocidadAngulo;

    // Convertir coordenadas polares a cartesianas
    masa.x = origen.x + longitudBrazoPendulo * Math.sin(angulo);
    masa.y = origen.y + longitudBrazoPendulo * Math.cos(angulo);

    // Limpiar el lienzo
    ctx.clearRect(0, 0, lienzo.width, lienzo.height);

    // Dibujar el semicírculo inferior del transportador
    //ctx.beginPath();
    //ctx.arc(origen.x, origen.y, 150, 0, 180); // Semicírculo inferior
    ctx.strokeStyle = 'black';
    //ctx.stroke();


    // Dibujar marcas de medida y etiquetas
    ctx.font = '10px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';

    for (let i = -90; i <= 90; i += 10) {
        let anguloRadianes = ((90 - i) * Math.PI) / 180;
        let x1 = origen.x + 150 * Math.cos(anguloRadianes);
        let y1 = origen.y + 150 * Math.sin(anguloRadianes);
        let x2 = origen.x + 160 * Math.cos(anguloRadianes);
        let y2 = origen.y + 160 * Math.sin(anguloRadianes);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        ctx.fillText(i.toString() + '°', x2, y2 + 10);
    }

    // Dibujar la línea del ángulo
ctx.beginPath();
ctx.moveTo(origen.x, origen.y);
ctx.lineTo(masa.x, masa.y);
ctx.strokeStyle = 'red';
ctx.stroke();

// Dibujar el punto en el origen del péndulo (parte superior)
ctx.beginPath();
ctx.arc(origen.x, origen.y, 3, 0, Math.PI * 2); // El tercer parámetro es el radio del círculo (3 pixels)
ctx.fillStyle = 'red'; // Color del punto
ctx.fill(); // Rellenar el círculo

    // Dibujar la masa
    ctx.beginPath();
    ctx.arc(masa.x, masa.y, radioMasa, 0, Math.PI * 2);
    ctx.fillStyle = 'blue';
    ctx.fill();

    // Añadir texto dentro de la masa
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(radioMasa, masa.x, masa.y); // Texto y posición del texto (en este caso, las coordenadas del centro del círculo)


    // Calcular y mostrar el ángulo actual en el medidor
    let anguloGrados = Math.round((angulo * 180 / Math.PI));
    document.getElementById('medidorAngulo').innerText = `Ángulo: ${anguloGrados}°`;
}

function onMouseDown(e) {
    let lienzo = document.getElementById('lienzo');
    let mouseX = e.clientX - lienzo.getBoundingClientRect().left;
    let mouseY = e.clientY - lienzo.getBoundingClientRect().top;

    // Verificar si el usuario hizo clic en la masa del péndulo
    let dx = mouseX - masa.x;
    let dy = mouseY - masa.y;
    let distancia = Math.sqrt(dx * dx + dy * dy);
    if (distancia < radioMasa) {
        arrastrando = true;
        offsetX = dx;
        offsetY = dy;
    }
}

function onMouseUp(e) {
    arrastrando = false;
}

function onMouseMove(e) {
    if (arrastrando) {
        let lienzo = document.getElementById('lienzo');
        let mouseX = e.clientX - lienzo.getBoundingClientRect().left;
        let mouseY = e.clientY - lienzo.getBoundingClientRect().top;

        // Calcular el ángulo basado en la posición del ratón
        let dx = mouseX - origen.x;
        let dy = mouseY - origen.y;
        angulo = Math.atan2(dx, dy);
    }
}

function reiniciar() {
    window.location.reload(); // Recargar la página
}

function aplicarConfiguracion() {
    angulo = parseFloat(document.getElementById('anguloInicial').value) * Math.PI / 180;
    longitudBrazoPendulo = parseFloat(document.getElementById('longitudPendulo').value);
    radioMasa = parseFloat(document.getElementById('radioMasa').value);
}

window.onload = configurar;
