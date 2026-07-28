import type { Metadata } from "next";
import { CourseHub } from "./components/CourseHub";

export const metadata: Metadata = {
  title: "CPSC 481 · Introduction to Artificial Intelligence",
  description: "A unified 15-module, 30-meeting interactive course in artificial intelligence.",
  openGraph: {
    title: "CPSC 481 · Introduction to Artificial Intelligence",
    description: "College-level AI lessons with explanations, demos, worked examples, practice, and assessment.",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "CPSC 481 course site" }],
  },
};

export default function Home() {
  return <CourseHub />;
}
