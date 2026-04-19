import mongoose, { Schema, type Document } from "mongoose";

export interface IProjectPortfolio extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  status: "planned" | "in-progress" | "completed";
  githubUrl?: string;
  demoUrl?: string;
  loomUrl?: string;
  caseStudy?: string;
  completedAt?: Date;
  createdAt: Date;
}

const ProjectPortfolioSchema = new Schema<IProjectPortfolio>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["planned", "in-progress", "completed"],
      default: "planned",
    },
    githubUrl: String,
    demoUrl: String,
    loomUrl: String,
    caseStudy: String,
    completedAt: Date,
  },
  { timestamps: true },
);

ProjectPortfolioSchema.index({ userId: 1, status: 1 });

export default (mongoose.models.ProjectPortfolio as mongoose.Model<IProjectPortfolio>) ||
  mongoose.model<IProjectPortfolio>("ProjectPortfolio", ProjectPortfolioSchema);
