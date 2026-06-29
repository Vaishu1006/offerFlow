import Wishlist from "../models/Wishlist.js";

export const addToWishlist = async (req, res, next) => {
  try {
    const { company_id, role } = req.body;
    const wishlist = await Wishlist.create({ user_id: req.user.id, company_id, role });
    res.status(201).json({ success: true, wishlist });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "Already in wishlist" });
    }
    next(error);
  }
};

export const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.role === "admin" && req.query.user_id ? req.query.user_id : req.user.id;
    const wishlist = await Wishlist.find({ user_id: userId }).populate("company_id", "name category location_type");
    res.status(200).json({ success: true, count: wishlist.length, wishlist });
  } catch (error) {
    next(error);
  }
};

export const updateWishlistStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const item = await Wishlist.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Wishlist item not found" });

    if (req.user.role === "student" && item.user_id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    item.status = status;
    await item.save();
    res.status(200).json({ success: true, wishlist: item });
  } catch (error) {
    next(error);
  }
};

export const removeFromWishlist = async (req, res, next) => {
  try {
    const item = await Wishlist.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Wishlist item not found" });

    if (req.user.role === "student" && item.user_id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    await item.deleteOne();
    res.status(200).json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    next(error);
  }
};