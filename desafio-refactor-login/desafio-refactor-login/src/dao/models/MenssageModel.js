const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference the User model
    required: true // Mark user field as required
  },
  message: {
    type: String,
    required: true, // Mark message field as required
    maxlength: 255 // Set a maximum length for the message
  },
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation" // Optional reference for conversations
  },
  isRead: {
    type: Boolean,
    default: false // Set default value for isRead
  },
  createdAt: {
    type: Date,
    default: Date.now // Use Date.now for message creation time
  }
}, {
  timestamps: true // Include automatic timestamps
});

// Optional: Add a custom validation for the message content
messageSchema.pre("save", function(next) {
  if (this.message.trim().length === 0) {
    const error = new Error("Message content cannot be empty");
    error.name = "ValidationError";
    return next(error);
  }
  next();
});

const MessageModel = mongoose.model("Message", messageSchema);

module.exports = MessageModel;