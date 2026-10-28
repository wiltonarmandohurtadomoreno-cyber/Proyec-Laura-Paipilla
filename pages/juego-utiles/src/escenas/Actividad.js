// Ventana modal con la actividad del sistema solar.
// Se abre encima de la escena Juego (que queda en pausa).
class Actividad extends Phaser.Scene {
  constructor() { super('Actividad'); }

  init(data) {
    this.util = data.util;
    this.act = data.util.actividad;
    this.alTerminar = data.alTerminar;
    this.errores = 0;
    this.terminada = false;
    this.contenido = [];
  }

  create() {
    // Fondo oscuro que bloquea los clics hacia el aula
    const velo = this.add.rectangle(0, 0, 1280, 720, 0x050818, 0.62).setOrigin(0).setInteractive();

    const P = this.P = { x: 150, y: 50, w: 980, h: 620 };
    const g = this.add.graphics();
    g.fillStyle(COLOR.panel, 1).fillRoundedRect(P.x, P.y, P.w, P.h, 28);
    const rnd = new Phaser.Math.RandomDataGenerator(['cosmos']);
    for (let i = 0; i < 80; i++) {
      g.fillStyle(0xffffff, rnd.realInRange(0.12, 0.55))
        .fillCircle(rnd.between(P.x + 20, P.x + P.w - 20), rnd.between(P.y + 20, P.y + P.h - 20), rnd.realInRange(0.6, 1.8));
    }
    g.lineStyle(5, COLOR.borde, 1).strokeRoundedRect(P.x, P.y, P.w, P.h, 28);

    // Cabecera
    const u = this.util;
    this.add.image(P.x + 62, P.y + 58, 'util_' + u.id).setScale(Dibujos.ajustar(this, 'util_' + u.id, 62));
    this.add.text(P.x + 110, P.y + 38, `¡Encontraste ${u.articulo} ${u.nombre}!`, T(20, '#ffd84d')).setOrigin(0, 0.5);
    this.add.text(P.x + 110, P.y + 72, this.act.titulo, T(34, '#ffffff', { fontStyle: '600' })).setOrigin(0, 0.5);
    this.instruccion = this.add.text(640, P.y + 132, this.act.instruccion || '', T(22, '#b9c6ff', { align: 'center', wordWrap: { width: 860 } })).setOrigin(0.5);
    this.feedback = this.add.text(640, P.y + P.h - 34, '', T(24, '#ffffff')).setOrigin(0.5);

    const constructores = {
      opcion: this.armarOpcion,
      vf: this.armarVF,
      ordenar: this.armarOrdenar,
      identificar: this.armarIdentificar,
      arrastrar: this.armarArrastrar,
      clasificar: this.armarClasificar
    };
    (constructores[this.act.tipo] || this.armarOpcion).call(this, this.act);

    // Animación de entrada
    this.children.list.forEach(o => {
      if (o === velo) return;
      this.tweens.add({ targets: o, alpha: { from: 0, to: o.alpha }, y: { from: o.y + 18, to: o.y }, duration: 260, ease: 'Cubic.out' });
    });
    this.tweens.add({ targets: velo, alpha: { from: 0, to: 1 }, duration: 200 });
  }

  // ------------------------------------------------------------ helpers
  c(obj) { this.contenido.push(obj); return obj; }

  mensaje(texto, color = '#ffffff') {
    this.feedback.setText(texto).setColor(color);
    if (texto) this.tweens.add({ targets: this.feedback, scale: { from: 1.15, to: 1 }, duration: 200 });
  }

  bien(texto = '¡Correcto!') { Sonido.bien(); this.mensaje(texto, '#7CFC9A'); }

  mal(texto = 'Mmm... intenta otra vez') {
    this.errores++;
    Sonido.mal();
    this.mensaje(texto, '#ff9a9a');
  }

  sacudir(objs) {
    this.tweens.add({ targets: objs, x: '+=9', duration: 45, yoyo: true, repeat: 3 });
  }

  planeta(x, y, id, escala = 1) {
    return this.add.image(x, y, 'planeta_' + id).setScale(0.5 * escala);
  }

  // ------------------------------------------------- 1. opción múltiple
  armarOpcion(a) {
    this.c(this.add.text(640, 255, a.pregunta, T(34, '#ffffff', { align: 'center', wordWrap: { width: 820 } })).setOrigin(0.5));
    const pos = [[455, 375], [825, 375], [455, 470], [825, 470]];
    a.opciones.forEach((op, i) => {
      const b = UI.boton(this, pos[i][0], pos[i][1], op, { w: 330, h: 74, tam: 30 });
      b.partes().forEach(o => this.c(o));
      b.alClic(() => {
        if (this.terminada) return;
        b.activo = false;
        if (i === a.correcta) {
          b.setColor(COLOR.verde);
          this.bien();
          this.completar();
        } else {
          b.setColor(COLOR.rojo);
          this.sacudir(b.partes());
          this.mal();
        }
      });
    });
  }

