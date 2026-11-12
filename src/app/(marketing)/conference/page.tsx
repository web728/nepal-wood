import type { Metadata } from "next";
import ConferencePage from "@/components/conference/conference-page";

export const metadata: Metadata = {
  title: "Technical Conclave 2027 | Nepal Wood International Expo",
  description:
    "Technical Conclave at Nepal Wood International Expo 2027. Explore five industry seminars and apply as a speaker or register your interest as an attendee.",
};

export default function ConferenceRoute() {
  return <ConferencePage />;
}
