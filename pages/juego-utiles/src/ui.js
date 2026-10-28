// Utilidades de interfaz: estilos de texto y botones reutilizables.
const FUENTE = '"Fredoka", "Trebuchet MS", Arial, sans-serif';
const TIZA = '"Patrick Hand", "Comic Sans MS", cursive';

const COLOR = {
  boton: 0x34419c,
  verde: 0x2fbf71,
  rojo: 0xe0484f,
  panel: 0x0b1033,
  tarjeta: 0x1d2a6b,
  borde: 0x6fd3ff
};

const T = (tam, color = '#ffffff', extra = {}) =>
  Object.assign({ fontFamily: FUENTE, fontSize: tam + 'px', color }, extra);

const TZ = (tam, color = '#f4f7f2', extra = {}) =>
  Object.assign({ fontFamily: TIZA, fontSize: tam + 'px', color }, extra);

const UI = {
  texturaBoton(scene, w, h) {
    const key = `boton_${w}x${h}`;
    if (!scene.textures.exists(key)) {
      const g = scene.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(0xb8b8b8, 1).fillRoundedRect(0, 0, w, h, 16);
      g.fillStyle(0xffffff, 1).fillRoundedRect(0, 0, w, h - 6, 16);
      g.generateTexture(key, w, h);
      g.destroy();
    }
    return key;
  },

  // Crea un botón (imagen + texto). Devuelve un objeto con helpers.
  boton(scene, x, y, texto, { w = 320, h = 70, color = COLOR.boton, tam = 28 } = {}) {
    const img = scene.add.image(x, y, this.texturaBoton(scene, w, h)).setTint(color);
    const txt = scene.add.text(x, y - 3, texto, T(tam, '#ffffff', { fontStyle: '600' })).setOrigin(0.5);
    img.setInteractive({ useHandCursor: true });

    const b = {
      img, txt,
      colorBase: color,
      color,
      activo: true,
      setColor(c) { this.color = c; img.setTint(c); return this; },
      reset() { this.activo = true; this.setColor(this.colorBase); return this; },
      mover(nx, ny) { img.setPosition(nx, ny); txt.setPosition(nx, ny - 3); return this; },
      alClic(fn) { img.on('pointerup', () => { if (this.activo) fn(); }); return this; },
      partes() { return [img, txt]; }
    };
    img.on('pointerover', () => {
      if (b.activo) img.setTint(Phaser.Display.Color.ValueToColor(b.color).lighten(12).color);
    });
    img.on('pointerout', () => img.setTint(b.color));
    return b;
  }
};
