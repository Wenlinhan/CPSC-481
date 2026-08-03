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
import { Meeting13Deck } from "../../components/Meeting13Deck";
import { Meeting14Deck } from "../../components/Meeting14Deck";
import { Meeting15Deck } from "../../components/Meeting15Deck";
import { Meeting19Deck } from "../../components/Meeting19Deck";
import { Meeting20Deck } from "../../components/Meeting20Deck";
import { RagDeck as Meeting21Deck } from "../../components/Meeting21Deck";
import { RagQualityDeck as Meeting22Deck } from "../../components/Meeting22Deck";
import { Meeting25Deck } from "../../components/Meeting25Deck";
import { Meeting26Deck } from "../../components/Meeting26Deck";
import { Lesson10Deck } from "../../components/Lesson10GPSlides";
import { Lesson09Deck } from "../../components/Lesson09GASlides";
import { MergedNeuralNetworksDeck } from "../../components/MergedNeuralNetworksDeck";

const lessonTitles: Record<number, string> = {
  1:"AI Applications, History, Intelligence, and Definitions", 2:"Agents, Task Environments, Agent Types, and the Turing Test",
  3:"Problem Formulation and Breadth-First Search", 4:"Depth-First, Uniform-Cost, and Search Evaluation",
  5:"Heuristic Functions, Hill Climbing, and Simulated Annealing", 6:"Best-First Search, A*, and Heuristic Quality",
  7:"Game Trees, Minimax, and Evaluation Functions", 8:"Alpha-Beta Pruning and Modern Game Search",
  9:"Evolutionary Computation and Genetic Algorithms", 10:"Genetic Programming, Artificial Life, and Swarm Intelligence",
  11:"AAB Evidence Practicum: Finding and Reviewing Research", 12:"AI Literacy: Explaining AI to Nontechnical Audiences Age Five and Older",
  13:"Probability Foundations and Bayesian Inference", 14:"Conditional Independence, Bayesian Networks, and Naive Bayes",
  15:"Machine Learning Foundations and Concept Learning", 16:"Decision Trees, ID3, and Evaluation",
  17:"Applied Machine Learning", 18:"Neural Networks: Foundations, Training, and Evaluation",
  19:"Transformers and Attention", 20:"Large Language Models",
  21:"RAG Foundations", 22:"RAG Quality, Evaluation, and Responsible Use",
};

export const dynamicParams = false;
export function generateStaticParams(){return Object.keys(lessonTitles).map(lesson=>({lesson:lesson.padStart(2,"0")}))}
export async function generateMetadata({params}:{params:Promise<{lesson:string}>}):Promise<Metadata>{const id=Number((await params).lesson);return lessonTitles[id]?{title:`Lesson ${id}: ${lessonTitles[id]}`}:{}}

export default async function LessonPage({params}:{params:Promise<{lesson:string}>}){
  const id=Number((await params).lesson); if(!lessonTitles[id]) notFound();
  const deck=id===1?<Meeting01Deck/>:id===2?<Meeting02Deck/>:id===3?<Meeting03Deck/>:id===4?<Meeting04Deck/>:id===5?<Meeting05Deck/>:id===6?<Meeting06Deck/>:id===7?<Meeting07Deck/>:id===8?<Meeting08Deck/>:id===9?<Lesson09Deck/>:id===10?<Lesson10Deck/>:id===11?<Meeting25Deck/>:id===12?<Meeting26Deck/>:id===13?<Meeting09Deck/>:id===14?<Meeting10Deck/>:id===15?<Meeting13Deck/>:id===16?<Meeting14Deck/>:id===17?<Meeting15Deck/>:id===18?<MergedNeuralNetworksDeck/>:id===19?<Meeting19Deck/>:id===20?<Meeting20Deck/>:id===21?<Meeting21Deck/>:<Meeting22Deck/>;
  return <div className="custom-lesson-route"><Link className="course-home-link" href="/">All modules</Link>{deck}</div>;
}
