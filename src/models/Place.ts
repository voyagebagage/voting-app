import mongoose from "mongoose";

const PlaceSchema = new mongoose.Schema({
  googlePlaceId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  distance: { type: Number, required: true },
  googleUrl: { type: String, required: true },
  rating: { type: Number },
  lastFetched: { type: Date, default: Date.now },
});

export default mongoose.models.Place || mongoose.model("Place", PlaceSchema);
