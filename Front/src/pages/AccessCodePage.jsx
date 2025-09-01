import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios"; // ajusta la ruta según tu config

function AccessCodePage() {
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAccessSubmit = async (e) => {
    e.preventDefault();
    console.log("👉 Botón Continuar presionado. Código ingresado:", accessCode);

    try {
      const res = await axios.post("/validate-access-code", {
        code: accessCode,
      });
      console.log("✅ Respuesta del backend:", res.data);

      if (res.data.valid) {
        console.log("🔓 Código válido. Navegando a /register con state:", {
          accessCode,
        });
        navigate("/add-people", {
          state: { companyId: "", companyName: "", accessCode },
        });
      } else {
        console.log("❌ Código inválido o expirado");
        setError("Código inválido o expirado");
      }
    } catch (err) {
      console.error("🔥 Error validando el código:", err);
      setError("Error validando el código");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <form
        onSubmit={handleAccessSubmit}
        className="p-10 rounded-xl shadow-lg w-full max-w-lg bg-ester"
      >
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          Portal de Empleados - Ingreso con Código
        </h2>

        <input
          type="text"
          value={accessCode}
          onChange={(e) => setAccessCode(e.target.value)}
          placeholder="Ingrese el código de acceso de su empresa"
          className="text-black border p-3 w-full mb-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blueSena"
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          className="bg-blueSena text-white py-3 rounded-lg w-full hover:bg-blue-800 transition"
        >
          Continuar
        </button>
      </form>
    </div>
  );
}

export default AccessCodePage;
