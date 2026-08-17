import { Schema, model, models, type InferSchemaType } from "mongoose";

const ContactSubmissionSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  interest: {
    type: String,
    required: true,
    enum: ["Exhibiting", "Visitor Registration", "Sponsorship", "Media", "General Enquiry"],
  },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  sourcePage: { type: String, default: "contact" },
});

export type ContactSubmission = InferSchemaType<typeof ContactSubmissionSchema>;

export default models.ContactSubmission ||
  model("ContactSubmission", ContactSubmissionSchema);
