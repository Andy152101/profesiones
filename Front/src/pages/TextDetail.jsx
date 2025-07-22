import { useParams } from 'react-router-dom';
import { useTests } from '../context/TestsContext';
import { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { format } from 'date-fns';

function TestDetail() {
  const { id } = useParams();
  const { getTest } = useTests();
  const [test, setTest] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      const data = await getTest(id);
      setTest(data);
    };
    fetchTest();
  }, [id, getTest]);

  const generatePDF = async () => {
    const doc = new jsPDF();
    const element = document.getElementById('test-detail');
    const button = document.getElementById('pdf-button');

    // Ocultar el botón antes de capturar la imagen
    button.style.display = 'none';

    await new Promise(resolve => setTimeout(resolve, 100)); // Espera 100ms
    const canvas = await html2canvas(element, { useCORS: true, scale: 2 });
    const imgData = canvas.toDataURL('image/png');

    const imgWidth = 210; // Ancho de una página A4 en mm
    const pageHeight = 300; // Altura de una página A4 en mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      doc.addPage();
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const fileName = `test-detail-${test.names}.pdf`;
    doc.save(fileName);

    // Mostrar el botón de nuevo después de capturar la imagen
    button.style.display = 'block';
  };

  if (!test) return <div>Loading...</div>;

  const formattedDate = format(new Date(test.date), 'dd/MM/yyyy');

  return (
    <div className='flex items-center justify-center my-2 px-4'>
      <div id="test-detail" className="max-w-4xl w-full p-6 md:p-10 rounded-md">
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4'>
          <div className='col-span-1'>
            <img
              src="/src/Imagenes/LogoVerde.png"
              alt="Logo"
              className="w-32 h-auto mb-4" // Cambia 'w-32' a cualquier valor de tamaño deseado
            />

          </div>
          <div className='col-span-2'>
            <h1 className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Resultado de la Prueba</strong></h1>
          </div>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Fecha de la prueba:</strong> {test.date}</p>
          </div>
          <hr className='col-span-4 my-4' />
          <h1 className='col-span-4 text-center text-xl font-bold text-black'>INFORMACION DEL USUARIO</h1>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Nombre:</strong> {test.names}</p>
          </div>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Documento:</strong> {test.docnumber}</p>
          </div>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Compañia:</strong> {test.company}</p>
          </div>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Mano Dominante:</strong> {test.dominanthand}</p>
          </div>
          <hr className='col-span-4 my-4' />
          <h1 className='col-span-4 text-center text-xl font-bold text-black'>MINESOTA</h1>
          <h2 className='col-span-4 text-lg font-semibold text-black'>COLOCACION</h2>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Intento 1:</strong> {test.mineplacementtime1}</p>
          </div>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Intento 2:</strong> {test.mineplacementtime2}</p>
          </div>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Total:</strong> {test.mineplacementtotal}</p>
          </div>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Escala:</strong> {test.mineplacementscale}</p>
          </div>
          <h2 className='col-span-4 text-lg font-semibold text-black'>ROTACION</h2>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Intento 1:</strong> {test.minerotationtime1}</p>
          </div>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Intento 2:</strong> {test.minerotationtime2}</p>
          </div>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Total:</strong> {test.minerotationtotal}</p>
          </div>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Escala:</strong> {test.minerotationscale}</p>
          </div>
          <h2 className='col-span-4 text-lg font-semibold text-black'>DESPLAZAMIENTO</h2>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Intento 1:</strong> {test.minedisplacementtime1}</p>
          </div>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Intento 2:</strong> {test.minedisplacementtime2}</p>
          </div>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Total:</strong> {test.minedisplacementtotal}</p>
          </div>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Escala:</strong> {test.minedisplacementscale}</p>
          </div>
          <hr className='col-span-4 my-4' />
          <h1 className='col-span-4 text-center text-xl font-bold text-black'>PURDUE</h1>
          <h2 className='col-span-2 text-lg font-semibold text-black'>MANO DOMINANTE</h2>
          <h2 className='col-span-2 text-lg font-semibold text-black'>MANO NO DOMINANTE</h2>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Numerica:</strong> {test.mineobservations}</p>
          </div>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Escala:</strong> {test.purdedominanthand}</p>
          </div>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Numerica:</strong> {test.purdedominanthandscale}</p>
          </div>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Escala:</strong> {test.purdenodominanthand}</p>
          </div>
          <h2 className='col-span-2 text-lg font-semibold text-black'> AMBAS MANO</h2>
          <h2 className='col-span-2 text-lg font-semibold text-black'>ENSAMBLE</h2>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Numerica:</strong> {test.purdenodominanthandscale}</p>
          </div>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Escala:</strong> {test.purdebothhands}</p>
          </div>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Numerica:</strong> {test.purdebothhandsscale}</p>
          </div>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Escala:</strong> {test.purdeassemble}</p>
          </div>
          <hr className='col-span-4 my-4' />
          <h1 className='col-span-4 text-center text-xl font-bold text-black'>TEST DE JUICIO DE ACTIVIDAD</h1>
          <br />
          <h2 className='col-span-4 text-lg font-semibold text-black'>CON DISTRACTOR</h2>
          <div className='col-span-2'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Aciertos:</strong> {test.purdeassemblescale}</p>
          </div>
          <div className='col-span-2'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Escala:</strong> {test.purdeobservations}</p>
          </div>
          <hr className='col-span-4 my-4' />
          <h1 className='col-span-4 text-center text-xl font-bold text-black'>TEST DE REACCION (VISION PERIFERICA)</h1>
          <h2 className='col-span-2 text-lg font-semibold text-black'>INTENTO 1</h2>
          <h2 className='col-span-2 text-lg font-semibold text-black'>INTENTO 2</h2>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Aciertos:</strong> {test.activityjtest}</p>
          </div>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Escala:</strong> {test.activityjtestscale}</p>
          </div>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Aciertos:</strong> {test.activityjtestobservations}</p>
          </div>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Escala:</strong> {test.reaction1}</p>
          </div>
          <hr className='col-span-4 my-4' />
          <h1 className='col-span-4 text-center text-xl font-bold text-black'>TEST DE ESTRELLA</h1>
          <h2 className='col-span-2 text-lg font-semibold text-black'>TIEMPO(seg)</h2>
          <h2 className='col-span-2 text-lg font-semibold text-black'>ERRORES(toques)</h2>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Aciertos:</strong> {test.startime}</p>
          </div>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Escala:</strong> {test.starTimeOne}</p>
          </div>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Aciertos:</strong> {test.startoucherrors}</p>
          </div>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Escala:</strong> {test.starTouchErrorsOne}</p>
          </div>
          <hr className='col-span-4 my-4' />
          <h1 className='col-span-4 text-center text-xl font-bold text-black'>WIRE GAME</h1>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Tiempo:</strong> {test.wireGameTime}</p>
          </div>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Errores:</strong> {test.wireGameError}</p>
          </div>
          <div className='col-span-2'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Nivel:</strong> {test.wireGameLevel}</p>
          </div>
          <hr className='col-span-4 my-4' />
          <h1 className='col-span-4 text-center text-xl font-bold text-black'>AGUDEZA VISUAL</h1>
          <div className='col-span-2'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Snellen:</strong> {test.visualAcuity}</p>
          </div>
          <div className='col-span-2'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Escala:</strong> {test.visualAcuityLevel}</p>
          </div>
          <hr className='col-span-4 my-4' />
          <h1 className='col-span-4 text-center text-xl font-bold text-black'>DEDOS</h1>
          <h2 className='col-span-4 text-lg font-semibold text-black'>INTENTO 1</h2>
          <div className='col-span-2'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Tiempo:</strong> {test.reaction1scale}</p>
          </div>
          <div className='col-span-2'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Nivel:</strong> {test.reaction2}</p>
          </div>

          <hr className='col-span-4 my-4' />
          <h1 className='col-span-4 text-center text-xl font-bold text-black'>TEST DE ISHIHARA (DALTONISMO)</h1>
          <h2 className='col-span-4 text-lg font-semibold text-black'>INTENTO 1</h2>
          <div className='col-span-2'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>% De Vision Normal:</strong> {test.reaction2scale}</p>
          </div>
          <div className='col-span-2'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>% De Portanopia:</strong> {test.reactionobservations}</p>
          </div>
          <div className='col-span-2'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>% De Deuterapia:</strong> {test.fingers}</p>
          </div>
          <div className='col-span-2'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>% Total Daltonismo:</strong> {test.fingersscale}</p>
          </div>

          <hr className='col-span-4 my-4' />
          <h1 className='col-span-4 text-center text-xl font-bold text-black'>LUMOSITY</h1>
          <h2 className='col-span-2 text-lg font-semibold text-black'>TREN</h2>
          <h2 className='col-span-2 text-lg font-semibold text-black'>MEMORIAS DEL MAR</h2>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Puntos:</strong> {test.fingersobservations}</p>
          </div>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Nivel:</strong> {test.ishinormalvision}</p>
          </div>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Puntos:</strong> {test.ishideuteranopia}</p>
          </div>
          <div className='col-span-1'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Nivel:</strong> {test.ishiportanopia}</p>
          </div>
          <h2 className='col-span-4 text-lg font-semibold text-black'>AVES</h2>
          <div className='col-span-2'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Puntos:</strong> {test.ishidaltonism}</p>
          </div>
          <div className='col-span-2'>
            <p className='w-full bg-white text-black px-4 py-2 rounded-md my-2'><strong>Nivel:</strong> {test.ishiobservations}</p>
          </div>

          <div className='flex justify-center col-span-4'>
            <button
              id="pdf-button"
              onClick={generatePDF}
              className="bg-blueSena text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Descargar PDF
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default TestDetail;