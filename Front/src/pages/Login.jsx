import { useForm } from "react-hook-form";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';

function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const { signin, errors: signinErrors, isAuthenticated } = useAuth();
    const onSubmit = handleSubmit((data) => {
        signin(data);
    });

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/home");
        }
    }, [isAuthenticated]);

    return (
        <div className='flex h-[calc(100vh-100px)] items-center justify-center'>
            <div className="bg-ester max-w-md w-full p-10 rounded-md min-h-[50vh]">
                {
                    signinErrors.map((error, i) => (
                        <div className='bg-red-500 p-2 text-white text-center m-2' key={i}>
                            {error}
                        </div>
                    ))
                }

                <h1 className="text-2xl font-bold text-blueSena">Iniciar Sesión</h1>
                <form onSubmit={onSubmit}>
                    <h2> Correo electrónico</h2>
                    <div className="flex items-center bg-white rounded-md my-2">
                        <FontAwesomeIcon icon={faUser} className="text-blueSena px-3" />
                        <input
                            type="email"
                            {...register("email", { required: true })}
                            className='w-full bg-white text-black px-4 py-2 rounded-md outline-none'
                            placeholder='Correo'
                            autoComplete="username"
                        />
                    </div>
                    {
                        errors.email && (
                            <p className="text-red-500">Email is required</p>
                        )
                    }
                    <h2> Contraseña</h2>
                    <div className="flex items-center bg-white rounded-md my-2">
                        <FontAwesomeIcon icon={faLock} className="text-blueSena px-3" />
                        <input
                            type="password"
                            {...register("password", { required: true })}
                            className='w-full bg-white text-black px-4 py-2 rounded-md outline-none'
                            placeholder='Contraseña'
                            autoComplete="current-password"
                        />
                    </div>
                    {
                        errors.password && (
                            <p className="text-red-500">Password is required</p>
                        )
                    }
                    <div className="flex justify-center mt-4">
                        <button type='submit' className="bg-blueSena text-white py-2 px-6 rounded-md">Ingreso</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;
