// Primera escena: carga SOLO el sprite de "loading" para poder mostrarlo
// mientras se carga todo lo demás.
class Arranque extends Phaser.Scene {
  constructor() { super('Arranque'); }

  preload() {
    // loading.png mide 4096x2048 y trae 4 cuadros de 1280x720:
    // cuadros 0, 1, 2 en la fila de arriba y el cuadro 3 abajo a la izquierda.
    this.load.spritesheet('loading', RUTAS.loading, {
      frameWidth: 1280,
      frameHeight: 720,
      endFrame: 3
    });
  }

  create() {
    this.scene.start('Carga');
  }
}
