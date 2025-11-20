import mongoose from "mongoose";

const rowProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 },
    category: { type: String, required: true },
    description: { type: String },
    thumbnail: { type: String },
    images: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("RowProduct", rowProductSchema);
