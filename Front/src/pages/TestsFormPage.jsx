import React, { useState, useEffect } from "react";
import { useTests } from "../context/TestsContext";
import { getPeopleByDocNumberRequest } from "../api/people.js";
import { useNavigate } from "react-router-dom";

const TestsFormPage = () => {
  const { createTests } = useTests();
  // Estado para los campos numéricos de entrada
  const [numericInputs, setNumericInputs] = useState({
    mineplacementtime1: "",
    mineplacementtime2: "",
    minerotationtime1: "",
    minerotationtime2: "",
    minedisplacementtime1: "",
    minedisplacementtime2: "",
    purdedominanthand_numeric: "",
    purdenodominanthand_numeric: "",
    purdebothhands_numeric: "",
    purdeassemble_numeric: "",
    activityjtest_numeric: "",
    reaction1_numeric: "",
    reaction2_numeric: "",
    fingers_numeric: "",
    ishinormalvision_numeric: "",
    ishideuteranopia_numeric: "",
    ishiportanopia_numeric: "",
    ishidaltonism_numeric: "",
    startime_numeric: "",
    startoucherrors_numeric: "",
    wireGameTime: "",
    wireGameError: "",
    lumosityTrain: "",
    lumosityMemory: "",
    lumosityBirds: "",
  });

  // Estado para el formulario principal que se enviará
  const [form, setForm] = useState({
    user: "",
    date: "",
    docnumber: "",
    names: "",
    company: "",
    dominanthand: "",
    mineplacementtotal: "",
    mineplacementscale: "",
    minerotationtotal: "",
    minerotationscale: "",
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
    wireGameLevel: "",
    visualAcuity: "",
    visualAcuityLevel: "",
    lumosityTrain: "",
    lumosityMemory: "",
    lumosityBirds: "",
  });

  const [searchId, setSearchId] = useState("");
  const [personInfo, setPersonInfo] = useState({
    names: "",
    docnumber: "",
    company: "",
    dominanthand: "",
  });

  // Helper function to get scale
  const getScale = (total, thresholds, higherIsBetter = true) => {
    const scales = ["MUY BAJO", "BAJO", "MEDIO", "ALTO", "MUY ALTO"];
    if (higherIsBetter) {
      for (let i = 0; i < thresholds.length; i++) {
        if (total <= thresholds[i]) return scales[i];
      }
      return "MUY ALTO";
    } else {
      for (let i = 0; i < thresholds.length; i++) {
        if (total >= thresholds[i]) return scales[i];
      }
      return "MUY ALTO";
    }
  };

  // Effects for calculations
  useEffect(() => {
    const time1 = parseFloat(numericInputs.mineplacementtime1) || 0;
    const time2 = parseFloat(numericInputs.mineplacementtime2) || 0;
    const total = time1 + time2;
    setForm((prev) => ({
      ...prev,
      mineplacementtotal: total,
      mineplacementscale: getScale(total, [139, 128, 117, 108], false),
    }));
  }, [numericInputs.mineplacementtime1, numericInputs.mineplacementtime2]);

  useEffect(() => {
    const time1 = parseFloat(numericInputs.minerotationtime1) || 0;
    const time2 = parseFloat(numericInputs.minerotationtime2) || 0;
    const total = time1 + time2;
    setForm((prev) => ({
      ...prev,
      minerotationtotal: total,
      minerotationscale: getScale(total, [113, 104, 94, 85], false),
    }));
  }, [numericInputs.minerotationtime1, numericInputs.minerotationtime2]);

  useEffect(() => {
    const time1 = parseFloat(numericInputs.minedisplacementtime1) || 0;
    const time2 = parseFloat(numericInputs.minedisplacementtime2) || 0;
    const total = time1 + time2;
    setForm((prev) => ({
      ...prev,
      minedisplacementtotal: total,
      minedisplacementscale: getScale(total, [106, 98, 91, 85], false),
    }));
  }, [numericInputs.minedisplacementtime1, numericInputs.minedisplacementtime2]);

  useEffect(() => {
    const value = parseFloat(numericInputs.purdedominanthand_numeric);
    if (!isNaN(value)) {
      setForm((prev) => ({
        ...prev,
        purdedominanthand: value,
        purdedominanthandscale: getScale(value, [16, 17, 19, 20]),
      }));
    }
  }, [numericInputs.purdedominanthand_numeric]);

  useEffect(() => {
    const value = parseFloat(numericInputs.purdenodominanthand_numeric);
    if (!isNaN(value)) {
      setForm((prev) => ({
        ...prev,
        purdenodominanthand: value,
        purdenodominanthandscale: getScale(value, [14, 16, 18, 19]),
      }));
    }
  }, [numericInputs.purdenodominanthand_numeric]);

  useEffect(() => {
    const value = parseFloat(numericInputs.purdebothhands_numeric);
    if (!isNaN(value)) {
      setForm((prev) => ({
        ...prev,
        purdebothhands: value,
        purdebothhandsscale: getScale(value, [13, 14, 16, 17]),
      }));
    }
  }, [numericInputs.purdebothhands_numeric]);

  useEffect(() => {
    const value = parseFloat(numericInputs.purdeassemble_numeric);
    if (!isNaN(value)) {
      setForm((prev) => ({
        ...prev,
        purdeassemble: value,
        purdeassemblescale: getScale(value, [37, 42, 46, 51]),
      }));
    }
  }, [numericInputs.purdeassemble_numeric]);

  useEffect(() => {
    const value = parseFloat(numericInputs.activityjtest_numeric);
    if (!isNaN(value)) {
      setForm((prev) => ({
        ...prev,
        activityjtest: value,
        activityjtestscale: getScale(value, [43, 50, 56, 63]),
      }));
    }
  }, [numericInputs.activityjtest_numeric]);

  useEffect(() => {
    const value = parseFloat(numericInputs.reaction1_numeric);
    if (!isNaN(value)) {
      setForm((prev) => ({
        ...prev,
        reaction1: value,
        reaction1scale: getScale(value, [43, 50, 56, 63]),
      }));
    }
  }, [numericInputs.reaction1_numeric]);

  useEffect(() => {
    const value = parseFloat(numericInputs.reaction2_numeric);
    if (!isNaN(value)) {
      setForm((prev) => ({
        ...prev,
        reaction2: value,
        reaction2scale: getScale(value, [301, 272, 181, 142, 83], false),
      }));
    }
  }, [numericInputs.reaction2_numeric]);

  useEffect(() => {
    const value = parseFloat(numericInputs.fingers_numeric);
    if (!isNaN(value)) {
      setForm((prev) => ({
        ...prev,
        fingers: value,
        fingersscale: "NO APLICA", // As per original logic, no scale for fingers
      }));
    }
  }, [numericInputs.fingers_numeric]);

  useEffect(() => {
    const value = parseFloat(numericInputs.ishinormalvision_numeric);
    if (!isNaN(value)) {
      setForm((prev) => ({ ...prev, ishinormalvision: value }));
    }
  }, [numericInputs.ishinormalvision_numeric]);
  useEffect(() => {
    const value = parseFloat(numericInputs.ishideuteranopia_numeric);
    if (!isNaN(value)) {
      setForm((prev) => ({ ...prev, ishideuteranopia: value }));
    }
  }, [numericInputs.ishideuteranopia_numeric]);

  useEffect(() => {
    const value = parseFloat(numericInputs.ishiportanopia_numeric);
    if (!isNaN(value)) {
      setForm((prev) => ({ ...prev, ishiportanopia: value }));
    }
  }, [numericInputs.ishiportanopia_numeric]);

  useEffect(() => {
    const value = parseFloat(numericInputs.ishidaltonism_numeric);
    if (!isNaN(value)) {
      setForm((prev) => ({ ...prev, ishidaltonism: value }));
    }
  }, [numericInputs.ishidaltonism_numeric]);

  useEffect(() => {
    const value = parseFloat(numericInputs.startime_numeric);
    if (!isNaN(value)) {
      setForm((prev) => ({
        ...prev,
        startime: value,
        starTimeOne: getScale(value, [190, 153, 128, 101], false),
      }));
    }
  }, [numericInputs.startime_numeric]);

  useEffect(() => {
    const value = parseFloat(numericInputs.startoucherrors_numeric);
    if (!isNaN(value)) {
      setForm((prev) => ({
        ...prev,
        startoucherrors: value,
        starTouchErrorsOne: getScale(value, [44, 23, 12, 6], false),
      }));
    }
  }, [numericInputs.startoucherrors_numeric]);

  useEffect(() => {
    const snellenValue = form.visualAcuity;
    let level = "NO APLICA";
    if (
      ["20/200", "20/100", "20/70", "20/50", "20/40", "20/30", "20/25"].includes(
        snellenValue
      )
    ) {
      level = "Agudeza visual deficiente";
    } else if (
      ["20/20", "20/15", "20/12", "20/10"].includes(snellenValue)
    ) {
      level = "Agudeza visual buena";
    }
    setForm((prev) => ({ ...prev, visualAcuityLevel: level }));
  }, [form.visualAcuity]);

  useEffect(() => {
    const tiempo = parseFloat(numericInputs.wireGameTime);
    const errores = parseInt(numericInputs.wireGameError, 10);
    let nivel = "NO APLICA";
    if (!isNaN(tiempo) && !isNaN(errores)) {
      if (tiempo <= 36 && (errores === 0 || errores === 1)) {
        nivel = "ALTO";
      } else if (tiempo >= 37 && tiempo <= 40 && errores >= 2 && errores <= 4) {
        nivel = "MEDIO";
      } else if (tiempo > 41 && errores > 5) {
        nivel = "BAJO";
      }
    }
    setForm((prev) => ({ ...prev, wireGameLevel: nivel }));
  }, [numericInputs.wireGameTime, numericInputs.wireGameError]);

  const handleNumericInputChange = (e) => {
    const { name, value } = e.target;
    setNumericInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
        navigate("/add-people2");
        return;
      }

      setForm((prevForm) => ({
        ...prevForm,
        names: people.names || "",
        docnumber: people.docnumber || "",
        company: people.company ? people.company._id : "",
        companyLabel: people.company
          ? `${people.company.name} - ${people.company.headquarters || ""}`
          : "-",
        dominanthand: people.dominanthand || "",
        user: people._id,
      }));
    } catch (error) {
      console.log("Person search failed:", error);
      navigate("/add-people2");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalForm = { ...form, ...numericInputs };
    for (let key in finalForm) {
      if (finalForm[key] === "") {
        finalForm[key] = "No Aplica";
      }
    }
    await createTests(finalForm);
    navigate("/tests");
  };

  return (
    <div className="flex items-center justify-center my-2 px-4">
      <div className="bg-blueSena max-w-6xl w-full p-6 md:p-10 rounded-md">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {/* Search Section */}
            <div className="col-span-2">
              <h2 className="text-lg font-semibold">Ingrese Documento</h2>
              <input
                type="text"
                name="searchId"
                placeholder="Ingrese documento"
                value={searchId}
                onChange={handleSearchInputChange}
                className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
              />
              <button
                type="button"
                onClick={handleSearchPerson}
                className="px-4 py-2 bg-greenSena text-white rounded-md mt-2 w-1/2"
              >
                Buscar
              </button>
            </div>
            <div className="col-span-2">
              <h2 className="text-lg font-semibold">Fecha de prueba</h2>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleInputChange}
                className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
              />
            </div>

            <hr className="col-span-4 my-4" />

            <h1 className="col-span-4 text-center text-xl font-bold">
              INFORMACION DEL USUARIO
            </h1>

            {/* User Info Section */}
            <div className="col-span-1">
              <input
                type="text"
                name="names"
                placeholder="Nombre"
                value={form.names}
                disabled
                className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
              />
            </div>
            <div className="col-span-1">
              <input
                type="text"
                name="docnumber"
                placeholder="Documento"
                value={form.docnumber}
                disabled
                className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
              />
            </div>
            <div className="col-span-1">
              <input
                type="text"
                name="company"
                placeholder="Empresa"
                value={form.companyLabel}
                disabled
                className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
              />
            </div>
            <div className="col-span-1">
              <input
                type="text"
                name="dominanthand"
                placeholder="Mano Dominante"
                value={form.dominanthand}
                disabled
                className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
              />
            </div>

            <hr className="col-span-4 my-4" />

            <h1 className="col-span-4 text-center text-xl font-bold">
              MINESOTA
            </h1>

            {/* Minesota Section */}
            <h2 className="col-span-4 text-lg font-semibold">COLOCACION</h2>
            <div className="col-span-1">
              <h2>Intento 1</h2>
              <input
                type="text"
                name="mineplacementtime1"
                placeholder="Tiempo 1"
                value={numericInputs.mineplacementtime1}
                onChange={handleNumericInputChange}
                className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
              />
            </div>
            <div className="col-span-1">
              <h2>Intento 2</h2>
              <input
                type="text"
                name="mineplacementtime2"
                placeholder="Tiempo 2"
                value={numericInputs.mineplacementtime2}
                onChange={handleNumericInputChange}
                className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
              />
            </div>
            <div className="col-span-1">
              <h2>Total</h2>
              <input
                type="text"
                name="mineplacementtotal"
                placeholder="Total"
                value={form.mineplacementtotal}
                readOnly
                className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
              />
            </div>
            <div className="col-span-1">
              <h2>Escala</h2>
              <input
                type="text"
                name="mineplacementscale"
                placeholder="Escala"
                value={form.mineplacementscale}
                readOnly
                className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
              />
            </div>

            <hr className="col-span-4 my-4" />
            <h1 className="col-span-4 text-center text-xl font-bold">
              TEST DE ISHIHARA (DALTONISMO)
            </h1>
            {/* Ishihara Section */}
            <div className="col-span-1">
              <h2>% De Vision Normal</h2>
              <input
                type="text"
                name="ishinormalvision"
                placeholder="% De Vision Normal"
                value={numericInputs.ishinormalvision_numeric}
                onChange={handleNumericInputChange}
                className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
              />
            </div>
            <div className="col-span-1">
              <h2>% De Protanopia</h2>
              <input
                type="text"
                name="ishiportanopia"
                placeholder="% De Portanopia"
                value={numericInputs.ishiportanopia_numeric}
                onChange={handleNumericInputChange}
                className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
              />
            </div>
            <div className="col-span-1">
              <h2>% De Deuteranopia</h2>
              <input
                type="text"
                name="ishideuteranopia"
                placeholder="% De Deuterapia"
                value={numericInputs.ishideuteranopia_numeric}
                onChange={handleNumericInputChange}
                className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
              />
            </div>
            <div className="col-span-1">
              <h2>% Total Daltonismo</h2>
              <input
                type="text"
                name="ishidaltonism"
                placeholder="% Total Daltonismo"
                value={numericInputs.ishidaltonism_numeric}
                onChange={handleNumericInputChange}
                className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
              />
            </div>
            {/* Submit Button */}
            <div className="flex justify-center col-span-4">
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
