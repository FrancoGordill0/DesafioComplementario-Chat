import mongoose from "mongoose";

const useCollection = "messages";

const chatSchema = new mongoose.Schema({
  email: String,
  message: String,
});

export const chatModel = mongoose.model(useCollection, chatSchema);
