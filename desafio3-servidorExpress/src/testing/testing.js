//ahora con type:module realizamos importaciones/exportaciones con import y export
//const ProductMananger = require("./productMananger");
import ProductMananger from "../../src/testing/testing.js ";

const producto = new ProductMananger();


 

//Productos title,description,price,thumbnail ,code,stock

console.log(producto.addProduct("Prs Custom 24", "Prs custom 24 Cerati", 5500, " https://images.app.goo.gl/pjezAzhoR7TDThhYA", "gui001", 3 ))

console.log(producto.addProduct("Gibson Les paul", "Gibson Les paul Custom black", 5000, "https://peachguitars.2dimg.com/114/4o0a5652_2314b7f614.jpg", "gui002", 10 ))

console.log(producto.addProduct("Fender Stratocaster", "Fender Stratocaster vintage", 4500, "https://images.app.goo.gl/5jFP6c2Zj8btNNKYA", "gui003", 8 ))  



console.log(producto.getProducts());

//console.log(producto.getProductById(1));

//onsole.log(producto.deleteProduct(3))

const productoActualizar={
    "id": 30,
    "description": "Fender Stratocaster vintage",
    "price": 500,
    "thumbnail": "https://images.com",
  
}

console.log( producto.updateProduct(3, productoActualizar))

