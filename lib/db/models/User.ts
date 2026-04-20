import mongoose, { Schema, type Document } from "mongoose";

export interface IUser extends Document {
  name?: string;
  image?: string;
  email: string;
  passwordHash?: string;
  githubId?: string;
  pathType: "no-code" | "developer";
  weeklyHours: number;
  weeklyTarget: number;
  startDate?: string;
  onboardingDone: boolean;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, trim: true },
    image: String,
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: String,
    githubId: String,
    pathType: { type: String, enum: ["no-code", "developer"], default: "developer" },
    weeklyHours: { type: Number, default: 10, min: 1 },
    weeklyTarget: { type: Number, default: 5, min: 1 },
    startDate: String,
    onboardingDone: { type: Boolean, default: false },
  },
  { timestamps: true },
);

UserSchema.index({ email: 1 });
UserSchema.index({ githubId: 1 }, { sparse: true });

export default (mongoose.models.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", UserSchema);
