import { mkdir, readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const here=path.dirname(fileURLToPath(import.meta.url));
const siteRoot=path.resolve(here,"../..");
const script=JSON.parse(await readFile(path.join(here,"lecture-script-aria.json"),"utf8"));
const visual=JSON.parse(await readFile(path.join(here,"visual-cue-plan.json"),"utf8"));
const kinetic=JSON.parse(await readFile(path.join(here,"kinetic-cue-plan.json"),"utf8"));
const audioDir=path.join(siteRoot,"output","lecture","lesson-13","audio-aria-final");
const video=path.join(siteRoot,"output","lecture","lesson-13","cpsc-481-lesson-13-video-lecture.mp4");
const output=path.join(siteRoot,"output","lecture","lesson-13","qa-frames");
await mkdir(output,{recursive:true});
function wavDuration(buffer){let offset=12,byteRate,dataSize;while(offset+8<=buffer.length){const id=buffer.toString("ascii",offset,offset+4);const size=buffer.readUInt32LE(offset+4);if(id==="fmt ")byteRate=buffer.readUInt32LE(offset+16);if(id==="data"){dataSize=size;break;}offset+=8+size+(size%2);}return dataSize/byteRate;}
const starts=new Map();let clock=.82;
for(const slide of script.slides){for(const [index,segment] of slide.segments.entries()){starts.set(`${slide.number}:${index+1}`,clock);const filename=`slide-${String(slide.number).padStart(2,"0")}-segment-${String(index+1).padStart(2,"0")}.wav`;clock+=wavDuration(await readFile(path.join(audioDir,filename)))+.42+(segment.pauseAfterSeconds??0);}if(slide.number<script.slides.length)clock+=2.28;}
const samples=[
  {name:"01-mdp-opening",slide:1,segment:2,cueType:"focus"},
  {name:"08-transition-example",slide:8,segment:2,cueType:"focus"},
  {name:"12-mdp-tuple",slide:12,segment:2,cueType:"focus"},
  {name:"15-discount-gamma-zero",slide:15,segment:3,cueType:"focus"},
  {name:"15-discount-gamma-nine",slide:15,segment:5,cueType:"focus"},
  {name:"17-bellman-reveal",slide:17,segment:3,cueType:"focus"},
  {name:"18-optimality-answer",slide:18,segment:4,cueType:"focus"},
  {name:"19-backup-direction",slide:19,segment:4,cueType:"focus"},
  {name:"21-grid-sweep",slide:21,segment:4,cueType:"focus"},
  {name:"21-grid-policy",slide:21,segment:6,cueType:"focus"},
  {name:"23-greedy-policy",slide:23,segment:5,cueType:"focus"},
  {name:"24-model-audit",slide:24,segment:5,cueType:"focus"},
  {name:"25-exit-frame",slide:25,segment:3,cueType:"focus"},
];
const report=[];
for(const sample of samples){const start=starts.get(`${sample.slide}:${sample.segment}`);const visualCues=visual.slides.find(x=>x.number===sample.slide).segments.find(x=>x.number===sample.segment).cues;const kineticCues=kinetic.slides.find(x=>x.number===sample.slide).segments.find(x=>x.number===sample.segment).cues;const candidates=sample.cueType==="kinetic"?kineticCues.filter(x=>!x.automatic):visualCues.filter(x=>x.type===sample.cueType);const cue=sample.cueType?candidates[sample.cueIndex??0]:null;if(sample.cueType&&!cue)throw new Error(`No ${sample.cueType} cue for ${sample.slide}:${sample.segment}`);const holdOffset=cue?Math.min(6.5,Math.max(.5,cue.durationSeconds-.25)):sample.offset;const seconds=start+(cue?cue.atSeconds+holdOffset:sample.offset);const target=path.join(output,sample.name+".png");const result=spawnSync(ffmpegPath,["-y","-ss",seconds.toFixed(3),"-i",video,"-frames:v","1","-q:v","2",target],{stdio:"ignore"});if(result.status!==0)throw new Error("Frame extraction failed for "+sample.name);report.push({...sample,seconds:+seconds.toFixed(3),target});}
console.log(JSON.stringify({timelineSeconds:+clock.toFixed(3),frames:report},null,2));
