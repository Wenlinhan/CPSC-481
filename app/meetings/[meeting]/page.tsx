import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AiFoundationsDeck as Meeting01Deck } from "../../components/Meeting01Deck";
import { AiFoundationsDeck as Meeting02Deck } from "../../components/Meeting02Deck";
import { StateSpaceFoundationsDeck as Meeting03Deck } from "../../components/Meeting03Deck";
import { UninformedSearchDeck as Meeting04Deck } from "../../components/Meeting04Deck";
import { Meeting05Deck } from "../../components/Meeting05Deck";
import { Meeting06Deck } from "../../components/Meeting06Deck";
import { Meeting07Deck } from "../../components/Meeting07Deck";
import { Meeting08Deck } from "../../components/Meeting08Deck";
import { Meeting09Deck } from "../../components/Meeting09Deck";
import { Meeting10Deck } from "../../components/Meeting10Deck";
import { Meeting11Deck } from "../../components/Meeting11Deck";
import { Meeting12Deck } from "../../components/Meeting12Deck";
import { Meeting13Deck } from "../../components/Meeting13Deck";
import { Meeting14Deck } from "../../components/Meeting14Deck";
import { Meeting15Deck } from "../../components/Meeting15Deck";
import { Meeting16Deck } from "../../components/Meeting16Deck";
import { Meeting17Deck } from "../../components/Meeting17Deck";
import { Meeting18Deck } from "../../components/Meeting18Deck";
import { Meeting19Deck } from "../../components/Meeting19Deck";
import { Meeting20Deck } from "../../components/Meeting20Deck";
import { RagDeck as Meeting21Deck } from "../../components/Meeting21Deck";
import { RagQualityDeck as Meeting22Deck } from "../../components/Meeting22Deck";
import { Meeting23Deck } from "../../components/Meeting23Deck";
import { Meeting24Deck } from "../../components/Meeting24Deck";
import { Meeting25Deck } from "../../components/Meeting25Deck";
import { Meeting26Deck } from "../../components/Meeting26Deck";
import { Meeting27Deck } from "../../components/Meeting27Deck";
import { Meeting28Deck } from "../../components/Meeting28Deck";
import { Meeting29Deck } from "../../components/Meeting29Deck";
import { Meeting30Deck } from "../../components/Meeting30Deck";
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
    : meeting.id === 3 ? <Meeting03Deck />
    : meeting.id === 4 ? <Meeting04Deck />
    : meeting.id === 5 ? <Meeting05Deck />
    : meeting.id === 6 ? <Meeting06Deck />
    : meeting.id === 7 ? <Meeting07Deck />
    : meeting.id === 8 ? <Meeting08Deck />
    : meeting.id === 9 ? <Meeting09Deck />
    : meeting.id === 10 ? <Meeting10Deck />
    : meeting.id === 11 ? <Meeting11Deck />
    : meeting.id === 12 ? <Meeting12Deck />
    : meeting.id === 13 ? <Meeting13Deck />
    : meeting.id === 14 ? <Meeting14Deck />
    : meeting.id === 15 ? <Meeting15Deck />
    : meeting.id === 16 ? <Meeting16Deck />
    : meeting.id === 17 ? <Meeting17Deck />
    : meeting.id === 18 ? <Meeting18Deck />
    : meeting.id === 19 ? <Meeting19Deck />
    : meeting.id === 20 ? <Meeting20Deck />
    : meeting.id === 21 ? <Meeting21Deck />
    : meeting.id === 22 ? <Meeting22Deck />
    : meeting.id === 23 ? <Meeting23Deck />
    : meeting.id === 24 ? <Meeting24Deck />
    : meeting.id === 25 ? <Meeting25Deck />
    : meeting.id === 26 ? <Meeting26Deck />
    : meeting.id === 27 ? <Meeting27Deck />
    : meeting.id === 28 ? <Meeting28Deck />
    : meeting.id === 29 ? <Meeting29Deck />
    : meeting.id === 30 ? <Meeting30Deck />
    : null;
  if (customDeck) return <div className="custom-lesson-route"><Link className="course-home-link" href="/">All modules</Link>{customDeck}</div>;
  return <PlannedLessonDeck meeting={meeting} />;
}
