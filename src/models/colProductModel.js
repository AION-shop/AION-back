import mongoose from "mongoose";

const colProductSchema = new mongoose.Schema(
  {
    title: String,
    price: Number,
    discountPercentage: Number,
    category: String,
    description: String,
    thumbnail: String,
    images: [String],
    batteryOptions: [String],
    maxRange: Number,
    acceleration: Number,
    power: Number,
    rating: Number,
    reviewsCount: Number,
  },
  { timestamps: true }
);

export default mongoose.model("ColProduct", colProductSchema);
