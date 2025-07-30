import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    ingredients: [{ name: String, quantity: Number, unit: String }],
    steps:       [{ type: String, required: true }],
    cookingTime: { type: Number, default: 0 }, // in minutes
    imageUrl:    { type: String, trim: true },
    categories:  [{ type: String, trim: true }],
    tags:        [{ type: String, trim: true }],
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Recipe", recipeSchema);
