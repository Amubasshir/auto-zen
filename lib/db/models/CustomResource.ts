import mongoose, { Schema, type Document } from "mongoose";

export interface ICustomResource extends Document {
  userId: mongoose.Types.ObjectId;
  weekId: string;
  title: string;
  url: string;
  type: "youtube" | "docs" | "course" | "article" | "github";
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  tasks: string[];
  completed: boolean;
  createdAt: Date;
}

const CustomResourceSchema = new Schema<ICustomResource>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    weekId: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    type: {
      type: String,
      enum: ["youtube", "docs", "course", "article", "github"],
      default: "youtube",
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    duration: { type: String, default: "" },
    tasks: { type: [String], default: [] },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

CustomResourceSchema.index({ userId: 1, weekId: 1 });

export default (mongoose.models.CustomResource as mongoose.Model<ICustomResource>) ||
  mongoose.model<ICustomResource>("CustomResource", CustomResourceSchema);
