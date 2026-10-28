// Efectos de sonido sintetizados (no necesitan archivos de audio).
const Sonido = {
  ctx: null,

  tono(freq, dur = 0.12, tipo = 'sine', vol = 0.15, retraso = 0) {
    try {
      if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const c = this.ctx;
      const o = c.createOscillator();
      const g = c.createGain();
      const t = c.currentTime + retraso;
      o.type = tipo;
      o.frequency.value = freq;
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g).connect(c.destination);
      o.start(t);
      o.stop(t + dur + 0.02);
    } catch (e) { /* sin audio */ }
  },

  bien()    { this.tono(660, 0.12, 'triangle'); this.tono(880, 0.2, 'triangle', 0.15, 0.1); },
  mal()     { this.tono(200, 0.25, 'sawtooth', 0.06); },
  paso()    { this.tono(520, 0.06, 'square', 0.03); },
  aviso()   { this.tono(330, 0.12, 'triangle', 0.08); },
  recoger() { [523, 659, 784, 1046].forEach((f, i) => this.tono(f, 0.14, 'triangle', 0.12, i * 0.07)); },
  fanfarria() {
    [523, 659, 784, 1046, 784, 1046].forEach((f, i) => this.tono(f, 0.22, 'triangle', 0.13, i * 0.13));
  }
};
