import { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import Task from "../models/Task";

const createTask = (req: Request, res: Response, next: NextFunction) => {
  const { title, user, completed } = req.body;

  const task = new Task({
    _id: new mongoose.Types.ObjectId(),
    title,
    user,
    completed,
  });

  return task
    .save()
    .then((task) => res.status(201).json({ task }))
    .catch((error) => res.status(500).json({ error }));
};

const getTask = (req: Request, res: Response, next: NextFunction) => {
  const taskId = req.params.taskId;

  return Task.findById(taskId)
    .populate("user")
    .select("-password") // not include password
    .then((task) => (task ? res.status(200).json({ task }) : res.status(404).json({ message: "not found" })))
    .catch((error) => res.status(500).json({ error }));
};

const getTasks = (req: Request, res: Response, next: NextFunction) => {
  return Task.find()
    .then((tasks) => res.status(200).json({ tasks }))
    .catch((error) => res.status(500).json({ error }));
};

const updateTask = (req: Request, res: Response, next: NextFunction) => {
  const taskId = req.params.taskId;

  return Task.findById(taskId)
    .then((task) => {
      if (task) {
        task.set(req.body);

        return task
          .save()
          .then((task) => res.status(201).json({ task }))
          .catch((error) => res.status(500).json({ error }));
      } else {
        return res.status(404).json({ message: "not found" });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

const deleteTask = (req: Request, res: Response, next: NextFunction) => {
  const taskId = req.params.taskId;

  return Task.findByIdAndDelete(taskId)
    .then((task) => (task ? res.status(201).json({ task, message: "task deleted" }) : res.status(404).json({ message: "not found" })))
    .catch((error) => res.status(500).json({ error }));
};

export default { createTask, getTask, getTasks, updateTask, deleteTask };
