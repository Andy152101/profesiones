import React, { useState, useEffect } from 'react';
import { useTests } from '../context/TestsContext';
import { getPeopleByDocNumberRequest } from '../api/people.js';
import { useNavigate } from 'react-router-dom';
const TestsFormPage = () => {
  const { createTests } = useTests();
  const [form, setForm] = useState({
    user: "",
    date: "",
    docnumber: "",
    names: "",
    company: "",
    dominanthand: "",
    mineplacementtime1: "",
    mineplacementtime2: "",
    mineplacementtotal: "",
    mineplacementscale: "",
    minerotationtime1: "",
    minerotationtime2: "",
    minerotationtotal: "",
    minerotationscale: "",
    minedisplacementtime1: "",
    minedisplacementtime2: "",
    minedisplacementtotal: "",
    minedisplacementscale: "",
    mineobservations: "",
    purdedominanthand: "",
    purdedominanthandscale: "",
    purdenodominanthand: "",
    purdenodominanthandscale: "",
    purdebothhands: "",
    purdebothhandsscale: "",
    purdeassemble: "",
    purdeassemblescale: "",
    purdeobservations: "",
    activityjtest: "",
    activityjtestscale: "",
    activityjtestobservations: "",
    reaction1: "",
    reaction1scale: "",
    reaction2: "",
    reaction2scale: "",
    reactionobservations: "",
    fingers: "",
    fingersscale: "",
    fingersobservations: "",
    ishinormalvision: "",
    ishideuteranopia: "",
    ishiportanopia: "",
    ishidaltonism: "",
    ishiobservations: "",
    startime: "",
    starTimeOne: "",
    startoucherrors: "",
    starTouchErrorsOne: "",
    wireGameTime: "",
    wireGameError: "",
    wireGameLevel: "",
    visualAcuity: "",
    visualAcuityLevel: ""
  });

  const [searchId, setSearchId] = useState("");
  const [personInfo, setPersonInfo] = useState({
    names: "",
    docnumber: "",
    company: "",
    dominanthand: ""
  });

  useEffect(() => {
    const time1 = parseFloat(form.mineplacementtime1) || 0;
    const time2 = parseFloat(form.mineplacementtime2) || 0;
    const total = time1 + time2;
    setForm((prevForm) => ({
      ...prevForm,
      mineplacementtotal: total.toString(),
      mineplacementscale: getMinePlacementScale(total),
    }));
  }, [form.mineplacementtime1, form.mineplacementtime2]);

  const getMinePlacementScale = (total) => {
    if (total >= 139) return "MUY BAJO";
    if (total >= 128) return "BAJO";
    if (total >= 117) return "MEDIO";
    if (total >= 108) return "ALTO";
    if (total >=1) return "MUY ALTO";
    return "NO APLICA";
  };

  useEffect(() => {
    const time1 = parseFloat(form.minerotationtime1) || 0;
    const time2 = parseFloat(form.minerotationtime2) || 0;
    const total = time1 + time2;
    setForm((prevForm) => ({
      ...prevForm,
      minerotationtotal: total.toString(),
      minerotationscale: getMineRotationTime(total),
    }));
  }, [form.minerotationtime1, form.minerotationtime2]);

  const getMineRotationTime = (total) => {
    if (total >= 113) return "MUY BAJO";
    if (total >= 104) return "BAJO";
    if (total >= 94) return "MEDIO";
    if (total >= 85) return "ALTO";
    if (total >= 1) return "MUY ALTO";
    return "NO APLICA";
  };


  useEffect(() => {
    const time1 = parseFloat(form.minedisplacementtime1) || 0;
    const time2 = parseFloat(form.minedisplacementtime2) || 0;
    const total = time1 + time2;
    setForm((prevForm) => ({
      ...prevForm,
      minedisplacementtotal: total.toString(),
      minedisplacementscale: getMineDisplacementtime(total),
    }));
  }, [form.minedisplacementtime1, form.minedisplacementtime2]);

  const getMineDisplacementtime = (total) => {
    if (total >= 106) return "MUY BAJO";
    if (total >= 98) return "BAJO";
    if (total >= 91) return "MEDIO";
    if (total >= 85) return "ALTO";
    if (total >= 1) return "MUY ALTO";
    return "NO APLICA";
  };


  useEffect(() => {
    // Si mineobservations está vacío o no es un número válido, dejamos el valor como "NO APLICA"
    if (!form.mineobservations || isNaN(form.mineobservations)) {
      setForm((prevForm) => ({
        ...prevForm,
        purdedominanthand: "NO APLICA",
      }));
      return;
    }
  
    // Si hay un valor válido en mineobservations, calculamos el valor de purdedominanthand
    const time1 = parseFloat(form.mineobservations);
    const total = time1.toString();
    setForm((prevForm) => ({
      ...prevForm,
      purdedominanthand: getPurdeminanthad(total),
    }));
  }, [form.mineobservations]);
  
  const getPurdeminanthad = (total) => {
    if (total <= 16) return "MUY BAJO";
    if (total <= 17) return "BAJO";
    if (total <= 19) return "MEDIO";
    if (total <= 20) return "ALTO";
    if (total >= 21) return "MUY ALTO";
    return "NO APLICA";
  };

  useEffect(() => {
    // Verificamos si purdedominanthandscale tiene un valor válido
    const time1 = parseFloat(form.purdedominanthandscale);
    
    if (isNaN(time1) || form.purdedominanthandscale === "") {
      // Si no es un número válido o está vacío, lo dejamos en "NO APLICA"
      setForm((prevForm) => ({
        ...prevForm,
        purdenodominanthand: "NO APLICA",
      }));
    } else {
      // Si es un número válido, calculamos el valor de purdenodominanthand
      const total = time1.toString();
      setForm((prevForm) => ({
        ...prevForm,
        purdenodominanthand: getPurdenodominanthand(total),
      }));
    }
  }, [form.purdedominanthandscale]);
  
  const getPurdenodominanthand = (total) => {
    if (total <= 14) return "MUY BAJO";
    if (total <= 16) return "BAJO";
    if (total <= 18) return "MEDIO";
    if (total <= 19) return "ALTO";
    if (total >= 20) return "MUY ALTO";
    return "NO APLICA";
  };

  useEffect(() => {
    const time1 = parseFloat(form.purdenodominanthandscale);
    if (isNaN(time1) || form.purdenodominanthandscale === "") {
      setForm((prevForm) => ({
        ...prevForm,
        purdebothhands: "NO APLICA",
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        purdebothhands: getPurdebothhands(time1),
      }));
    }
  }, [form.purdenodominanthandscale]);
  
  const getPurdebothhands = (total) => {
    if (total <= 13) return "MUY BAJO";
    if (total <= 14) return "BAJO";
    if (total <= 16) return "MEDIO";
    if (total <= 17) return "ALTO";
    if (total >= 18) return "MUY ALTO";
    return "NO APLICA";
  };

  useEffect(() => {
    const time1 = parseFloat(form.purdebothhandsscale);
    if (isNaN(time1) || form.purdebothhandsscale === "") {
      setForm((prevForm) => ({
        ...prevForm,
        purdeassemble: "NO APLICA",
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        purdeassemble: getPurdeassemble(time1),
      }));
    }
  }, [form.purdebothhandsscale]);
  
  const getPurdeassemble = (total) => {
    if (total <= 37) return "MUY BAJO";
    if (total <= 42) return "BAJO";
    if (total <= 46) return "MEDIO";
    if (total <= 51) return "ALTO";
    if (total >= 52) return "MUY ALTO";
    return "NO APLICA";
  };

  useEffect(() => {
    const time1 = parseFloat(form.activityjtest);
    if (isNaN(time1) || form.activityjtest === "") {
      setForm((prevForm) => ({
        ...prevForm,
        activityjtestscale: "NO APLICA",
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        activityjtestscale: getActivityjtestscale(time1),
      }));
    }
  }, [form.activityjtest]);
  
  const getActivityjtestscale = (total) => {
    if (total <= 43) return "MUY BAJO";
    if (total <= 50) return "BAJO";
    if (total <= 56) return "MEDIO";
    if (total <= 63) return "ALTO";
    if (total >= 64) return "MUY ALTO";
    return "NO APLICA";
  };

  useEffect(() => {
    const time1 = parseFloat(form.activityjtestobservations);
    if (isNaN(time1) || form.activityjtestobservations === "") {
      setForm((prevForm) => ({
        ...prevForm,
        reaction1: "NO APLICA",
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        reaction1: getReaction1(time1),
      }));
    }
  }, [form.activityjtestobservations]);
  
  const getReaction1 = (total) => {
    if (total <= 43) return "MUY BAJO";
    if (total <= 50) return "BAJO";
    if (total <= 56) return "MEDIO";
    if (total <= 63) return "ALTO";
    if (total >= 64) return "MUY ALTO";
    return "NO APLICA";
  };



  useEffect(() => {
    const time1 = parseFloat(form.reaction1scale);
    if (isNaN(time1) || form.reaction1scale === "") {
      setForm((prevForm) => ({
        ...prevForm,
        reaction2: "NO APLICA",
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        reaction2: getReaction2(time1),
      }));
    }
  }, [form.reaction1scale]);
  
  const getReaction2 = (total) => {
    if (total >= 301) return "NO TERMINO";
    if (total >= 272) return "MUY BAJO";
    if (total >= 181) return "BAJO";
    if (total >= 142) return "MEDIO";
    if (total >= 83) return "ALTO";
    if (total >= 1) return "MUY ALTO";
    return "NO APLICA";
  };

  useEffect(() => {
    const time1 = parseFloat(form.fingersobservations);
    if (isNaN(time1) || form.fingersobservations === "") {
      setForm((prevForm) => ({
        ...prevForm,
        ishinormalvision: "NO APLICA",
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        ishinormalvision: getIshinormalvision(time1),
      }));
    }
  }, [form.fingersobservations]);

  const getIshinormalvision = (total) => {
    if (total <= 3000) return "MUY BAJO";
    if (total <= 5500) return "BAJO";
    if (total <= 7600) return "MEDIO";
    if (total <= 10000) return "ALTO";
    if (total >= 10001) return "MUY ALTO";
    return "NO APLICA";
  };


  useEffect(() => {
    const time1 = parseFloat(form.ishideuteranopia);
    if (isNaN(time1) || form.ishideuteranopia === "") {
      setForm((prevForm) => ({
        ...prevForm,
        ishiportanopia: "NO APLICA",
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        ishiportanopia: getIshiportanopia(time1),
      }));
    }
  }, [form.ishideuteranopia]);

  const getIshiportanopia = (total) => {
    if (total <= 16100) return "MUY BAJO";
    if (total <= 22600) return "BAJO";
    if (total <= 31000) return "MEDIO";
    if (total <= 39900) return "ALTO";
    if (total >= 39901) return "MUY ALTO";
    return "NO APLICA";
  };

  useEffect(() => {
    const time1 = parseFloat(form.ishidaltonism);
    if (isNaN(time1) || form.ishidaltonism === "") {
      setForm((prevForm) => ({
        ...prevForm,
        ishiobservations: "NO APLICA",
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        ishiobservations: getIshiobservations(time1),
      }));
    }
  }, [form.ishidaltonism]);

  const getIshiobservations = (total) => {
    if (total <= 4300) return "MUY BAJO";
    if (total <= 7600) return "BAJO";
    if (total <= 11150) return "MEDIO";
    if (total <= 15250) return "ALTO";
    if (total >= 15251) return "MUY ALTO";
    return "NO APLICA";
  };


  useEffect(() => {
    const time1 = parseFloat(form.startime);
    if (isNaN(time1) || form.startime === "") {
      setForm((prevForm) => ({
        ...prevForm,
        starTimeOne: "NO APLICA",
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        starTimeOne: getStartime(time1),
      }));
    }
  }, [form.startime]);

  const getStartime = (total) => {
    if (total >= 190) return "MUY BAJO";
    if (total >= 153 && total < 190) return "BAJO";
    if (total >= 128 && total < 153) return "MEDIO";
    if (total >= 101 && total < 128) return "ALTO";
    if (total >= 1) return "MUY ALTO";
    return "NO APLICA";
  };

  useEffect(() => {
    const time1 = parseFloat(form.startoucherrors);
    if (isNaN(time1) || form.startoucherrors === "") {
      setForm((prevForm) => ({
        ...prevForm,
        starTouchErrorsOne: "NO APLICA",
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        starTouchErrorsOne: getStartoucherrors(time1),
      }));
    }
  }, [form.startoucherrors]);

  const getStartoucherrors = (total) => {
    if (total >= 44) return "MUY BAJO";
    if (total >= 23) return "BAJO";
    if (total >= 12) return "MEDIO";
    if (total >= 6) return "ALTO";
    if (total >= 1) return "MUY ALTO";
    return "NO APLICA";
  };

  useEffect(() => {
    const snellenValue = form.visualAcuity;
    setForm((prevForm) => ({
      ...prevForm,
      visualAcuityLevel: getVisualAcuity(snellenValue),
    }));
  }, [form.visualAcuity]);

  const getVisualAcuity = (snellenValue) => {
    switch (snellenValue) {
      case "20/200":
      case "20/100":
      case "20/70":
      case "20/50":
      case "20/40":
      case "20/30":
      case "20/25":
        return "Agudeza visual deficiente";
      case "20/20":
      case "20/15":
      case "20/12":
      case "20/10":
        return "Agudeza visual buena";
      default:
        return "NO APLICA";
    }
  };

  useEffect(() => {
    const tiempo = parseFloat(form.wireGameTime);
    const errores = parseInt(form.wireGameError, 10);
    
    // Verificamos si los valores son válidos, si no lo son, asignamos "NO APLICA"
    if (isNaN(tiempo) || isNaN(errores)) {
      setForm((prevForm) => ({
        ...prevForm,
        wireGameLevel: "NO APLICA",
      }));
      return; // salimos de la función si los valores no son válidos
    }
  
    const nivel = calcularNivelWireGame(tiempo, errores);
  
    setForm((prevForm) => ({
      ...prevForm,
      wireGameLevel: nivel,
    }));
  }, [form.wireGameTime, form.wireGameError]);
  
  const calcularNivelWireGame = (tiempo, errores) => {
    if (tiempo <= 36 && (errores === 0 || errores === 1)) {
      return "ALTO";
    } else if (tiempo >= 37 && tiempo <= 40 && errores >= 2 && errores <= 4) {
      return "MEDIO";
    } else if (tiempo > 41 && errores > 5) {
      return "BAJO";
    }
    return "NO APLICA"; // Si no se cumplen las condiciones, devolvemos "NO APLICA"
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let processedValue = value;

    if (name === "date") {
      // No hacer conversión de zona horaria, mantener la fecha tal cual se selecciona.
      processedValue = value;
    }

    setForm((prevForm) => ({
      ...prevForm,
      [name]: processedValue,
    }));
  };



  const handleSearchInputChange = (e) => {
    setSearchId(e.target.value);
  };

  const navigate = useNavigate();

  const handleSearchPerson = async () => {
    try {
      const res = await getPeopleByDocNumberRequest(searchId);
      const people = res.data;

      if (!people) {
        navigate('/add-people2');
        return;
      }

      setForm({
        ...form,
        names: people.names || "",
        docnumber: people.docnumber || "",
        company: people.company || "",
        dominanthand: people.dominanthand || ""
      });

      setPersonInfo({
        names: people.names || "",
        docnumber: people.docnumber || "",
        company: people.company || "",
        dominanthand: people.dominanthand || ""
      });
      setForm((prevForm) => ({ ...prevForm, user: people._id }));
    } catch (error) {
      console.log("Person search failed:", error);
      navigate('/add-people2'); // Redirige a la página de 'people' en caso de error
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Reemplazar los campos vacíos con "No Aplica"
    const formWithNoAplica = { ...form };
  
    for (let key in formWithNoAplica) {
      if (formWithNoAplica[key] === "") {
        formWithNoAplica[key] = "No Aplica";
      }
    }
  
    try {
      // Crear el test con los datos procesados
      await createTests(formWithNoAplica);
      
      // Restablecer el formulario a su estado inicial
      setForm({
        user: "",
        date: "",
        docnumber: "",
        names: "",
        company: "",
        dominanthand: "",
        mineplacementtime1: "",
        mineplacementtime2: "",
        mineplacementtotal: "",
        mineplacementscale: "",
        minerotationtime1: "",
        minerotationtime2: "",
        minerotationtotal: "",
        minerotationscale: "",
        minedisplacementtime1: "",
        minedisplacementtime2: "",
        minedisplacementtotal: "",
        minedisplacementscale: "",
        mineobservations: "",
        purdedominanthand: "",
        purdedominanthandscale: "",
        purdenodominanthand: "",
        purdenodominanthandscale: "",
        purdebothhands: "",
        purdebothhandsscale: "",
        purdeassemble: "",
        purdeassemblescale: "",
        purdeobservations: "",
        activityjtest: "",
        activityjtestscale: "",
        activityjtestobservations: "",
        reaction1: "",
        reaction1scale: "",
        reaction2: "",
        reaction2scale: "",
        reactionobservations: "",
        fingers: "",
        fingersscale: "",
        fingersobservations: "",
        ishinormalvision: "",
        ishideuteranopia: "",
        ishiportanopia: "",
        ishidaltonism: "",
        ishiobservations: "",
        startime: "",
        startoucherrors: "",
        starTimeOne: "",
        starTouchErrorsOne: "",
        wireGameTime: "",
        wireGameError: "",
        wireGameLevel: "",
        visualAcuity: "",
        visualAcuityLevel: ""
      });
      
      // Restablecer la información de la persona
      setPersonInfo({
        names: "",
        docnumber: "",
        company: "",
        dominanthand: ""
      });
  
      // Limpiar el ID de búsqueda
      setSearchId("");
  
      // Redirigir a la página de tests
      navigate('/tests');
    } catch (error) {
      console.error('Error al crear el test:', error);
    }
  };
  
  return (

    <div className='flex items-center justify-center my-2 px-4'>
      <div className="bg-blueSena max-w-6xl w-full p-6 md:p-10 rounded-md">
        <form onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4'>
            {/* Sección para búsqueda */}
            <div className='col-span-2'>
              <h2 className='text-lg font-semibold'>Ingrese Documento</h2>
              <input type="text"
                name="searchId"
                placeholder="Ingrese documento"
                value={searchId}
                onChange={handleSearchInputChange}
                className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
              <div className='flex col-span-1'>
                <button
                  type="button"
                  onClick={handleSearchPerson}
                  className="px-4 py-2 bg-greenSena text-white rounded-md mt-2 w-1/2"
                >
                  Buscar
                </button>
              </div>
            </div>

            <div className='col-span-2'>
              <h2 className='text-lg font-semibold'>Fecha de prueba</h2>
              <input
                type="date" name="date"
                placeholder="Date" value={form.date}
                onChange={handleInputChange}
                className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>

            <hr className='col-span-4 my-4' />

            <h1 className='col-span-4 text-center text-xl font-bold'>INFORMACION DEL USUARIO</h1>

            <div className='col-span-1'>
              <input type="text"
                name="names"
                placeholder="Nombre"
                value={form.names}
                disabled className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-1'>
              <input type="text"
                name="docnumber"
                placeholder="Documento"
                value={form.docnumber}
                disabled className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-1'>
              <input type="text"
                name="company"
                placeholder="Empresa"
                value={form.company}
                disabled className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-1'>
              <input
                type="text"
                name="dominanthand"
                placeholder="Mano Dominante"
                value={form.dominanthand}
                disabled className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>

            <hr className='col-span-4 my-4' />

            <h1 className='col-span-4 text-center text-xl font-bold'>MINESOTA</h1>

            <h2 className='col-span-4 text-lg font-semibold'>COLOCACION</h2>
            <div className='col-span-1'>
              <h2>Intento 1</h2>
              <input type="text"
                name="mineplacementtime1"
                placeholder="Tiempo 1"
                value={form.mineplacementtime1}
                onChange={handleInputChange}
                className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-1'>
              <h2>Intento 2</h2>
              <input type="text"
                name="mineplacementtime2"
                placeholder="Tiempo 2"
                value={form.mineplacementtime2}
                onChange={handleInputChange}
                className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-1'>
              <h2>Total</h2>
              <input type="text"
                name="mineplacementtotal"
                placeholder="Total"
                value={form.mineplacementtotal}
                readOnly className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-1'>
              <h2>Escala</h2>
              <input type="text"
                name="mineplacementscale"
                placeholder="Escala"
                value={form.mineplacementscale}
                readOnly className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>

            <h2 className='col-span-4 text-lg font-semibold'>ROTACION</h2>
            <div className='col-span-1'>
              <h2>Intento 1</h2>
              <input type="text"
                name="minerotationtime1"
                placeholder="Tiempo 1"
                value={form.minerotationtime1}
                onChange={handleInputChange}
                className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-1'>
              <h2>Intento 2</h2>
              <input type="text"
                name="minerotationtime2"
                placeholder="Tiempo 2"
                value={form.minerotationtime2}
                onChange={handleInputChange}
                className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-1'>
              <h2>Total</h2>
              <input type="text"
                name="minerotationtotal"
                placeholder="Total"
                value={form.minerotationtotal}
                readOnly className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-1'>
              <h2>Escala</h2>
              <input type="text"
                name="minerotationscale"
                placeholder="Escale"
                value={form.minerotationscale}
                readOnly className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>

            <h2 className='col-span-4 text-lg font-semibold'>DESPLAZAMIENTO</h2>
            <div className='col-span-1'>
              <h2>Intento 1</h2>
              <input type="text"
                name="minedisplacementtime1"
                placeholder="Tiempo 1"
                value={form.minedisplacementtime1}
                onChange={handleInputChange}
                className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-1'>
              <h2>Intento 2</h2>
              <input type="text"
                name="minedisplacementtime2"
                placeholder="Tiempo 2"
                value={form.minedisplacementtime2}
                onChange={handleInputChange}
                className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-1'>
              <h2>Total</h2>
              <input type="text"
                name="minedisplacementtotal"
                placeholder="Total"
                value={form.minedisplacementtotal}
                readOnly className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-1'>
              <h2>Escala</h2>
              <input type="text"
                name="minedisplacementscale"
                placeholder="Escale"
                value={form.minedisplacementscale}
                readOnly className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>

            <hr className='col-span-4 my-4' />

            <h1 className='col-span-4 text-center text-xl font-bold'>PURDUE</h1>

            <h2 className='col-span-2 text-lg font-semibold'>MANO DOMINANTE</h2>
            <h2 className='col-span-2 text-lg font-semibold'>MANO NO DOMINANTE</h2>
            <div className='col-span-1'>
              <h2>Numerica</h2>
              <input type="text"
                name="mineobservations"
                placeholder="Numerica"
                value={form.mineobservations}
                onChange={handleInputChange}
                className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-1'>
              <h2>Escala</h2>
              <input type="text"
                name="purdedominanthand"
                placeholder="Total"
                value={form.purdedominanthand}
                onChange={handleInputChange}
                readOnly className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>

            <div className='col-span-1'>
              <h2>Numerica</h2>
              <input type="text"
                name="purdedominanthandscale"
                placeholder="Numerica"
                value={form.purdedominanthandscale}
                onChange={handleInputChange}
                className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-1'>
              <h2>Escala</h2>
              <input type="text"
                name="purdenodominanthand"
                placeholder="Purdue Dominant Hand Total"
                value={form.purdenodominanthand}
                readOnly className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <h2 className='col-span-2 text-lg font-semibold'> AMBAS MANO</h2>
            <h2 className='col-span-2 text-lg font-semibold'>ENSAMBLE</h2>
            <div className='col-span-1'>
              <h2>Numerica</h2>
              <input type="text"
                name="purdenodominanthandscale"
                placeholder="Numerica"
                value={form.purdenodominanthandscale}
                onChange={handleInputChange}
                className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-1'>
              <h2>Escala</h2>
              <input type="text"
                name="purdebothhands"
                placeholder="Purdue Dominant Hand Total"
                value={form.purdebothhands}
                readOnly className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-1'>
              <h2>Numerica</h2>
              <input type="text"
                name="purdebothhandsscale"
                placeholder="Numerica"
                value={form.purdebothhandsscale}
                onChange={handleInputChange}
                className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-1'>
              <h2>Escala</h2>
              <input type="text"
                name="purdeassemble"
                placeholder="Purdue Dominant Hand Total"
                value={form.purdeassemble}
                readOnly className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <hr className='col-span-4 my-4' />
            <h1 className='col-span-4 text-center text-xl font-bold'>TEST DE JUICIO DE ACTIVIDAD</h1>
            <h2 className='col-span-4 text-lg font-semibold'>CON DISTRACTOR</h2>
            <div className='col-span-2'>
              <h2>Aciertos</h2>
              <input type="text"
                name="purdeassemblescale"
                placeholder="Aciertos"
                value={form.purdeassemblescale}
                onChange={handleInputChange}
                className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-2'>
              <h2>Escala</h2>
              <select
                name="purdeobservations"
                value={form.purdeobservations}
                onChange={handleInputChange}
                className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              >
                <option value="">Selecciona una opción</option>
                <option value="MUY ALTO">MUY ALTO</option>
                <option value="ALTO">ALTO</option>
                <option value="MEDIO">MEDIO</option>
                <option value="BAJO">BAJO</option>
                <option value="MUY BAJO">MUY BAJO</option>

              </select>
            </div>
            <hr className='col-span-4 my-4' />
            <h1 className='col-span-4 text-center text-xl font-bold'>TEST DE REACCION (VISION PERIFERICA)</h1>
            <h2 className='col-span-2 text-lg font-semibold'>INTENTO 1</h2>
            <h2 className='col-span-2 text-lg font-semibold'>INTENTO 2</h2>
            <div className='col-span-1'>
              <h2>Aciertos</h2>
              <input type="text"
                name="activityjtest"
                placeholder="Aciertos"
                value={form.activityjtest}
                onChange={handleInputChange}
                className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-1'>
              <h2>Escala</h2>
              <input type="text"
                name="activityjtestscale"
                placeholder="Escalas"
                value={form.activityjtestscale}
                readOnly className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-1'>
              <h2>Aciertos</h2>
              <input type="text"
                name="activityjtestobservations"
                placeholder="Aciertos"
                value={form.activityjtestobservations}
                onChange={handleInputChange}
                className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-1'>
              <h2>Escala</h2>
              <input type="text"
                name="reaction1"
                placeholder="Escalas"
                value={form.reaction1}
                readOnly className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <hr className='col-span-4 my-4' />
            <h1 className='col-span-4 text-center text-xl font-bold'>TEST DE ESTRELLA</h1>
            <h2 className='col-span-2 text-lg font-semibold'>TIEMPO(seg)</h2>
            <h2 className='col-span-2 text-lg font-semibold'>ERRORES(toques)</h2>
            <div className='col-span-1'>
              <h2>Aciertos</h2>
              <input type="text"
                name="startime"
                placeholder="Aciertos"
                value={form.startime}
                onChange={handleInputChange}
                className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-1'>
              <h2>Escala</h2>
              <input type="text"
                name="starTimeOne"
                placeholder="Escalas"
                value={form.starTimeOne}
                readOnly className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-1'>
              <h2>Aciertos</h2>
              <input type="text"
                name="startoucherrors"
                placeholder="Aciertos"
                value={form.startoucherrors}
                onChange={handleInputChange}
                className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-1'>
              <h2>Escala</h2>
              <input type="text"
                name="starTouchErrorsOne"
                placeholder="Escalas"
                value={form.starTouchErrorsOne}
                readOnly className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <hr className='col-span-4 my-4' />
            <h1 className='col-span-4 text-center text-xl font-bold'>WIRE GAME</h1>
            <div className='col-span-1'>
              <h2>Tiempo(Seg)</h2>
              <input type="text"
                name="wireGameTime"
                placeholder="Tiempo"
                value={form.wireGameTime}
                onChange={handleInputChange}
                className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-1'>
              <h2>Errores</h2>
              <input type="text"
                name="wireGameError"
                placeholder="Errores"
                value={form.wireGameError}
                onChange={handleInputChange}
                className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-2'>
              <h2>Nivel</h2>
              <input type="text"
                name="wireGameLevel"
                placeholder="Nivel"
                value={form.wireGameLevel}
                readOnly className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <hr className='col-span-4 my-4' />
            <h1 className='col-span-4 text-center text-xl font-bold'>AGUDEZA VISUAL</h1>
            <div className='col-span-2'>
              <h2>Línea de Snellen</h2>
              <select
                name="visualAcuity"
                value={form.visualAcuity}
                onChange={handleInputChange}
                className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              >
                <option value="">Selecciona una opción</option>
                <option value="20/200">20/200</option>
                <option value="20/100">20/100</option>
                <option value="20/70">20/70</option>
                <option value="20/50">20/50</option>
                <option value="20/40">20/40</option>
                <option value="20/30">20/30</option>
                <option value="20/25">20/25</option>
                <option value="20/20">20/20</option>
                <option value="20/15">20/15</option>
                <option value="20/12">20/12</option>
                <option value="20/10">20/10</option>
              </select>
            </div>

            <div className='col-span-2'>
              <h2>Escala</h2>
              <input type="text"
                name="visualAcuityLevel"
                placeholder="Escalas"
                value={form.visualAcuityLevel}
                readOnly className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>

            <hr className='col-span-4 my-4' />
            <h1 className='col-span-4 text-center text-xl font-bold'>DEDOS</h1>
            <h2 className='col-span-4 text-lg font-semibold'>INTENTO 1</h2>
            <div className='col-span-2'>
              <h2>Tiempo</h2>
              <input type="text"
                name="reaction1scale"
                placeholder="Aciertos"
                value={form.reaction1scale}
                onChange={handleInputChange}
                className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-2'>
              <h2>Nivel</h2>
              <input type="text"
                name="reaction2"
                placeholder="Escalas"
                value={form.reaction2}
                readOnly className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <hr className='col-span-4 my-4' />
            <h1 className='col-span-4 text-center text-xl font-bold'>TEST DE ISHIHARA (DALTONISMO)</h1>
            <h2 className='col-span-4 text-lg font-semibold'>INTENTO 1</h2>
            <div className='col-span-1'>
              <h2>% De Vision Normal</h2>
              <input type="text"
                name="reaction2scale"
                placeholder="% De Vision Normal"
                value={form.reaction2scale}
                onChange={handleInputChange}
                className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div><div className='col-span-1'>
              <h2>% De Protanopia</h2>
              <input type="text"
                name="reactionobservations"
                placeholder="% De Portanopia"
                value={form.reactionobservations}
                onChange={handleInputChange}
                className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div><div className='col-span-1'>
              <h2>% De Deuteranopia</h2>
              <input type="text"
                name="fingers"
                placeholder="% De Deuterapia"
                value={form.fingers}
                onChange={handleInputChange}
                className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div><div className='col-span-1'>
              <h2>% Total Daltonismo</h2>
              <input type="text"
                name="fingersscale"
                placeholder="% Total Daltonismo"
                value={form.fingersscale}
                onChange={handleInputChange}
                className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <hr className='col-span-4 my-4' />
            <h1 className='col-span-4 text-center text-xl font-bold'>LUMOSITY</h1>
            <h2 className='col-span-2 text-lg font-semibold'>TREN</h2>
            <h2 className='col-span-2 text-lg font-semibold'>MEMORIAS DEL MAR</h2>
            <div className='col-span-1'>
              <h2>Puntos</h2>
              <input type="text"
                name="fingersobservations"
                placeholder="Puntos"
                value={form.fingersobservations}
                onChange={handleInputChange}
                className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-1'>
              <h2>Nivel</h2>
              <input type="text"
                name="ishinormalvision"
                placeholder="Nivel"
                value={form.ishinormalvision}
                readOnly className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-1'>
              <h2>Puntos</h2>
              <input type="text"
                name="ishideuteranopia"
                placeholder="Puntos"
                value={form.ishideuteranopia}
                onChange={handleInputChange}
                className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-1'>
              <h2>Nivel</h2>
              <input type="text"
                name="ishiportanopia"
                placeholder="Nivel"
                value={form.ishiportanopia}
                readOnly className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <h2 className='col-span-4 text-lg font-semibold'>AVES</h2>
            <div className='col-span-2'>
              <h2>Puntos</h2>
              <input type="text"
                name="ishidaltonism"
                placeholder="Puntos"
                value={form.ishidaltonism}
                onChange={handleInputChange}
                className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>
            <div className='col-span-2'>
              <h2>Nivel</h2>
              <input type="text"
                name="ishiobservations"
                placeholder="Nivel"
                value={form.ishiobservations}
                readOnly className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
              />
            </div>


            <div className='flex justify-center col-span-4'>
              <button
                type="submit"
                className="px-4 py-2 bg-ester text-white rounded-md mt-4"
              >
                Crear Prueba
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>



  );
};

export default TestsFormPage;
