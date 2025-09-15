import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePeoples } from "../context/PeopleContext";
import { useAuth } from "../context/AuthContext";
import { useCompanies } from "../context/CompanyContext";
import * as yup from "yup";

const personSchema = yup.object().shape({
  names: yup
    .string()
    .required("El nombre completo es obligatorio")
    .max(100, "El nombre no puede exceder 100 caracteres")
    .matches(
      /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
      "El nombre solo puede contener letras y espacios"
    ),

  doctype: yup
    .string()
    .required("El tipo de documento es obligatorio")
    .oneOf(
      ["Cédula", "T. Identidad", "Cédula de Extranjería"],
      "Tipo de documento inválido"
    ),

  docnumber: yup
    .string()
    .required("El número de documento es obligatorio")
    .matches(/^\d+$/, "El número de documento debe contener solo números")
    .min(6, "El número de documento debe tener al menos 6 dígitos")
    .max(15, "El número de documento no puede exceder 15 dígitos"),

  birthdate: yup
    .date()
    .required("La fecha de nacimiento es obligatoria")
    .max(
      new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000),
      "Debe ser mayor de 10 años"
    )
    .min(
      new Date(Date.now() - 100 * 365 * 24 * 60 * 60 * 1000),
      "La edad máxima es 100 años"
    ),

  sex: yup
    .string()
    .required("El género es obligatorio")
    .oneOf(["Masculino", "Femenino", "No binario"], "Género inválido"),

  phone: yup
    .string()
    .required("El número de teléfono es obligatorio")
    .matches(/^\d{10}$/, "El teléfono debe tener exactamente 10 dígitos"),

  email: yup
    .string()
    .required("El correo electrónico es obligatorio")
    .email("Debe ser un correo electrónico válido")
    .max(100, "El correo no puede exceder 100 caracteres"),

  company: yup.string().required("La empresa es obligatoria"),

  companytime: yup
    .number()
    .required("El tiempo en la compañía es obligatorio")
    .positive("El tiempo debe ser un número positivo")
    .integer("El tiempo debe ser un número entero"),

  academiclevel: yup
    .string()
    .required("El nivel educativo es obligatorio")
    .oneOf(
      [
        "Primaria",
        "Bachiller",
        "Técnico",
        "Tecnólogo",
        "Profesional",
        "Especialista",
        "Magíster",
        "Doctorado",
      ],
      "Nivel educativo inválido"
    ),

  graduationdate: yup
    .date()
    .required("La fecha de graduación es obligatoria")
    .test(
      "graduation-after-birth",
      "La graduación debe ser posterior al nacimiento",
      function (value) {
        const { birthdate } = this.parent;
        if (!birthdate || !value) return true;
        return new Date(value) > new Date(birthdate);
      }
    ),

  dominanthand: yup
    .string()
    .required("La mano dominante es obligatoria")
    .oneOf(["Derecha", "Izquierda", "Ambidiestra"], "Mano dominante inválida"),

  address: yup
    .string()
    .required("La dirección es obligatoria")
    .max(200, "La dirección no puede exceder 200 caracteres"),

  neighborhood: yup
    .string()
    .required("El barrio es obligatorio")
    .max(100, "El barrio no puede exceder 100 caracteres"),

  municipality: yup.string().required("El municipio es obligatorio"),
});

