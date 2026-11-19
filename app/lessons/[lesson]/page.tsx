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
import { Meeting19Deck } from "../../components/Meeting19Deck";
import { Meeting20Deck } from "../../components/Meeting20Deck";
import { RagDeck as Meeting21Deck } from "../../components/Meeting21Deck";
import { RagQualityDeck as Meeting22Deck } from "../../components/Meeting22Deck";
import { Lesson10Deck } from "../../components/Lesson10GPSlides";
import { Lesson09Deck } from "../../components/Lesson09GASlides";
import { Module12Lesson17Deck, Module12Lesson18Deck } from "../../components/Module12LearningDecks";

const lessonTitles: Record<number, string> = {
  1:"AI Applications, History, Intelligence, and Definitions", 2:"Agents, Task Environments, Agent Types, and the Turing Test",
  3:"Problem Formulation and Breadth-First Search", 4:"Depth-First, Uniform-Cost, and Search Evaluation",
  5:"Heuristic Functions, Hill Climbing, and Simulated Annealing", 6:"Best-First Search, A*, and Heuristic Quality",
  7:"Game Trees, Minimax, and Evaluation Functions", 8:"Alpha-Beta Pruning and Modern Game Search",
  9:"Evolutionary Computation and Genetic Algorithms", 10:"Genetic Programming, Artificial Life, and Swarm Intelligence",
  11:"Probability Foundations and Bayesian Inference", 12:"Conditional Independence, Bayesian Networks, and Naive Bayes",
  13:"Markov Decision Processes, Policies, and Value Iteration", 14:"Reinforcement Learning, Q-Learning, and Exploration",
  15:"Machine Learning Foundations and Concept Learning", 16:"Decision Trees, ID3, and Evaluation",
  17:"Machine Learning Categories, Genetic Learning, and Perceptrons", 18:"Neural Networks, Clustering, and Online Learning",
  19:"Transformers and Attention", 20:"Large Language Models",
  21:"RAG Foundations", 22:"RAG Quality, Evaluation, and Responsible Use",
};

export const dynamicParams = false;
export function generateStaticParams(){return Object.keys(lessonTitles).map(lesson=>({lesson:lesson.padStart(2,"0")}))}
export async function generateMetadata({params}:{params:Promise<{lesson:string}>}):Promise<Metadata>{const id=Number((await params).lesson);return lessonTitles[id]?{title:`Lesson ${id}: ${lessonTitles[id]}`}:{}}

export default async function LessonPage({params}:{params:Promise<{lesson:string}>}){
  const id=Number((await params).lesson); if(!lessonTitles[id]) notFound();
  const forcePrintAll=false;
  const deck=id===1?<Meeting01Deck forcePrintAll={forcePrintAll}/>:id===2?<Meeting02Deck forcePrintAll={forcePrintAll}/>:id===3?<Meeting03Deck forcePrintAll={forcePrintAll}/>:id===4?<Meeting04Deck forcePrintAll={forcePrintAll}/>:id===5?<Meeting05Deck forcePrintAll={forcePrintAll}/>:id===6?<Meeting06Deck forcePrintAll={forcePrintAll}/>:id===7?<Meeting07Deck forcePrintAll={forcePrintAll}/>:id===8?<Meeting08Deck forcePrintAll={forcePrintAll}/>:id===9?<Lesson09Deck forcePrintAll={forcePrintAll}/>:id===10?<Lesson10Deck forcePrintAll={forcePrintAll}/>:id===11?<Meeting09Deck forcePrintAll={forcePrintAll}/>:id===12?<Meeting10Deck forcePrintAll={forcePrintAll}/>:id===13?<Meeting11Deck forcePrintAll={forcePrintAll}/>:id===14?<Meeting12Deck forcePrintAll={forcePrintAll}/>:id===15?<Meeting13Deck/>:id===16?<Meeting14Deck/>:id===17?<Module12Lesson17Deck/>:id===18?<Module12Lesson18Deck/>:id===19?<Meeting19Deck/>:id===20?<Meeting20Deck/>:id===21?<Meeting21Deck/>:<Meeting22Deck/>;
  return <div className="custom-lesson-route"><Link className="course-home-link" href="/">All modules</Link>{deck}</div>;
}
