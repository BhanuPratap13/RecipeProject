import express from "express";
import { likeRecipe, unlikeRecipe, getLikesCount, getUser } from "../controllers/likeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, likeRecipe);          // Like a recipe
router.delete("/", protect, unlikeRecipe);      // Unlike a recipe
router.get("/:recipeId/count", getLikesCount);  // Get likes count for a recipe
router.get("/:recipeId/user", protect, getUser); 

export default router;
