import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function EditRegisterPage() {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const { updateRegister, getRegister, selectedRegister, isAuthenticated, errors: RegisterErrors } = useAuth();
    const navigate = useNavigate();
    const { id } = useParams();

    // Cargar datos solo cuando hay un ID y el usuario está autenticado
    useEffect(() => {
        if (isAuthenticated && id && !selectedRegister) {
            getRegister(id);
        }
    }, [id, isAuthenticated, getRegister, selectedRegister]);

    // Solo setea valores cuando selectedRegister ha cambiado y no es undefined
    useEffect(() => {
        if (selectedRegister) {
            setValue('username', selectedRegister.username || '');
            setValue('email', selectedRegister.email || '');
            setValue('role', selectedRegister.role || '');
        }
    }, [selectedRegister, setValue]);

    const onSubmit = handleSubmit(async (values) => {
        if (!values.password) {
            delete values.password; // Elimina la contraseña si no está siendo actualizada
        }
        await updateRegister(id, values);
        navigate('/VerRegister');
    });

    return (
        <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
            <div className="bg-blueSena max-w-md w-full p-10 rounded-md min-h-[50vh]">
                {
                    RegisterErrors.map((error, i) => (
                        <div className='bg-red-500 p-2 text-white' key={i}>
                            {error}
                        </div>
                    ))
                }

                <form onSubmit={onSubmit}>
                    <h2>Editar Nombre del Usuario</h2>
                    <input type="text" {...register("username", { required: true })}
                        className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
                        placeholder='Nombre' />
                    {errors.username && (<p className="text-red-500">Username is required</p>)}

                    <h2>Editar Correo Electrónico</h2>
                    <input type="email" {...register("email", { required: true })}
                        className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
                        placeholder='Correo' />
                    {errors.email && (<p className="text-red-500">Email is required</p>)}

                    <h2>Contraseña</h2>
                    <input type="password" {...register("password")}
                        className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
                        placeholder='Dejar en blanco para mantener la contraseña actual' />

                    <h2>Rol</h2>
                    <select {...register("role", { required: true })}
                        className='w-full bg-white text-black px-4 py-2 rounded-md my-2'>
                        <option value="">Seleccione un rol</option>
                        <option value="admin">Administrador</option>
                        <option value="user">Usuario</option>
                        <option value="editor">Editor</option>
                    </select>
                    {errors.role && (<p className="text-red-500">El rol es requerido</p>)}

                    <div className="flex justify-center mt-4">
                        <button type='submit' className="bg-ester text-white py-2 px-6 rounded-md">Actualizar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditRegisterPage;




