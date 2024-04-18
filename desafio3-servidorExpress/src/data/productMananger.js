//ahora con type:module realizamos importaciones/exportaciones con import y export
//const fs = require("fs");

import fs from "fs";



class ProductMananger{

    #products;
    #path;
    static idProducto = 0;

    constructor(){
        this.#path= "./src/data/productos.json"
        this.#products = this.#leerProductosInFile();
    



 // Inicializar el ID basado en el producto con el ID más alto al cargar los productos
 if (this.#products.length > 0) {
    ProductMananger.idProducto = this.#products.reduce((max, product) => product.idProducto > max ? product.idProducto : max, 0);
}



    }

/*     #asingarIdProducto(){
        let id= 1;
        if(!this.#products.length != 0 )
        id = this.#products[this.#products.length-1].id + 1 ;
     return id ;
    }  */

    #asingarIdProducto() {
        let id;
        if (this.#products.length > 0) {
            id = this.#products[this.#products.length - 1].id + 1;
        } else {
            id = 1; // Asignar un valor inicial de ID si el arreglo está vacío
        }
        return id; // Asegúrate de retornar el valor de ID
    }

    #leerProductosInFile(){
    try{
        if(fs.existsSync(this.#path)){
            return JSON.parse(fs.readFileSync(this.#path, 'utf-8'))
        }
        return [];

    } catch (error) {
console.log(`Hubo un error al momento de LEER el archivo de productos, ${error} `)
    }
    }

    //Cuando queramos hacer un cambio en algún producto acá lo fguardaremos automaticamente
    #guardarArchivo(){
    try{
   /* fs.writeFileSyncthis(this.#path,JSON.stringify(this.#products)) */
            fs.writeFileSync(this.#path,JSON.stringify(this.#products))
        
    }catch (error) {
console.log(`Hubo un error al momento de GUARDAR el archivo de productos, ${error} `)
    }
    }


    addProduct(title,description,price,thumbnail ,code,stock){
   
        if((!title || !description|| !price
            || !thumbnail || !code || !stock))
            return "todos los parámetoros son requeridos  [title,description,price,thumbnail ,code,stock]"
                
            
            ProductMananger.idProducto = ProductMananger.idProducto + 1;
            const id = ProductMananger.idProducto; // Usa el ID de ProductMananger en lugar de llamar a #asingarIdProducto


            
/* const codeRepetido=  this.#products.some(p => p.code== code);

        if( codeRepetido)
         return `El código ${code} ya se encuetra repetido en otro producto`
//acá s evalida que no haya repeticiones de ódigop
//Id autoincrementable

ProductMananger.idProducto = ProductMananger.idProducto + 1;
const id = this.#asingarIdProducto(); */

const nuevoProducto = {
            id,
            description,
            price,
            thumbnail,
            code,
            stock,
        };
        this.#products.push(nuevoProducto);
        this.#guardarArchivo();
        return `Producto agregado satisfactoriamente!`;


        
    }

    getProducts(limit=0){
        limit = Number(limit); 
        if(limit > 0 ){
            return this.#products.slice(0,limit)
            //Me tiene que devolver la cantidad solicitada
            return this.#products;
        }
        return this.#products
    }

    getProductById(id){
     const producto =  this.#products.find(p =>p.id == id)
     if(producto)

        return producto;

    else
     
        return `Not found del producto con id ${id}`

    
        //Not Found

    }

    updateProduct(id,objetoUpdate){
        let msg = `El producto con id ${id} no existe`

        const index = this.#products.findIndex(p=> p.id === id );

        if(index !== -1){
            const{id, ...rest}= objetoUpdate;
            this.#products[index]= { ...this.#products[index], ...rest}
            this.#guardarArchivo();
            msg = `Producto actualizado!! `

        }
        
        return msg;
    } 

    deleteProduct(id){
let msg = `El producto con id ${id} NO EXISTE`

        const index = this.#products.findIndex(p=>p.id === id )

        if(index !=  -1){

        this.#products=this.#products.filter(p=>p.id !== id)

        this.#guardarArchivo();

        msg= `Producto eliminado con éxito!`
}

    return msg
    }

}


//module.exports= ProductMananger
//Ahora lo exportamos de la siguiente manera 
export default ProductMananger
