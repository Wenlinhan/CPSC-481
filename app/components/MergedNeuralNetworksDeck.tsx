"use client";

import { useState } from "react";
import { Meeting17Deck } from "./Meeting17Deck";
import { Meeting18Deck } from "./Meeting18Deck";

export function MergedNeuralNetworksDeck() {
  const [part, setPart] = useState<1 | 2>(1);
  return <div className="merged-lesson-deck"><nav className="merged-lesson-tabs" aria-label="Lesson 18 parts"><button className={part === 1 ? "active" : ""} onClick={() => setPart(1)}>Part A · Neural-network foundations</button><button className={part === 2 ? "active" : ""} onClick={() => setPart(2)}>Part B · Training and evaluation</button></nav>{part === 1 ? <Meeting17Deck /> : <Meeting18Deck />}</div>;
}
