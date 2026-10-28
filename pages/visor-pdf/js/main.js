// Lista de PDFs que están en la carpeta /pdf
// Agrega aquí el nombre de cada archivo que pongas en esa carpeta.
const PDFS = [
  { nombre: "Documento de ejemplo", archivo: "proyecto.pdf" }
];

const CARPETA = "pdf/";

const selector = document.getElementById("selector-pdf");
let visor = document.getElementById("visor");
const enlaceAbrir = document.getElementById("enlace-abrir");
const enlaceDescargar = document.getElementById("enlace-descargar");

function cargarPdf(archivo) {
  const ruta = CARPETA + encodeURIComponent(archivo);

  // Reemplazar el <object> fuerza al navegador a recargar el PDF
  const nuevo = visor.cloneNode(true);
  nuevo.setAttribute("data", ruta + "#toolbar=1&navpanes=0&view=FitH");
  visor.parentNode.replaceChild(nuevo, visor);
  visor = nuevo;

  enlaceAbrir.href = ruta;
  enlaceDescargar.href = ruta;
  enlaceDescargar.setAttribute("download", archivo);
  const respaldo = nuevo.querySelector("#enlace-respaldo");
  if (respaldo) respaldo.href = ruta;
}

// Llenar el selector
PDFS.forEach(({ nombre, archivo }) => {
  const opcion = document.createElement("option");
  opcion.value = archivo;
  opcion.textContent = nombre;
  selector.appendChild(opcion);
});

selector.addEventListener("change", () => cargarPdf(selector.value));

// Permite abrir un PDF directamente: index.html?pdf=archivo.pdf
const desdeUrl = new URLSearchParams(location.search).get("pdf");
const inicial = desdeUrl || (PDFS[0] && PDFS[0].archivo);

if (inicial) {
  if (desdeUrl && !PDFS.some(p => p.archivo === desdeUrl)) {
    const opcion = document.createElement("option");
    opcion.value = desdeUrl;
    opcion.textContent = desdeUrl;
    selector.appendChild(opcion);
  }
  selector.value = inicial;
  cargarPdf(inicial);
}
