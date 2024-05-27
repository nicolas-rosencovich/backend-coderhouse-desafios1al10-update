const mongoose = require("mongoose");
const bcrypt = require("bcrypt"); // For password hashing
const paginate = require("mongoose-paginate-v2");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true, // Remove leading/trailing whitespace
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true, // Convert email to lowercase for consistency
  },
  age: {
    type: Number,
    min: 13, // Minimum age requirement (optional)
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // Minimum password length
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"], // Allowed roles (optional)
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart",
  },
}, {
  timestamps: true,
  strict: false,
});

// Hash password before saving the user document
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10; // Adjust salt rounds for security needs
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
  next();
});

// Custom method for password comparison (optional)
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.plugin(paginate);

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
