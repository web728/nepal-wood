import { Schema, model, models, type InferSchemaType } from "mongoose";

const ExhibitorRegistrationSchema = new Schema({
  fullName: { type: String, required: true },
  designation: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  companyName: { type: String, required: true },
  websiteUrl: { type: String },
  country: { type: String, required: true },
  city: { type: String, required: true },
  message: { type: String },
  interestedInSponsorship: { type: Boolean, default: false },
  marketingOptIn: { type: Boolean, default: false },
  privacyAccepted: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
  sourcePage: { type: String, default: "exhibitor-registration" },
});

export type ExhibitorRegistration = InferSchemaType<typeof ExhibitorRegistrationSchema>;

export default models.ExhibitorRegistration ||
  model("ExhibitorRegistration", ExhibitorRegistrationSchema);
