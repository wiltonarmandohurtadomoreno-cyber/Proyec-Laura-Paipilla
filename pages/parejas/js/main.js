const cartas = document.querySelectorAll(".carta");

const audioBien = document.getElementById("audioBien");
const audioMal = document.getElementById("audioMal");
const audioAplausos = document.getElementById("audioAplausos");

const mensajeFinal = document.getElementById("mensajeFinal");

let primeraCarta = null;
let segundaCarta = null;

let bloqueado = false;

let parejasEncontradas = 0;


mezclarCartas();

function mezclarCartas(){

    const tablero = document.querySelector(".tablero");

    const cartasArray = Array.from(cartas);

    cartasArray.sort(() => Math.random() - 0.5);

    cartasArray.forEach(carta => {

        tablero.appendChild(carta);

    });

}


cartas.forEach(carta => {

    carta.addEventListener("click", () => {

        if(bloqueado) return;

        if(carta.classList.contains("completada")) return;

        if(carta === primeraCarta) return;

        mostrarImagen(carta);

        carta.classList.add("activa");

  
        if(!primeraCarta){

            primeraCarta = carta;

            return;

        }

      
        segundaCarta = carta;

        bloqueado = true;

        verificarParejas();

    });

});


function mostrarImagen(carta){

    const imagen = carta.getAttribute("data-imagen");

    carta.querySelector("img").src = imagen;

}


function ocultarImagen(carta){

    carta.querySelector("img").src = "img/interrogacion.png";

}


function verificarParejas(){

    const valor1 = primeraCarta.getAttribute("data-imagen");
    const valor2 = segundaCarta.getAttribute("data-imagen");


    if(valor1 === valor2){

        audioBien.currentTime = 0;
        audioBien.play();

        primeraCarta.classList.add("completada");
        segundaCarta.classList.add("completada");

        parejasEncontradas++;

        reiniciarTurno();

      
        if(parejasEncontradas === 3){

            setTimeout(() => {

                audioAplausos.currentTime = 0;
                audioAplausos.play();

                mensajeFinal.style.display = "block";

                mensajeFinal.innerHTML = " ¡Encontraste todas las parejas!";

            },500);

        }

    }else{

        audioMal.currentTime = 0;
        audioMal.play();

        setTimeout(() => {

            ocultarImagen(primeraCarta);
            ocultarImagen(segundaCarta);

            primeraCarta.classList.remove("activa");
            segundaCarta.classList.remove("activa");

            reiniciarTurno();

        },1000);

    }

}


function reiniciarTurno(){

    primeraCarta = null;
    segundaCarta = null;

    bloqueado = false;

}


function reiniciar(){

    location.reload();

}