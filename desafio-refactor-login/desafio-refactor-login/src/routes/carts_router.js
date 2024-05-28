// PUT update cart (entire cart)
router.put("/:cid", async (req, res) => {
    const products = req.body;
    const { cid } = req.params;
  
    if (!products) {
      return res.status(400).json({ error: "Cart must contain products" });
    }
  
    if (!isValidObjectId(cid)) {
      return res.status(400).json({ error: "Invalid Mongo ID provided" });
    }
  
    try {
      // Retrieve the existing cart from the database
      const existingCart = await cartManager.getCarritoById({ _id: cid });
      if (!existingCart) {
        return res.status(400).json({ error: `Cart with ID ${cid} does not exist` });
      }
  
      // Process the received products
      const processedProducts = [];
      for (const product of products) {
        const { productId, quantity } = product;
  
        // Validate product ID and quantity
        if (!isValidObjectId(productId) || typeof quantity !== "number") {
          continue; // Skip invalid products
        }
  
        // Check if product exists in the database
        const existingProduct = await productManager.getProductBy({ _id: productId });
        if (!existingProduct) {
          continue; // Skip products that don't exist
        }
  
        // Determine whether to add, modify, or delete the product
        const existingProductIndex = existingCart.products.findIndex(
          (cartProduct) => cartProduct.productId._id === productId
        );
  
        if (existingProductIndex !== -1) {
          // Product already exists in the cart - update quantity
          const existingCartProduct = existingCart.products[existingProductIndex];
          existingCartProduct.quantity = quantity;
        } else {
          // New product - add to the cart
          processedProducts.push({ productId: existingProduct, quantity });
        }
      }
  
      // Update the cart with the processed products
      const updatedCart = {
        ...existingCart,
        products: [...existingCart.products, ...processedProducts],
      };
  
      // Save the updated cart to the database
      const updated = await cartManager.updateCart(cid, updatedCart);
      if (updated) {
        return res.status(200).json({ status: "Cart updated successfully" });
      } else {
        return res.status(500).json({ error: "Failed to update cart" });
      }
    } catch (error) {
      return handleError(error, res);
    }
  });
  