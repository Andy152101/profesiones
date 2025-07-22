import * as XLSX from 'xlsx';

function exportToExcel(peoples) {
  // Mapeamos los datos de `peoples` para que coincidan con los campos del esquema
  const worksheet = XLSX.utils.json_to_sheet(
    peoples.map((person) => ({
      "Nombres": person.names,
      "Tipo de documento": person.doctype,
      "Número de documento": person.docnumber,
      "Fecha de nacimiento": person.birthdate,
      "Sexo": person.sex,
      "Teléfono": person.phone,
      "Correo electrónico": person.email,
      "Empresa": person.company,
      "Tiempo en la empresa": person.companytime,
      "Nivel académico": person.academiclevel,
      "Fecha de graduación": person.graduationdate,
      "Mano dominante": person.dominanthand,
      "Dirección": person.address,
      "Barrio": person.neighborhood,
      "Municipio": person.municipality,
    }))
  );

  // Crear el libro de trabajo y agregar la hoja
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Personas");

  // Generar el archivo .xlsx y descargarlo
  XLSX.writeFile(workbook, "personas.xlsx");
}

export default exportToExcel;
