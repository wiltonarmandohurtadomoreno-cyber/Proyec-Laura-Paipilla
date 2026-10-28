// =====================================================================
//  DIBUJOS GENERADOS POR CÓDIGO
//  Los útiles escolares, los planetas, el Sol y algunos adornos se
//  dibujan con canvas al iniciar, así no hacen falta más imágenes.
//  Se dibujan al doble de resolución (R = 2) para que se vean nítidos;
//  por eso en el juego se muestran con escala 0.5.
// =====================================================================
const Dibujos = {
  R: 2,

  lienzo(scene, key, w, h, dibujar) {
    if (scene.textures.exists(key)) return;
    const R = this.R;
    const tex = scene.textures.createCanvas(key, Math.ceil(w * R), Math.ceil(h * R));
    const ctx = tex.getContext();
    ctx.save();
    ctx.scale(R, R);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    dibujar(ctx, w, h);
    ctx.restore();
    tex.refresh();
  },

  rr(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  },

  // Escala para que una textura quepa en un cuadro de "max" píxeles
  ajustar(scene, key, max) {
    const f = scene.textures.getFrame(key);
    return max / Math.max(f.width, f.height);
  },

  crearTodo(scene) {
    this.crearUtiles(scene);
    this.crearPlanetas(scene);
    this.crearAdornos(scene);
  },

  // ------------------------------------------------------------ útiles
  crearUtiles(scene) {
    const rr = this.rr.bind(this);
    const borde = '#4a3210';

    const lapiz = (ctx, color, claro, oscuro) => {
      // punta de madera y mina
      ctx.beginPath(); ctx.moveTo(24, 4); ctx.lineTo(4, 14); ctx.lineTo(24, 24); ctx.closePath();
      ctx.fillStyle = '#f3c48d'; ctx.fill(); ctx.strokeStyle = borde; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(11, 10.5); ctx.lineTo(4, 14); ctx.lineTo(11, 17.5); ctx.closePath();
      ctx.fillStyle = color === '#ffd23f' ? '#333' : color; ctx.fill();
      // cuerpo
      ctx.fillStyle = color; ctx.fillRect(24, 4, 72, 20);
      ctx.fillStyle = claro; ctx.fillRect(24, 4, 72, 6);
      ctx.fillStyle = oscuro; ctx.fillRect(24, 18, 72, 6);
      ctx.strokeStyle = borde; ctx.strokeRect(24, 4, 72, 20);
    };

    this.lienzo(scene, 'util_lapiz', 122, 28, (ctx) => {
      lapiz(ctx, '#ffd23f', '#ffe680', '#e6a900');
      ctx.fillStyle = '#c9ced4'; ctx.fillRect(96, 3, 11, 22);
      ctx.strokeStyle = '#7d848c'; ctx.lineWidth = 1;
      [99.5, 103.5].forEach(x => { ctx.beginPath(); ctx.moveTo(x, 4); ctx.lineTo(x, 24); ctx.stroke(); });
      ctx.strokeStyle = borde; ctx.lineWidth = 1.5; ctx.strokeRect(96, 3, 11, 22);
      rr(ctx, 105, 3, 14, 22, 5); ctx.fillStyle = '#ff8fb3'; ctx.fill(); ctx.stroke();
    });

    this.lienzo(scene, 'util_borrador', 74, 42, (ctx) => {
      rr(ctx, 4, 6, 64, 30, 6); ctx.fillStyle = '#f7f7f2'; ctx.fill();
      ctx.save(); rr(ctx, 4, 6, 64, 30, 6); ctx.clip();
      ctx.fillStyle = '#2d6cdf'; ctx.fillRect(38, 0, 40, 42);
      ctx.fillStyle = 'rgba(255,255,255,.35)'; ctx.fillRect(4, 6, 64, 6);
      ctx.restore();
      rr(ctx, 4, 6, 64, 30, 6); ctx.strokeStyle = '#26324a'; ctx.lineWidth = 1.8; ctx.stroke();
    });

    this.lienzo(scene, 'util_tajalapiz', 58, 46, (ctx) => {
      rr(ctx, 5, 8, 46, 32, 6); ctx.fillStyle = '#e53935'; ctx.fill();
      ctx.fillStyle = '#ff7a73'; ctx.fillRect(9, 10, 38, 5);
      ctx.strokeStyle = '#6e1010'; ctx.lineWidth = 1.8; rr(ctx, 5, 8, 46, 32, 6); ctx.stroke();
      ctx.fillStyle = '#b8c4cc'; ctx.fillRect(9, 17, 22, 9); ctx.strokeStyle = '#5d6b73'; ctx.strokeRect(9, 17, 22, 9);
      ctx.beginPath(); ctx.arc(20, 21.5, 1.8, 0, Math.PI * 2); ctx.fillStyle = '#5d6b73'; ctx.fill();
      ctx.beginPath(); ctx.arc(38, 26, 7.5, 0, Math.PI * 2); ctx.fillStyle = '#2a2a2a'; ctx.fill();
      ctx.beginPath(); ctx.arc(38, 26, 4, 0, Math.PI * 2); ctx.fillStyle = '#555'; ctx.fill();
    });

    this.lienzo(scene, 'util_esfero', 112, 24, (ctx) => {
      ctx.beginPath(); ctx.moveTo(18, 7); ctx.lineTo(5, 12); ctx.lineTo(18, 17); ctx.closePath();
      ctx.fillStyle = '#e8edf2'; ctx.fill(); ctx.strokeStyle = '#1b2d6b'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.beginPath(); ctx.arc(5, 12, 1.6, 0, Math.PI * 2); ctx.fillStyle = '#1e3fbf'; ctx.fill();
      rr(ctx, 18, 6, 76, 12, 3); ctx.fillStyle = 'rgba(170,215,255,.95)'; ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#1e3fbf'; ctx.fillRect(20, 10.5, 70, 3);
      rr(ctx, 86, 5, 22, 14, 5); ctx.fillStyle = '#1e3fbf'; ctx.fill(); ctx.stroke();
      rr(ctx, 70, 1.5, 30, 4, 2); ctx.fillStyle = '#2a4fd6'; ctx.fill(); ctx.stroke();
    });

    this.lienzo(scene, 'util_colores', 92, 74, (ctx) => {
      const colores = [['#e53935', '#ff7a73', '#a52420'], ['#43a047', '#7fd383', '#2c6e30'], ['#1e88e5', '#7cc0ff', '#155fa0']];
      colores.forEach((c, i) => {
        ctx.save();
        ctx.translate(46, 66);
        ctx.rotate(-Math.PI / 2 + (i - 1) * 0.42);
        ctx.translate(-8, -14);
        ctx.scale(0.62, 1);
        // lápiz de color en vertical: dibujado como el lápiz pero apuntando a la derecha
        ctx.beginPath(); ctx.moveTo(78, 4); ctx.lineTo(98, 14); ctx.lineTo(78, 24); ctx.closePath();
        ctx.fillStyle = '#f3c48d'; ctx.fill(); ctx.strokeStyle = borde; ctx.lineWidth = 1.5; ctx.stroke();
        ctx.beginPath(); ctx.moveTo(91, 10.5); ctx.lineTo(98, 14); ctx.lineTo(91, 17.5); ctx.closePath();
        ctx.fillStyle = c[0]; ctx.fill();
        ctx.fillStyle = c[0]; ctx.fillRect(4, 4, 74, 20);
        ctx.fillStyle = c[1]; ctx.fillRect(4, 4, 74, 6);
        ctx.fillStyle = c[2]; ctx.fillRect(4, 18, 74, 6);
        ctx.strokeRect(4, 4, 74, 20);
        ctx.restore();
      });
    });

    this.lienzo(scene, 'util_regla', 132, 30, (ctx) => {
      rr(ctx, 3, 4, 126, 22, 3); ctx.fillStyle = 'rgba(255,214,79,.97)'; ctx.fill();
      ctx.strokeStyle = '#9c7400'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.lineWidth = 1;
      for (let i = 0; i <= 20; i++) {
        const x = 8 + i * 5.8;
        ctx.beginPath(); ctx.moveTo(x, 4); ctx.lineTo(x, i % 5 === 0 ? 14 : 9); ctx.stroke();
      }
    });

    this.lienzo(scene, 'util_cuaderno', 66, 80, (ctx) => {
      rr(ctx, 9, 4, 52, 70, 5); ctx.fillStyle = '#ff7043'; ctx.fill();
      ctx.strokeStyle = '#7a2b10'; ctx.lineWidth = 1.8; ctx.stroke();
      ctx.fillStyle = '#fff8ee'; ctx.fillRect(21, 22, 32, 18); ctx.strokeRect(21, 22, 32, 18);
      ctx.strokeStyle = '#9fb6d6'; ctx.lineWidth = 1;
      [28, 34].forEach(y => { ctx.beginPath(); ctx.moveTo(24, y); ctx.lineTo(50, y); ctx.stroke(); });
      ctx.strokeStyle = '#55595e'; ctx.lineWidth = 2.2;
      for (let y = 10; y < 72; y += 8) { ctx.beginPath(); ctx.ellipse(9, y, 5, 2.6, 0, 0, Math.PI * 2); ctx.stroke(); }
    });
  },

  // ---------------------------------------------------------- planetas
  dibujarPlaneta(ctx, p, cx, cy) {
    const r = p.r;
    const anillo = (mitad) => {
      ctx.save();
      ctx.translate(cx, cy); ctx.rotate(-0.35);
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.9, r * 0.55, 0, mitad === 'atras' ? Math.PI : 0, mitad === 'atras' ? Math.PI * 2 : Math.PI);
      ctx.strokeStyle = '#cdb27a'; ctx.lineWidth = r * 0.3; ctx.stroke();
      ctx.strokeStyle = '#efdcae'; ctx.lineWidth = r * 0.1; ctx.stroke();
      ctx.restore();
    };
    if (p.id === 'saturno') anillo('atras');

    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
    const banda = (dy, h, color) => { ctx.fillStyle = color; ctx.fillRect(cx - r, cy + dy * r, r * 2, h * r); };
    const mancha = (dx, dy, rx, ry, color) => {
      ctx.beginPath(); ctx.ellipse(cx + dx * r, cy + dy * r, rx * r, ry * r, 0.3, 0, Math.PI * 2);
      ctx.fillStyle = color; ctx.fill();
    };
    const base = {
      mercurio: '#a8a8a8', venus: '#e9c27c', tierra: '#2f7de1', marte: '#d4573b',
      jupiter: '#d8a46e', saturno: '#e8cf8f', urano: '#93dde6', neptuno: '#3d6fdc'
    }[p.id];
    ctx.fillStyle = base; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);

    switch (p.id) {
      case 'mercurio':
        mancha(-0.3, -0.2, 0.22, 0.2, '#8d8d8d'); mancha(0.35, 0.3, 0.16, 0.15, '#8d8d8d'); mancha(0.1, -0.55, 0.12, 0.1, '#919191');
        break;
      case 'venus':
        banda(-0.5, 0.25, '#f3d9a4'); banda(0.1, 0.3, '#dcae62'); banda(0.6, 0.2, '#f3d9a4');
        break;
      case 'tierra':
        mancha(-0.35, -0.15, 0.35, 0.45, '#3fae4a'); mancha(0.45, 0.25, 0.3, 0.38, '#3fae4a'); mancha(0.1, -0.6, 0.25, 0.15, '#3fae4a');
        banda(-1, 0.22, '#f2f6ff'); banda(0.85, 0.2, '#f2f6ff');
        break;
      case 'marte':
        mancha(-0.25, 0.1, 0.3, 0.2, '#a83e28'); mancha(0.4, -0.3, 0.18, 0.14, '#a83e28'); banda(-1, 0.18, '#ffe9e0');
        break;
      case 'jupiter':
        banda(-0.75, 0.18, '#b9784a'); banda(-0.4, 0.22, '#f1d2a6'); banda(-0.05, 0.2, '#a8643c');
        banda(0.3, 0.25, '#f1d2a6'); banda(0.65, 0.15, '#b9784a');
        mancha(0.35, 0.42, 0.2, 0.11, '#c2492f');
        break;
      case 'saturno':
        banda(-0.6, 0.2, '#d6b56d'); banda(-0.1, 0.25, '#f3e2b5'); banda(0.45, 0.2, '#d6b56d');
        break;
      case 'urano':
        banda(-0.2, 0.3, '#a9e8ee');
        break;
      case 'neptuno':
        banda(-0.3, 0.2, '#2e57b5'); banda(0.4, 0.15, '#5585ea'); mancha(-0.3, 0.1, 0.16, 0.1, '#20408a');
        break;
    }
    // sombreado para que se vea redondo
    const g = ctx.createRadialGradient(cx - r * 0.4, cy - r * 0.4, r * 0.1, cx, cy, r);
    g.addColorStop(0, 'rgba(255,255,255,0.35)');
    g.addColorStop(0.5, 'rgba(255,255,255,0)');
    g.addColorStop(1, 'rgba(0,0,30,0.5)');
    ctx.fillStyle = g; ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    ctx.restore();

    if (p.id === 'saturno') anillo('frente');
  },

  crearPlanetas(scene) {
    PLANETAS.forEach(p => {
      const w = (p.id === 'saturno' ? p.r * 4.3 : p.r * 2) + 6;
      const h = p.r * 2 + 6;
      this.lienzo(scene, 'planeta_' + p.id, w, h, (ctx) => this.dibujarPlaneta(ctx, p, w / 2, h / 2));
    });

    this.lienzo(scene, 'sol', 200, 200, (ctx) => {
      const brillo = ctx.createRadialGradient(100, 100, 50, 100, 100, 100);
      brillo.addColorStop(0, 'rgba(255,200,40,0.6)');
      brillo.addColorStop(1, 'rgba(255,140,0,0)');
      ctx.fillStyle = brillo; ctx.fillRect(0, 0, 200, 200);
      const g = ctx.createRadialGradient(85, 85, 5, 100, 100, 62);
      g.addColorStop(0, '#fff7c2'); g.addColorStop(0.5, '#ffd23f'); g.addColorStop(1, '#ff8a1e');
      ctx.beginPath(); ctx.arc(100, 100, 62, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
    });
  },

  // ----------------------------------------------------------- adornos
  crearAdornos(scene) {
    this.lienzo(scene, 'sombra', 70, 18, (ctx) => {
      const g = ctx.createRadialGradient(35, 9, 2, 35, 9, 35);
      g.addColorStop(0, 'rgba(0,0,0,0.35)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.save(); ctx.scale(1, 18 / 70); ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(35, 35, 35, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    });

    this.lienzo(scene, 'brillo', 30, 30, (ctx) => {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(15, 0); ctx.quadraticCurveTo(17, 13, 30, 15); ctx.quadraticCurveTo(17, 17, 15, 30);
      ctx.quadraticCurveTo(13, 17, 0, 15); ctx.quadraticCurveTo(13, 13, 15, 0);
      ctx.fill();
    });

    const estrella = (ctx, relleno, borde) => {
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + i * Math.PI / 5;
        const rad = i % 2 === 0 ? 30 : 13;
        ctx.lineTo(32 + Math.cos(a) * rad, 34 + Math.sin(a) * rad);
      }
      ctx.closePath();
      ctx.fillStyle = relleno; ctx.fill();
      ctx.strokeStyle = borde; ctx.lineWidth = 3; ctx.stroke();
    };
    this.lienzo(scene, 'estrella', 64, 64, (ctx) => estrella(ctx, '#ffd23f', '#c98a00'));
    this.lienzo(scene, 'estrellaVacia', 64, 64, (ctx) => estrella(ctx, 'rgba(255,255,255,0.08)', '#5b6699'));

    this.lienzo(scene, 'confeti', 10, 6, (ctx) => { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, 10, 6); });
  }
};
