const Banner = require("../models/banner.model");

// Yangi banner qo'shish
exports.addBanner = async (req, res) => {
  try {
    const { title, image, link } = req.body;
    if (!title || !image) {
      return res.json({ success: false, message: "Title va image majburiy!" });
    }

    const banner = new Banner({ title, image, link });
    await banner.save();

    return res.json({ success: true, message: "Banner muvaffaqiyatli qo'shildi!", banner });
  } catch (error) {
    console.error("❌ addBanner error:", error);
    return res.json({ success: false, message: "Server xatosi!" });
  }
};

// Barcha bannerlarni olish
exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({});
    return res.json({ success: true, banners });
  } catch (error) {
    console.error("❌ getBanners error:", error);
    return res.json({ success: false, message: "Bannerlarni olishda xatolik!" });
  }
};

// Bir bannerni o'chirish
exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndDelete(id);
    if (!banner) return res.status(404).json({ success: false, message: "Banner topilmadi!" });
    res.json({ success: true, message: "Banner o‘chirildi!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server xatosi!" });
  }
};

// Hammasini o‘chirish
exports.deleteAllBanners = async (req, res) => {
  try {
    await Banner.deleteMany({});
    res.json({ success: true, message: "Barcha bannerlar o‘chirildi!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
