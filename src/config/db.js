const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB ulandi: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB ulanish xatosi: ${err.message}`);
    process.exit(1);
  }
};

module.exports = dbConnection;
