import mongoose, { Document, Schema } from "mongoose";

export interface ITask {
  title: string;
  completed: boolean;
  user: string;
}

export interface ITaskModel extends ITask, Document {}

const TaskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, required: true },
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<ITaskModel>("Task", TaskSchema);
