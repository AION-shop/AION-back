const Location = require("../models/location");
const axios = require("axios");

const API_KEY = "85670c9f2a02a6a2b75067d5481d149d"; // твой OpenWeather API key

// Create location
exports.createLocation = async (req, res) => {
  try {
    const { name, lat, lon } = req.body;
    const location = new Location({ name, lat, lon });
    await location.save();
    res.json(location);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all locations
exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get weather by location id
exports.getWeather = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ message: "Location not found" });

    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${location.lat}&lon=${location.lon}&exclude=minutely,hourly&appid=${API_KEY}&units=metric`;
    const response = await axios.get(url);

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update location
exports.updateLocation = async (req, res) => {
  try {
    const updated = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete location
exports.deleteLocation = async (req, res) => {
  try {
    await Location.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
