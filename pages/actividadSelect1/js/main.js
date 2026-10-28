function verificar(){

    const selects = document.querySelectorAll(".respuesta");

    const audioBien = document.getElementById("audioBien");
    const audioMal = document.getElementById("audioMal");
    const audioAplausos = document.getElementById("audioAplausos");

    const resultado = document.getElementById("resultado");

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

alert(correctas);

    resultado.style.display = "block";

    if(correctas === selects.length){

        resultado.innerHTML = "¡Todas las respuestas son correctas!";
        resultado.style.background = "#d4edda";
        resultado.style.color = "#155724";

        audioBien.play();

        setTimeout(() => {

            audioAplausos.play();

        },500);

    }else{

        resultado.innerHTML = " Algunas respuestas son incorrectas";
        resultado.style.background = "#f8d7da";
        resultado.style.color = "#721c24";

        audioMal.play();

    }

}


function reiniciar(){

    location.reload();

}