  // ------------------------------------------------ 2. verdadero / falso
  armarVF(a) {
    let i = 0;
    let esperando = false;
    const total = a.afirmaciones.length;
    const contador = this.c(this.add.text(640, 228, '', T(20, '#8fa0e6')).setOrigin(0.5));
    const g = this.c(this.add.graphics());
    g.fillStyle(COLOR.tarjeta, 1).fillRoundedRect(290, 258, 700, 130, 20);
    g.lineStyle(3, COLOR.borde, 0.6).strokeRoundedRect(290, 258, 700, 130, 20);
    const texto = this.c(this.add.text(640, 323, '', T(34, '#ffffff', { align: 'center', wordWrap: { width: 640 } })).setOrigin(0.5));

    const bV = UI.boton(this, 500, 470, 'Verdadero', { w: 250, h: 78, color: 0x2a7fd4, tam: 30 });
    const bF = UI.boton(this, 780, 470, 'Falso', { w: 250, h: 78, color: 0xb8437a, tam: 30 });
    [...bV.partes(), ...bF.partes()].forEach(o => this.c(o));

    const mostrar = () => {
      contador.setText(`Frase ${i + 1} de ${total}`);
      texto.setText(a.afirmaciones[i].texto);
      this.tweens.add({ targets: texto, alpha: { from: 0, to: 1 }, duration: 250 });
      bV.reset(); bF.reset();
      esperando = false;
    };

    const responder = (valor, b) => {
      if (esperando || this.terminada) return;
      if (valor === a.afirmaciones[i].v) {
        esperando = true;
        b.setColor(COLOR.verde);
        this.bien();
        this.time.delayedCall(800, () => {
          i++;
          if (i >= total) this.completar(0);
          else { this.mensaje(''); mostrar(); }
        });
      } else {
        b.activo = false;
        b.setColor(COLOR.rojo);
        this.sacudir(b.partes());
        this.mal('No es así, piénsalo de nuevo');
      }
    };
    bV.alClic(() => responder(true, bV));
    bF.alClic(() => responder(false, bF));
    mostrar();
  }

  // ------------------------------------------------- 3. ordenar planetas
  armarOrdenar() {
    const sol = this.c(this.add.image(240, 330, 'sol').setScale(0.36));
    this.tweens.add({ targets: sol, angle: 360, duration: 20000, repeat: -1 });
    this.c(this.add.text(240, 395, 'Sol', T(20, '#ffd84d')).setOrigin(0.5));

    const g = this.c(this.add.graphics());
    const slots = PLANETAS.map((p, i) => {
      const x = 335 + i * 102;
      const y = 330;
      g.lineStyle(2, 0xffffff, 0.3).strokeCircle(x, y, 32);
      this.c(this.add.text(x, y, String(i + 1), T(22, '#5b6699')).setOrigin(0.5));
      return { x, y };
    });

    let siguiente = 0;
    const mezclados = Phaser.Utils.Array.Shuffle(PLANETAS.slice());
    mezclados.forEach((p, i) => {
      const x = 245 + i * 113;
      const y = 490;
      const img = this.c(this.planeta(x, y, p.id, 0.72).setInteractive({ useHandCursor: true }));
      const nombre = this.c(this.add.text(x, y + 48, p.nombre, T(18, '#dfe5ff')).setOrigin(0.5));
      img.on('pointerup', () => {
        if (this.terminada) return;
        if (p.id === PLANETAS[siguiente].id) {
          const s = slots[siguiente];
          img.disableInteractive();
          this.tweens.add({ targets: img, x: s.x, y: s.y, scale: 0.5 * 0.62, duration: 380, ease: 'Back.out' });
          this.tweens.add({ targets: nombre, x: s.x, y: s.y + (siguiente % 2 ? 54 : -50), duration: 380 });
          siguiente++;
          if (siguiente === PLANETAS.length) { this.bien('¡Sistema solar ordenado!'); this.completar(); }
          else this.bien(`¡Bien! Va ${p.nombre}. ¿Cuál sigue?`);
        } else {
          this.sacudir([img, nombre]);
          this.mal(`Ese no va todavía. ¿Cuál está más cerca del Sol?`);
        }
      });
    });
  }

