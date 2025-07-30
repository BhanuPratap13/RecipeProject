import express from "express";
import {
  createRecipe,
  getRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from "../controllers/recipeController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getRecipes);
router.get("/:id", getRecipeById);
router.post("/", protect, createRecipe);         // Protected: only logged in users
router.put("/:id", protect, updateRecipe);       // Protected: only creator can update
router.delete("/:id", protect, deleteRecipe);    // Protected: only creator can delete

export default router;
