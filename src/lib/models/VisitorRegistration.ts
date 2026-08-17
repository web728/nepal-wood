import { Schema, model, models, type InferSchemaType } from "mongoose";

const VisitorRegistrationSchema = new Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  company: { type: String, required: true },
  websiteUrl: { type: String },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  areasOfInterest: { type: [String], default: [] },
  privacyAccepted: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
  sourcePage: { type: String, default: "visitor-registration" },
});

export type VisitorRegistration = InferSchemaType<typeof VisitorRegistrationSchema>;

export default models.VisitorRegistration ||
  model("VisitorRegistration", VisitorRegistrationSchema);
