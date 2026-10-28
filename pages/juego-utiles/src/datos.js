// =====================================================================
//  DATOS DEL JUEGO
//  Aquí se definen los útiles escolares, dónde aparecen en el aula y
//  qué actividad del sistema solar abre cada uno. Para agregar o cambiar
//  preguntas solo hay que editar este archivo.
// =====================================================================

// Zona del piso por donde puede caminar el personaje (posición de los pies)
const ZONA = { xMin: 60, xMax: 1225, yMin: 450, yMax: 708 };

// Planetas en orden desde el Sol. r = radio en píxeles (tamaño relativo).
const PLANETAS = [
  { id: 'mercurio', nombre: 'Mercurio', r: 16, tipo: 'rocoso' },
  { id: 'venus',    nombre: 'Venus',    r: 24, tipo: 'rocoso' },
  { id: 'tierra',   nombre: 'Tierra',   r: 25, tipo: 'rocoso' },
  { id: 'marte',    nombre: 'Marte',    r: 20, tipo: 'rocoso' },
  { id: 'jupiter',  nombre: 'Júpiter',  r: 46, tipo: 'gaseoso' },
  { id: 'saturno',  nombre: 'Saturno',  r: 40, tipo: 'gaseoso' },
  { id: 'urano',    nombre: 'Urano',    r: 32, tipo: 'gaseoso' },
  { id: 'neptuno',  nombre: 'Neptuno',  r: 31, tipo: 'gaseoso' }
];

const planetaPorId = (id) => PLANETAS.find(p => p.id === id);

// Útiles escolares: posición en el aula (x, y = donde "toca el piso"/mesa)
// y la actividad que se abre al recogerlo.
//
// Tipos de actividad disponibles:
//   opcion      -> pregunta con 4 respuestas
//   vf          -> varias afirmaciones de verdadero o falso
//   ordenar     -> tocar los planetas en orden desde el Sol
//   identificar -> tocar el planeta que cumple una pista (varias rondas)
//   arrastrar   -> arrastrar el nombre hasta su planeta
//   clasificar  -> arrastrar planetas a "rocosos" o "gaseosos"
const UTILES = [
  {
    id: 'lapiz', nombre: 'lápiz', articulo: 'el', x: 380, y: 578, angulo: -10,
    actividad: {
      tipo: 'opcion',
      titulo: 'El vecino del Sol',
      instruccion: 'Escoge la respuesta correcta.',
      pregunta: '¿Cuál es el planeta más cercano al Sol?',
      opciones: ['Venus', 'Mercurio', 'Tierra', 'Marte'],
      correcta: 1,
      dato: 'Mercurio da una vuelta completa al Sol en solo 88 días.'
    }
  },
  {
    id: 'borrador', nombre: 'borrador', articulo: 'el', x: 1150, y: 456, angulo: 0,
    actividad: {
      tipo: 'ordenar',
      titulo: 'Ordena el sistema solar',
      instruccion: 'Toca los planetas en orden: del más cercano al más lejano del Sol.',
      dato: 'Neptuno está tan lejos que la luz del Sol tarda unas 4 horas en llegar hasta él.'
    }
  },
  {
    id: 'tajalapiz', nombre: 'tajalápiz', articulo: 'el', x: 600, y: 704, angulo: 0,
    actividad: {
      tipo: 'vf',
      titulo: '¿Verdadero o falso?',
      instruccion: 'Lee cada frase y decide si es verdadera o falsa.',
      afirmaciones: [
        { texto: 'El Sol es una estrella.', v: true },
        { texto: 'La Luna es un planeta.', v: false },
        { texto: 'La Tierra gira alrededor del Sol.', v: true },
        { texto: 'A Marte lo llaman "el planeta azul".', v: false }
      ],
      dato: 'A Marte le dicen el planeta rojo por el óxido de hierro que cubre su suelo.'
    }
  },
  {
    id: 'esfero', nombre: 'esfero', articulo: 'el', x: 250, y: 690, angulo: 12,
    actividad: {
      tipo: 'identificar',
      titulo: 'Detective de planetas',
      instruccion: 'Lee la pista y toca el planeta correcto.',
      rondas: [
        { pregunta: 'Toca el planeta más grande.', correcta: 'jupiter' },
        { pregunta: 'Toca el planeta con grandes anillos.', correcta: 'saturno' },
        { pregunta: 'Toca el planeta donde vivimos.', correcta: 'tierra' },
        { pregunta: 'Toca el planeta rojo.', correcta: 'marte' }
      ],
      dato: 'Dentro de Júpiter cabrían más de 1.300 planetas como la Tierra.'
    }
  },
  {
    id: 'colores', nombre: 'colores', articulo: 'los', x: 1090, y: 700, angulo: 0,
    actividad: {
      tipo: 'arrastrar',
      titulo: 'Ponles nombre',
      instruccion: 'Arrastra cada nombre hasta su planeta.',
      planetas: ['tierra', 'marte', 'jupiter', 'saturno'],
      dato: 'Saturno es tan liviano que flotaría en una piscina gigante de agua.'
    }
  },
  {
    id: 'regla', nombre: 'regla', articulo: 'la', x: 845, y: 576, angulo: -4,
    actividad: {
      tipo: 'clasificar',
      titulo: 'Rocosos y gaseosos',
      instruccion: 'Arrastra cada planeta a su grupo.',
      dato: 'Los 4 planetas cercanos al Sol son rocosos; los 4 lejanos son gigantes de gas y hielo.'
    }
  },
  {
    id: 'cuaderno', nombre: 'cuaderno', articulo: 'el', x: 955, y: 662, angulo: 6,
    actividad: {
      tipo: 'opcion',
      titulo: 'Contemos planetas',
      instruccion: 'Escoge la respuesta correcta.',
      pregunta: '¿Cuántos planetas tiene nuestro sistema solar?',
      opciones: ['7', '8', '9', '10'],
      correcta: 1,
      dato: 'Desde 2006, Plutón se considera un planeta enano.'
    }
  }
];
