from __future__ import annotations

import json
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "art-source"
OUTPUT_DIR = ROOT / "public" / "concepts"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

ATLASES = {
    "a": [
        ("compare", "Two approaches balanced for comparison"),
        ("model", "An intelligent agent with sensors, internal model, goal, and action"),
        ("classify", "Mixed objects sorted into distinct groups"),
        ("explain", "A technical AI diagram translated into a simple explanation"),
        ("predict", "Observed data continuing into a forecast"),
        ("generate", "A model producing text, image, sound, and code"),
        ("retrieve", "Relevant evidence found in a document collection"),
        ("act", "An agent choosing an action that changes its environment"),
        ("world", "A complex changing real-world environment"),
        ("data", "Incomplete, uneven, and changing data"),
        ("goals", "Conflicting goals pulling a decision in different directions"),
        ("people", "People adapting around an AI system"),
        ("evidence-source", "A claim connected to measurements and a checked source"),
        ("consequences", "A decision producing different impacts"),
        ("adapt", "A system changing strategy after feedback"),
        ("perception", "Sensors converting sights and sounds into signals"),
    ],
    "b": [
        ("representation", "A real scene encoded into a structured representation"),
        ("reasoning", "Premises connected through logic to a conclusion"),
        ("learning", "An agent improving from examples and feedback"),
        ("communication", "People and an AI exchanging meaningful messages"),
        ("creation", "An empty workspace becoming a new artifact"),
        ("planning", "An ordered route through future checkpoints"),
        ("reflection", "An agent inspecting and correcting its own output"),
        ("thinking-humanly", "A human cognitive process modeled by a computer"),
        ("thinking-rationally", "Formal logic forming a valid conclusion"),
        ("acting-humanly", "Human and machine behavior compared behind a screen"),
        ("acting-rationally", "An agent selecting the best expected outcome"),
        ("perceive", "Sensors gathering evidence from a scene"),
        ("consider", "Possible actions branching into simulated futures"),
        ("evaluate", "Outcomes measured against a performance scale"),
        ("action", "A selected action changing the world"),
        ("performance", "Safety, accuracy, time, and inclusion balanced together"),
    ],
    "c": [
        ("environment", "An AI agent situated among people, objects, weather, and rules"),
        ("actuators", "Wheels, arm, speaker, and signal light carrying out commands"),
        ("sensors", "Camera, microphone, lidar, and touch sensors collecting signals"),
        ("simple-reflex", "One stimulus triggering one direct response"),
        ("model-based", "A partially hidden world reconstructed as an internal map"),
        ("goal-based", "An agent simulating paths toward a target"),
        ("utility-based", "Goal-reaching outcomes compared across tradeoffs"),
        ("learning-agent", "Feedback improving an agent's future behavior"),
        ("sense", "Vision, sound, and range signals entering a system"),
        ("represent-learn", "Observations becoming an updating knowledge network"),
        ("decide", "Several options scored and one selected"),
        ("act-interact", "An agent changing the world with human coordination"),
        ("single-task", "A narrow machine optimized for one target"),
        ("conditions", "The same AI system operating in different conditions"),
        ("cost-risk", "Money, time, safety, and harm balanced in a decision"),
        ("human-oversight", "A person approving, correcting, or stopping AI action"),
    ],
    "d": [
        ("claim", "A strong assertion emerging from an AI tutor"),
        ("evidence-comparison", "Two study results compared and checked"),
        ("boundary", "An AI system inside a defined operating boundary"),
        ("risk", "Privacy, incorrect feedback, dependence, and access risks"),
        ("decision", "Evidence flowing into use, monitor, restrict, redesign, or reject"),
        ("audience-age-five", "A student explaining image classification with toys"),
        ("audience-family", "A student explaining recommendations with familiar choices"),
        ("audience-community", "A student explaining evidence and oversight to community leaders"),
        ("foundations", "Agents, search, and representation supporting later AI systems"),
        ("machine-learning", "Examples training a model and evaluated predictions"),
        ("generative-ai", "A multimodal model producing language, image, sound, and code"),
        ("ai-systems", "A model connected to retrieval, tools, interface, policy, and people"),
        ("evidence-communication", "A paper becoming an evidence card and public explanation"),
        ("define", "A fuzzy idea becoming a precise bounded definition"),
        ("bound", "A capability map with a working region and failure edge"),
        ("explain-public", "A mechanism translated into analogy, example, and limitation"),
    ],
    "e": [
        ("calculator", "A calculator executing fixed arithmetic rules"),
        ("spam-filter", "Email sorted into legitimate and unwanted messages"),
        ("chatbot", "A conversational AI responding through speech bubbles"),
        ("thermostat", "A controller sensing temperature and switching heating"),
        ("turing-judge", "A 1950s evaluator comparing hidden conversational participants"),
        ("machine-participant", "A computer terminal responding behind a screen"),
        ("human-participant", "A person typing responses behind a separate screen"),
        ("agent-loop", "Perception, decision, and action forming a closed loop"),
        ("history-turing", "Turing's 1950 paper, early computer, and imitation game"),
        ("history-dartmouth", "The 1956 Dartmouth summer research workshop"),
        ("history-mycin", "An early medical expert system applying rules"),
        ("history-deep-blue", "A chess champion facing a powerful computer"),
        ("history-alexnet", "Image examples training a deep visual network"),
        ("history-alphago", "Learned Go patterns combined with search"),
        ("history-chatgpt", "A conversational generative AI interface"),
        ("history-ai-systems", "A multimodal model connected to tools, robots, and people"),
    ],
    "f": [
        ("task-environment", "An agent acting in an external world that defines its task"),
        ("not-task-environment", "Internal code and hardware that belong to the agent rather than its environment"),
        ("relevant-environment", "External conditions that can affect a delivery robot's success"),
        ("irrelevant-environment", "External details that do not affect the task being analyzed"),
        ("fully-observable", "A board state whose relevant information is visible to the agent"),
        ("partially-observable", "A driving scene with hidden and occluded information"),
        ("deterministic", "One action leading predictably to one next state"),
        ("stochastic", "One action branching into uncertain possible outcomes"),
        ("episodic", "Independent cases that can be handled one at a time"),
        ("sequential", "A decision whose result changes later decisions"),
        ("static", "A task world that waits while the agent deliberates"),
        ("dynamic", "A task world that changes while the agent deliberates"),
        ("discrete", "A task represented by distinct states and actions"),
        ("continuous", "A task represented by smoothly changing position, time, and speed"),
        ("known", "An agent operating with known action and outcome rules"),
        ("unknown", "An agent learning unfamiliar action and outcome rules"),
    ],
    "g": [
        ("single-agent", "One agent solving a task without strategic opponents"),
        ("multi-agent", "Several agents cooperating or competing in one environment"),
        ("soccer-environment", "A soccer player acting in a dynamic multi-agent task environment"),
        ("taxi-environment", "An autonomous taxi operating amid traffic, people, signals, and weather"),
        ("vacuum-environment", "A robot vacuum sensing and acting in a household"),
        ("chess-environment", "Two strategic agents acting on a visible board"),
        ("spam-task", "A classifier handling one email as a task instance"),
        ("medical-task", "A diagnostic system reasoning from incomplete clinical evidence"),
        ("quiz-correct", "A learner receiving confirmation after a correct classification"),
        ("quiz-incorrect", "A learner revising a classification after feedback"),
        ("guided-practice", "Students collaborating to classify an AI task environment"),
        ("exit-ticket", "A concise written assessment submitted at the end of class"),
        ("agent-function", "A mapping from percept history to an action"),
        ("agent-program", "A program implementing an agent function"),
        ("agent-architecture", "Sensors, processor, and actuators running an agent program"),
        ("peas-task", "Performance, environment, actuators, and sensors framing an agent task"),
    ],
}


