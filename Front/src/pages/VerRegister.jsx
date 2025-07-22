import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import IndexRegister from "../components/IndexRegister";
import { Link } from 'react-router-dom';

function IndexRegisterPage() {
    const { getRegisters, registers } = useAuth();

    useEffect(() => {
        // Llamar a getRegisters al montar el componente
        getRegisters();

        // Actualizar la lista de registros cada 10 segundos (10000 ms)
        const intervalId = setInterval(() => {
            getRegisters();
        }, 10000); // Cambiado a 10 segundos para evitar sobrecarga de solicitudes

        // Limpiar el intervalo cuando el componente se desmonte
        return () => clearInterval(intervalId);
    }, [getRegisters]);

    if (registers.length === 0) return <h1 className="text-center text-xl font-bold">No hay registros</h1>;

    return (
        <div className="p-6">
            <div className="flex flex-col gap-4">
                <div className="flex justify-end gap-4">
                    <Link to='/register' className='px-4 py-2 bg-blueSena text-white rounded-md'>
                        Crear Registro
                    </Link>
                </div>
                {registers.map((registerData) => (
                    <div className="w-full" key={registerData._id}>
                        <IndexRegister registerData={registerData} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default IndexRegisterPage;
