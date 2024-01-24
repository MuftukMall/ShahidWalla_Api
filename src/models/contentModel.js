import { Schema, model } from "mongoose";

const contentSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String },
  contentType: { type: String, required: true },
  contentUrl: { type: String, required: true },
  tag: { type: String },
  subject: { type: String },
}, { timestamps: { createdAt: true, updatedAt: false }});

const contentModel = model("Content", contentSchema);

export default contentModel;
