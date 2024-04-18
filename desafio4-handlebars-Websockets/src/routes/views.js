import { Router } from "express";
import { ProductManager } from "../productManager.js";

const router = Router();

router.get("/", (req, res) => {
    const p = new ProductManager();
    p.getProducts()
        .then(productos => {
            console.log({productos});
            return res.render("home", {productos});
        })
        .catch(error => {
            console.error("Error al obtener los productos:", error);
            return res.status(500).send("Error interno del servidor");
        });
});

router.get("/realtimeproducts", (req, res) => {
  return res.render("realTimeProducts")
})



export default router;