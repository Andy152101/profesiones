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
      Fecha: test.date,
      Documento: test.docnumber,
      Nombres: test.names,
      Empresa: test.company?.name || "-",
      "Mano Dominante": test.dominanthand,
      "Minnessota Tiempo de Colocación 1": test.mineplacementtime1,
      "Minnessota Tiempo de Colocación 2": test.mineplacementtime2,
      "Minnessota Total de Colocación": test.mineplacementtotal,
      "Minnessota Escala de Colocación": test.mineplacementscale,
      "Minnessota Tiempo de Rotación 1": test.minerotationtime1,
      "Minnessota Tiempo de Rotación 2": test.minerotationtime2,
      "Minnessota Total de Rotación": test.minerotationtotal,
      "Minnessota Escala de Rotación": test.minerotationscale,
      "Minnessota Tiempo de Desplazamiento 1": test.minedisplacementtime1,
      "Minnessota Tiempo de Desplazamiento 2": test.minedisplacementtime2,
      "Minnessota Total de Desplazamiento": test.minedisplacementtotal,
      "Minnessota Escala de Desplazamiento": test.minedisplacementscale,
      "Minnessota Observaciones": test.mineobservations,
      "Purdue Mano Dominante": test.purdedominanthand,
      "Purdue Escala Mano Dominante": test.purdedominanthandscale,
      "Purdue Mano No Dominante": test.purdenodominanthand,
      "Purdue Escala Mano No Dominante": test.purdenodominanthandscale,
      "Purdue Ambas Manos": test.purdebothhands,
      "Purdue Escala Ambas Manos": test.purdebothhandsscale,
      "Purdue Ensamblar": test.purdeassemble,
      "Purdue Escala Ensamblar": test.purdeassemblescale,
      "Purdue Observaciones": test.purdeobservations,
      "Test de Juicio de Actividad": test.activityjtest,
      "Test de Juicio de Actividad Escala": test.activityjtestscale,
      "Test de Juicio de Actividad Observaciones":
        test.activityjtestobservations,
      "Reacción 1": test.reaction1,
      "Reacción 1 Escala": test.reaction1scale,
      "Reacción 2": test.reaction2,
      "Reacción 2 Escala": test.reaction2scale,
      "Reacción Observaciones": test.reactionobservations,
      Dedos: test.fingers,
      "Dedos Escala": test.fingersscale,
      "Dedos Observaciones": test.fingersobservations,
      "Ishihara Visión Normal": test.ishinormalvision,
      "Ishihara Deuteranopia": test.ishideuteranopia,
      "Ishihara Portanopia": test.ishiportanopia,
      "Ishihara Daltonismo": test.ishidaltonism,
      "Ishihara Observaciones": test.ishiobservations,
      "Tiempo de Estrella": test.startime,
      "Tiempo de Estrella Escala": test.starTimeOne,
      "Errores de Estrella": test.startoucherrors,
      "Errores de Estrella Escala": test.starTouchErrorsOne,
      "Wire Game Tiempo": test.wireGameTime,
      "Wire Game Errores": test.wireGameError,
      "Wire Game Nivel": test.wireGameLevel,
      "Agudeza Visual": test.visualAcuity,
      "Agudeza Visual Nivel": test.visualAcuityLevel,
      "Lumosity Tren": test.lumosityTrain,
      "Lumosity Memoria": test.lumosityMemory,
      "Lumosity Aves": test.lumosityBirds,
    }))
  );

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "tests");
  XLSX.writeFile(workbook, "tests.xlsx");
}

export default exportToExcel;
