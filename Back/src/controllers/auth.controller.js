import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { createAccessToken } from '../libs/jwt.js'
import jwt from 'jsonwebtoken'
import { TOKEN_SECRET } from '../config.js'


export const register = async (req, res) => {
    const { username, email, password, role } = req.body; // Asegúrate de incluir 'role' aquí
    try {
        const userFound = await User.findOne({ email });
        if (userFound) return res.status(400).json(['Usuario Existente']);
        
        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: passwordHash,
            role, // Agregar el rol aquí
        });
        const userSaved = await newUser.save();
        const token = await createAccessToken({ id: userSaved._id });
        res.cookie('token', token);
        res.json({
            id: userSaved._id,
            username: userSaved.username,
            email: userSaved.email,
            role: userSaved.role, // Asegúrate de devolver el rol aquí
            createdAt: userSaved.createdAt,
            updatedAt: userSaved.updatedAt,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userFound = await User.findOne({ email });
        if (!userFound) return res.status(400).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, userFound.password)
        if (!isMatch)
            return res.status(400).json({ message: "Incorrect password" });
        const token = await createAccessToken({ id: userFound._id });

        res.cookie("token", token)
        res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            role: userFound.role,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt

        });

    } catch (error) {

        res.status(500).json({ message: error.message });
    }



};
export const logout = (req, res) => {
    res.cookie("token", " ", {
        expires: new Date(0),
    });
    return res.sendStatus(200);

};
export const profile = async (req, res) => {

    const userFound = await User.findById(req.user.id)

    if (!userFound) return res.status(400).json({ message: "User not found" });

    return res.json({
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
        role: userFound.role,
        createdAt: userFound.createdAt,
        updatedAt: userFound.updatedAt

    });
}

export const verifyToken = async (req, res) => {
    const { token } = req.cookies

    if (!token) return res.status(401).json({ message: "unauthorized" });

    jwt.verify(token, TOKEN_SECRET, async (err, user)=>{

        if (err) return res.status(401).json({ message: "unauthorized" })
        const userFound = await User.findById(user.id)
        if (!userFound) return res.status(401).json({
            message:"unauthorized" 
        });

       return res.json({
            id: userFound._id,
            username: userFound.username,
            email: userFound.email,
            role: userFound.role
        });

    })

}
// Obtener Todos los Usuarios
export const getAllRegisters = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener un Usuario por ID
export const viewRegister = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateRegisters = async (req, res) => {
    const { id } = req.params;
    const { username, email, password, role } = req.body; // Desestructurar el rol

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Actualizar campos si se proporcionan
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) {
            const passwordHash = await bcrypt.hash(password, 10);
            user.password = passwordHash;
        }
        if (role) user.role = role; // Actualizar el rol si se proporciona

        const updatedUser = await user.save();
        res.json({
            id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role, // Incluir el rol en la respuesta
            createdAt: updatedUser.createdAt,
            updatedAt: updatedUser.updatedAt,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Eliminar un Usuario
export const deleteRegisters = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        res.json({ message: "Usuario eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};