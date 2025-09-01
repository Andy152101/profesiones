import React, { useState } from "react";
//import { usePeoples } from "../context/PeopleContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const PeopleClientePage = () => {
  const { registerEmployee, errors } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  // Tomar datos de la empresa desde location.state
  //const companyId = location.state?.companyId || "";
  //const companyAccessCode = location.state?.companyAccessCode || "";
  //const companyName = location.state?.companyName || "";
  const accessCode = location.state?.accessCode || "";
  const [formError, setFormError] = useState(""); // para validaciones locales

  function createEmptyForm() {
    return {
      username: "",
      names: "",
      doctype: "",
      docnumber: "",
      birthdate: "",
      sex: "",
      phone: "",
      email: "",
      companytime: "",
      academiclevel: "",
      graduationdate: "",
      dominanthand: "",
      address: "",
      neighborhood: "",
      municipality: "",
      password: "", // Nueva propiedad para la contraseña
    };
  }

  const [form, setForm] = useState(createEmptyForm());

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" && (value.length > 10 || !/^\d*$/.test(value))) {
      return;
    }

    if (name === "companytime" && !/^\d*$/.test(value)) {
      return;
    }

    setForm({
      ...form,
      [name]: ["names", "address", "neighborhood"].includes(name)
        ? value.toUpperCase()
        : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que el email contenga un @
    if (!form.email.includes("@")) {
      setFormError({ formError: "El email debe contener un @" });
      return;
    }

    // Validar que el phone tenga exactamente 10 dígitos
    if (form.phone.length !== 10) {
      setFormError({
        formError: "El número de teléfono debe tener 10 dígitos",
      });
      return;
    }
    // Construir payload como lo espera el backend
    const payload = {
      username: form.username,
      email: form.email,
      password: form.password,
      companyAccessCode: accessCode, // viene de location.state
      peopleData: {
        names: form.names,
        email: form.email, // 👈 añadir aquí también
        doctype: form.doctype,
        docnumber: form.docnumber,
        birthdate: form.birthdate,
        sex: form.sex,
        phone: form.phone,
        companytime: form.companytime,
        academiclevel: form.academiclevel,
        graduationdate: form.graduationdate,
        dominanthand: form.dominanthand,
        address: form.address,
        neighborhood: form.neighborhood,
        municipality: form.municipality,
      },
    };

    const success = await registerEmployee(payload);

    if (success) {
      setForm(createEmptyForm());
      navigate("/"); // Redirige al index en caso de éxito
    }
  };

  return (
    <div className="flex items-center justify-center my-2 px-4">
      <div className="bg-ester max-w-2xl w-full p-6 md:p-10 rounded-md">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <div className="sm:col-span-2">
            {/* Código de acceso visible solo lectura */}
            <div className="sm:col-span-2">
              <label className="text-white">
                Código de Acceso de la Empresa *
              </label>
              <input
                type="text"
                name="companyAccessCode"
                value={accessCode}
                readOnly
                className="input w-full bg-white text-black px-4 py-2 rounded-md my-2"
              />
            </div>

            {formError && (
              <div className="col-span-2 text-red-500">{formError}</div>
            )}

            {/* Campo oculto para enviar el companyId al backend */}
            <input type="hidden" name="companyId" value={form.companyId} />
          </div>
          <div className="col-span-2">
            <h2 className="text-white">usuario</h2>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full bg-white text-black px-4 py-2 rounded-md my-2 uppercase"
              placeholder="NOMBRE COMPLETO"
              required
            />
          </div>

          <div className="col-span-2">
            <h2 className="text-white">Nombre Completo</h2>
            <input
              name="names"
              value={form.names}
              onChange={handleChange}
              className="w-full bg-white text-black px-4 py-2 rounded-md my-2 uppercase"
              placeholder="NOMBRE COMPLETO"
              required
            />
          </div>
          <div>
            <h2 className="text-white">Tipo de documento</h2>
            <select
              name="doctype"
              value={form.doctype}
              onChange={handleChange}
              className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
              required
            >
              <option value="">SELECCIONE TIPO DOCUMENTO</option>
              <option value="Cédula">Cédula</option>
              <option value="T. Identidad">T. Identidad</option>
              <option value="Cédula de Extranjería">
                Cédula de Extranjería
              </option>
            </select>
          </div>
          <div>
            <h2 className="text-white">Número de Documento</h2>
            <input
              name="docnumber"
              value={form.docnumber}
              onChange={handleChange}
              className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
              placeholder="NUMERO DE DOCUMENTO"
              required
            />
          </div>
          <div>
            <h2 className="text-white">Fecha Nacimiento</h2>
            <input
              type="date"
              name="birthdate"
              value={form.birthdate}
              onChange={handleChange}
              className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
              required
            />
          </div>
          <div>
            <h2 className="text-white">Género</h2>
            <select
              name="sex"
              value={form.sex}
              onChange={handleChange}
              className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
              required
            >
              <option value="">SELECCIONE GÉNERO</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="No binario">No binario</option>
            </select>
          </div>
          <div>
            <h2 className="text-white">Número Celular</h2>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
              placeholder="NUMERO CELULAR"
              required
              maxLength={10}
              pattern="\d{10}" // Asegura que sean 10 dígitos
              title="El número de teléfono debe tener 10 dígitos"
            />
          </div>
          <div>
            <h2 className="text-white">Correo Electrónico</h2>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
              placeholder="CORREO ELECTRÓNICO"
              required
              pattern="[^@\s]+@[^@\s]+\.[^@\s]+" // Valida que contenga un @
              title="Debe ser un correo electrónico válido"
            />
          </div>
          <div>
            <h2 className="text-white">Tiempo en la Compañía</h2>
            <input
              name="companytime"
              value={form.companytime}
              onChange={handleChange}
              className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
              placeholder="INGRESE EN MESES"
              required
              pattern="\d*" // Asegura que solo se ingresen números
              title="Solo se permiten números"
            />
          </div>
          <div>
            <h2 className="text-white">Nivel Educativo</h2>
            <select
              name="academiclevel"
              value={form.academiclevel}
              onChange={handleChange}
              className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
              required
            >
              <option value="">SELECCIONE NIVEL EDUCATIVO</option>
              <option value="Primaria">Primaria</option>
              <option value="Bachiller">Bachiller</option>
              <option value="Técnico">Tecnico</option>
              <option value="Tecnólogo">Tecnologo</option>
              <option value="Profesional">Profesional</option>
              <option value="Especialización">Especializacion</option>
              <option value="Maestría">Maestria</option>
              <option value="Doctorado">Doctorado</option>
            </select>
          </div>
          <div>
            <h2 className="text-white">Fecha Finalización</h2>
            <input
              type="date"
              name="graduationdate"
              value={form.graduationdate}
              onChange={handleChange}
              className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
              required
            />
          </div>
          <div>
            <h2 className="text-white">Mano Dominante</h2>
            <select
              name="dominanthand"
              value={form.dominanthand}
              onChange={handleChange}
              className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
              required
            >
              <option value="">SELECCIONE MANO DOMINANTE</option>
              <option value="Derecha">Derecha</option>
              <option value="Izquierda">Izquierda</option>
              <option value="Ambidiestro">Ambidiestro</option>
            </select>
          </div>
          <div>
            <h2 className="text-white">Dirección</h2>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
              placeholder="DIRECCION"
              required
            />
          </div>
          <div>
            <h2 className="text-white">Barrio</h2>
            <input
              name="neighborhood"
              value={form.neighborhood}
              onChange={handleChange}
              className="w-full bg-white text-black px-4 py-2 rounded-md my-2 uppercase"
              placeholder="BARRIO"
              required
            />
          </div>
          <div>
            <h2 className="text-white">Municipio</h2>
            <select
              name="municipality"
              value={form.municipality}
              onChange={handleChange}
              className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
              required
            >
              <option value="">SELECCIONE MUNICIPIO</option>
              <option value="Aguadas">Aguadas</option>
              <option value="Anserma">Anserma</option>
              <option value="Aranzazu">Aranzazu</option>
              <option value="Belalcázar">Belalcázar</option>
              <option value="Chinchiná">Chinchiná</option>
              <option value="Filadelfia">Filadelfia</option>
              <option value="La Dorada">La Dorada</option>
              <option value="La Merced">La Merced</option>
              <option value="Manizales">Manizales</option>
              <option value="Manzanares">Manzanares</option>
              <option value="Marmato">Marmato</option>
              <option value="Marquetalia">Marquetalia</option>
              <option value="Marulanda">Marulanda</option>
              <option value="Neira">Neira</option>
              <option value="Norcasia">Norcasia</option>
              <option value="Pácora">Pácora</option>
              <option value="Palestina">Palestina</option>
              <option value="Pensilvania">Pensilvania</option>
              <option value="Riosucio">Riosucio</option>
              <option value="Risaralda">Risaralda</option>
              <option value="Salamina">Salamina</option>
              <option value="Samaná">Samaná</option>
              <option value="San José">San José</option>
              <option value="Supía">Supía</option>
              <option value="Victoria">Victoria</option>
              <option value="Villamaría">Villamaría</option>
              <option value="Viterbo">Viterbo</option>
            </select>
          </div>
          <div>
            <h2 className="text-white">Contraseña</h2>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full bg-white text-black px-4 py-2 rounded-md my-2"
              placeholder="INGRESE UNA CONTRASEÑA"
              required
            />
          </div>

          {formError && (
            <div className="col-span-2 text-red-500">{formError}</div>
          )}

          {errors.length > 0 && (
            <div className="col-span-2 text-red-500">{errors.join(", ")}</div>
          )}

          <input type="hidden" name="companyId" value={form.companyId} />

          <div className="col-span-2 flex justify-center">
            <button
              type="submit"
              className="bg-blueSena px-4 py-2 rounded-md text-white my-2"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PeopleClientePage;
