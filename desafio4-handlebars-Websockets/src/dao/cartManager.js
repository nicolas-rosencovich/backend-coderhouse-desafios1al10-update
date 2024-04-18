import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";

export class CartManager {
  constructor() {
    this.path = "cart.json";
  }

  async getCarts() {
    try {
      const response = await fs.readFile(this.path, "utf-8");
      const carts = JSON.parse(response);
      return carts;
    } catch (error) {
      console.error("Error al leer el archivo de carritos:", error);
      return [];
    }
  }

  async getCartProducts(id) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find((cart) => cart.id === id);

      if (cart) {
        return cart.products;
      } else {
        console.log("Upss. El carrito no fue encontrado");
        return [];
      }
    } catch (error) {
      console.error("Error al obtener productos del carrito:", error);
      return [];
    }
  }

  async newCart() {
    try {
      const id = uuidv4();
      const newCart = { id, products: [] };

      const carts = await this.getCarts();
      carts.push(newCart);

      await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
      console.log("Nuevo carrito creado con éxito:", newCart);
      return newCart;
    } catch (error) {
      console.error("Error al crear un nuevo carrito:", error);
      throw error;
    }
  }

  async addProductToCart(cart_id, product_id) {
    try {
      const carts = await this.getCarts();
      const index = carts.findIndex((cart) => cart.id === cart_id);

      if (index !== -1) {
        const cartProducts = await this.getCartProducts(cart_id);
        const existingProductIndex = cartProducts.findIndex(
          (product) => product.product_id === product_id
        );

        if (existingProductIndex !== -1) {
          cartProducts[existingProductIndex].quantity += 1;
        } else {
          cartProducts.push({ product_id, quantity: 1 });
        }

        carts[index].products = cartProducts;

        await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
        console.log("Producto agregado al carrito con éxito");
      } else {
        console.log("Carrito no encontrado");
      }
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      throw error;
    }
  }
}