const EditPeoplePage = () => {
  const { companies, getAllCompanies } = useCompanies();
  const { userRole } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPeople, updatePeople, error, setError } = usePeoples();

  const [form, setForm] = useState({
    names: "",
    doctype: "",
    docnumber: "",
    birthdate: "",
    sex: "",
    phone: "",
    email: "",
    company: "",
    companytime: "",
    academiclevel: "",
    graduationdate: "",
    dominanthand: "",
    address: "",
    neighborhood: "",
    municipality: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getAllCompanies();
  }, [getAllCompanies]);

  useEffect(() => {
    const loadPerson = async () => {
      const person = await getPeople(id);
      if (person) {
        setForm({
          ...person,
          birthdate: person.birthdate
            ? new Date(person.birthdate).toISOString().split("T")[0]
            : "",
          graduationdate: person.graduationdate
            ? new Date(person.graduationdate).toISOString().split("T")[0]
            : "",
          company: person.company?._id || "",
          companyName: person.company?.name || "",
        });
      }
    };
    loadPerson();
  }, [id, getPeople]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Limpiar error de validación para este campo cuando el usuario empiece a escribir
    if (validationErrors[name]) {
      setValidationErrors({
        ...validationErrors,
        [name]: "",
      });
    }
  };

  const validateForm = async () => {
    try {
      await personSchema.validate(form, { abortEarly: false });
      setValidationErrors({});
      return true;
    } catch (err) {
      const errors = {};
      err.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
      setValidationErrors(errors);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isValid = await validateForm();

    if (isValid) {
      try {
        const success = await updatePeople(id, form);
        if (success) {
          navigate("/people");
        }
      } catch (error) {
        console.error("Error updating person:", error);
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex items-center justify-center my-2 px-4">
      <div className="bg-blueSena max-w-2xl w-full p-6 md:p-10 rounded-md">
        <form onSubmit={handleSubmit}>
          <div className="bg-blueSena p-4 rounded-md shadow-md space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="col-span-2">
                <h2 className="text-white">Nombre Completo</h2>
                <input
                  name="names"
                  value={form.names}
                  onChange={handleChange}
                  className={`w-full bg-white text-black px-4 py-2 rounded-md uppercase ${
                    validationErrors.names ? "border-2 border-red-500" : ""
                  }`}
                  placeholder="NOMBRE COMPLETO"
                />
                {validationErrors.names && (
                  <p className="text-red-400 text-sm mt-1">
                    {validationErrors.names}
                  </p>
                )}
              </div>

              <div>
                <h2 className="text-white">Tipo de documento</h2>
                <select
                  name="doctype"
                  value={form.doctype}
                  onChange={handleChange}
                  className={`w-full bg-white text-black px-4 py-2 rounded-md ${
                    validationErrors.doctype ? "border-2 border-red-500" : ""
                  }`}
                >
                  <option value="">SELECCIONE TIPO DOCUMENTO</option>
                  <option value="Cédula">Cédula</option>
                  <option value="T. Identidad">T. Identidad</option>
                  <option value="Cédula de Extranjería">
                    Cédula de Extranjería
                  </option>
                </select>
                {validationErrors.doctype && (
                  <p className="text-red-400 text-sm mt-1">
                    {validationErrors.doctype}
                  </p>
                )}
              </div>

              <div>
                <h2 className="text-white">Número de Documento</h2>
                <input
                  name="docnumber"
                  value={form.docnumber}
                  onChange={handleChange}
                  className={`w-full bg-white text-black px-4 py-2 rounded-md ${
                    validationErrors.docnumber ? "border-2 border-red-500" : ""
                  }`}
                  placeholder="NUMERO DE DOCUMENTO"
                />
                {validationErrors.docnumber && (
                  <p className="text-red-400 text-sm mt-1">
                    {validationErrors.docnumber}
                  </p>
                )}
              </div>

              <div>
                <h2 className="text-white">Fecha Nacimiento</h2>
                <input
                  type="date"
                  name="birthdate"
                  value={form.birthdate}
                  onChange={handleChange}
                  className={`w-full bg-white text-black px-4 py-2 rounded-md ${
                    validationErrors.birthdate ? "border-2 border-red-500" : ""
                  }`}
                />
                {validationErrors.birthdate && (
                  <p className="text-red-400 text-sm mt-1">
                    {validationErrors.birthdate}
                  </p>
                )}
              </div>

              <div>
                <h2 className="text-white">Género</h2>
                <select
                  name="sex"
                  value={form.sex}
                  onChange={handleChange}
                  className={`w-full bg-white text-black px-4 py-2 rounded-md ${
                    validationErrors.sex ? "border-2 border-red-500" : ""
                  }`}
                >
                  <option value="">SELECCIONE GÉNERO</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="No binario">No binario</option>
                </select>
                {validationErrors.sex && (
                  <p className="text-red-400 text-sm mt-1">
                    {validationErrors.sex}
                  </p>
                )}
              </div>

              <div>
                <h2 className="text-white">Número Celular</h2>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={`w-full bg-white text-black px-4 py-2 rounded-md ${
                    validationErrors.phone ? "border-2 border-red-500" : ""
                  }`}
                  placeholder="NUMERO CELULAR"
                  maxLength={10}
                />
                {validationErrors.phone && (
                  <p className="text-red-400 text-sm mt-1">
                    {validationErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <h2 className="text-white">Correo Electrónico</h2>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full bg-white text-black px-4 py-2 rounded-md ${
                    validationErrors.email ? "border-2 border-red-500" : ""
                  }`}
                  placeholder="CORREO ELECTRÓNICO"
                />
                {validationErrors.email && (
                  <p className="text-red-400 text-sm mt-1">
                    {validationErrors.email}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h2 className="text-white">Nombre de la Compañía</h2>
                {userRole === "admin" ? (
                  <select
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    className={`w-full bg-white text-black px-4 py-2 rounded-md uppercase ${
                      validationErrors.company ? "border-2 border-red-500" : ""
                    }`}
                  >
                    <option value="">SELECCIONE EMPRESA</option>
                    {companies.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={form.companyName}
                    disabled
                    className="w-full bg-gray-200 text-black px-4 py-2 rounded-md uppercase"
                  />
                )}
                {validationErrors.company && (
                  <p className="text-red-400 text-sm mt-1">
                    {validationErrors.company}
                  </p>
                )}
              </div>

              <div>
                <h2 className="text-white">Tiempo en la Compañía</h2>
                <input
                  name="companytime"
                  type="number"
                  value={form.companytime}
                  onChange={handleChange}
                  className={`w-full bg-white text-black px-4 py-2 rounded-md ${
                    validationErrors.companytime
                      ? "border-2 border-red-500"
                      : ""
                  }`}
                  placeholder="INGRESE EN MESES"
                  min="1"
                />
                {validationErrors.companytime && (
                  <p className="text-red-400 text-sm mt-1">
                    {validationErrors.companytime}
                  </p>
                )}
              </div>

              <div>
                <h2 className="text-white">Nivel Educativo</h2>
                <select
                  name="academiclevel"
                  value={form.academiclevel}
                  onChange={handleChange}
                  className={`w-full bg-white text-black px-4 py-2 rounded-md ${
                    validationErrors.academiclevel
                      ? "border-2 border-red-500"
                      : ""
                  }`}
                >
                  <option value="">SELECCIONE NIVEL EDUCATIVO</option>
                  <option value="Primaria">Primaria</option>
                  <option value="Bachiller">Bachiller</option>
                  <option value="Técnico">Técnico</option>
                  <option value="Tecnólogo">Tecnólogo</option>
                  <option value="Profesional">Profesional</option>
                  <option value="Especialista">Especialización</option>
                  <option value="Magíster">Maestría</option>
                  <option value="Doctorado">Doctorado</option>
                </select>
                {validationErrors.academiclevel && (
                  <p className="text-red-400 text-sm mt-1">
                    {validationErrors.academiclevel}
                  </p>
                )}
              </div>

              <div>
                <h2 className="text-white">Fecha de Graduación</h2>
                <input
                  type="date"
                  name="graduationdate"
                  value={form.graduationdate}
                  onChange={handleChange}
                  className={`w-full bg-white text-black px-4 py-2 rounded-md ${
                    validationErrors.graduationdate
                      ? "border-2 border-red-500"
                      : ""
                  }`}
                />
                {validationErrors.graduationdate && (
                  <p className="text-red-400 text-sm mt-1">
                    {validationErrors.graduationdate}
                  </p>
                )}
              </div>

              <div>
                <h2 className="text-white">Mano Dominante</h2>
                <select
                  name="dominanthand"
                  value={form.dominanthand}
                  onChange={handleChange}
                  className={`w-full bg-white text-black px-4 py-2 rounded-md ${
                    validationErrors.dominanthand
                      ? "border-2 border-red-500"
                      : ""
                  }`}
                >
                  <option value="">SELECCIONE MANO DOMINANTE</option>
                  <option value="Derecha">Derecha</option>
                  <option value="Izquierda">Izquierda</option>
                  <option value="Ambidiestra">Ambidiestra</option>
                </select>
                {validationErrors.dominanthand && (
                  <p className="text-red-400 text-sm mt-1">
                    {validationErrors.dominanthand}
                  </p>
                )}
              </div>

              <div>
                <h2 className="text-white">Dirección</h2>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className={`w-full bg-white text-black px-4 py-2 rounded-md ${
                    validationErrors.address ? "border-2 border-red-500" : ""
                  }`}
                  placeholder="DIRECCIÓN"
                />
                {validationErrors.address && (
                  <p className="text-red-400 text-sm mt-1">
                    {validationErrors.address}
                  </p>
                )}
              </div>

              <div>
                <h2 className="text-white">Barrio</h2>
                <input
                  name="neighborhood"
                  value={form.neighborhood}
                  onChange={handleChange}
                  className={`w-full bg-white text-black px-4 py-2 rounded-md ${
                    validationErrors.neighborhood
                      ? "border-2 border-red-500"
                      : ""
                  }`}
                  placeholder="BARRIO"
                />
                {validationErrors.neighborhood && (
                  <p className="text-red-400 text-sm mt-1">
                    {validationErrors.neighborhood}
                  </p>
                )}
              </div>

              <div>
                <h2 className="text-white">Municipio</h2>
                <select
                  name="municipality"
                  value={form.municipality}
                  onChange={handleChange}
                  className={`w-full bg-white text-black px-4 py-2 rounded-md ${
                    validationErrors.municipality
                      ? "border-2 border-red-500"
                      : ""
                  }`}
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
                  <option value="Pacora">Pácora</option>
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
                {validationErrors.municipality && (
                  <p className="text-red-400 text-sm mt-1">
                    {validationErrors.municipality}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-greenSena text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Actualizando..." : "Actualizar"}
              </button>
            </div>
          </div>

          {error && error.formError && (
            <div className="text-red-500 text-center mt-4">
              {error.formError}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditPeoplePage;
