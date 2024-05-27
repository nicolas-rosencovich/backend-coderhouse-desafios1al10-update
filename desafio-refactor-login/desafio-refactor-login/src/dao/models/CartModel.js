let mongoose = require("mongoose");

const cartsCollection = "carts";
const cartsEsquema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          productId: {
            type: mongoose.Types.ObjectId,
            ref: "products",
          },
          quantity: Number,
        },
      ],
    },
  },
  // Optional strict mode (consider setting to false in production)
  { timestamps: true }
);

// Populate only specific fields from products
cartsEsquema.pre("find", function () {
  this.populate({
    path: "products.productId",
    select: "name price -_id",
  });
});

const cartsModelo = mongoose.model(cartsCollection, cartsEsquema);

module.exports = cartsModelo;