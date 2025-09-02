import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function EditCompanyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCompany, selectedCompany, updateCompany } = useAuth();

  const { register, handleSubmit } = useForm();

  // Cargar datos de la empresa
  useEffect(() => {
    async function loadCompany() {
      await getCompany(id);
    }
    loadCompany();
  }, [id, getCompany]);

  const onSubmit = handleSubmit(async (data) => {
    await updateCompany(id, data);
    navigate("/companiesPage"); // Redirigir a lista de empresas
  });

  return (
    <div className="flex justify-center mt-10">
      <form
        onSubmit={onSubmit}
        className="bg-[#003355] text-white shadow-lg rounded p-6 w-full max-w-2xl  space-y-4"
      >
        <h1 className="text-xl font-bold mb-4">Editar Empresa</h1>

        <div>
          <label className="block mb-1">Nombre</label>
          <input
            {...register("name", { required: true })}
            defaultValue={selectedCompany?.name}
            className="w-full border px-3 py-2 rounded text-black"
            placeholder="Nombre"
          />
        </div>

        <div>
          <label className="block mb-1">Código de Acceso</label>
          <input
            {...register("companyAccessCode")}
            defaultValue={selectedCompany?.companyAccessCode}
            className="w-full border px-3 py-2 rounded text-gray-500 bg-gray-200 cursor-not-allowed"
            placeholder="Código de Acceso"
            readOnly
          />
        </div>

        <div>
          <label className="block mb-1">Correo</label>
          <input
            {...register("contactEmail")}
            defaultValue={selectedCompany?.contactEmail}
            className="w-full border px-3 py-2 rounded text-black"
            placeholder="Correo"
          />
        </div>

        <div>
          <label className="block mb-1">Teléfono</label>
          <input
            {...register("contactPhone")}
            defaultValue={selectedCompany?.contactPhone}
            className="w-full border px-3 py-2 rounded text-black"
            placeholder="Teléfono"
          />
        </div>

        <div>
          <label className="block mb-1">Dirección</label>
          <input
            {...register("address")}
            defaultValue={selectedCompany?.address}
            className="w-full border px-3 py-2 rounded text-black"
            placeholder="Dirección"
          />
        </div>

        <div>
          <label className="block mb-1">Descripción</label>
          <textarea
            {...register("description")}
            defaultValue={selectedCompany?.description}
            className="w-full border px-3 py-2 rounded text-black"
            placeholder="Descripción"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}

export default EditCompanyPage;
