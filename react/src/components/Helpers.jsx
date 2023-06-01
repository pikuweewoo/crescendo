const noteFromPitch = (frequency) => {
      // Calculo de la ubicacion de la nota en el rango a los 12 semitonos que existen por cada octava.
      // 12 representa los semitonos en una octava.
      // La frecuencia base es 440 Hz, o A4
      // La división del logaritmo (frecuencia / frecuencia base) por logaritmo 2 resulta en que tan alejado
      // está el valor 
    var noteNum = 12 * (Math.log(frequency / 440) / Math.log(2));
    return Math.round(noteNum) + 69; // 69 representa la ubicación en semitonos de A4, contando desde C0
  };
  
  const frequencyFromNoteNumber = (note) => {
    return 440 * Math.pow(2, (note - 69) / 12);
  };
  
  const centsOffFromPitch = (frequency, note) => {
    return Math.floor(
      (1000 * Math.log(frequency / frequencyFromNoteNumber(note))) / Math.log(2)
    );
  };
  
  const getDetunePercent = (detune) => {
    if (detune > 0) {
      return 50 + detune;
    } else {
      return 50 + -detune;
    }
  };
  
  export { noteFromPitch, centsOffFromPitch, getDetunePercent, frequencyFromNoteNumber };