  // ------------------------------------------- 4. identificar el planeta
  armarIdentificar(a) {
    let ronda = 0;
    let esperando = false;
    const contador = this.c(this.add.text(640, 225, '', T(20, '#8fa0e6')).setOrigin(0.5));
    const pregunta = this.c(this.add.text(640, 268, '', T(34, '#ffffff')).setOrigin(0.5));

    const mezclados = Phaser.Utils.Array.Shuffle(PLANETAS.slice());
    const imgs = {};
    mezclados.forEach((p, i) => {
      const x = 245 + i * 113;
      const y = 430;
      const img = this.c(this.planeta(x, y, p.id, 0.85).setInteractive({ useHandCursor: true }));
      imgs[p.id] = img;
      this.tweens.add({ targets: img, y: y - 6, duration: 1000 + i * 90, yoyo: true, repeat: -1, ease: 'Sine.inOut' });
      img.on('pointerup', () => {
        if (esperando || this.terminada) return;
        if (p.id === a.rondas[ronda].correcta) {
          esperando = true;
          const aro = this.c(this.add.circle(x, y, p.r * 0.85 + 10).setStrokeStyle(4, 0x7CFC9A));
          this.c(this.add.text(x, y + 72, p.nombre, T(20, '#7CFC9A')).setOrigin(0.5));
          this.tweens.add({ targets: aro, scale: { from: 1.4, to: 1 }, duration: 300, ease: 'Back.out' });
          this.bien(`¡Sí! Es ${p.nombre}.`);
          this.time.delayedCall(900, () => {
            ronda++;
            if (ronda >= a.rondas.length) this.completar(0);
            else { this.mensaje(''); mostrar(); }
          });
        } else {
          this.sacudir(img);
          this.mal(`Ese es ${p.nombre}. Lee otra vez la pista.`);
        }
      });
    });

    const mostrar = () => {
      contador.setText(`Pista ${ronda + 1} de ${a.rondas.length}`);
      pregunta.setText(a.rondas[ronda].pregunta);
      this.tweens.add({ targets: pregunta, alpha: { from: 0, to: 1 }, duration: 250 });
      esperando = false;
    };
    mostrar();
  }

  // ------------------------------------- 5. arrastrar nombres a planetas
  armarArrastrar(a) {
    const xs = [310, 530, 750, 970];
    const objetivos = a.planetas.map((id, i) => {
      const x = xs[i];
      this.c(this.planeta(x, 300, id, 1));
      const g = this.c(this.add.graphics());
      g.lineStyle(2, 0xffffff, 0.35).strokeRoundedRect(x - 90, 392, 180, 54, 14);
      return { id, x, y: 419 };
    });

    let colocados = 0;
    const mezclados = Phaser.Utils.Array.Shuffle(a.planetas.slice());
    mezclados.forEach((id, i) => {
      const origen = { x: xs[i], y: 540 };
      const b = UI.boton(this, origen.x, origen.y, planetaPorId(id).nombre, { w: 176, h: 56, color: 0x5a3fc0, tam: 26 });
      b.partes().forEach(o => this.c(o));
      this.input.setDraggable(b.img);

      b.img.on('dragstart', () => { b.img.setDepth(10); b.txt.setDepth(11); });
      b.img.on('drag', (p, x, y) => b.mover(x, y));
      b.img.on('dragend', () => {
        const x = b.img.x, y = b.img.y;
        const destino = objetivos.find(o => Math.abs(o.x - x) < 105 && y > 230 && y < 480);
        if (!destino) {
          this.tweens.add({ targets: b.img, x: origen.x, y: origen.y, duration: 250, onUpdate: () => b.txt.setPosition(b.img.x, b.img.y - 3) });
          return;
        }
        if (destino.id === id && !destino.ocupado) {
          destino.ocupado = true;
          b.mover(destino.x, destino.y);
          b.setColor(COLOR.verde);
          b.activo = false;
          b.img.disableInteractive();
          colocados++;
          if (colocados === objetivos.length) { this.bien('¡Todos tienen su nombre!'); this.completar(); }
          else this.bien();
        } else {
          b.setColor(COLOR.rojo);
          this.mal('Ese nombre no corresponde a ese planeta.');
          this.tweens.add({
            targets: b.img, x: origen.x, y: origen.y, duration: 350,
            onUpdate: () => b.txt.setPosition(b.img.x, b.img.y - 3),
            onComplete: () => b.setColor(b.colorBase)
          });
        }
      });
    });
  }

