import * as XLSX from "xlsx";

function exportToExcel(tests, currentUser) {
  // Filtrar tests según el rol del usuario
  const filteredTests =
    currentUser?.role === "admin"
      ? tests
      : tests.filter((test) => {
          // Comparar el ID de la empresa del test con la del usuario
          const testCompanyId = test.company?._id || test.company?.id;
          const userCompanyId =
            currentUser.company?._id || currentUser.company?.id;
          return testCompanyId === userCompanyId;
        });

  const worksheet = XLSX.utils.json_to_sheet(
    filteredTests.map((test) => ({
      // 👈 Usar 'test' (singular)
      Fecha: test.date, // 👈 'test' en lugar de 'tests'
      Documento: test.docnumber,
      Nombres: test.names,
      Empresa: test.company?.name || "-",
      "Mano Dominante": test.dominanthand, // 👈 Cambiar todos estos
      "Tiempo de Colocación 1": test.mineplacementtime1,
      "Tiempo de Colocación 2": test.mineplacementtime2,
      "Total de Colocación": test.mineplacementtotal,
      "Escala de Colocación": test.mineplacementscale,
      "Tiempo de Rotación 1": test.minerotationtime1,
      "Tiempo de Rotación 2": test.minerotationtime2,
      "Total de Rotación": test.minerotationtotal,
      "Escala de Rotación": test.minerotationscale,
      "Tiempo de Desplazamiento 1": test.minedisplacementtime1,
      "Tiempo de Desplazamiento 2": test.minedisplacementtime2,
      "Total de Desplazamiento": test.minedisplacementtotal,
      "Escala de Desplazamiento": test.minedisplacementscale,
      "Puque Mano Dominante": test.mineobservations,
      "Escala Mano Dominante": test.purdedominanthand,
      "Puque Mano No Dominante": test.purdedominanthandscale,
      "Escala Mano No Dominante": test.purdenodominanthand,
      "Puque Ambas Manos": test.purdenodominanthandscale,
      "Escala Ambas Manos": test.purdebothhands,
      "Puque Ensamblar": test.purdebothhandsscale,
      "Escala Ensamblar": test.purdeassemble,
      "Con distractor": test.purdeassemblescale,
      "Escala con distractor": test.purdeobservations,
      "Reacción 1": test.activityjtest,
      "Escala Reacción 1": test.activityjtestscale,
      "Reacción 2": test.activityjtestobservations,
      "Escala Reacción 2": test.reaction1,
      "Tiempo de estrella": test.startime,
      "Escala Estrella": test.starTimeOne,
      "Errores Estrella": test.startoucherrors,
      "Escala Errores Estrella": test.starTouchErrorsOne,
      "Wire Game tiempo": test.wireGameTime,
      "Wire Game errores": test.wireGameError,
      "Escala Wire Game": test.wireGameLevel,
      "Agudesa Visual Snellen": test.visualAcuity,
      "Escala Agudesa Visual Snellen": test.visualAcuityLevel,
      Dedos: test.reaction1scale,
      "Escala de Dedos": test.reaction2,
      "% De Vision Normal": test.reaction2scale,
      "% De Portanopia": test.reactionobservations,
      "% De Deuteranopia": test.fingers,
      "% Total De Daltonismo": test.fingersscale,
      Tren: test.fingersobservations,
      "Escala de Tren": test.ishinormalvision,
      "Memoria del Mar": test.ishideuteranopia,
      "Escala Memoria del Mar": test.ishiportanopia,
      Aves: test.ishidaltonism,
      "Escala Aves": test.ishiobservations,
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "tests");
  XLSX.writeFile(workbook, "tests.xlsx");
}

export default exportToExcel;
