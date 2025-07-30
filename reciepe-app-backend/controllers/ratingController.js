import mongoose from "mongoose";
import Rating from "../models/Rating.js";

// Add or update rating for a recipe
export const rateRecipe = async (req, res, next) => {
  try {
    const { recipeId, rating } = req.body;

    // Convert rating to number to avoid saving string
    const value = Number(rating);

    if (!recipeId || !value) {
      return res.status(400).json({ message: "RecipeId and rating are required" });
    }

    if (value < 1 || value > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Upsert rating (insert new or update existing)
    const updatedRating = await Rating.findOneAndUpdate(
      { recipe: recipeId, user: req.user._id },
      { value },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json({ message: "Rating saved", rating: updatedRating });
  } catch (error) {
    next(error);
  }
};

// Get average rating and count for a recipe
export const getRecipeRating = async (req, res, next) => {
  try {
    const { recipeId } = req.params;

    const result = await Rating.aggregate([
      { $match: { recipe: new mongoose.Types.ObjectId(recipeId) } },
      {
        $group: {
          _id: "$recipe",
          averageRating: { $avg: "$value" },
          ratingCount: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.json({ averageRating: 0, ratingCount: 0 });
    }

    res.json({
      averageRating: result[0].averageRating,
      ratingCount: result[0].ratingCount,
    });
  } catch (error) {
    next(error);
  }
};
