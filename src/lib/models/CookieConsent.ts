import { Schema, model, models, type InferSchemaType } from "mongoose";

const CookieConsentEventSchema = new Schema({
  consentGiven: { type: Boolean, required: true },
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export type CookieConsentEvent = InferSchemaType<typeof CookieConsentEventSchema>;

export default models.CookieConsentEvent ||
  model("CookieConsentEvent", CookieConsentEventSchema);
