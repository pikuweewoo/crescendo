export default function autoCorrelate(buf, sampleRate) {
  var SIZE = buf.length;
  var rms = 0; //root mean square / media cuadratica

  for (let i = 0; i < SIZE; i++) {
    var val = buf[i];
    rms += val * val;
  }

  // Realizar media cuadrática para detectar si hay suficiente señal.
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01)
    // Si no detecta suficientes señales/frecuencias, devolver -1.
    return -1;

  // Encontrar un rango en el bufer donde los valores sean menores segun un umbral dado
  var r1 = 0,
    r2 = SIZE - 1,
    thres = 0.2;

  // Recorrer para adelante con r1
  for (let i = 0; i < SIZE / 2; i++)
    if (Math.abs(buf[i]) < thres) {
      r1 = i;
      break;
    }

  // Recorrer para atras con r2
  for (let i = 1; i < SIZE / 2; i++)
    if (Math.abs(buf[SIZE - i]) < thres) {
      r2 = SIZE - i;
      break;
    }

  // Recortar el bufer segun los rangos obtenidos y actualizar variable SIZE (tamaño del bufer)
  buf = buf.slice(r1, r2);
  SIZE = buf.length;


  // Crear un nuevo array de las sumas de los offsets para realizar la autocorrelacion
  var c = new Array(SIZE).fill(0);
  // Por cada potencial offset, calcular la suma de cada valor del buffer, multiplicado su valor offset
  for (let i = 0; i < SIZE; i++)
    for (var j = 0; j < SIZE - i; j++)
      c[i] = c[i] + buf[j] * buf[j + i];


  // Encontrar el ultimo indice donde el valor sea mayor que el siguiente    
  var d = 0;
  while (c[d] > c[d + 1])
    d++;

  // Iterar del indice obtenido hasta el final y acumular la suma
  var maxval = -1,
    maxpos = -1;
  for (let i = d; i < SIZE; i++) {
    if (c[i] > maxval) {
      maxval = c[i];
      maxpos = i;
    }
  }


  var T0 = maxpos;


  // Del autor original:
  // Suponemos que una parabola que pasa a traves de tres puntos que componen el pico.
  // 'a' y 'b' son los valores desconocidos de la ecuacion linear y b/(2a) es el 'error' en la abscisa.
  // Por lo tanto, x1, x2 y x3 deberian ser y1, y2 e y3 ya que son las ordenadas.

  var x1 = c[T0 - 1],
    x2 = c[T0],
    x3 = c[T0 + 1];
  var a = (x1 + x3 - 2 * x2) / 2;
  var b = (x3 - x1) / 2;
  if (a) T0 = T0 - b / (2 * a);

  // Una vez obtenido el mejor offset de la repeticion, se puede calcular la frecuencia a partir del sampleRate.
  return sampleRate / T0;
};