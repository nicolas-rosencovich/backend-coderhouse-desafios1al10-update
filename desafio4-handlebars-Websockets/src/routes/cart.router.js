import {Router} from "express";
import { cartManager } from "../app.js";

const cartsRouter = Router()

//Para crear un nuevo carrito > }

cartsRouter.post("/", async (req,res) => {
  try{
    const response = await cartManager.newCart()
    res.json(response)
  }
  catch(error){
res.send("Error al crear carrito ")
  }
})


cartsRouter.get("/:cid", async (req, res)=>{
   const {cid}= req.params
    try{
const response=await cartManager.getCartProducts(cid)
    }
    catch(error){
res.send("Error al intentar enviar productos al carrito")
    }
})

cartsRouter.post ("/:cid/products/:pid", async(req,res)=>{
    const {cid,pid}= req.params;
    
    try{
        await cartManager.addProductToCart(cid,pid)
        res.send("Producto agregado exitosamente")
    }
    catch (error){
     res.send("Error al intentar guardar producto en el carrito")
    }
})

export {cartsRouter}