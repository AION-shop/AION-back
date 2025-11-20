const UserClient = require("../models/userclient");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
exports.registerClient = async (req, res) => {
  try {
    let { telegram, chatId, firstName, lastName, password } = req.body;

    if (!telegram || !firstName || !lastName || !password)
      return res.json({ success: false, message: "Barcha majburiy maydonlar to‘ldirilishi kerak!" });

    telegram = telegram.replace("@", "").trim();

    if (await UserClient.findOne({ telegram }))
      return res.json({ success: false, message: "Bu username allaqachon mavjud!" });

    // Parolni hash qilmasdan modelga yuborish, model ichida pre-save hook bor
    const user = new UserClient({ telegram, chatId: chatId || null, firstName, lastName, password });
    await user.save();

    // JWT token
    const token = jwt.sign(
      { id: user._id, telegram: user.telegram, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Ro‘yxatdan o‘tish muvaffaqiyatli!",
      user: { telegram: user.telegram, firstName, lastName, chatId: user.chatId, role: user.role },
      token,
    });
  } catch (error) {
    console.error("❌ registerClient error:", error);
    return res.json({ success: false, message: "Server xatosi!" });
  }
};

// ================= LOGIN =================
exports.loginClient = async (req, res) => {
  try {
    let { telegram, password } = req.body;
    if (!telegram || !password)
      return res.json({ success: false, message: "Telegram va parol kiritilishi kerak!" });

    telegram = telegram.replace("@", "").trim();
    const user = await UserClient.findOne({ telegram }).select("+password"); // passwordni olish

    if (!user) return res.json({ success: false, message: "Foydalanuvchi topilmadi!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Parol noto‘g‘ri!" });

    const token = jwt.sign(
      { id: user._id, telegram: user.telegram, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      success: true,
      message: "Kirish muvaffaqiyatli!",
      user: { telegram: user.telegram, firstName: user.firstName, lastName: user.lastName, chatId: user.chatId, role: user.role },
      token,
    });
  } catch (error) {
    console.error("❌ loginClient error:", error);
    return res.json({ success: false, message: "Server xatosi!" });
  }
};

// ================= CRUD =================
exports.getAllClients = async (req, res) => {
  try {
    const users = await UserClient.find({}, { password: 0 });
    res.json({ success: true, users });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Foydalanuvchilarni olishda xato!" });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const user = await UserClient.findById(req.params.id, { password: 0 });
    if (!user) return res.json({ success: false, message: "Foydalanuvchi topilmadi!" });
    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Server xatosi!" });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const { firstName, lastName, password, chatId } = req.body;
    const updateData = { firstName, lastName, chatId };
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }
    const user = await UserClient.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!user) return res.json({ success: false, message: "Foydalanuvchi topilmadi!" });
    res.json({ success: true, message: "Yangilandi!", user });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Server xatosi!" });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const user = await UserClient.findByIdAndDelete(req.params.id);
    if (!user) return res.json({ success: false, message: "Foydalanuvchi topilmadi!" });
    res.json({ success: true, message: "O‘chirildi!" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Server xatosi!" });
  }
};
