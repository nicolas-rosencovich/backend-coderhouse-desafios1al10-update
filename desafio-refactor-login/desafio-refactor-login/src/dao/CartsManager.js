const cartsModelo = require("../dao/models/CartModel.js");

class CartsManager {

    async getCarritos(limit = 10) {
        try {
            // El populate se puede agregar aquí en la consulta o como middleware pre en el esquema
            // return await cartsModelo.find().populate("products.productId").limit(limit).lean();
            return await cartsModelo.find().limit(limit).lean();
        } catch (error) {
            console.error("Error desde getCarritos:", error);
            throw error;
        }
    }

    async getCarritoBy(filter) {
        try {
            return await cartsModelo.find(filter).lean();
        } catch (error) {
            console.error("Error desde getCarritoBy:", error);
            throw error;
        }
    }

    // {products:[{productId:"",quantity:1},{products:[{productId:"",quantity:1}]}
    async crearCarrito(NuevoCarrito) {
        try {
            return await cartsModelo.create(NuevoCarrito);
        } catch (error) {
            console.error("Error desde crearCarrito:", error);
            throw error;
        }
    }

    async getCarritoById(cid) {
        try {
            return await cartsModelo.findById(cid).populate("products.productId").lean();
        } catch (error) {
            console.error("Error en el getCarritoById:", error);
            throw error;
        }
    }

    async getCarritoByIdNotPopulate(cid) {
        try {
            return await cartsModelo.findById(cid).lean();
        } catch (error) {
            console.error("Error en el getCarritoByIdNotPopulate:", error);
            throw error;
        }
    }

    async updateCart(cid, update) {
        try {
            // Ejemplo: incrementar 1 {"$inc":{"stock": 1}}
            return await cartsModelo.findByIdAndUpdate({ "_id": cid }, update, {
                runValidators: true,
                new: true,
                upsert: true
            });
        } catch (error) {
            console.error("Error desde updateCart:", error.message);
            throw error;
        }
    }

    async deleteCarrito(cid) {
        try {
            return await cartsModelo.findByIdAndDelete(cid);
        } catch (error) {
            console.error("Error desde deleteCarrito:", error);
            throw error;
        }
    }
}

module.exports = CartsManager;
