// Pantalla final con el puntaje.
class Final extends Phaser.Scene {
  constructor() { super('Final'); }

  init(data) {
    this.estrellas = data.estrellas || 0;
    this.maximo = data.maximo || 1;
  }

  create() {
    this.add.image(0, 0, 'fondo').setOrigin(0);
    this.add.rectangle(0, 0, 1280, 720, 0x050818, 0.55).setOrigin(0);

    const g = this.add.graphics();
    g.fillStyle(COLOR.panel, 1).fillRoundedRect(250, 80, 780, 560, 30);
    g.lineStyle(5, COLOR.borde, 1).strokeRoundedRect(250, 80, 780, 560, 30);

    const pj = this.add.image(420, 610, 'personaje', 'cuerpo').setOrigin(0.5, 1).setScale(1.15);
    this.tweens.add({ targets: pj, y: 585, duration: 420, yoyo: true, repeat: -1, ease: 'Sine.out' });

    const cx = 760;
    this.add.text(cx, 170, '¡Misión cumplida!', T(48, '#ffd84d', { fontStyle: '600' })).setOrigin(0.5);
    this.add.text(cx, 250, 'Encontraste todos tus útiles y aprendiste sobre el sistema solar.',
      T(24, '#dfe5ff', { align: 'center', wordWrap: { width: 420 } })).setOrigin(0.5);

    this.add.image(cx - 70, 355, 'estrella').setScale(0.9);
    this.add.text(cx - 20, 355, `${this.estrellas} / ${this.maximo}`, T(52, '#ffffff', { fontStyle: '600' })).setOrigin(0, 0.5);

    const r = this.estrellas / this.maximo;
    const frase = r >= 0.9 ? '¡Eres un astronauta experto!' : r >= 0.6 ? '¡Muy buen viaje espacial!' : '¡Buen trabajo! Juega otra vez para ganar más estrellas.';
    this.add.text(cx, 440, frase, T(24, '#7CFC9A', { align: 'center', wordWrap: { width: 420 } })).setOrigin(0.5);

    UI.boton(this, cx, 545, 'Jugar otra vez', { w: 300, h: 74, color: COLOR.verde })
      .alClic(() => this.scene.start('Juego'));

    this.add.particles(0, -10, 'confeti', {
      x: { min: 0, max: 1280 },
      speedY: { min: 120, max: 260 },
      speedX: { min: -60, max: 60 },
      rotate: { min: 0, max: 360 },
      scale: { min: 0.4, max: 0.8 },
      lifespan: 5000,
      frequency: 70,
      quantity: 2,
      tint: [0xffd23f, 0xe53935, 0x43a047, 0x1e88e5, 0xff8fb3, 0x6fd3ff]
    }).setDepth(10);

    this.cameras.main.fadeIn(500, 5, 8, 24);
    Sonido.fanfarria();
  }
}
