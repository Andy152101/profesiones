import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Importa el ícono de logout

function Navbar() {
    const { isAuthenticated, logout, user } = useAuth();

    return (
        <nav className="bg-ester text-white flex flex-col">
            {/* Menú principal */}
            <div className="flex justify-between items-center py-4 px-6">
                <img
                    src="/src/Imagenes/LogoAzul.png"
                    alt="LogoAzul"
                    className="w-auto max-h-full h-20 md:h-24 object-cover"
                />
                {!isAuthenticated && (
                    <ul className="flex gap-x-2 ml-auto">
                        <li>
                            <Link to='/login' className='px-4 py-1 rounded-sm'>Login</Link>
                        </li>
                        <li>
                            <Link to='/add-people' className='px-4 py-1 rounded-sm'>Registro</Link>
                        </li>
                    </ul>
                )}
            </div>

            {/* Menú secundario */}
            {isAuthenticated && (
                <div className="flex justify-between items-center py-4 px-10">
                    {/* Menú de enlaces */}
                    <ul className="flex gap-x-2 flex-grow items-center">
                        {/* Solo mostrar el enlace de Usuarios si el rol es admin */}
                        {user.role === 'admin' && ( // Asegúrate de que user.role esté disponible
                            <li>
                                <Link to='/VerRegister' className='px-4 py-1 rounded-sm'>Usuarios</Link>
                            </li>
                        )}
                        <li>
                            <Link to='/people' className='px-4 py-1 rounded-sm'>Registro</Link>
                        </li>
                        <li>
                            <Link to='/tests' className='px-4 py-1 rounded-sm'>Prueba</Link>
                        </li>
                        <li>
                            <Link to='/PowerBi' className='px-4 py-1 rounded-sm'>Graficos</Link>
                        </li>
                    </ul>

                    {/* Usuario y logout */}
                    <ul className="flex gap-x-2 items-center ml-auto">
                        <li>
                            Bienvenido {user.username}
                        </li>
                        <li>
                            <button
                                onClick={() => logout()}
                                className='p-1 rounded-sm flex items-center justify-center hover:bg-blueSena focus:outline-none'
                                aria-label="Salir"
                            >
                                <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5 md:h-6 md:w-6 text-white" />
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </nav>
    );
}

export default Navbar;

