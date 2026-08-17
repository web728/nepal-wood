import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IBrochure extends Document {
  name: string;
  email: string;
  phone: string;
  company: string;
  designation?: string;
  country: string;
  createdAt: Date;
}

const BrochureSchema = new Schema<IBrochure>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    designation: { type: String, default: "" },
    country: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default models.Brochure || model<IBrochure>("Brochure", BrochureSchema);