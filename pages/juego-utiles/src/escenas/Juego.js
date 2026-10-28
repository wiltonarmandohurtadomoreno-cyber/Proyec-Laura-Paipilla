// Escena principal: el aula, el personaje y los útiles escolares.
class Juego extends Phaser.Scene {
  constructor() { super('Juego'); }

  create() {
    this.VELOCIDAD = 270;            // píxeles por segundo
    this.estrellas = 0;
    this.indice = 0;
    this.bloqueado = true;           // se desbloquea al asignar la primera misión
    this.destino = null;
    this.pasoT = 0;
    this.siguienteAviso = 0;

    this.add.image(0, 0, 'fondo').setOrigin(0);

    // Orden aleatorio de las misiones
    this.orden = Phaser.Utils.Array.Shuffle(UTILES.slice());

    this.crearUtiles();
    this.crearPersonaje();
    this.crearPizarra();
    this.crearBurbuja();
    this.crearControles();

    this.cameras.main.fadeIn(400, 38, 231, 245);
    this.time.delayedCall(350, () => this.siguienteMision(true));
  }

  // ------------------------------------------------------------ montaje
  crearUtiles() {
    this.items = UTILES.map((u, i) => {
      const sombra = this.add.image(u.x, u.y + 2, 'sombra').setScale(0.5).setDepth(u.y - 1);
      const s = this.add.image(u.x, u.y, 'util_' + u.id)
        .setOrigin(0.5, 0.85).setScale(0.5).setAngle(u.angulo || 0).setDepth(u.y);
      s.datos = u;
      s.sombra = sombra;
      s.recogido = false;

      // flota suavemente para que se note que se puede recoger
      this.tweens.add({ targets: s, y: u.y - 7, duration: 900 + i * 70, yoyo: true, repeat: -1, ease: 'Sine.inOut' });

      s.brillo = this.add.image(u.x + 22, u.y - 26, 'brillo').setScale(0.25).setDepth(u.y + 1).setAlpha(0);
      this.tweens.add({
        targets: s.brillo, alpha: 0.95, scale: 0.45, angle: 90,
        duration: 600, yoyo: true, repeat: -1, repeatDelay: 900 + i * 230, delay: i * 300
      });
      return s;
    });
  }

  crearPersonaje() {
    this.sombraPj = this.add.image(110, 565, 'sombra');
    this.pj = this.add.image(110, 565, 'personaje', 'cuerpo').setOrigin(0.5, 1);
    this.ajustarPerspectiva();
  }

  crearPizarra() {
    // La pizarra del fondo va de x=242 a 935 y de y=100 a 362
    const cx = 588;
    this.txtMision = this.add.text(cx, 130, '', TZ(26, '#cfe8d0')).setOrigin(0.5);
    this.txtBusca = this.add.text(cx + 30, 192, '', TZ(46)).setOrigin(0.5);
    this.iconoBusca = this.add.image(cx, 192, 'util_lapiz').setVisible(false);
    this.txtEstrellas = this.add.text(915, 128, '★ 0', TZ(30, '#ffe066')).setOrigin(1, 0.5);
    this.add.text(cx, 345, 'Camina con las flechas / WASD o toca el piso', TZ(19, '#a9c9ad')).setOrigin(0.5);

    // casillas con todos los útiles (se iluminan al recogerlos)
    this.slots = {};
    const n = this.orden.length;
    const sep = 86;
    const g = this.add.graphics();
    this.orden.forEach((u, i) => {
      const x = cx - ((n - 1) * sep) / 2 + i * sep;
      const y = 278;
      g.lineStyle(2, 0xffffff, 0.35).strokeCircle(x, y, 34);
      const escala = Dibujos.ajustar(this, 'util_' + u.id, 54);
      const icono = this.add.image(x, y, 'util_' + u.id).setScale(escala).setAlpha(0.22);
      this.slots[u.id] = { x, y, escala, icono };
    });
  }

  crearBurbuja() {
    this.burbuja = this.add.container(0, 0).setDepth(5000).setVisible(false);
    this.burbujaFondo = this.add.graphics();
    this.burbujaTexto = this.add.text(0, -26, '', T(20, '#1d2350', { align: 'center', wordWrap: { width: 270 } }))
      .setOrigin(0.5, 1);
    this.burbuja.add([this.burbujaFondo, this.burbujaTexto]);
  }

