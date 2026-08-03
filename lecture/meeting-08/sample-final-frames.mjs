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
const audioDir=path.join(siteRoot,"output","lecture","meeting-08","audio-aria-final");
const video=path.join(siteRoot,"output","lecture","meeting-08","cpsc-481-lesson-08-video-lecture.mp4");
const output=path.join(siteRoot,"output","lecture","meeting-08","qa-frames");
await mkdir(output,{recursive:true});
function wavDuration(buffer){let offset=12,byteRate,dataSize;while(offset+8<=buffer.length){const id=buffer.toString("ascii",offset,offset+4);const size=buffer.readUInt32LE(offset+4);if(id==="fmt ")byteRate=buffer.readUInt32LE(offset+16);if(id==="data"){dataSize=size;break;}offset+=8+size+(size%2);}return dataSize/byteRate;}
const starts=new Map();let clock=.82;
for(const slide of script.slides){for(const [index,segment] of slide.segments.entries()){if(segment.action)clock+=1.445;starts.set(`${slide.number}:${index+1}`,clock);const filename=`slide-${String(slide.number).padStart(2,"0")}-segment-${String(index+1).padStart(2,"0")}.wav`;clock+=wavDuration(await readFile(path.join(audioDir,filename)))+.42+(segment.pauseAfterSeconds??0);}if(slide.number<script.slides.length)clock+=2.195;}
const samples=[
  {name:"01-pruning-shears",slide:1,segment:2,cueType:"kinetic"},
  {name:"04-depth-first-return",slide:4,segment:8,offset:4},
  {name:"06-max-pseudocode-enlarged",slide:6,segment:5,offset:4},
  {name:"07-beta-cutoff",slide:7,segment:6,offset:4},
  {name:"09-alpha-cutoff",slide:9,segment:6,offset:4},
  {name:"14-middle-branch-enlarged",slide:14,segment:5,offset:4},
  {name:"18-correct-no-cutoff",slide:18,segment:6,offset:4},
  {name:"19-correct-beta-cutoff",slide:19,segment:5,offset:4},
  {name:"20-d-alpha-cutoff",slide:20,segment:9,offset:4},
  {name:"23-practice-tree-enlarged",slide:23,segment:5,offset:4},
  {name:"24-root-five-reveal",slide:24,segment:9,offset:4},
  {name:"25-cutoff-takeaway",slide:25,segment:2,cueType:"popup"},
];
const report=[];
for(const sample of samples){const start=starts.get(`${sample.slide}:${sample.segment}`);const visualCues=visual.slides.find(x=>x.number===sample.slide).segments.find(x=>x.number===sample.segment).cues;const kineticCues=kinetic.slides.find(x=>x.number===sample.slide).segments.find(x=>x.number===sample.segment).cues;const candidates=sample.cueType==="kinetic"?kineticCues.filter(x=>!x.automatic):visualCues.filter(x=>x.type===sample.cueType);const cue=sample.cueType?candidates[sample.cueIndex??0]:null;if(sample.cueType&&!cue)throw new Error(`No ${sample.cueType} cue for ${sample.slide}:${sample.segment}`);const seconds=start+(cue?cue.atSeconds+Math.min(1.5,cue.durationSeconds/2):sample.offset);const target=path.join(output,sample.name+".png");const result=spawnSync(ffmpegPath,["-y","-ss",seconds.toFixed(3),"-i",video,"-frames:v","1","-q:v","2",target],{stdio:"ignore"});if(result.status!==0)throw new Error("Frame extraction failed for "+sample.name);report.push({...sample,seconds:+seconds.toFixed(3),target});}
console.log(JSON.stringify({timelineSeconds:+clock.toFixed(3),frames:report},null,2));
