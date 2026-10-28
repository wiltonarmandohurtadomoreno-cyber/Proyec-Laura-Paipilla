let respuestasCorrectas = 0;

function arrastrar(event) {

    event.dataTransfer.setData("idImagen", event.target.id);

}


function permitirDrop(event) {

    event.preventDefault();

}


function soltar(event) {

    event.preventDefault();

    const idImagen = event.dataTransfer.getData("idImagen");

    const imagen = document.getElementById(idImagen);

    const imagenCorrecta = event.target.getAttribute("data-imagen");


    const audioBien = document.getElementById("audioBien");
    const audioMal = document.getElementById("audioMal");
    const audioAplausos = document.getElementById("audioAplausos");


    if (idImagen === imagenCorrecta) {


        if (!event.target.classList.contains("correcto")) {

            respuestasCorrectas++;

        }

        event.target.innerHTML = "";

        event.target.appendChild(imagen);

        event.target.classList.add("correcto");

        imagen.setAttribute("draggable", "false");


        audioBien.currentTime = 0;
        audioBien.play();


        if (respuestasCorrectas === 3) {

            setTimeout(() => {

                audioAplausos.currentTime = 0;
                audioAplausos.play();

                const mensaje = document.getElementById("mensajeFinal");

                mensaje.style.display = "block";

                mensaje.innerHTML = " ¡Actividad completada correctamente!";

            }, 500);

        }

    } else {

        event.target.classList.add("incorrecto");


        audioMal.currentTime = 0;
        audioMal.play();

        setTimeout(() => {

            event.target.classList.remove("incorrecto");

        }, 800);

    }

}


function reiniciar() {

    location.reload();

}