  crearControles() {
    this.teclas = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys('W,A,S,D');

    this.input.on('pointerdown', (p) => {
      if (this.bloqueado) return;
      const x = Phaser.Math.Clamp(p.worldX, ZONA.xMin, ZONA.xMax);
      const y = Phaser.Math.Clamp(p.worldY, ZONA.yMin, ZONA.yMax);
      this.destino = { x, y };
      const marca = this.add.circle(x, y, 12).setStrokeStyle(3, 0xffffff, 0.9).setScale(1, 0.5).setDepth(y - 2);
      this.tweens.add({ targets: marca, scaleX: 2.2, scaleY: 1.1, alpha: 0, duration: 450, onComplete: () => marca.destroy() });
    });
  }

  // ------------------------------------------------------------ misiones
  siguienteMision(primera) {
    this.objetivo = this.orden[this.indice];
    const u = this.objetivo;
    this.bloqueado = false;

    this.txtMision.setText(`Misión ${this.indice + 1} de ${this.orden.length}`);
    this.txtBusca.setText(`Busca ${u.articulo} ${u.nombre}`);
    this.iconoBusca.setTexture('util_' + u.id)
      .setScale(Dibujos.ajustar(this, 'util_' + u.id, 62))
      .setPosition(this.txtBusca.x - this.txtBusca.width / 2 - 48, 196)
      .setVisible(true);
    this.tweens.add({ targets: [this.txtMision, this.txtBusca, this.iconoBusca], alpha: { from: 0, to: 1 }, duration: 500 });

    this.decir(primera
      ? `¡Hola! Ayúdame a encontrar ${u.articulo} ${u.nombre}.`
      : `¡Ahora busquemos ${u.articulo} ${u.nombre}!`);
  }

  revisarUtiles(time) {
    for (const it of this.items) {
      if (it.recogido) continue;
      const dx = Math.abs(it.datos.x - this.pj.x);
      const dy = Math.abs(it.datos.y - this.pj.y);
      if (dx < 52 && dy < 36) {
        if (it.datos.id === this.objetivo.id) {
          this.recoger(it);
          return;
        }
        if (time > this.siguienteAviso) {
          this.siguienteAviso = time + 2600;
          const u = it.datos;
          this.decir(`Eso es ${u.articulo} ${u.nombre}. Busco ${this.objetivo.articulo} ${this.objetivo.nombre}.`);
          Sonido.aviso();
          this.tweens.add({ targets: it, angle: (u.angulo || 0) + 12, duration: 90, yoyo: true, repeat: 2 });
        }
      }
    }
  }

  recoger(it) {
    this.bloqueado = true;
    this.destino = null;
    it.recogido = true;
    this.tweens.killTweensOf([it, it.brillo]);
    it.brillo.destroy();
    it.sombra.destroy();
    Sonido.recoger();
    this.decir(`¡Encontré ${it.datos.articulo} ${it.datos.nombre}!`);

    const slot = this.slots[it.datos.id];
    it.setDepth(4000);
    this.tweens.chain({
      targets: it,
      tweens: [
        { y: it.y - 100, scale: 0.8, angle: 0, duration: 420, ease: 'Back.out' },
        { x: slot.x, y: slot.y + 8, scale: slot.escala, duration: 520, ease: 'Cubic.in', delay: 150 }
      ],
      onComplete: () => {
        it.destroy();
        slot.icono.setAlpha(1);
        this.tweens.add({ targets: slot.icono, scale: { from: slot.escala * 1.6, to: slot.escala }, duration: 300, ease: 'Back.out' });
        this.add.text(slot.x + 24, slot.y + 20, '✓', TZ(32, '#7CFC9A')).setOrigin(0.5);
        this.time.delayedCall(350, () => this.abrirActividad(it.datos));
      }
    });
  }

  abrirActividad(util) {
    this.burbuja.setVisible(false);
    this.scene.pause();
    this.scene.launch('Actividad', {
      util,
      alTerminar: (est) => this.actividadTerminada(est)
    });
  }

