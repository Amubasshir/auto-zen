import mongoose, { Schema, type Document } from "mongoose";

export interface IStreak extends Document {
  userId: mongoose.Types.ObjectId;
  count: number;
  lastDate: string; // ISO date string "YYYY-MM-DD"
  activeDays: string[]; // last 28 active "YYYY-MM-DD" strings
}

const StreakSchema = new Schema<IStreak>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    count: { type: Number, default: 0 },
    lastDate: { type: String, default: "" },
    activeDays: { type: [String], default: [] },
  },
  { timestamps: true },
);

StreakSchema.index({ userId: 1 });

export default (mongoose.models.Streak as mongoose.Model<IStreak>) ||
  mongoose.model<IStreak>("Streak", StreakSchema);
