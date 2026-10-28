// Configuración e inicio del juego.
const config = {
  type: Phaser.AUTO,
  parent: 'juego',
  width: 1280,
  height: 720,
  backgroundColor: '#0f1630',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  // Carga las imágenes con <img> en vez de XHR: así también funciona
  // la versión de un solo archivo (imágenes incrustadas en base64).
  loader: { imageLoadType: 'HTMLImageElement' },
  scene: [Arranque, Carga, Juego, Actividad, Final]
};

// Esperamos las fuentes (máximo 2.5 s) para que los textos no salgan con otra letra.
const fuentesListas = Promise.all([
  document.fonts.load('32px "Fredoka"'),
  document.fonts.load('600 32px "Fredoka"'),
  document.fonts.load('32px "Patrick Hand"')
]).catch(() => {});

Promise.race([fuentesListas, new Promise(r => setTimeout(r, 2500))])
  .then(() => { window.juego = new Phaser.Game(config); });
