const Product = require("../models/popular.model");

// Barcha mashhur avtomobillarni olish
exports.getPopularCars = async (req, res) => {
  try {
    const cars = await Product.find({ isPopular: true });
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Barcha avtomobillarni olish
exports.getAllCars = async (req, res) => {
  try {
    const cars = await Product.find();
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Bitta avtomobilni ID bo‘yicha olish
exports.getCarById = async (req, res) => {
  try {
    const car = await Product.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Yangi avtomobil qo‘shish
exports.addCar = async (req, res) => {
  try {
    const newCar = new Product(req.body);
    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (error) {
    res.status(400).json({ message: "Invalid data", error: error.message });
  }
};

// Avtomobilni yangilash
exports.updateCar = async (req, res) => {
  try {
    const updatedCar = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCar) return res.status(404).json({ message: "Car not found" });
    res.json(updatedCar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Avtomobilni o‘chirish
exports.deleteCar = async (req, res) => {
  try {
    const deletedCar = await Product.findByIdAndDelete(req.params.id);
    if (!deletedCar) return res.status(404).json({ message: "Car not found" });
    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Views oshirish
exports.addCarView = async (req, res) => {
  try {
    const car = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json({ success: true, views: car.views });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Rating berish
exports.rateCar = async (req, res) => {
  try {
    const { rating } = req.body; // 1-5 ball
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const car = await Product.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });

    const totalRating = (car.rating || 0) * (car.reviewsCount || 0);
    const newReviewsCount = (car.reviewsCount || 0) + 1;
    const newRating = (totalRating + rating) / newReviewsCount;

    car.rating = newRating;
    car.reviewsCount = newReviewsCount;

    await car.save();
    res.json({ success: true, rating: car.rating, reviewsCount: car.reviewsCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
