import express from "express";
import { rateRecipe, getRecipeRating } from "../controllers/ratingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, rateRecipe);            // Add/update rating
router.get("/:recipeId", getRecipeRating);        // Get rating stats

export default router;
