import { Router } from "express";
import { productManager } from "../app.js";


const productsRouter = Router()

//hhtp://localhost:8080/products
/* productsRouter.get("/", async(req, res)=>{
    try{
        const [limit]= req.query;
        const products = await productManager.getProducts()

        if(limit){
            const limitedProducts = products.slice(0, limit)
            return res.json(limitedProducts)
        }
        return res.json(products)
    }


    catch(error){
        //Cuando algo salga mal
        console.log(error);
        res.send ("Error al intentar recibir productos")
        
    }
}) */


productsRouter.get("/", async(req, res)=>{
    try{
        const limit = Number(req.query.limit);
        if (isNaN(limit) || limit < 1) {
            return res.status(400).send("El límite debe ser un número positivo");
        }

        const products = await productManager.getProducts()

        if(limit){
            const limitedProducts = products.slice(0, limit)
            return res.json(limitedProducts)
        }
        return res.json(products)
    }
    catch(error){
        console.error(error);
        res.status(500).send("Error al intentar recibir productos")
    }
})


productsRouter.get("/:pid", async (req, res)=>{
    try{
        const {pid} = req.params;
        const products =await  productManager.getProductById(pid)
        req.json(products)
    }
      catch(error){
        //Cuando algo salga mal
        console.log(error);
        res.send (`Error al intentar recibir el producto con id ${pid} `)
    }
})

productsRouter.post("/", async (req, res)=>{
    try{
        const{title,description, price, thumbnail,code,stock,stat=true,category}= req.body;
        const response = await productManager.addProduct({title,description, price, thumbnail,code,stock,stat,category})
    }
    catch (error){
        console.log("error");
        res.send("Error al intentar ingresar un producto")
        
    }
})

productsRouter.put("/:id", async(res,req)=>{
    const{pid}= req.params
    try{
        const{title,description, price, thumbnail,code,stock,stat=true,category}=req.body
        const response = await productManager.updateProduct(pid,{title,description, price, thumbnail,code,stock,stat,category})
        res.json(response)
    }

    catch{
        console.log(error);
        res.send(`Error al intentar editar producto con ID ${pid}`)
    
    }
})

productsRouter.delete("/:id", async(res,req)=>{
    const{pid}= req.params
    try{
        await productManager.deleteProduct(id)
        res.send(`Producto eliminado de forma exitosa`)
    }
    catch{
console.log(error);
res.send(`Error al intentar ELIMINAR producto con ID ${pid}`)


    }
})

export {productsRouter}