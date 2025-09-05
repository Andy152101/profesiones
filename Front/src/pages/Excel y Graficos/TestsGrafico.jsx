import * as XLSX from "xlsx";

function exportToExcel(tests) {
  // Mapeamos los datos de `peoples` para que coincidan con los campos del esquema
  const worksheet = XLSX.utils.json_to_sheet(
    tests.map((tests) => ({
      Fecha: tests.date,
      Documento: tests.docnumber,
      Nombres: tests.names,
      Empresa: tests.company?.name || "-", // 👈 muestra el nombre o un guion,

      "Mano Dominante": tests.dominanthand,
      "Tiempo de Colocación 1": tests.mineplacementtime1,
      "Tiempo de Colocación 2": tests.mineplacementtime2,
      "Total de Colocación": tests.mineplacementtotal,
      "Escala de Colocación": tests.mineplacementscale,
      "Tiempo de Rotación 1": tests.minerotationtime1,
      "Tiempo de Rotación 2": tests.minerotationtime2,
      "Total de Rotación": tests.minerotationtotal,
      "Escala de Rotación": tests.minerotationscale,
      "Tiempo de Desplazamiento 1": tests.minedisplacementtime1,
      "Tiempo de Desplazamiento 2": tests.minedisplacementtime2,
      "Total de Desplazamiento": tests.minedisplacementtotal,
      "Escala de Desplazamiento": tests.minedisplacementscale,
      "Puque Mano Dominante": tests.mineobservations,
      "Escala Mano Dominante": tests.purdedominanthand,
      "Puque Mano No Dominante": tests.purdedominanthandscale,
      "Escala Mano No Dominante": tests.purdenodominanthand,
      "Puque Ambas Manos": tests.purdenodominanthandscale,
      "Escala Ambas Manos": tests.purdebothhands,
      "Puque Ensamblar": tests.purdebothhandsscale,
      "Escala Ensamblar": tests.purdeassemble,
      "Con distractor": tests.purdeassemblescale,
      "Escala con distractor": tests.purdeobservations,
      "Reacción 1": tests.activityjtest,
      "Escala Reacción 1": tests.activityjtestscale,
      "Reacción 2": tests.activityjtestobservations,
      "Escala Reacción 2": tests.reaction1,
      "Tiempo de estrella": tests.startime,
      "Escala Estrella": tests.starTimeOne,
      "Errores Estrella": tests.startoucherrors,
      "Escala Errores Estrella": tests.starTouchErrorsOne,
      "Wire Game tiempo": tests.wireGameTime,
      "Wire Game errores": tests.wireGameError,
      "Escala Wire Game": tests.wireGameLevel,
      "Agudesa Visual Snellen": tests.visualAcuity,
      "Escala Agudesa Visual Snellen": tests.visualAcuityLevel,
      Dedos: tests.reaction1scale,
      "Escala de Dedos": tests.reaction2,
      "% De Vision Normal": tests.reaction2scale,
      "% De Portanopia": tests.reactionobservations,
      "% De Deuteranopia": tests.fingers,
      "% Total De Daltonismo": tests.fingersscale,
      Tren: tests.fingersobservations,
      "Escala de Tren": tests.ishinormalvision,
      "Memoria del Mar": tests.ishideuteranopia,
      "Escala Memoria del Mar": tests.ishiportanopia,
      Aves: tests.ishidaltonism,
      "Escala Aves": tests.ishiobservations,
    }))
  );

  // Crear el libro de trabajo y agregar la hoja
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "tests");

  // Generar el archivo .xlsx y descargarlo
  XLSX.writeFile(workbook, "tests.xlsx");
}

export default exportToExcel;
