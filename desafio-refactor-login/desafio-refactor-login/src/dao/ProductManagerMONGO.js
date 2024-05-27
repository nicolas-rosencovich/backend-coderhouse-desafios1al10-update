const productoModelo = require("../dao/models/ProductModel");

class ProductManagerMONGO {

    async getProducts(limit = 10, page = 1, sort) {
        let filter = sort ? "price" : "_id";
        sort = sort || 1;

        try {
            return await productoModelo.paginate({}, { limit, page, sort: { [filter]: sort }, lean: true });
        } catch (error) {
            console.error("Error desde getProducts:", error);
            throw error;
        }
    }

    async addProduct(nuevoProducto) {
        try {
            let ProductoNuevo = await productoModelo.create(nuevoProducto);
            return ProductoNuevo.toJSON();
        } catch (error) {
            console.error("Error desde addProduct:", error);
            throw error;
        }
    }

    async getProductBy(filtro) {
        try {
            return await productoModelo.findOne(filtro).lean();
        } catch (error) {
            console.error("Error desde getProductBy:", error);
            throw error;
        }
    }

    async updateProduct(id, update) {
        try {
            return await productoModelo.findByIdAndUpdate(
                { _id: id },
                update,
                { runValidators: true, returnDocument: "after" }
            );
        } catch (error) {
            console.error("Error desde updateProduct:", error);
            throw error;
        }
    }

    async deleteProduct(pid) {
        try {
            return await productoModelo.deleteOne({ _id: pid });
        } catch (error) {
            console.error("Error desde deleteProduct:", error);
            throw error;
        }
    }
}

module.exports = ProductManagerMONGO;
