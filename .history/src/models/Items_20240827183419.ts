import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  type: { type: String, enum: ["place", "person", "service"], required: true },
  // Place-specific fields
  googlePlaceId: { type: String, sparse: true, unique: true },
  location: String,
  distance: Number,
  googleUrl: String,
  rating: Number,
  // Person-specific fields
  description: String,
  contactInfo: String,
  // Common fields
  votes: { type: Number, default: 0 },
  lastFetched: { type: Date, default: Date.now },
  addedBy: { type: String, required: true }, // userId of the user who added this item
});

export default mongoose.models.Item || mongoose.model("Item", ItemSchema);
