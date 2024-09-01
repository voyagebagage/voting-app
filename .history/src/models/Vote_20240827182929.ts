import mongoose from "mongoose";

const VoteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Place",
    required: true,
  },
  category: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

VoteSchema.index({ userId: 1, category: 1, createdAt: 1 });

export default mongoose.models.Vote || mongoose.model("Vote", VoteSchema);