  // -------------------------------------- 6. clasificar rocoso / gaseoso
  armarClasificar() {
    const cajas = [
      { tipo: 'rocoso', titulo: 'Rocosos', x: 410, color: 0x9fe870, n: 0 },
      { tipo: 'gaseoso', titulo: 'Gaseosos', x: 870, color: 0xffb35c, n: 0 }
    ];
    cajas.forEach(cj => {
      cj.rect = new Phaser.Geom.Rectangle(cj.x - 215, 365, 430, 215);
      const g = this.c(this.add.graphics());
      g.fillStyle(COLOR.tarjeta, 1).fillRoundedRect(cj.rect.x, cj.rect.y, cj.rect.width, cj.rect.height, 20);
      g.lineStyle(3, cj.color, 0.9).strokeRoundedRect(cj.rect.x, cj.rect.y, cj.rect.width, cj.rect.height, 20);
      this.c(this.add.text(cj.x, 392, cj.titulo, T(26, Phaser.Display.Color.IntegerToColor(cj.color).rgba, { fontStyle: '600' })).setOrigin(0.5));
    });

    let colocados = 0;
    const mezclados = Phaser.Utils.Array.Shuffle(PLANETAS.slice());
    mezclados.forEach((p, i) => {
      const origen = { x: 245 + i * 113, y: 252 };
      const img = this.c(this.planeta(origen.x, origen.y, p.id, 0.62));
      const nombre = this.c(this.add.text(origen.x, origen.y + 40, p.nombre, T(17, '#dfe5ff')).setOrigin(0.5));
      img.setInteractive({ useHandCursor: true, draggable: true });

      const seguir = () => nombre.setPosition(img.x, img.y + 40);
      img.on('dragstart', () => { img.setDepth(10); nombre.setDepth(10); });
      img.on('drag', (ptr, x, y) => { img.setPosition(x, y); seguir(); });
      img.on('dragend', () => {
        const caja = cajas.find(cj => cj.rect.contains(img.x, img.y));
        if (!caja) {
          this.tweens.add({ targets: img, x: origen.x, y: origen.y, duration: 250, onUpdate: seguir });
          return;
        }
        if (caja.tipo === p.tipo) {
          const k = caja.n++;
          img.disableInteractive();
          this.tweens.add({ targets: img, x: caja.x - 156 + k * 104, y: 470, duration: 250, ease: 'Back.out', onUpdate: seguir });
          colocados++;
          if (colocados === PLANETAS.length) { this.bien('¡Todos clasificados!'); this.completar(); }
          else this.bien(`¡Bien! ${p.nombre} es ${p.tipo}.`);
        } else {
          this.mal(`${p.nombre} no es ${caja.tipo}. Intenta de nuevo.`);
          this.tweens.add({ targets: img, x: origen.x, y: origen.y, duration: 350, onUpdate: seguir });
        }
      });
    });
  }

  // ------------------------------------------------------- resultado
  completar(espera = 700) {
    if (this.terminada) return;
    this.terminada = true;
    const est = Math.max(1, 3 - this.errores);

    this.time.delayedCall(espera + 300, () => {
      this.tweens.killTweensOf(this.contenido);
      this.tweens.add({
        targets: this.contenido, alpha: 0, duration: 250,
        onComplete: () => this.contenido.forEach(o => o.destroy())
      });
      this.instruccion.setText('');
      this.mensaje('');

      const titulo = est === 3 ? '¡Excelente!' : est === 2 ? '¡Muy bien!' : '¡Lo lograste!';
      [-1, 0, 1].forEach((d, i) => {
        const s = this.add.image(640 + d * 110, 270 - (d === 0 ? 14 : 0), i < est ? 'estrella' : 'estrellaVacia').setScale(0);
        this.tweens.add({ targets: s, scale: d === 0 ? 0.75 : 0.62, duration: 380, delay: 200 + i * 170, ease: 'Back.out',
          onStart: () => { if (i < est) Sonido.tono(660 + i * 180, 0.15, 'triangle', 0.12); } });
      });
      this.add.text(640, 365, titulo, T(42, '#ffd84d', { fontStyle: '600' })).setOrigin(0.5);

      const g = this.add.graphics();
      g.fillStyle(COLOR.tarjeta, 1).fillRoundedRect(270, 412, 740, 110, 18);
      this.add.text(300, 434, 'DATO CURIOSO', T(16, '#6fd3ff', { fontStyle: '600' })).setOrigin(0, 0.5);
      this.add.text(640, 476, this.act.dato || '', T(22, '#ffffff', { align: 'center', wordWrap: { width: 680 } })).setOrigin(0.5);

      const b = UI.boton(this, 640, 586, 'Continuar  ▶', { w: 280, h: 70, color: COLOR.verde, tam: 28 });
      b.alClic(() => this.cerrar(est));
    });
  }

  cerrar(est) {
    const cb = this.alTerminar;
    this.scene.resume('Juego');
    this.scene.stop();
    if (cb) cb(est);
  }
}
