/* eslint-disable */
import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  status: String,
  connectedUsers: [String],
});

export default mongoose.models.Room || mongoose.model("Room", RoomSchema);