const usuariosModelo = require("./models/UsuarioModel.js");

class UsersManager {
    async createUsuario(usuario) {
        try {
            let nuevoUsuario = await usuariosModelo.create(usuario);
            return nuevoUsuario.toJSON();
        } catch (error) {
            console.error("Error al crear usuario:", error);
            throw error;
        }
    }

    async getUsuarioBy(filtro = {}, proyeccion = {}) {
        try {
            return await usuariosModelo.findOne(filtro, proyeccion).lean();
        } catch (error) {
            console.error("Error al obtener usuario:", error);
            throw error;
        }
    }
}

module.exports = UsersManager;
