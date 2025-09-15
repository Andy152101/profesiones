import { useState, useEffect, useMemo } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { usePeoples } from "../context/PeopleContext";
import { useNavigate } from "react-router-dom";
import instance from "../api/axios";
import PropTypes from "prop-types";
import { toast } from "react-toastify"; //librería para notificaciones

const FormField = ({ label, children, error }) => (
  <div className="space-y-1">
    <label className="block text-white text-sm font-medium">
      {label} <span className="text-red-300">*</span>
    </label>
    {children}
    {error && <p className="text-red-300 text-xs">{error.message}</p>}
  </div>
);

// Schema de validación con Yup
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

  headquarters: yup.string().required("La sede es obligatoria"),

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

const formSchema = yup.object().shape({
  people: yup
    .array()
    .of(personSchema)
    .min(1, "Debe haber al menos una persona"),
});

const AddPeopleForm = () => {
  const { createPeoples } = usePeoples(); // Quitamos `error` y `setError` del contexto para manejarlo localmente
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [options, setOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const municipalities = useMemo(
    () => [
      "Aguadas",
      "Anserma",
      "Aranzazu",
      "Belalcázar",
      "Chinchiná",
      "Filadelfia",
      "La Dorada",
      "La Merced",
      "Manizales",
      "Manzanares",
      "Marmato",
      "Marquetalia",
      "Marulanda",
      "Neira",
      "Norcasia",
      "Pácora",
      "Palestina",
      "Pensilvania",
      "Riosucio",
      "Risaralda",
      "Salamina",
      "Samaná",
      "San José",
      "Supía",
      "Victoria",
      "Villamaría",
      "Viterbo",
    ],
    []
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError, // ⬅️ Usar el setError de `react-hook-form`
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      people: [
        {
          names: "",
          doctype: "",
          docnumber: "",
          birthdate: "",
          sex: "",
          phone: "",
          email: "",
          company: "",
          headquarters: "",
          companytime: "",
          academiclevel: "",
          graduationdate: "",
          dominanthand: "",
          address: "",
          neighborhood: "",
          municipality: "",
        },
      ],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "people",
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        const res = await instance.get("/companies");
        const fetchedCompanies = Array.isArray(res.data) ? res.data : [];
        setCompanies(fetchedCompanies);

        const flattenedOptions = [];
        fetchedCompanies.forEach((company) => {
          if (
            Array.isArray(company.headquarters) &&
            company.headquarters.length > 0
          ) {
            company.headquarters.forEach((headquarters) => {
              flattenedOptions.push({
                companyId: company._id,
                companyName: company.name,
                headquarters: headquarters,
                id: `${company._id}-${headquarters}`,
              });
            });
          } else {
            flattenedOptions.push({
              companyId: company._id,
              companyName: company.name,
              headquarters: company.headquarters || "Sede Principal",
              id: `${company._id}-${company.headquarters || "main"}`,
            });
          }
        });
        setOptions(flattenedOptions);
      } catch (error) {
        console.error(
          "Error cargando empresas:",
          error.response?.data || error.message
        );
        toast.error(
          "Error al cargar las empresas. Por favor, recarga la página."
        );
        setCompanies([]);
        setOptions([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const addForm = () => {
    if (fields.length < 10) {
      append({
        names: "",
        doctype: "",
        docnumber: "",
        birthdate: "",
        sex: "",
        phone: "",
        email: "",
        company: "",
        headquarters: "",
        companytime: "",
        academiclevel: "",
        graduationdate: "",
        dominanthand: "",
        address: "",
        neighborhood: "",
        municipality: "",
      });
    }
  };

  const removeForm = (index) => {
    if (fields.length > 1) {
      remove(index);
    }
  };
  const formatDateForInput = (date) => {
    if (!date) return "";
    try {
      return new Date(date).toISOString().split("T")[0]; // ✅ siempre yyyy-MM-dd
    } catch {
      return "";
    }
  };

  //LÓGICA DE ENVÍO Y MANEJO DE ERRORES MEJORADA
  const onSubmit = async (data) => {
    const failedForms = [];
    let hasFailed = false;

    console.log("Iniciando proceso de", data.people.length, "registros");

    for (let i = 0; i < data.people.length; i++) {
      const person = data.people[i];
      try {
        const formattedPerson = {
          ...person,
          birthdate: formatDateForInput(person.birthdate),
          graduationdate: formatDateForInput(person.graduationdate),
        };

        await createPeoples(formattedPerson);

        console.log(`Registro ${i + 1} EXITOSO`);
        toast.success(`Registro ${i + 1} guardado correctamente.`);
      } catch (error) {
        console.log(` Registro ${i + 1} FALLÓ:`, error);
        hasFailed = true;
        const errorMessage =
          error.response?.data?.message || "Error de validación.";
        toast.error(`Error en el registro ${i + 1}: ${errorMessage}`);
        setError(`people.${i}.email`, {
          type: "manual",
          message: errorMessage,
        });

        failedForms.push(person);
      }
    }

    console.log("Resultado final:", {
      hasFailed,
      failedForms: failedForms.length,
    });

    if (hasFailed) {
      console.log("🔄 Haciendo reset con formularios fallidos");
      reset({
        people: failedForms.map((p) => ({
          ...p,
          birthdate: formatDateForInput(p.birthdate),
          graduationdate: formatDateForInput(p.graduationdate),
        })),
      });
    } else {
      console.log(" Todos exitosos - navegando");
      navigate("/people");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-lg">Cargando empresas...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center my-2 px-4">
      <div className="bg-blueSena max-w-4xl w-full p-6 md:p-10 rounded-md">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold">
            Registro de Personas
          </h1>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addForm}
              disabled={fields.length >= 10 || isSubmitting}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white px-3 py-1 rounded text-sm"
            >
              + Agregar Formulario
            </button>
            {fields.length > 1 && (
              <span className="text-gray-300 text-sm py-1">
                {fields.length} formulario{fields.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="bg-blueSena p-6 rounded-lg shadow-xl shadow-gray-800 space-y-6 relative"
            >
              <div className="flex justify-between items-center border-b border-gray-600 pb-4">
                <h3 className="text-white text-lg font-semibold">
                  Formulario {index + 1}
                </h3>
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeForm(index)}
                    disabled={isSubmitting}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Eliminar
                  </button>
                )}
              </div>

              {/* Información Personal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <FormField
                    label="Nombre Completo"
                    error={errors.people?.[index]?.names}
                  >
                    <Controller
                      name={`people.${index}.names`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                          className="w-full bg-white text-black px-4 py-2 rounded-md uppercase"
                          placeholder="NOMBRE COMPLETO"
                          disabled={isSubmitting}
                        />
                      )}
                    />
                  </FormField>
                </div>

                <FormField
                  label="Tipo de Documento"
                  error={errors.people?.[index]?.doctype}
                >
                  <Controller
                    name={`people.${index}.doctype`}
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full bg-white text-black px-4 py-2 rounded-md"
                        disabled={isSubmitting}
                      >
                        <option value="">SELECCIONE TIPO DOCUMENTO</option>
                        <option value="Cédula">Cédula</option>
                        <option value="T. Identidad">T. Identidad</option>
                        <option value="Cédula de Extranjería">
                          Cédula de Extranjería
                        </option>
                      </select>
                    )}
                  />
                </FormField>

                <FormField
                  label="Número de Documento"
                  error={errors.people?.[index]?.docnumber}
                >
                  <Controller
                    name={`people.${index}.docnumber`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          field.onChange(value);
                        }}
                        className="w-full bg-white text-black px-4 py-2 rounded-md"
                        placeholder="NUMERO DE DOCUMENTO"
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </FormField>

                <FormField
                  label="Fecha de Nacimiento"
                  error={errors.people?.[index]?.birthdate}
                >
                  <Controller
                    name={`people.${index}.birthdate`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="date"
                        className="w-full bg-white text-black px-4 py-2 rounded-md"
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </FormField>

                <FormField label="Género" error={errors.people?.[index]?.sex}>
                  <Controller
                    name={`people.${index}.sex`}
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full bg-white text-black px-4 py-2 rounded-md"
                        disabled={isSubmitting}
                      >
                        <option value="">SELECCIONE GÉNERO</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="No binario">No binario</option>
                      </select>
                    )}
                  />
                </FormField>
              </div>

              {/* Información de Contacto */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Número Celular"
                  error={errors.people?.[index]?.phone}
                >
                  <Controller
                    name={`people.${index}.phone`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10);
                          field.onChange(value);
                        }}
                        className="w-full bg-white text-black px-4 py-2 rounded-md"
                        placeholder="NUMERO CELULAR"
                        disabled={isSubmitting}
                        maxLength={10}
                      />
                    )}
                  />
                </FormField>

                <FormField
                  label="Correo Electrónico"
                  error={errors.people?.[index]?.email}
                >
                  <Controller
                    name={`people.${index}.email`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="email"
                        onChange={(e) =>
                          field.onChange(e.target.value.toLowerCase())
                        }
                        className="w-full bg-white text-black px-4 py-2 rounded-md"
                        placeholder="correo@ejemplo.com"
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </FormField>
              </div>

              {/* Información Laboral */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  label="Empresa y Sede"
                  error={
                    errors.people?.[index]?.company ||
                    errors.people?.[index]?.headquarters
                  }
                >
                  <Controller
                    name={`people.${index}.company`}
                    control={control}
                    render={({ field: companyField }) => (
                      <Controller
                        name={`people.${index}.headquarters`}
                        control={control}
                        render={({ field: headquartersField }) => {
                          const currentValue =
                            companyField.value && headquartersField.value
                              ? `${companyField.value}-${headquartersField.value}`
                              : "";

                          return (
                            <select
                              value={currentValue}
                              onChange={(e) => {
                                if (e.target.value) {
                                  const [companyId, headquarters] =
                                    e.target.value.split("-");
                                  companyField.onChange(companyId);
                                  headquartersField.onChange(headquarters);
                                } else {
                                  companyField.onChange("");
                                  headquartersField.onChange("");
                                }
                              }}
                              className="w-full bg-white text-black px-4 py-2 rounded-md"
                              disabled={isSubmitting}
                            >
                              <option value="">
                                SELECCIONE EMPRESA Y SEDE
                              </option>
                              {options.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.companyName} - {option.headquarters}
                                </option>
                              ))}
                            </select>
                          );
                        }}
                      />
                    )}
                  />
                </FormField>

                <FormField
                  label="Tiempo en la Compañía (meses)"
                  error={errors.people?.[index]?.companytime}
                >
                  <Controller
                    name={`people.${index}.companytime`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          field.onChange(value ? parseInt(value) : "");
                        }}
                        className="w-full bg-white text-black px-4 py-2 rounded-md"
                        placeholder="MESES"
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </FormField>
              </div>

              {/* Información Educativa */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Nivel Educativo"
                  error={errors.people?.[index]?.academiclevel}
                >
                  <Controller
                    name={`people.${index}.academiclevel`}
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full bg-white text-black px-4 py-2 rounded-md"
                        disabled={isSubmitting}
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
                    )}
                  />
                </FormField>

                <FormField
                  label="Fecha de Graduación"
                  error={errors.people?.[index]?.graduationdate}
                >
                  <Controller
                    name={`people.${index}.graduationdate`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="date"
                        className="w-full bg-white text-black px-4 py-2 rounded-md"
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </FormField>

                <FormField
                  label="Mano Dominante"
                  error={errors.people?.[index]?.dominanthand}
                >
                  <Controller
                    name={`people.${index}.dominanthand`}
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full bg-white text-black px-4 py-2 rounded-md"
                        disabled={isSubmitting}
                      >
                        <option value="">SELECCIONE MANO DOMINANTE</option>
                        <option value="Derecha">Derecha</option>
                        <option value="Izquierda">Izquierda</option>
                        <option value="Ambidiestra">Ambidiestra</option>
                      </select>
                    )}
                  />
                </FormField>

                <FormField
                  label="Municipio"
                  error={errors.people?.[index]?.municipality}
                >
                  <Controller
                    name={`people.${index}.municipality`}
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full bg-white text-black px-4 py-2 rounded-md"
                        disabled={isSubmitting}
                      >
                        <option value="">SELECCIONE MUNICIPIO</option>
                        {municipalities.map((municipality) => (
                          <option key={municipality} value={municipality}>
                            {municipality}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </FormField>
              </div>

              {/* Información de Ubicación */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Dirección"
                  error={errors.people?.[index]?.address}
                >
                  <Controller
                    name={`people.${index}.address`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="w-full bg-white text-black px-4 py-2 rounded-md"
                        placeholder="DIRECCIÓN"
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </FormField>

                <FormField
                  label="Barrio"
                  error={errors.people?.[index]?.neighborhood}
                >
                  <Controller
                    name={`people.${index}.neighborhood`}
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        className="w-full bg-white text-black px-4 py-2 rounded-md"
                        placeholder="BARRIO"
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </FormField>
              </div>
            </div>
          ))}

          {/* Mostrar errores generales */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              Por favor, corrige los errores en los formularios resaltados.
            </div>
          )}

          <div className="flex justify-center gap-4 pt-6">
            <button
              type="button"
              onClick={() => reset()}
              disabled={isSubmitting}
              className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white px-6 py-3 rounded-md font-semibold"
            >
              Limpiar Formularios
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className={`px-6 py-3 rounded-md font-semibold transition-colors ${
                isSubmitting || isLoading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-ester hover:bg-ester-dark text-white"
              }`}
            >
              {isSubmitting
                ? `Procesando ${fields.length} formulario${
                    fields.length > 1 ? "s" : ""
                  }...`
                : `Crear ${fields.length} Registro${
                    fields.length > 1 ? "s" : ""
                  }`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  error: PropTypes.object,
};

export default AddPeopleForm;
