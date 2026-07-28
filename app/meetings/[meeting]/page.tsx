import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AiFoundationsDeck as Meeting01Deck } from "../../components/Meeting01Deck";
import { AiFoundationsDeck as Meeting02Deck } from "../../components/Meeting02Deck";
import { RagDeck as Meeting21Deck } from "../../components/Meeting21Deck";
import { RagQualityDeck as Meeting22Deck } from "../../components/Meeting22Deck";
import { PlannedLessonDeck } from "../../components/PlannedLessonDeck";
import { getMeeting, meetings } from "../../data/course";

export const dynamicParams = false;

export function generateStaticParams() {
  return meetings.map((meeting) => ({ meeting: String(meeting.id).padStart(2, "0") }));
}

export async function generateMetadata({ params }: { params: Promise<{ meeting: string }> }): Promise<Metadata> {
  const { meeting: rawMeeting } = await params;
  const meeting = getMeeting(Number(rawMeeting));
  if (!meeting) return {};
  return {
    title: `Meeting ${meeting.id}: ${meeting.title}`,
    description: meeting.question,
  };
}

export default async function MeetingPage({ params }: { params: Promise<{ meeting: string }> }) {
  const { meeting: rawMeeting } = await params;
  const meeting = getMeeting(Number(rawMeeting));
  if (!meeting) notFound();
  const customDeck = meeting.id === 1 ? <Meeting01Deck />
    : meeting.id === 2 ? <Meeting02Deck />
    : meeting.id === 21 ? <Meeting21Deck />
    : meeting.id === 22 ? <Meeting22Deck />
    : null;
  if (customDeck) return <div className="custom-lesson-route"><Link className="course-home-link" href="/">All modules</Link>{customDeck}</div>;
  return <PlannedLessonDeck meeting={meeting} />;
}
