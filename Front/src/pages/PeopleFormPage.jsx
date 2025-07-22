import { useForm } from 'react-hook-form';
import { usePeoples } from '../context/PeopleContext';

function PeopleClientePage() {
    const { register, handleSubmit } = useForm();
    const { createPeoples } = usePeoples();

    const onSubmit = handleSubmit((data) => {
        createPeoples(data);
    });

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-900'>
            <div className='bg-white max-w-2xl w-full p-10 rounded-md my-2'>
                <h1 className='text-2xl font-bold text-center text-black mb-4'>Registro de Personas</h1>
                <form onSubmit={onSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <input type="text" placeholder="Nombre"
                                {...register("names")}
                                className='w-full bg-zinc-200 text-black px-4 py-2 rounded-md my-2 uppercase'
                                autoFocus />
                        </div>
                        <div>
                            <select 
                                {...register("doctype")}
                                className='w-full bg-zinc-200 text-black px-4 py-2 rounded-md my-2'>
                                <option value="">Seleccione tipo documento</option>
                                <option value="Cédula">Cédula</option>
                                <option value="Cédula de Extranjería">Cédula de Extranjería</option>
                                <option value="Pasaporte">Pasaporte</option>
                                <option value="T. Identidad">T. Identidad</option>
                            </select>
                        </div>
                        {/* Otros campos del formulario */}
                        <div>
                            <h2 className="text-black">Municipio</h2>
                            <select
                                {...register("municipality")}
                                className='w-full bg-zinc-200 text-black px-4 py-2 rounded-md my-2'
                            >
                                <option value="">Seleccione municipio</option>
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
                    </div>
                    <button className='bg-blueSena text-white px-4 py-2 rounded-md mt-4 mx-auto block'>
                        Save
                    </button>
                </form>
            </div>
        </div>
    );
}

export default PeopleClientePage;