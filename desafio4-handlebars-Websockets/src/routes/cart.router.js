import { Router } from "express";
import { cartManager } from "../app.js";

const cartsRouter = Router();

cartsRouter.post("/", async (req, res) => {
    try {
        const response = await cartManager.newCart();
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al crear carrito" });
    }
});

cartsRouter.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const response = await cartManager.getCartProducts(cid);
        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al obtener productos del carrito" });
    }
});

cartsRouter.post("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    try {
        await cartManager.addProductToCart(cid, pid);
        res.json({ message: "Producto agregado exitosamente al carrito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al agregar producto al carrito" });
    }
});

export { cartsRouter };
