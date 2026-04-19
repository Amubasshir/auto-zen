import mongoose, { Schema, type Document } from "mongoose";

export interface IRoadmapProgress extends Document {
  userId: mongoose.Types.ObjectId;
  // itemId -> true
  completedItems: Record<string, boolean>;
  // itemId -> { taskId -> true }
  completedTasks: Record<string, Record<string, boolean>>;
  lastActiveItem?: string;
  updatedAt: Date;
}

const RoadmapProgressSchema = new Schema<IRoadmapProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    completedItems: { type: Schema.Types.Mixed, default: {} },
    completedTasks: { type: Schema.Types.Mixed, default: {} },
    lastActiveItem: String,
  },
  { timestamps: true },
);

RoadmapProgressSchema.index({ userId: 1 });

export default (mongoose.models.RoadmapProgress as mongoose.Model<IRoadmapProgress>) ||
  mongoose.model<IRoadmapProgress>("RoadmapProgress", RoadmapProgressSchema);