def crop_atlas(atlas_key: str, entries: list[tuple[str, str]]) -> list[dict[str, str]]:
    image = Image.open(SOURCE_DIR / f"ai-concept-atlas-{atlas_key}.png").convert("RGB")
    width, height = image.size
    records: list[dict[str, str]] = []
    for index, (slug, meaning) in enumerate(entries):
        row, column = divmod(index, 4)
        left = round(column * width / 4) + 5
        top = round(row * height / 4) + 5
        right = round((column + 1) * width / 4) - 5
        bottom = round((row + 1) * height / 4) - 5
        tile = image.crop((left, top, right, bottom))
        tile = ImageOps.fit(tile, (420, 420), Image.Resampling.LANCZOS)
        output = OUTPUT_DIR / f"{slug}.webp"
        tile.save(output, "WEBP", quality=88, method=6)
        records.append({
            "key": slug,
            "path": f"/concepts/{slug}.webp",
            "meaning": meaning,
            "source_atlas": atlas_key,
            "source_tile": f"r{row + 1}c{column + 1}",
        })
    return records


manifest: list[dict[str, str]] = []
for key, items in ATLASES.items():
    manifest.extend(crop_atlas(key, items))

(OUTPUT_DIR / "visual-usage-manifest.json").write_text(
    json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
    encoding="utf-8",
)
print(f"Created {len(manifest)} concept visuals in {OUTPUT_DIR}")
