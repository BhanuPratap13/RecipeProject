import Like from "../models/Like.js";

// Like a recipe
export const likeRecipe = async (req, res, next) => {
  try {
    const { recipeId } = req.body;

    if (!recipeId) return res.status(400).json({ message: "RecipeId is required" });

    // Check if already liked
    const existingLike = await Like.findOne({ recipe: recipeId, user: req.user._id });
    if (existingLike) {
      return res.status(400).json({ message: "Recipe already liked" });
    }

    const like = new Like({ recipe: recipeId, user: req.user._id });
    await like.save();

    res.status(201).json({ message: "Recipe liked" });
  } catch (error) {
    next(error);
  }
};

// Unlike a recipe
export const unlikeRecipe = async (req, res, next) => {
  try {
    const { recipeId } = req.body;

    if (!recipeId) return res.status(400).json({ message: "RecipeId is required" });

    const deleted = await Like.findOneAndDelete({ recipe: recipeId, user: req.user._id });

    if (!deleted) return res.status(400).json({ message: "You have not liked this recipe" });

    res.json({ message: "Recipe unliked" });
  } catch (error) {
    next(error);
  }
};

// Get number of likes for a recipe
export const getLikesCount = async (req, res, next) => {
  try {
    const { recipeId } = req.params;

    const count = await Like.countDocuments({ recipe: recipeId });

    res.json({ likes: count });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res) => {
  try {
    const { recipeId } = req.params;
    const existingLike = await Like.findOne({ recipe: recipeId, user: req.user._id });
    res.json({ liked: !!existingLike });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};