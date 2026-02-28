const mongoose = require("mongoose");

const connectDB = () => {
  // Default: local MongoDB (works even when Node can't reach Atlas due to TLS).
  // For Atlas, create .env with MONGODB_URI=mongodb+srv://user:pass@namastenode...
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/devTinder";
  return mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });
};

module.exports = connectDB;