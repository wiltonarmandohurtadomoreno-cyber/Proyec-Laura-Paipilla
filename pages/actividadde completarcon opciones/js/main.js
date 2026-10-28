function verificar(){

    const selects = document.querySelectorAll(".respuesta");

    const resultado = document.getElementById("resultado");

    const audioBien = document.getElementById("audioBien");
    const audioMal = document.getElementById("audioMal");
    const audioAplausos = document.getElementById("audioAplausos");

    let correctas = 0;

    selects.forEach(select => {

        const respuestaUsuario = select.value;

        const respuestaCorrecta = select.getAttribute("data-correcta");

  
        select.classList.remove("correcto");
        select.classList.remove("incorrecto");

   
        if(respuestaUsuario === respuestaCorrecta){

            select.classList.add("correcto");

            correctas++;

        }else{

            select.classList.add("incorrecto");

        }

    });


    resultado.style.display = "block";

    if(correctas === selects.length){

        resultado.innerHTML = "¡Completaste la frase correctamente!";
        resultado.style.background = "#d4edda";
        resultado.style.color = "#155724";

        audioBien.currentTime = 0;
        audioBien.play();

        setTimeout(() => {

            audioAplausos.currentTime = 0;
            audioAplausos.play();

        },500);

    }else{

        resultado.innerHTML = " Algunas respuestas son incorrectas";
        resultado.style.background = "#f8d7da";
        resultado.style.color = "#721c24";

        audioMal.currentTime = 0;
        audioMal.play();

    }

}


function reiniciar(){

    location.reload();

}