  actividadTerminada(est) {
    this.estrellas += est;
    this.txtEstrellas.setText('★ ' + this.estrellas);
    this.tweens.add({ targets: this.txtEstrellas, scale: { from: 1.5, to: 1 }, duration: 400, ease: 'Back.out' });
    this.indice++;

    if (this.indice >= this.orden.length) {
      this.decir('¡Encontré todos mis útiles!');
      this.time.delayedCall(1800, () => {
        this.cameras.main.fadeOut(500, 5, 8, 24);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('Final', { estrellas: this.estrellas, maximo: this.orden.length * 3 });
        });
      });
      return;
    }
    this.bloqueado = false;
    this.siguienteMision(false);
  }

  // ---------------------------------------------------- globo de diálogo
  decir(texto) {
    this.burbujaTexto.setText(texto);
    const w = Math.max(120, this.burbujaTexto.width + 30);
    const h = this.burbujaTexto.height + 22;
    const g = this.burbujaFondo;
    g.clear();
    g.fillStyle(0xffffff, 0.97).fillRoundedRect(-w / 2, -15 - h, w, h, 16);
    g.fillTriangle(-10, -16, 10, -16, 0, 0);
    g.lineStyle(2, 0x1d2350, 0.25).strokeRoundedRect(-w / 2, -15 - h, w, h, 16);
    this.burbuja.setVisible(true).setAlpha(1);
    this.posicionarBurbuja();
    this.tweens.add({ targets: this.burbuja, scale: { from: 0.7, to: 1 }, duration: 220, ease: 'Back.out' });

    if (this.timerBurbuja) this.timerBurbuja.remove();
    this.timerBurbuja = this.time.delayedCall(2800, () => {
      this.tweens.add({ targets: this.burbuja, alpha: 0, duration: 300, onComplete: () => this.burbuja.setVisible(false) });
    });
  }

  posicionarBurbuja() {
    const x = Phaser.Math.Clamp(this.pj.x, 170, 1110);
    this.burbuja.setPosition(x, this.pj.y - this.pj.displayHeight - 6);
  }

  // ------------------------------------------------------------- bucle
  update(time, dt) {
    if (this.bloqueado) {
      this.animarPaso(false, dt);
      this.posicionarBurbuja();
      return;
    }

    let vx = 0, vy = 0;
    const k = this.teclas, w = this.wasd;
    if (k.left.isDown || w.A.isDown) vx -= 1;
    if (k.right.isDown || w.D.isDown) vx += 1;
    if (k.up.isDown || w.W.isDown) vy -= 1;
    if (k.down.isDown || w.S.isDown) vy += 1;

    let paso = this.VELOCIDAD * dt / 1000;
    if (vx || vy) {
      this.destino = null;
    } else if (this.destino) {
      const dx = this.destino.x - this.pj.x;
      const dy = this.destino.y - this.pj.y;
      const d = Math.hypot(dx, dy);
      if (d < 3) {
        this.destino = null;
      } else {
        vx = dx; vy = dy;
        paso = Math.min(paso, d);
      }
    }

    const largo = Math.hypot(vx, vy);
    const moviendo = largo > 0;
    if (moviendo) {
      vx /= largo; vy /= largo;
      this.pj.x = Phaser.Math.Clamp(this.pj.x + vx * paso, ZONA.xMin, ZONA.xMax);
      this.pj.y = Phaser.Math.Clamp(this.pj.y + vy * paso, ZONA.yMin, ZONA.yMax);
      if (vx < -0.15) this.pj.setFlipX(true);
      if (vx > 0.15) this.pj.setFlipX(false);
    }

    this.animarPaso(moviendo, dt);
    this.ajustarPerspectiva();
    this.posicionarBurbuja();
    this.revisarUtiles(time);
  }

  animarPaso(moviendo, dt) {
    if (moviendo) {
      const antes = Math.floor(this.pasoT / 250);
      this.pasoT += dt;
      if (Math.floor(this.pasoT / 250) !== antes) Sonido.paso();
      this.pj.angle = Math.sin(this.pasoT / 80) * 6;
      this.rebote = Math.abs(Math.sin(this.pasoT / 80)) * 0.04;
    } else {
      this.pj.angle *= 0.8;
      this.rebote = 0;
    }
  }

  // Más grande cuando está adelante (abajo), más pequeño atrás.
  ajustarPerspectiva() {
    const t = (this.pj.y - ZONA.yMin) / (ZONA.yMax - ZONA.yMin);
    const s = 0.66 + 0.16 * t;
    this.pj.setScale(s, s * (1 + (this.rebote || 0)));
    this.pj.setDepth(this.pj.y + 0.5);
    this.sombraPj.setPosition(this.pj.x, this.pj.y).setScale(s * 1.15).setDepth(this.pj.y - 0.5);
  }
}
