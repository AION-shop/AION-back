import Product from "../models/product.model.js";

// 🔹 Barcha productlarni olish
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server xatosi!" });
  }
};

// 🔹 Hammasini delete qilish
export const deleteAllProducts = async (req, res) => {
  try {
    await Product.deleteMany({});
    res.json({ success: true, message: "Barcha products muvaffaqiyatli o‘chirildi!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 GET products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    if (!category)
      return res
        .status(400)
        .json({ success: false, products: [], message: "Category kerak" });

    const products = await Product.find({ category });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 GET products by search query
export const searchProducts = async (req, res) => {
  try {
    let q = req.query.q || "";
    q = q.trim();

    const filter = {
      category: { $regex: "AION", $options: "i" }, 
    };

    if (q !== "") {
      const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.title = { $regex: escapedQ, $options: "i" };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ success: false, message: "Server xatosi!" });
  }
};

// 🔹 Yagona product qo'shish
export const addProduct = async (req, res) => {
  try {
    const { title, price, description, thumbnail, images, category } = req.body;
    if (!title || !price) {
      return res
        .status(400)
        .json({ success: false, message: "Title va price kerak!" });
    }

    const product = new Product({ title, price, description, thumbnail, images, category });
    await product.save();
    res
      .status(201)
      .json({ success: true, message: "Product muvaffaqiyatli qo'shildi!", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server xatosi!" });
  }
};


// 🔹 GET /api/products/stats
export const getProductStats = async (req, res) => {
  try {
    // jami productlar
    const totalProducts = await Product.countDocuments();

    // bugun qo‘shilgan productlar
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newProductsToday = await Product.countDocuments({ createdAt: { $gte: today } });

    // kunlik stats oxirgi 7 kun
    const dailyStats = await Product.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ totalProducts, newProductsToday, dailyStats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// 🔹 Bulk add products
export const bulkAddProducts = async (req, res) => {
  try {
    const products = req.body;
    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Products array bo'lishi kerak!" });
    }

    const newProducts = await Product.insertMany(products);
    res
      .status(201)
      .json({ success: true, message: "Products muvaffaqiyatli qo‘shildi!", products: newProducts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 Productni ID bo‘yicha olish
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ success: false, message: "Product topilmadi" });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🔹 Productni update qilish
export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, product: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// 🔹 Productni delete qilish
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product o‘chirildi!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
