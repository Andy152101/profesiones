import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

function RegisterPage() {
    const { register, handleSubmit, formState: { errors },
    } = useForm();
    const { signup, isAuthenticated, errors: RegisterErrors } = useAuth();
    const navigate = useNavigate()

    useEffect(() => {
        if (isAuthenticated) navigate("/register")

    }, [isAuthenticated])

    const onSubmit = handleSubmit(async (values) => {
        console.log("Valores enviados:", values); // Verifica si 'role' está presente
        await signup(values);
        if (isAuthenticated) {
            navigate('/VerRegister');
        }
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
                    <h2>Nombre del Usuario</h2>
                    <input type="text" {...register("username", { required: true })}
                        className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
                        placeholder='Nombre'
                        autoComplete="username"

                    />
                    {
                        errors.username && (<p className="text-red-500" >Username is requered</p>
                        )}
                    <h2>Correo electronico</h2>
                    <input type="email" {...register("email", { required: true })}
                        className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
                        placeholder='Correo'
                        autoComplete="username"
                    />

                    {
                        errors.email && (<p className="text-red-500" >email is requered</p>
                        )}
                    <h2>Contraseña</h2>
                    <input type="password" {...register("password", { required: true })}
                        className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
                        placeholder='Contraseña'
                        autoComplete="current-password"
                    />
                    {
                        errors.password && (<p className="text-red-500" >password is requered</p>
                        )}


                    <label htmlFor="role">Rol</label>
                    <select
                        id="role"
                        {...register("role", { required: true })}
                        className='w-full bg-white text-black px-4 py-2 rounded-md my-2'
                    >
                        <option value="">Seleccione un rol</option>
                        <option value="admin">Administrador</option>
                        <option value="user">Usuario</option>
                        <option value="editor">Editor</option>
                    </select>
                    {errors.role && (<p className="text-red-500">El rol es requerido</p>)}


                    <div className="flex justify-center mt-4">
                        <button type='submit' className="bg-ester text-white py-2 px-6 rounded-md">Registrar</button>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default RegisterPage