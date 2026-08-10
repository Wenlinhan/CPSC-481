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
const audioDir=path.join(siteRoot,"output","lecture","lesson-14-rl","audio-aria-final");
const video=path.join(siteRoot,"output","lecture","lesson-14-rl","cpsc-481-lesson-14-video-lecture.mp4");
const output=path.join(siteRoot,"output","lecture","lesson-14-rl","qa-frames");
await mkdir(output,{recursive:true});
function wavDuration(buffer){let offset=12,byteRate,dataSize;while(offset+8<=buffer.length){const id=buffer.toString("ascii",offset,offset+4);const size=buffer.readUInt32LE(offset+4);if(id==="fmt ")byteRate=buffer.readUInt32LE(offset+16);if(id==="data"){dataSize=size;break;}offset+=8+size+(size%2);}return dataSize/byteRate;}
const starts=new Map();let clock=.82;
for(const slide of script.slides){for(const [index,segment] of slide.segments.entries()){starts.set(`${slide.number}:${index+1}`,clock);const filename=`slide-${String(slide.number).padStart(2,"0")}-segment-${String(index+1).padStart(2,"0")}.wav`;clock+=wavDuration(await readFile(path.join(audioDir,filename)))+.42+(segment.pauseAfterSeconds??0);}if(slide.number<script.slides.length)clock+=2.28;}
const samples=[
  {name:"01-rl-opening",slide:1,segment:2,cueType:"focus"},
  {name:"06-source-figure-enlarged",slide:6,segment:3,cueType:"focus"},
  {name:"10-action-arrow",slide:10,segment:4,cueType:"focus"},
  {name:"10-reward-arrow",slide:10,segment:5,cueType:"focus"},
  {name:"10-loop-step-five",slide:10,segment:12,cueType:"focus"},
  {name:"13-return-gamma-nine",slide:13,segment:5,cueType:"focus"},
  {name:"15-bandit-arm-a",slide:15,segment:4,cueType:"focus"},
  {name:"15-bandit-arm-c",slide:15,segment:6,cueType:"focus"},
  {name:"16-epsilon-point-one",slide:16,segment:4,cueType:"focus"},
  {name:"18-q-update-next",slide:18,segment:4,cueType:"focus"},
  {name:"19-propagation-step-four",slide:19,segment:6,cueType:"focus"},
  {name:"21-sarsa",slide:21,segment:4,cueType:"focus"},
  {name:"23-reveal-solution",slide:23,segment:7,cueType:"focus"},
  {name:"24-correct-distinction",slide:24,segment:4,cueType:"focus"},
  {name:"25-exit-frame",slide:25,segment:3,cueType:"focus"},
];
const report=[];
for(const sample of samples){
  const start=starts.get(`${sample.slide}:${sample.segment}`);
  const scriptSegment=script.slides.find(x=>x.number===sample.slide).segments[sample.segment-1];
  const visualCues=visual.slides.find(x=>x.number===sample.slide).segments.find(x=>x.number===sample.segment).cues;
  const kineticCues=kinetic.slides.find(x=>x.number===sample.slide).segments.find(x=>x.number===sample.segment).cues;
  const candidates=sample.cueType==="kinetic"?kineticCues.filter(x=>!x.automatic):visualCues.filter(x=>x.type===sample.cueType);
  const cue=sample.cueType?candidates[sample.cueIndex??0]:null;
  if(sample.cueType&&!cue)throw new Error(`No ${sample.cueType} cue for ${sample.slide}:${sample.segment}`);
  let holdOffset=cue?cue.atSeconds+Math.min(6.5,Math.max(.5,cue.durationSeconds-.25)):sample.offset;
  if(scriptSegment.action){
    const stem=`slide-${String(sample.slide).padStart(2,"0")}-segment-${String(sample.segment).padStart(2,"0")}`;
    const boundaries=JSON.parse(await readFile(path.join(audioDir,stem+".words.json"),"utf8"));
    const nowIndex=boundaries.findIndex((boundary,index)=>boundary.text.toLowerCase()==="now"&&boundaries[index+1]?.text.toLowerCase().startsWith("activate"));
    if(nowIndex>=0)holdOffset=Math.max(holdOffset,boundaries[nowIndex].offsetSeconds+1.45);
  }
  const segmentDuration=wavDuration(await readFile(path.join(audioDir,`slide-${String(sample.slide).padStart(2,"0")}-segment-${String(sample.segment).padStart(2,"0")}.wav`)));
  const seconds=start+Math.min(holdOffset,segmentDuration-.25);
  const target=path.join(output,sample.name+".png");
  const result=spawnSync(ffmpegPath,["-y","-ss",seconds.toFixed(3),"-i",video,"-frames:v","1","-q:v","2",target],{stdio:"ignore"});
  if(result.status!==0)throw new Error("Frame extraction failed for "+sample.name);
  report.push({...sample,seconds:+seconds.toFixed(3),target});
}
console.log(JSON.stringify({timelineSeconds:+clock.toFixed(3),frames:report},null,2));
