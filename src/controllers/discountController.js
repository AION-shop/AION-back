  import DiscountCard from "../models/discountCard.js";

  // CREATE discount card
  export const createDiscountCard = async (req, res) => {
    try {
      const { title, description, product1 } = req.body;

      if (!product1?.name || !product1?.price || !product1?.originalPrice || !product1?.showProduct1Until) {
        return res.status(400).json({ success: false, message: "Product ma'lumotlari yetarli emas" });
      }

      const card = await DiscountCard.create({ title, description, product1 });
      res.status(201).json({ success: true, discountCard: card });
    } catch (err) {
      console.error(err);
      res.status(400).json({ success: false, message: err.message });
    }
  };

  // GET active product (frontend uchun)
  export const getActiveProduct = async (req, res) => {
    try {
      const card = await DiscountCard.findOne({ isActive: true }).sort({ createdAt: -1 });
      if (!card) return res.json({ products: [] });

      const now = new Date();
      let products = [];

      if (new Date(card.product1.showProduct1Until) > now) {
        const p = { ...card.product1._doc };  // original doc
        // Chegirma foizini hisoblash
        p.discountPercent = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100);
        products = [p];
      }

      res.json({ products });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  // DELETE discount card
  export const deleteDiscountCard = async (req, res) => {
    try {
      const deletedCard = await DiscountCard.findByIdAndDelete(req.params.id);
      if (!deletedCard) return res.status(404).json({ success: false, message: "Not found" });
      res.json({ success: true, message: "Deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };
