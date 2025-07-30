import Recipe from "../models/Recipe.js";
import Like from "../models/Like.js";
import Rating from "../models/Rating.js";
import mongoose from "mongoose";

// Create a new recipe
export const createRecipe = async (req, res, next) => {
  try {
    const { title, description, ingredients, steps, cookingTime, imageUrl, categories, tags } = req.body;

    // Basic validation
    if (!title || !steps || steps.length === 0) {
      return res.status(400).json({ message: "Title and steps are required" });
    }

    const recipe = new Recipe({
      title,
      description,
      ingredients,
      steps,
      cookingTime,
      imageUrl,
      categories,
      tags,
      createdBy: req.user._id, // from protect middleware
    });

    await recipe.save();

    res.status(201).json(recipe);
  } catch (error) {
    next(error);
  }
};

// Get list of recipes with optional filtering by category or tags and include likes and ratings
export const getRecipes = async (req, res, next) => {
  try {
    const { category, tag, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (category) filter.categories = category;
    if (tag) filter.tags = tag;

    const recipes = await Recipe.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate("createdBy", "name email")
      .lean();

    const recipesWithStats = await Promise.all(
      recipes.map(async (recipe) => {
        const likesCount = await Like.countDocuments({ recipe: recipe._id });
        const ratingAgg = await Rating.aggregate([
          { $match: { recipe: new mongoose.Types.ObjectId(recipe._id) } },
          {
            $group: {
              _id: "$recipe",
              averageRating: { $avg: "$rating" },
              ratingCount: { $sum: 1 },
            },
          },
        ]);
        const averageRating = ratingAgg[0]?.averageRating || 0;
        const ratingCount = ratingAgg[0]?.ratingCount || 0;

        return {
          ...recipe,
          likesCount,
          averageRating: Number(averageRating.toFixed(2)),
          ratingCount,
        };
      })
    );

    res.json(recipesWithStats);
  } catch (error) {
    next(error);
  }
};

// Get single recipe by id with likes and ratings
export const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate("createdBy", "name email")
      .lean();

    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    const likesCount = await Like.countDocuments({ recipe: recipe._id });
    const ratingAgg = await Rating.aggregate([
      { $match: { recipe: new mongoose.Types.ObjectId(recipe._id) } },
      {
        $group: {
          _id: "$recipe",
          averageRating: { $avg: "$rating" },
          ratingCount: { $sum: 1 },
        },
      },
    ]);
    const averageRating = ratingAgg[0]?.averageRating || 0;
    const ratingCount = ratingAgg[0]?.ratingCount || 0;

    res.json({
      ...recipe,
      likesCount,
      averageRating: Number(averageRating.toFixed(2)),
      ratingCount,
    });
  } catch (error) {
    next(error);
  }
};

// Update recipe (only by creator)
export const updateRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this recipe" });
    }

    const updates = req.body;
    Object.assign(recipe, updates);
    await recipe.save();

    res.json(recipe);
  } catch (error) {
    next(error);
  }
};

// Delete recipe (only by creator)
export const deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    if (recipe.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this recipe" });
    }

    await recipe.deleteOne();

    res.json({ message: "Recipe deleted" });
  } catch (error) {
    next(error);
  }
};
