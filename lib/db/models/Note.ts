import mongoose, { Schema, type Document } from "mongoose";

export interface INote extends Document {
  userId: mongoose.Types.ObjectId;
  weekId: string;
  content: string;
  updatedAt: Date;
}

const NoteSchema = new Schema<INote>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    weekId: { type: String, required: true },
    content: { type: String, default: "" },
  },
  { timestamps: true },
);

// One note per user per week
NoteSchema.index({ userId: 1, weekId: 1 }, { unique: true });

export default (mongoose.models.Note as mongoose.Model<INote>) ||
  mongoose.model<INote>("Note", NoteSchema);
