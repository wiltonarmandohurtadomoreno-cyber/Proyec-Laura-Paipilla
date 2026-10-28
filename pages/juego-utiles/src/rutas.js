// Rutas de las imágenes del juego.
// Si cambias los nombres de los archivos en /assets, cámbialos aquí.
let RUTAS = {
  loading: 'assets/loading.png',     // sprite de carga: 4 cuadros de 1280x720 (3 arriba, 1 abajo)
  fondo: 'assets/fondo.png',         // aula 1280x720
  personaje: 'assets/personaje.png'  // niño (256x512, el dibujo está arriba a la izquierda)
};

// Al abrir index.html con doble clic (file://) el navegador no deja que
// WebGL use los .png de la carpeta y las imágenes no aparecen.
// En ese caso se usan las copias incrustadas de assets/imagenes.js
// (se regeneran con: python3 empaquetar.py).
if (location.protocol === 'file:' && typeof IMAGENES_INCRUSTADAS !== 'undefined') {
  RUTAS = Object.assign({}, RUTAS, IMAGENES_INCRUSTADAS);
}
