const { Router } = require("express");
const router = Router();
const ProductManager = require("../dao/ProductManagerMONGO.js");
const uploader = require("../utils.js").uploader;
const { isValidObjectId } = require("mongoose");
const auth = require("../middleware/auth.js");

const entorno = async () => {
  const productManager = new ProductManager();

  router.get("/", async (request, response) => {
    let { limit, page, sort } = request.query;

    if (sort) {
      sort = Number(sort);
      if (isNaN(sort)) {
        sort = 1;
      }
    }

    console.log(sort, "Desde linea 18");

    if (page) {
      page = Number(page);
      if (isNaN(page)) {
        page = 1;
      }
    }

    page = page || 1;

    if (limit) {
      limit = Number(limit);
      if (!isNaN(limit)) {
        if (limit > 0) {
          try {
            const { docs: productos } = await productManager.getProducts(limit, page, sort);
            response.setHeader("Content-Type", "application/json");
            return response.status(200).json(productos);
          } catch (error) {
            console.log(error);
            response.setHeader("Content-Type", "application/json");
            return response.status(500).json({
              error: "Error inesperado en el servidor - intente más tarde",
              detalle: `${error.message}`,
            });
          }
        } else {
          response.setHeader("Content-Type", "application/json");
          return response.status(400).json({ error: "Los limites deben ser datos numericos" });
        }
      } else {
        response.setHeader("Content-Type", "application/json");
        return response.status(400).json({ error: "Los limites deben ser datos numericos" });
      }
    } else {
      limit = 10;
      try {
        const { docs: productos } = await productManager.getProducts(limit, page, sort);
        response.setHeader("Content-Type", "application/json");
        return response.status(200).json(productos);
      } catch (error) {
        console.log(error);
        response.setHeader("Content-Type", "application/json");
        return response.status(500).json({
          error: "Error inesperado en el servidor - intente más tarde",
          detalle: `${error.message}`,
        });
      }
    }
  });

  router.get("/:pid", async (request, response) => {
    let { pid } = request.params;

    if (!isValidObjectId(pid)) {
      response.setHeader("Content-Type", "application/json");
      return response.status(400).json({ error: 'Ingrese un ID valido de MongoDB' });
    } else {
      try {
        const producto = await productManager.getProductBy({ _id: pid });
        if (producto) {
          response.setHeader("Content-Type", "application/json");
          return response.status(200).json(producto);
        } else {
          response.setHeader("Content-Type", "application/json");
          return response.status(400).json({ error: `No existe producto con ID ${pid}` });
        }
      } catch (error) {
        console.log(error);
        response.setHeader("Content-Type", "application/json");
        return response.status(500).json({
          error: `Error inesperado en el servidor`,
          detalle: `${error.message}`,
        });
      }
    }
  });

  router.post("/", uploader.single("thumbnail")), auth, async (request, response) => {
    // Recuperar todos los datos desde el cuerpo de la consulta
    let { title, description, price, thumbnail, code, stock } = request.body;

    // Verificar Si recibimos imagenes
    if (request.file) {
      thumbnail = request.file.path;
    }

    let existe;
    if (!title || !description || !price || !code || !stock) {
      response.setHeader("Content-Type", "application")


      router.put("/:pid", uploader.single("thumbnail"), auth, async (request, response) => {
        const { pid } = request.params;
    
        if (!isValidObjectId(pid)) {
          response.setHeader("Content-Type", "application/json");
          return response.status(400).json({ error: "Ingrese un ID valido de MongoDB" });
        } else {
          let { title, description, price, code, stock } = request.body;
          let thumbnail;
    
          if (request.file) {
            thumbnail = request.file.path;
          }
    
          try {
            const productoActualizado = await productManager.updateProduct({ _id: pid }, { title, description, price, code, stock, thumbnail });
            if (productoActualizado) {
              response.setHeader("Content-Type", "application/json");
              return response.status(200).json({ mensaje: "Producto actualizado exitosamente" });
            } else {
              response.setHeader("Content-Type", "application/json");
              return response.status(400).json({ error: `No existe producto con ID ${pid}` });
            }
          } catch (error) {
            console.log(error);
            response.setHeader("Content-Type", "application/json");
            return response.status(500).json({
              error: "Error inesperado en el servidor",
              detalle: `${error.message}`,
            });
          }
        }
      });
    
      router.delete("/:pid", auth, async (request, response) => {
        const { pid } = request.params;
    
        if (!isValidObjectId(pid)) {
          response.setHeader("Content-Type", "application/json");
          return response.status(400).json({ error: "Ingrese un ID valido de MongoDB" });
        } else {
          try {
            const productoEliminado = await productManager.deleteProduct({ _id: pid });
            if (productoEliminado) {
              response.setHeader("Content-Type", "application/json");
              return response.status(200).json({ mensaje: "Producto eliminado exitosamente" });
            } else {
              response.setHeader("Content-Type", "application/json");
              return response.status(400).json({ error: `No existe producto con ID ${pid}` });
            }
          } catch (error) {
            console.log(error);
            response.setHeader("Content-Type", "application/json");
            return response.status(500).json({
              error: "Error inesperado en el servidor",
              detalle: `${error.message}`,
            });
          }
        }
      });
      
    }
    
      return router;
    }

    

    module.exports = entorno;
}