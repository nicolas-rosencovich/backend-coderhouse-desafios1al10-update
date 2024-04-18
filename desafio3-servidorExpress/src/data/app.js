import express from "express";
import ProductMananger from "./productMananger.js";


const app = express();
const PORT = 8080;

app.get("/products", (req,res) => {
  const {limit}= req.query;
  console.log({limit})//Si el req llega sin nada en consola aparecera undefined;
const p = new ProductMananger();
return res.json({productos:p.getProducts(limit)})

})

app.get("/products/:pid", (req,res) => {
  //Que nos llegue un pid, osea product id 
  const {pid}= req.params;
  const p = new ProductMananger();
  const producto = p.getProductById(Number(pid));



  return  res.json({producto});

  

})
app.listen(PORT, () => {
  console.log(`App corriendo en el puerto ${PORT} `)
})