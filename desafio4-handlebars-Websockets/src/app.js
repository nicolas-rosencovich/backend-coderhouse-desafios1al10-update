import express from 'express';

import {Server} from  "socket.io";
import {engine} from "express-handlebars";
import __dirname from './utils.js';

import { ProductManager}  from './productManager.js';
import { CartManager } from './dao/cartManager.js'; 
import { productsRouter } from "./routes/products.router.js";
import { cartsRouter } from "./routes/cart.router.js";
import views from "./routes/views.js"



const PORT = 8080;
const app = express();

export const productManager = new ProductManager();
export const cartManager = new CartManager(); // Exporta el cartManager correctamente


const p = new ProductManager()

app.use("/", views)
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"))

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views',  __dirname +'/views');


/* app.get('/', (req, res) => {
    res.render('home');
}); */

const expressServer = app.listen(PORT, () => {
    console.log(`Server escuchando en puerto ${PORT}`);
});


const socketServer = new Server(expressServer)



socketServer.on("connection", async (socket) => {
    console.log("Cliente conectado desde front");
    try {
        const productos = await p.getProducts();
        socket.emit("productos", productos);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
    }
});




