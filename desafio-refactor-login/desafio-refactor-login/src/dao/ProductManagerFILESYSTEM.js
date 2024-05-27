const fs = require("fs");

class ProductManagerFILESYSTEM {
    #products;
    #path;

    constructor(rutaDeArchivo) {
        this.#path = rutaDeArchivo;
        this.inicializar();
    }

    async inicializar() {
        this.#products = await this.#BuscarArchivo();
    }

    #asignarIdProducto() {
        let id = 1;
        if (this.#products.length != 0) {
            id = this.#products[this.#products.length - 1].id + 1;
        }
        return id;
    }

    #BuscarArchivo = async () => {
        try {
            if (fs.existsSync(this.#path)) {
                return JSON.parse(await fs.promises.readFile(this.#path, "utf-8"));
            } else {
                return [];
            }
        } catch (error) {
            console.error("Problemas al buscar el archivo:", error);
            return [];
        }
    }

    #guardarArchivo = async () => {
        try {
            await fs.promises.writeFile(this.#path, JSON.stringify(this.#products, null, 5));
        } catch (error) {
            console.error("Problemas al guardar el archivo:", error);
        }
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !code || !stock) {
            return "🛑 Se requiere completar todos los parámetros: title, description, price, thumbnail, code, stock";
        } else {
            let repetido = this.#products.some(pro => pro.code === code.trim());
            if (repetido) {
                return "🛑 Ya existe un producto con este código 🛑";
            } else {
                if (thumbnail) {
                    thumbnail = thumbnail.replace("/Applications/MAMP/htdocs/ClaseBackend/Desafio5/src/public", "..");
                }

                const nuevoProducto = {
                    id: this.#asignarIdProducto(),
                    title,
                    description,
                    price,
                    thumbnail: thumbnail || "../img/SinImagen.png",
                    code,
                    stock
                };

                this.#products.push(nuevoProducto);
                try {
                    await this.#guardarArchivo();
                    return "✅ Producto agregado exitosamente ✅";
                } catch (error) {
                    console.error(error);
                    return "🛑 Error al agregar el producto 🛑";
                }
            }
        }
    }

    getProducts() {
        return this.#products;
    }

    getProductById(id) {
        let producto = this.#products.find((prod) => prod.id === id);
        return producto ? producto : "🛑 Producto no encontrado 🛑";
    }

    async updateProduct(id, update) {
        const index = this.#products.findIndex((produc) => produc.id === id);
        if (index >= 0) {
            const { id, ...rest } = update;
            this.#products[index] = { ...this.#products[index], ...rest };
            try {
                await this.#guardarArchivo();
                return "✅ Producto actualizado correctamente ✅";
            } catch (error) {
                console.error(error.message);
                return "🛑 Error al actualizar el producto 🛑";
            }
        } else {
            return `🛑 El producto con el id: ${id} no existe 🛑`;
        }
    }

    async deleteProduct(pid) {
        const index = this.#products.findIndex((produc) => produc.id === pid);
        if (index >= 0) {
            this.#products = this.#products.filter(produc => produc.id !== pid);
            try {
                await this.#guardarArchivo();
                return "✅ Producto eliminado correctamente ✅";
            } catch (error) {
                console.error("Error al eliminar el producto:", error);
                return "🛑 Error al eliminar el producto 🛑";
            }
        } else {
            return `🛑 El producto con el id: ${pid} no existe 🛑`;
        }
    }
}

module.exports = ProductManagerFILESYSTEM;
