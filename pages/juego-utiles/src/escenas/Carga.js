// Pantalla de carga: muestra el sprite loading.png y avanza sus cuadros
// (barra vacía -> 1 -> 2 -> 3 bloques) según el progreso de la carga
// del fondo y del personaje.
class Carga extends Phaser.Scene {
  constructor() { super('Carga'); }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#26e7f5');

    // Tiempo mínimo en pantalla para que la animación se alcance a ver
    // aunque las imágenes carguen instantáneamente.
    this.TIEMPO_MINIMO = 2600;

    this.tarjeta = this.add.sprite(width / 2, height / 2 - 20, 'loading', 0).setScale(0.72);
    this.porcentaje = this.add.text(width / 2, height / 2 + 255, '0%', T(34, '#0b5f3a', { fontStyle: '600' }))
      .setOrigin(0.5);

    this.progresoReal = 0;
    this.cuadroActual = 0;
    this.listo = false;
    this.terminado = false;
    this.inicio = this.time.now;

    // Dibujos generados por código (útiles, planetas, estrellas...)
    Dibujos.crearTodo(this);

    // Carga del fondo y del personaje
    this.load.image('fondo', RUTAS.fondo);
    this.load.image('personaje', RUTAS.personaje);
    this.load.on('progress', (v) => { this.progresoReal = v; });
    this.load.once('complete', () => {
      // El dibujo del niño ocupa solo la parte de arriba de personaje.png;
      // creamos un "frame" recortado para usar únicamente esa zona.
      this.textures.get('personaje').add('cuerpo', 0, 26, 5, 120, 242);
      this.listo = true;
    });
    this.load.start();
  }

  update(time) {
    if (this.terminado) return;

    const avanceTiempo = Math.min(1, (time - this.inicio) / this.TIEMPO_MINIMO);
    const p = Math.min(this.progresoReal, avanceTiempo);

    // 4 cuadros: 0% -> cuadro 0, 33% -> 1, 66% -> 2, 100% -> 3
    const cuadro = Math.min(3, Math.floor(p * 3 + 0.0001));
    if (cuadro !== this.cuadroActual) {
      this.cuadroActual = cuadro;
      this.tarjeta.setFrame(cuadro);
      this.tweens.add({ targets: this.tarjeta, scale: { from: 0.75, to: 0.72 }, duration: 220, ease: 'Back.out' });
    }
    this.porcentaje.setText(Math.round(p * 100) + '%');

    if (this.listo && p >= 1) {
      this.terminado = true;
      this.time.delayedCall(450, () => {
        this.cameras.main.fadeOut(400, 38, 231, 245);
        this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Juego'));
      });
    }
  }
}
