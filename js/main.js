function cargarpagina(pagina) {
    // Cierra cualquier modal abierto antes de reemplazar el contenido
    document.querySelectorAll('.modal.show').forEach(m => {
        bootstrap.Modal.getInstance(m)?.hide();
    });
    document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
    document.body.classList.remove('modal-open');
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('padding-right');

    fetch('pages/' + pagina)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar la página: ' + response.status);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('contenido').innerHTML = data;

            if (pagina === "bienvenida.html") {
                const nombreGuardado = localStorage.getItem("nombreUsuario");
                const spanNombre = document.getElementById("nombre");
                if (spanNombre && nombreGuardado) {
                    spanNombre.textContent = nombreGuardado;
                }

                const modalEl = document.getElementById("modalBienvenida");
                if (modalEl) {
                    bootstrap.Modal.getOrCreateInstance(modalEl).show();
                }
            }

            localStorage.setItem("paginaActual", pagina);
        })
        .catch(error => {
            document.getElementById('contenido').innerHTML = "<p>Error cargando el contenido</p>";
            console.error(error);
        });
}
document.addEventListener("DOMContentLoaded" , function () {

  const paginaGuardada = localStorage.getItem("paginaActual");
  if(paginaGuardada) {
    cargarpagina(paginaGuardada);
  } else {
    cargarpagina("home.html");
  }
});
document.addEventListener("DOMContentLoaded" , function () {

  const paginaGuardada = localStorage.getItem("paginaActual");
  if(paginaGuardada) {
    cargarpagina(paginaGuardada);
  } else {
    cargarpagina("inicio.html");
  }
});


document.addEventListener("DOMContentLoaded", function () {
    const paginaGuardada = localStorage.getItem("paginaActual");
    const nombreGuardado = localStorage.getItem("nombreUsuario");
    
    if (nombreGuardado) {
        document.getElementById("loginScreen").style.display = "none";
        document.getElementById("appContent").style.display = "block";
    } else {
        document.getElementById("appContent").style.display = "none";
    }

    if (paginaGuardada) {
        cargarpagina(paginaGuardada);
    } else {
        cargarpagina("bienvenida.html");
    }

    // Manejo del inicio de sesión
    document.getElementById("formLogin").addEventListener("submit", function (e) {
        e.preventDefault();

        const nombre = document.getElementById("inputNombre").value.trim();
        const regex = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;

        if (!nombre || !regex.test(nombre)) {
            mostrarAlerta("Ingrese un nombre válido", "alert-danger");
        } else {
            localStorage.setItem("nombreUsuario", nombre);
            cargarpagina("bienvenida.html"); // Carga la página de bienvenida
            document.getElementById("loginScreen").style.display = "none";
            document.getElementById("appContent").style.display = "block";
        }
    });
});

// Función para mostrar alerta
function mostrarAlerta(mensaje, clase) {
    const alertContainer = document.getElementById("alertContainer");
    alertContainer.innerHTML = `
        <div class="alert ${clase} alert-dismissible fade show" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    setTimeout(() => {
        alertContainer.innerHTML = "";
    }, 3000);
}

  document.addEventListener("DOMContentLoaded", function () {
    const modal = new bootstrap.Modal(document.getElementById("modalBienvenida"));
    modal.show();
  });