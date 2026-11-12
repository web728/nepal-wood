import { Schema, model, models } from "mongoose";

const conclaveRegistrationSchema = new Schema(
  {
    registrationType: { type: String, enum: ["speaker", "attendee"], required: true },
    event: { type: String, default: "Nepal Wood Technical Conclave 2027", required: true },
    sourcePage: { type: String, default: "conference", required: true },
    status: { type: String, enum: ["pending_review", "approved", "declined"], default: "pending_review" },
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    topic: { type: String, default: "" },
    professionalBio: { type: String, default: "" },
    abstract: { type: String, default: "" },
    profileUrl: { type: String, default: "" },
    industry: { type: String, default: "" },
    sessionInterest: { type: String, default: "" },
    question: { type: String, default: "" },
    consentAccepted: { type: Boolean, required: true },
    consentAt: { type: Date, required: true },
  },
  { timestamps: true }
);

conclaveRegistrationSchema.index({ email: 1, registrationType: 1, createdAt: -1 });

const ConclaveRegistration =
  models.ConclaveRegistration || model("ConclaveRegistration", conclaveRegistrationSchema);

export default ConclaveRegistration;
