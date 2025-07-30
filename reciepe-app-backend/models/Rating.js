import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    user:   { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: true },
    value:  { type: Number, min: 1, max: 5, required: true },
  },
  {
    timestamps: true,
  }
);

ratingSchema.index({ user: 1, recipe: 1 }, { unique: true });

export default mongoose.model("Rating", ratingSchema);
