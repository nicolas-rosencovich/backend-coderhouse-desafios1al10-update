import { Router } from "express";
import { productManager } from "../app.js";

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
    try {
        const limit = Number(req.query.limit);
        if (isNaN(limit) || limit < 1) {
            return res.status(400).send("El límite debe ser un número positivo");
        }

        const products = await productManager.getProducts();

        if (limit) {
            const limitedProducts = products.slice(0, limit);
            return res.json(limitedProducts);
        }
        return res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al intentar recibir productos");
    }
});

productsRouter.get("/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid);
        if (!product) {
            return res.status(404).send(`Producto con ID ${pid} no encontrado`);
        }
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error al intentar recibir el producto con ID ${pid}`);
    }
});

productsRouter.post("/", async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock, stat = true, category } = req.body;
        const response = await productManager.addProduct({ title, description, price, thumbnail, code, stock, stat, category });
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al intentar ingresar un producto");
    }
});

productsRouter.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const { title, description, price, thumbnail, code, stock, stat = true, category } = req.body;
        const response = await productManager.updateProduct(pid, { title, description, price, thumbnail, code, stock, stat, category });
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error al intentar editar producto con ID ${pid}`);
    }
});

productsRouter.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        await productManager.deleteProduct(pid);
        res.send(`Producto con ID ${pid} eliminado de forma exitosa`);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error al intentar ELIMINAR producto con ID ${pid}`);
    }
});

export { productsRouter };
