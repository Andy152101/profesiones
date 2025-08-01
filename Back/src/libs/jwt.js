// Importa la clave secreta y la librería jsonwebtoken para crear tokens JWT
import { TOKEN_SECRET } from "../config.js";
import jwt from "jsonwebtoken";

// Función para crear un token JWT con la clave secreta y el payload proporcionado
//1. payload: Objeto que contiene los datos que se incluirán en el token, como el ID del usuario, el rol, etc.
//2. TOKEN_SECRET: Clave secreta utilizada para firmar el token
//3. { expiresIn: "1d" }: Configuración para que el token expire después de 1 día
//4. (err, token): Callback que se ejecuta después de crear el token. Si hay un error, se rechaza la promesa con el error. Si no hay error, se resuelve la promesa con el token generado.
//5. new Promise: Se crea una promesa que se resuelve con el token generado o rechaza con el error si hay un error al crear el token.
export async function createAccessToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, TOKEN_SECRET, { expiresIn: "1d" }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
}
