import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ffmpegPath from "ffmpeg-static";

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,"../..");
const master=path.join(root,"output","lecture","lesson-17","cpsc-481-lesson-17-video-lecture.mp4");
const delivery=path.join(root,"output","lecture","lesson-17","cpsc-481-lesson-17-video-lecture-canvas.mp4");
const maximumBytes=135_000_000;

function run(args){
  const result=spawnSync(ffmpegPath,args,{cwd:root,stdio:"inherit",windowsHide:true});
  if(result.status!==0)throw new Error("FFmpeg failed with exit code "+result.status);
}

let selected;
for(const crf of [28,30,32]){
  run(["-y","-i",master,"-map","0:v:0","-map","0:a:0","-c:v","libx264","-preset","slow","-crf",String(crf),"-pix_fmt","yuv420p","-c:a","aac","-b:a","80k","-movflags","+faststart",delivery]);
  const file=await stat(delivery);
  selected={crf,bytes:file.size};
  if(file.size<=maximumBytes)break;
}
if(selected.bytes>maximumBytes)throw new Error("Canvas delivery remains above the safe quota target: "+selected.bytes);
run(["-v","error","-i",delivery,"-f","null","NUL"]);
const sha256=createHash("sha256").update(await readFile(delivery)).digest("hex");
console.log(JSON.stringify({master,delivery,maximumBytes,...selected,sha256,decode:"passed"},null,2));
