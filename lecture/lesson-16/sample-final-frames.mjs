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
const audioDir=path.join(siteRoot,"output","lecture","lesson-16","audio-aria-final");
const video=path.join(siteRoot,"output","lecture","lesson-16","cpsc-481-lesson-16-video-lecture.mp4");
const output=path.join(siteRoot,"output","lecture","lesson-16","qa-frames");
await mkdir(output,{recursive:true});
function wavDuration(buffer){let offset=12,byteRate,dataSize;while(offset+8<=buffer.length){const id=buffer.toString("ascii",offset,offset+4);const size=buffer.readUInt32LE(offset+4);if(id==="fmt ")byteRate=buffer.readUInt32LE(offset+16);if(id==="data"){dataSize=size;break;}offset+=8+size+(size%2);}return dataSize/byteRate;}
const starts=new Map();let clock=.82;
for(const slide of script.slides){for(const [index,segment] of slide.segments.entries()){if(segment.action)clock+=1.445;starts.set(`${slide.number}:${index+1}`,clock);const filename=`slide-${String(slide.number).padStart(2,"0")}-segment-${String(index+1).padStart(2,"0")}.wav`;clock+=wavDuration(await readFile(path.join(audioDir,filename)))+.42+(segment.pauseAfterSeconds??0);}if(slide.number<script.slides.length)clock+=2.195;}
const samples=[
  {name:"01-root-question-popup",slide:1,segment:1,cueType:"popup"},
  {name:"03-target-predictors-popup",slide:3,segment:1,cueType:"popup"},
  {name:"06-tree-anatomy-popup",slide:6,segment:1,cueType:"popup"},
  {name:"08-counterfactual-path-popup",slide:8,segment:1,cueType:"popup"},
  {name:"09-recursion-popup",slide:9,segment:1,cueType:"popup"},
  {name:"12-mml-popup",slide:12,segment:1,cueType:"popup"},
  {name:"13-entropy-popup",slide:13,segment:1,cueType:"popup"},
  {name:"15-information-gain-popup",slide:15,segment:1,cueType:"popup"},
  {name:"16-worked-calculation-popup",slide:16,segment:1,cueType:"popup"},
  {name:"20-rule-conversion-popup",slide:20,segment:1,cueType:"popup"},
  {name:"24-metrics-popup",slide:24,segment:1,cueType:"popup"},
  {name:"25-evaluation-audit-popup",slide:25,segment:1,cueType:"popup"},
  {name:"25-exit-frame",slide:25,segment:4,offset:4},
];
for(const slide of script.slides){
  for(const [index,segment] of slide.segments.entries()){
    if(!segment.action)continue;
    const safe=segment.label.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"").slice(0,48);
    samples.push({name:`${String(slide.number).padStart(2,"0")}-${String(index+1).padStart(2,"0")}-${safe}`,slide:slide.number,segment:index+1,offset:Math.min(4,Math.max(2,wavDuration(await readFile(path.join(audioDir,`slide-${String(slide.number).padStart(2,"0")}-segment-${String(index+1).padStart(2,"0")}.wav`)))/2))});
  }
}
const report=[];
for(const sample of samples){const start=starts.get(`${sample.slide}:${sample.segment}`);const visualCues=visual.slides.find(x=>x.number===sample.slide).segments.find(x=>x.number===sample.segment).cues;const kineticCues=kinetic.slides.find(x=>x.number===sample.slide).segments.find(x=>x.number===sample.segment).cues;const candidates=sample.cueType==="kinetic"?kineticCues.filter(x=>!x.automatic):visualCues.filter(x=>x.type===sample.cueType);const cue=sample.cueType?candidates[sample.cueIndex??0]:null;if(sample.cueType&&!cue)throw new Error(`No ${sample.cueType} cue for ${sample.slide}:${sample.segment}`);const seconds=start+(cue?cue.atSeconds+Math.min(1.5,cue.durationSeconds/2):sample.offset);const target=path.join(output,sample.name+".png");const result=spawnSync(ffmpegPath,["-y","-ss",seconds.toFixed(3),"-i",video,"-frames:v","1","-q:v","2",target],{stdio:"ignore"});if(result.status!==0)throw new Error("Frame extraction failed for "+sample.name);report.push({...sample,seconds:+seconds.toFixed(3),target});}
console.log(JSON.stringify({timelineSeconds:+clock.toFixed(3),frames:report},null,2));



