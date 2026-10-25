import fs from "node:fs";
import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";

const traverse = traverseModule.default;
const decks = [
  [1, "app/components/Meeting01Deck.tsx"],
  [2, "app/components/Meeting02Deck.tsx"],
  [3, "app/components/Meeting03Deck.tsx"],
  [4, "app/components/Meeting04Deck.tsx"],
  [5, "app/components/Meeting05Deck.tsx"],
  [6, "app/components/Meeting06Deck.tsx"],
  [7, "app/components/Meeting07Deck.tsx"],
  [8, "app/components/Meeting08Deck.tsx"],
  [9, "app/data/lesson09InstructorSpeech.ts"],
  [10, "app/data/lesson10InstructorSpeech.ts"],
  [11, "app/components/Meeting09Deck.tsx"],
  [12, "app/components/Meeting10Deck.tsx"],
];

function textOf(node) {
  if (!node) return null;
  if (node.type === "StringLiteral") return node.value;
  if (node.type === "TemplateLiteral" && node.expressions.length === 0) return node.quasis.map(q => q.value.cooked ?? q.value.raw).join("");
  return null;
}

function words(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

for (const [lesson, file] of decks) {
  const source = fs.readFileSync(file, "utf8");
  const ast = parse(source, { sourceType: "module", plugins: ["typescript", "jsx"] });
  const notes = [];
  if (lesson === 9 || lesson === 10) {
    traverse(ast, {
      VariableDeclarator(path) {
        const expected = lesson === 9 ? "lesson09InstructorSpeech" : "lesson10InstructorSpeech";
        if (path.node.id.type !== "Identifier" || path.node.id.name !== expected) return;
        const init = path.node.init?.type === "TSAsExpression" ? path.node.init.expression : path.node.init;
        if (init?.type !== "ArrayExpression") return;
        for (const element of init.elements) {
          const text = textOf(element);
          if (text) notes.push({ title: `Page ${notes.length + 1}`, text });
        }
      },
    });
  } else {
    const additions = [];
    traverse(ast, {
      ObjectExpression(path) {
        let note = null;
        let title = null;
        for (const prop of path.node.properties) {
          if (prop.type !== "ObjectProperty") continue;
          const key = prop.key.type === "Identifier" ? prop.key.name : prop.key.type === "StringLiteral" ? prop.key.value : "";
          if (key === "note") note = textOf(prop.value);
          if (key === "title") title = textOf(prop.value);
        }
        if (note) notes.push({ title: title ?? `Page ${notes.length + 1}`, text: note });
      },
      VariableDeclarator(path) {
        const expected = lesson === 1 ? "lesson01InstructorSpeech" : lesson === 2 ? "lesson02InstructorSpeech" : "";
        if (!expected || path.node.id.type !== "Identifier" || path.node.id.name !== expected || path.node.init?.type !== "ArrayExpression") return;
        for (const element of path.node.init.elements) {
          const text = textOf(element);
          if (text) additions.push(text);
        }
      },
    });
    if (additions.length) notes.forEach((note, index) => { note.text = `${note.text} ${additions[index] ?? ""}`; });
  }
  const counts = notes.map(n => words(n.text));
  const sorted = [...counts].sort((a, b) => a - b);
  const median = sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;
  const short = notes.map((n, i) => ({ page: i + 1, title: n.title, words: words(n.text), text: n.text })).filter(n => n.words < 180);
  const cue = notes.map((n, i) => ({ page: i + 1, title: n.title, text: n.text })).filter(n => /\b(?:instructor note|speaker note|tell students|ask students|pause here|teaching cue|facilitator)\b/i.test(n.text));
  console.log(JSON.stringify({ lesson, file, count: notes.length, min: Math.min(...counts), median, max: Math.max(...counts), short: short.map(({page,title,words,text}) => ({page,title,words,preview:text.slice(0,160)})), cue: cue.map(({page,title,text}) => ({page,title,preview:text.slice(0,160)})) }));
}
