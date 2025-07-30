import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';

export async function createDefaultUser() {
  try {
    const userExists = await User.findOne({ email: 'admin@test.com' });
    if (userExists) {
      console.log('Usuario por defecto ya existe');
      return;
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      username: 'admin',
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'admin'
    });

    console.log(' Usuario admin@test.com creado con éxito');
  } catch (err) {
    console.error(' Error creando usuario por defecto:', err.message);
  }
}
