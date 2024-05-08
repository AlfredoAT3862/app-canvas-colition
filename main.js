const canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

const window_height = window.innerHeight;
const window_width = window.innerWidth;

canvas.height = window_height;
canvas.width = window_width;

canvas.style.background = '#ffff00';

class Circle {
    constructor(x, y, radius, color, text, velocidad) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.velocidad = velocidad;
        this.dx = 1 * this.velocidad;
        this.dy = 1 * this.velocidad;
        this.colliding = false; // Bandera para indicar si el círculo está en colisión
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = '18px Arial';
        context.fillText(this.text, this.posX, this.posY);
        context.lineWidth = 5;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context, window_width, window_height) {
        // Actualizamos la posición sumando la velocidad actual
        this.posX += this.dx;
        this.posY += this.dy;

        // Comprobamos si el círculo ha chocado con los bordes y ajustamos su posición y dirección
        if (this.posX + this.radius >= window_width || this.posX - this.radius <= 0) {
            this.dx = -this.dx; // Invertimos la dirección horizontal para hacer que rebote
            // Ajustamos la posición para que el círculo no sobrepase los bordes
            this.posX = Math.min(window_width - this.radius, Math.max(this.radius, this.posX));
        }
        if (this.posY + this.radius >= window_height || this.posY - this.radius <= 0) {
            this.dy = -this.dy; // Invertimos la dirección vertical para hacer que rebote
            // Ajustamos la posición para que el círculo no sobrepase los bordes
            this.posY = Math.min(window_height - this.radius, Math.max(this.radius, this.posY));
        }
    }
}

function getDistance(posx1, posY1, posX2, posY2) {
    let result = Math.sqrt(Math.pow((posX2 - posx1), 2) + Math.pow((posY2 - posY1), 2));
    return result;
}

function handleCollision(circle1, circle2) {
    // Calcular las diferencias de posición y velocidad
    let dx = circle2.posX - circle1.posX;
    let dy = circle2.posY - circle1.posY;
    let distance = Math.sqrt(dx * dx + dy * dy);

    // Normalizar el vector de colisión
    let nx = dx / distance;
    let ny = dy / distance;

    // Componente de velocidad en la dirección de colisión
    let dp1 = circle1.dx * nx + circle1.dy * ny;
    let dp2 = circle2.dx * nx + circle2.dy * ny;

    // Calcular las velocidades en la dirección de colisión después de la colisión
    let m1 = circle1.radius * circle1.radius; // Masa del círculo 1
    let m2 = circle2.radius * circle2.radius; // Masa del círculo 2
    let c1 = 2 * (dp1 - dp2) / (m1 + m2);
    let c2 = 2 * (dp2 - dp1) / (m1 + m2);

    // Actualizar las velocidades después de la colisión
    circle1.dx -= c1 * m2 * nx;
    circle1.dy -= c1 * m2 * ny;
    circle2.dx -= c2 * m1 * nx;
    circle2.dy -= c2 * m1 * ny;
}

let circles = [];

function generateRandomCircles(numCircles) {
    for (let i = 0; i < numCircles; i++) {
        let x = Math.random() * window_width;
        let y = Math.random() * window_height;
        let radius = Math.random() * 100 + 20; // Radio entre 20 y 120
        let color = "blue"; //'#' + Math.floor(Math.random()*16777215).toString(16); // Color azul
        let text = i + 1; // Texto constante
        let velocidad = 4; // Velocidad constante
        circles.push(new Circle(x, y, radius, color, text, velocidad));
    }
}

generateRandomCircles(10); // Genera 10 círculos aleatorios

let updateCircles = function () {
    ctx.clearRect(0, 0, window_width, window_height);

    // Reiniciamos la bandera de colisión para todos los círculos
    for (let circle of circles) {
        circle.colliding = false;
    }

    // Verificamos colisiones entre todos los pares de círculos
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            if (getDistance(circles[i].posX, circles[i].posY, circles[j].posX, circles[j].posY) < (circles[i].radius + circles[j].radius)) {
                // Si hay colisión, marcamos ambos círculos como en colisión
                circles[i].colliding = true;
                circles[j].colliding = true;
                handleCollision(circles[i], circles[j]); // Manejar el rebote entre los círculos
            }
        }
    }

    // Actualizamos y dibujamos los círculos, cambiando el color si están en colisión
    for (let circle of circles) {
        circle.update(ctx, window_width, window_height);
        if (circle.colliding) {
            circle.color = "purple";
        } else {
            circle.color = "green";
        }
        circle.draw(ctx);
    }

    requestAnimationFrame(updateCircles);
};

updateCircles();