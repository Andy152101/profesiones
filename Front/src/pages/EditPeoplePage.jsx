import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePeoples } from '../context/PeopleContext';

const EditPeoplePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPeople, updatePeople, error, setError } = usePeoples();
  const [form, setForm] = useState({
    names: '',
    doctype: '',
    docnumber: '',
    birthdate: '',
    sex: '',
    phone: '',
    email: '',
    company: '',
    companytime: '',
    academiclevel: '',
    graduationdate: '',
    dominanthand: '',
    address: '',
    neighborhood: '',
    municipality: '',
  });

  useEffect(() => {
    const loadPerson = async () => {
      const person = await getPeople(id);
      if (person) setForm(person);
    };
    loadPerson();
  }, [id, getPeople]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await updatePeople(id, form);
    if (success) {
      navigate('/people');
    } else {
      console.error('Error updating person:', error);
    }
  };

  return (
    <div className='flex items-center justify-center my-2 px-4'>
      <div className="bg-blueSena max-w-2xl w-full p-6 md:p-10 rounded-md">
        <form onSubmit={handleSubmit}>
          <div className='bg-blueSena p-4 rounded-md shadow-md space-y-4'>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div className="col-span-2">
                <h2 className="text-white">Nombre Completo</h2>
                <input name="names" value={form.names} onChange={handleChange}
                  className='w-full bg-white text-black px-4 py-2 rounded-md uppercase'
                  placeholder="NOMBRE COMPLETO"
                  required
                />
              </div>
              <div>
                <h2 className="text-white">Tipo de documento</h2>
                <select name="doctype"
                  value={form.doctype} onChange={handleChange}
                  className='w-full bg-white text-black px-4 py-2 rounded-md'
                  required>
                  <option value="">SELECCIONE TIPO DOCUMENTO</option>
                  <option value="Cédula">Cédula</option>
                  <option value="T. Identidad">T. Identidad</option>
                  <option value="Cédula de Extranjería">Cédula de Extranjería</option>
                </select>
              </div>
              <div>
                <h2 className="text-white">Número de Documento</h2>
                <input name="docnumber"
                  value={form.docnumber} onChange={handleChange}
                  className='w-full bg-white text-black px-4 py-2 rounded-md'
                  placeholder="NUMERO DE DOCUMENTO"
                  required />
              </div>
              <div>
                <h2 className="text-white">Fecha Nacimiento</h2>
                <input type="date" name="birthdate"
                  value={form.birthdate} onChange={handleChange}
                  className='w-full bg-white text-black px-4 py-2 rounded-md'
                  required />
              </div>
              <div>
                <h2 className="text-white">Género</h2>
                <select name="sex"
                  value={form.sex} onChange={handleChange}
                  className='w-full bg-white text-black px-4 py-2 rounded-md'
                  required>
                  <option value="">SELECCIONE GÉNERO</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                  <option value="No binario">No binario</option>
                </select>
              </div>
              <div>
                <h2 className="text-white">Número Celular</h2>
                <input name="phone" value={form.phone}
                  onChange={handleChange}
                  className='w-full bg-white text-black px-4 py-2 rounded-md'
                  placeholder="NUMERO CELULAR"
                  required
                  maxLength={10}
                  pattern="\d{10}"
                  title="El número de teléfono debe tener 10 dígitos"
                />
              </div>
              <div>
                <h2 className="text-white">Correo Electrónico</h2>
                <input name="email"
                  value={form.email} onChange={handleChange}
                  className='w-full bg-white text-black px-4 py-2 rounded-md'
                  placeholder="CORREO ELECTRÓNICO"
                  required
                  pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                  title="Debe ser un correo electrónico válido"
                />
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <h2 className="text-white">Nombre de la Compañía</h2>
                <input name="company" value={form.company} onChange={handleChange}
                  className='w-full bg-white text-black px-4 py-2 rounded-md uppercase'
                  placeholder="NOMBRE DE LA COMPAÑÍA"
                  required
                />
              </div>
              <div>
                <h2 className="text-white">Tiempo en la Compañía</h2>
                <input name="companytime"
                  value={form.companytime} onChange={handleChange}
                  className='w-full bg-white text-black px-4 py-2 rounded-md'
                  placeholder="INGRESE EN MESES"
                  required
                  pattern="\d*"
                  title="Solo se permiten números"
                />
              </div>
              <div>
                <h2 className="text-white">Nivel Educativo</h2>
                <select name="academiclevel"
                  value={form.academiclevel} onChange={handleChange}
                  className='w-full bg-white text-black px-4 py-2 rounded-md'
                  required
                >
                  <option value="">SELECCIONE NIVEL EDUCATIVO</option>
                  <option value="Primaria">Primaria</option>
                  <option value="Bachiller">Bachiller</option>
                  <option value="Técnico">Tecnico</option>
                  <option value="Tecnologo">Tecnologo</option>
                  <option value="Profesional">Profesional</option>
                  <option value="Especialista">Especializacion</option>
                  <option value="Magíster">Maestria</option>
                  <option value="Doctorado">Doctorado</option>
                </select>
              </div>
              <div>
                <h2 className="text-white">Fecha de Graduación</h2>
                <input type="date" name="graduationdate"
                  value={form.graduationdate} onChange={handleChange}
                  className='w-full bg-white text-black px-4 py-2 rounded-md'
                  required />
              </div>
              <div>
                <h2 className="text-white">Mano Dominante</h2>
                <select name="dominanthand"
                  value={form.dominanthand} onChange={handleChange}
                  className='w-full bg-white text-black px-4 py-2 rounded-md'
                  required
                >
                  <option value="">SELECCIONE MANO DOMINANTE</option>
                  <option value="Derecha">Derecha</option>
                  <option value="Izquierda">Izquierda</option>
                  <option value="Ambidiestra">Ambidiestra</option>
                </select>
              </div>
              <div>
                <h2 className="text-white">Dirección</h2>
                <input name="address"
                  value={form.address} onChange={handleChange}
                  className='w-full bg-white text-black px-4 py-2 rounded-md'
                  placeholder="DIRECCIÓN"
                  required
                />
              </div>
              <div>
                <h2 className="text-white">Barrio</h2>
                <input name="neighborhood"
                  value={form.neighborhood} onChange={handleChange}
                  className='w-full bg-white text-black px-4 py-2 rounded-md'
                  placeholder="BARRIO"
                  required
                />
              </div>
              <div>
                <h2 className="text-white">Municipio</h2>
                <select name="municipality"
                  value={form.municipality} onChange={handleChange}
                  className='w-full bg-white text-black px-4 py-2 rounded-md'
                  required
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
              </div>
            </div>
            <div className='flex justify-center mt-4'>
              <button type="submit" className='bg-greenSena text-white px-4 py-2 rounded-md hover:bg-green-700'>
                Actualizar
              </button>
            </div>
          </div>
          {error && error.formError && (
            <div className="text-red-500 text-center mt-4">{error.formError}</div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditPeoplePage;

