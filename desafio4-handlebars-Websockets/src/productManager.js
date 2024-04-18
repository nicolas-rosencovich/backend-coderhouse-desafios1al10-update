import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import __dirname from './utils.js';

export class ProductManager {
    constructor() {
        this.path ="products.json";
        this.products = [];
    }

    async addProduct({ title, description, price, thumbnail, code, stock, stat, category }) {
        let id = uuidv4();
        let newProduct = { id, title, description, price, thumbnail, code, stock, stat, category };
        this.products = await this.getProducts();
        this.products.push(newProduct);
        await fs.writeFile(this.path, JSON.stringify(this.products));
        return newProduct;
    }

    async getProducts() {
        try {
            const response = await fs.readFile(this.path, "utf-8");
            return JSON.parse(response);
        } catch (error) {
            console.error("Error al leer el archivo:", error);
            return [];
        }
    }

    async getProductById(id) {
        const response = await this.getProducts();
        const product = response.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            console.log("Producto no encontrado");
        }
    }

    async updateProduct(id, data) {
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === id);
        if (index !== -1) {
            products[index] = { id, ...data };
            await fs.writeFile(this.path, JSON.stringify(products));
            return products[index];
        } else {
            console.log("Upss.. Producto no encontrado");
        }
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const index = products.findIndex(product => product.id === id);
        if (index !== -1) {
            products.splice(index, 1);
            await fs.writeFile(this.path, JSON.stringify(products));
        } else {
            console.log("Producto no encontrado");
        }
    }
}