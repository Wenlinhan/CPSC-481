export async function installLectureOverlays(page) {
  await page.evaluate(() => {
    document.getElementById("lecture-overlay-styles")?.remove();
    const style = document.createElement("style");
    style.id = "lecture-overlay-styles";
    style.textContent = `
      @keyframes lecturePulse { 0%,100% { transform:scale(1); opacity:.94 } 50% { transform:scale(1.035); opacity:1 } }
      @keyframes captionIn { from { transform:translate(-50%,12px); opacity:0 } to { transform:translate(-50%,0); opacity:1 } }
      @keyframes popupIn { from { transform:translateY(-18px) scale(.94); opacity:0 } to { transform:translateY(0) scale(1); opacity:1 } }
      @keyframes snowFall { from { transform:translate3d(0,-12vh,0) rotate(0deg) } to { transform:translate3d(var(--drift),112vh,0) rotate(540deg) } }
      #lecture-focus-ring { position:fixed; z-index:2147483638; pointer-events:none; border:4px solid #f5b237; border-radius:18px; box-shadow:0 0 0 9999px rgba(5,10,20,.38),0 8px 32px rgba(0,0,0,.42); transition:all 380ms cubic-bezier(.22,.72,.2,1); animation:lecturePulse 2.4s ease-in-out infinite; }
      #lecture-focus-label { position:absolute; left:12px; top:-42px; background:#f5b237; color:#111827; padding:7px 12px; border-radius:9px; font:700 17px/1.2 system-ui,sans-serif; white-space:nowrap; box-shadow:0 4px 14px rgba(0,0,0,.32); }
      #lecture-caption { position:fixed; left:50%; bottom:84px; transform:translateX(-50%); width:min(1540px,86vw); min-height:58px; z-index:2147483640; pointer-events:none; display:flex; align-items:center; justify-content:center; padding:13px 28px 15px; border-radius:16px; color:white; background:rgba(3,8,18,.89); border:1px solid rgba(255,255,255,.2); box-shadow:0 9px 30px rgba(0,0,0,.42); font:650 31px/1.25 system-ui,sans-serif; text-align:center; letter-spacing:.01em; animation:captionIn 220ms ease-out; }
      #lecture-caption:empty { display:none; }
      #lecture-caption-progress { position:absolute; left:18px; right:18px; bottom:5px; height:3px; border-radius:3px; overflow:hidden; background:rgba(255,255,255,.18); }
      #lecture-caption-progress i { display:block; height:100%; width:0; background:#55d6be; transition:width 120ms linear; }
      .lecture-enlarged { transform:scale(1.035)!important; transform-origin:center!important; transition:transform 380ms cubic-bezier(.22,.72,.2,1)!important; position:relative!important; z-index:2147483639!important; }
      #lecture-popup-tray { position:fixed; left:50%; top:42%; transform:translate(-50%,-50%); z-index:2147483641; display:grid; place-items:center; pointer-events:none; }
      .lecture-popup-card { width:410px; padding:16px; border-radius:28px; color:white; background:rgba(5,15,32,.96); border:4px solid rgba(85,214,190,.9); box-shadow:0 20px 56px rgba(0,0,0,.5); animation:popupIn 300ms cubic-bezier(.22,.72,.2,1); }
      .lecture-popup-card img { display:block; width:100%; height:280px; object-fit:cover; border-radius:20px; background:#0b1b34; }
      .lecture-popup-card .lecture-popup-symbol { display:grid; min-width:0; max-width:100%; min-height:220px; place-items:center; box-sizing:border-box; padding:24px; border-radius:20px; color:#f8fbff; background:linear-gradient(145deg,#17294a,#0b1b34); font:850 44px/1.08 "Segoe UI Emoji",system-ui,sans-serif; overflow-wrap:anywhere; word-break:normal; text-align:center; }
      .lecture-popup-card strong { display:block; margin-top:12px; font:800 30px/1.2 system-ui,sans-serif; text-align:center; }
      #lecture-snow { position:fixed; inset:0; z-index:2147483637; pointer-events:none; overflow:hidden; background:linear-gradient(180deg,rgba(180,220,255,.12),rgba(9,30,56,.22)); }
      #lecture-snow::after { content:'AI WINTER'; position:absolute; left:50%; top:86px; transform:translateX(-50%); padding:10px 20px; border-radius:999px; color:#eaf7ff; background:rgba(8,28,53,.78); border:1px solid rgba(220,245,255,.75); font:800 24px/1 system-ui,sans-serif; letter-spacing:.12em; }
      .lecture-snowflake { position:absolute; top:-10vh; color:white; opacity:.82; text-shadow:0 0 7px #c8eeff; animation:snowFall var(--speed) linear infinite; animation-delay:var(--delay); }
      #lecture-kinetic-layer { position:fixed; inset:0; z-index:2147483642; pointer-events:none; overflow:hidden; }
      .lecture-kinetic-object { position:absolute; left:0; top:0; width:420px; min-height:310px; display:flex; flex-direction:column; align-items:center; justify-content:center; will-change:transform,opacity,filter; filter:drop-shadow(0 18px 28px rgba(0,0,0,.4)); }
      .lecture-kinetic-object img { width:360px; height:360px; object-fit:cover; border-radius:36px; border:5px solid rgba(85,214,190,.92); box-shadow:0 16px 44px rgba(0,0,0,.44); background:#081a32; }
      .lecture-kinetic-object .kinetic-pair { display:flex; gap:24px; align-items:center; }
      .lecture-kinetic-object .kinetic-pair img { width:320px; height:320px; }
      .lecture-kinetic-object .kinetic-emoji { font:750 230px/1.05 "Segoe UI Emoji","Apple Color Emoji",sans-serif; white-space:nowrap; text-align:center; text-shadow:0 10px 28px rgba(0,0,0,.42); }
      .lecture-kinetic-object .kinetic-label { margin-top:12px; padding:10px 18px; border-radius:999px; color:white; background:rgba(5,15,32,.93); border:2px solid rgba(85,214,190,.84); font:800 26px/1.15 system-ui,sans-serif; white-space:nowrap; }
      .lecture-kinetic-object.lecture-correctness-mark { width:112px; min-height:112px; filter:drop-shadow(0 8px 16px rgba(0,0,0,.38)); }
      .lecture-kinetic-object.lecture-correctness-mark .kinetic-emoji { font-size:94px; }
      .lecture-kinetic-swap { display:grid; place-items:center; }
      .lecture-kinetic-swap > span { grid-area:1/1; }
      .lecture-iceberg-waterline { position:fixed; height:5px; border-radius:999px; z-index:2147483643; pointer-events:none; background:linear-gradient(90deg,transparent,#24b7d7,#b8f4ff,#24b7d7,transparent); box-shadow:0 0 18px rgba(36,183,215,.9); }
      .lecture-iceberg-shell { position:fixed; z-index:2147483642; pointer-events:none; background:linear-gradient(165deg,rgba(245,253,255,.88) 0 35%,rgba(103,210,237,.68) 36% 44%,rgba(15,96,157,.52) 45% 100%); clip-path:polygon(50% 0,63% 18%,72% 39%,100% 43%,92% 100%,8% 100%,0 43%,28% 39%,38% 18%); border:2px solid rgba(187,241,255,.8); filter:drop-shadow(0 16px 24px rgba(21,103,149,.42)); }
    `;
    document.head.appendChild(style);

    const caption = document.createElement("div");
    caption.id = "lecture-caption";
    caption.innerHTML = `<span></span><div id="lecture-caption-progress"><i></i></div>`;
    document.body.appendChild(caption);
    const tray = document.createElement("div");
    tray.id = "lecture-popup-tray";
    document.body.appendChild(tray);
    const kineticLayer = document.createElement("div");
    kineticLayer.id = "lecture-kinetic-layer";
    document.body.appendChild(kineticLayer);

    const state = { timers: [], animations: [], focusToken: 0 };
    const clearFocus = () => {
      state.focusToken += 1;
      document.getElementById("lecture-focus-ring")?.remove();
      document.querySelectorAll(".lecture-enlarged").forEach(element => element.classList.remove("lecture-enlarged"));
    };
    const focus = cue => {
      clearFocus();
      const target = document.querySelectorAll(cue.selector)[cue.index ?? 0];
      if (!target) return;
      const token = state.focusToken;
      const rect = target.getBoundingClientRect();
      const padding = 12;
      const top = Math.max(52, rect.top - padding);
      const ring = document.createElement("div");
      ring.id = "lecture-focus-ring";
      Object.assign(ring.style, {
        left: `${Math.max(8, rect.left - padding)}px`, top: `${top}px`,
        width: `${Math.min(innerWidth - Math.max(8, rect.left - padding) - 8, rect.width + padding * 2)}px`,
        height: `${Math.min(innerHeight - top - 92, rect.height + padding * 2)}px`,
      });
      const label = document.createElement("div");
      label.id = "lecture-focus-label";
      label.textContent = `Focus: ${cue.label}`;
      ring.appendChild(label);
      document.body.appendChild(ring);
      target.classList.add("lecture-enlarged");
      state.timers.push(setTimeout(() => { if (state.focusToken === token) clearFocus(); }, cue.durationSeconds * 1000));
    };
    const popup = cue => {
      const tray = document.getElementById("lecture-popup-tray");
      if (!tray) return;
      const card = document.createElement("div");
      card.className = "lecture-popup-card";
      const visual = cue.asset ? document.createElement("img") : document.createElement("div");
      if (cue.asset) { visual.src = cue.asset; visual.alt = ""; }
      else { visual.className = "lecture-popup-symbol"; visual.textContent = cue.emoji ?? cue.text ?? ""; }
      const label = document.createElement("strong");
      label.textContent = cue.label;
      card.append(visual, label);
      tray.replaceChildren(card);
      state.timers.push(setTimeout(() => card.remove(), cue.durationSeconds * 1000));
    };
    const snow = cue => {
      document.getElementById("lecture-snow")?.remove();
      const layer = document.createElement("div");
      layer.id = "lecture-snow";
      for (let index = 0; index < 72; index += 1) {
        const flake = document.createElement("span");
        flake.className = "lecture-snowflake";
        flake.textContent = index % 4 === 0 ? "â„" : "â€¢";
        Object.assign(flake.style, { left: `${(index * 37) % 101}%`, fontSize: `${10 + (index * 11) % 25}px` });
        flake.style.setProperty("--speed", `${4.8 + (index % 8) * .55}s`);
        flake.style.setProperty("--delay", `${-(index % 13) * .43}s`);
        flake.style.setProperty("--drift", `${-90 + (index * 29) % 180}px`);
        layer.appendChild(flake);
      }
      document.body.appendChild(layer);
      state.timers.push(setTimeout(() => layer.remove(), cue.durationSeconds * 1000));
    };
    const point = (x, y, scale = 1, rotate = 0, opacity = 1, offset) => ({
      transform: `translate3d(${x}px,${y}px,0) scale(${scale}) rotate(${rotate}deg)`, opacity, offset,
    });
    const routeFrames = (cue, width) => {
      const objectWidth = width;
      const centerX = innerWidth * .5 - objectWidth * .5;
      const centerY = innerHeight * .43 - 170;
      const target = cue.selector ? document.querySelectorAll(cue.selector)[cue.index ?? 0] : null;
      const targetRect = target?.getBoundingClientRect();
      const targetX = targetRect ? targetRect.left + targetRect.width / 2 - objectWidth / 2 : centerX;
      const targetY = targetRect ? targetRect.top + targetRect.height / 2 - 150 : centerY;
      const route = cue.route ?? "arc-center";
      if (cue.type === "mark" && targetRect) {
        const markX = Math.min(innerWidth - objectWidth - 18, targetRect.right - objectWidth * .58);
        const markY = Math.max(70, targetRect.top + targetRect.height * .5 - 56);
        return [point(markX,markY,.55,0,0,0),point(markX,markY,1.12,0,1,.12),point(markX,markY,1,0,1,.82),point(markX,markY,.72,0,0,1)];
      }
      if (route.includes("jump-to-target") || route.includes("slide-to-target")) {
        return [point(centerX,centerY+28,.72,-4,0,0),point(centerX,centerY,1,0,1,.12),point(centerX,centerY,1,0,1,.58),point(targetX,targetY,.72,0,1,.78),point(targetX,targetY,.72,0,1,.9),point(targetX,targetY,.55,0,0,1)];
      }
      return [point(centerX,centerY+28,.72,-3,0,0),point(centerX,centerY,1.04,0,1,.14),point(centerX,centerY,1,0,1,.78),point(centerX,centerY-8,.96,0,1,.88),point(centerX,centerY-18,.78,0,0,1)];
    };
    const kinetic = cue => {
      const layer = document.getElementById("lecture-kinetic-layer");
      if (!layer) return;
      if (cue.type === "effect" && cue.effect === "shake") {
        const slide = document.querySelector(".slide-content");
        if (!slide) return;
        const animation = slide.animate([
          { transform:"translate3d(0,0,0) rotate(0deg)" },
          { transform:"translate3d(-13px,4px,0) rotate(-.35deg)", offset:.12 },
          { transform:"translate3d(11px,-3px,0) rotate(.3deg)", offset:.24 },
          { transform:"translate3d(-8px,3px,0) rotate(-.22deg)", offset:.36 },
          { transform:"translate3d(7px,-2px,0) rotate(.18deg)", offset:.48 },
          { transform:"translate3d(-4px,1px,0) rotate(-.1deg)", offset:.6 },
          { transform:"translate3d(3px,-1px,0) rotate(.08deg)", offset:.72 },
          { transform:"translate3d(0,0,0) rotate(0deg)" },
        ], { duration:cue.durationSeconds*1000, easing:"ease-in-out" });
        state.animations.push(animation);
        return;
      }
      if (cue.type === "camera") {
        const slide = document.querySelector(".slide-content");
        if (!slide) return;
        const x = cue.route === "breathe-right" ? -7 : 7;
        const animation = slide.animate([
          { transform:"translate3d(0,0,0) scale(1)" },
          { transform:`translate3d(${x}px,-3px,0) scale(1.012)`, offset:.55 },
          { transform:"translate3d(0,0,0) scale(1)" },
        ], { duration:cue.durationSeconds*1000, easing:"ease-in-out" });
        state.animations.push(animation);
        return;
      }
      if (cue.type === "morph" && cue.effect === "iceberg") {
        const target = document.querySelectorAll(cue.selector)[cue.index ?? 0];
        if (!target) return;
        const rect = target.getBoundingClientRect();
        const water = document.createElement("div");
        water.className = "lecture-iceberg-waterline";
        Object.assign(water.style, { left:`${rect.left-22}px`, top:`${rect.top+rect.height*.42}px`, width:`${rect.width+44}px` });
        document.body.appendChild(water);
        const ice = document.createElement("div");
        ice.className = "lecture-iceberg-shell";
        Object.assign(ice.style, { left:`${rect.left-28}px`, top:`${rect.top-46}px`, width:`${rect.width+56}px`, height:`${rect.height+92}px` });
        document.body.appendChild(ice);
        const animation = target.animate([
          { clipPath:"inset(0 round 18px)", transform:"scale(1)", filter:"none" },
          { clipPath:"polygon(50% 0,63% 18%,72% 39%,100% 43%,92% 100%,8% 100%,0 43%,28% 39%,38% 18%)", transform:"scale(1.13)", filter:"drop-shadow(0 14px 18px rgba(21,103,149,.45)) saturate(1.15)", offset:.25 },
          { clipPath:"polygon(50% 0,63% 18%,72% 39%,100% 43%,92% 100%,8% 100%,0 43%,28% 39%,38% 18%)", transform:"scale(1.13)", filter:"drop-shadow(0 14px 18px rgba(21,103,149,.45)) saturate(1.15)", offset:.78 },
          { clipPath:"inset(0 round 18px)", transform:"scale(1)", filter:"none" },
        ], { duration:cue.durationSeconds*1000, easing:"cubic-bezier(.22,.72,.2,1)" });
        const waterAnimation = water.animate([{opacity:0,transform:"scaleX(.6)"},{opacity:1,transform:"scaleX(1)",offset:.25},{opacity:1,transform:"scaleX(1)",offset:.8},{opacity:0,transform:"scaleX(.7)"}], {duration:cue.durationSeconds*1000,easing:"ease-in-out"});
        const iceAnimation = ice.animate([{opacity:0,transform:"scale(.82) translateY(18px)"},{opacity:.5,transform:"scale(1) translateY(0)",offset:.25},{opacity:.5,transform:"scale(1) translateY(0)",offset:.8},{opacity:0,transform:"scale(.9) translateY(8px)"}], {duration:cue.durationSeconds*1000,easing:"ease-in-out"});
        state.animations.push(animation, waterAnimation, iceAnimation);
        state.timers.push(setTimeout(() => { water.remove(); ice.remove(); }, cue.durationSeconds*1000));
        return;
      }
      const object = document.createElement("div");
      object.className = "lecture-kinetic-object";
      let width = cue.type === "mark" ? 112 : 420;
      if (cue.type === "sprite-pair") {
        width = 680; object.style.width = `${width}px`;
        const pair = document.createElement("div"); pair.className = "kinetic-pair";
        for (const source of [cue.asset, cue.assetAfter]) { const image=document.createElement("img"); image.src=source; image.alt=""; pair.appendChild(image); }
        object.appendChild(pair);
      } else if (cue.asset) {
        const image = document.createElement("img"); image.src = cue.asset; image.alt = ""; object.appendChild(image);
      } else if (cue.type === "emoji-swap") {
        const swap = document.createElement("div"); swap.className = "kinetic-emoji lecture-kinetic-swap";
        const before=document.createElement("span"); before.textContent=cue.emoji;
        const after=document.createElement("span"); after.textContent=cue.emojiAfter; after.style.opacity="0";
        swap.append(before,after); object.appendChild(swap);
        const half=cue.durationSeconds*500;
        state.timers.push(setTimeout(()=>{before.animate([{opacity:1},{opacity:0}],{duration:450,fill:"forwards"});after.animate([{opacity:0},{opacity:1}],{duration:450,fill:"forwards"});},half));
      } else {
        const emoji = document.createElement("div"); emoji.className = "kinetic-emoji"; emoji.textContent = cue.emoji ?? "âœ¨"; object.appendChild(emoji);
      }
      if (cue.type === "mark") object.classList.add("lecture-correctness-mark");
      if (cue.label && cue.asset) { const label=document.createElement("div"); label.className="kinetic-label"; label.textContent=cue.label; object.appendChild(label); }
      layer.appendChild(object);
      const animation = object.animate(routeFrames(cue,width), { duration:cue.durationSeconds*1000, easing:"linear", fill:"forwards" });
      state.animations.push(animation);
      state.timers.push(setTimeout(() => object.remove(), cue.durationSeconds*1000));
    };
    const clearVisuals = () => {
      state.timers.splice(0).forEach(clearTimeout);
      state.animations.splice(0).forEach(animation => animation.cancel());
      clearFocus();
      document.getElementById("lecture-popup-tray")?.replaceChildren();
      document.getElementById("lecture-kinetic-layer")?.replaceChildren();
      document.querySelectorAll(".lecture-iceberg-waterline").forEach(element => element.remove());
      document.querySelectorAll(".lecture-iceberg-shell").forEach(element => element.remove());
      document.getElementById("lecture-snow")?.remove();
    };
    const startTimeline = cues => {
      clearVisuals();
      for (const cue of cues) {
        state.timers.push(setTimeout(() => {
          if (cue.type === "focus") focus(cue);
          else if (cue.type === "popup") popup(cue);
          else if (cue.type === "snow" || (cue.type === "effect" && cue.effect === "snow")) snow(cue);
          else kinetic(cue);
        }, cue.atSeconds * 1000));
      }
    };
    window.__lectureVisuals = { clearVisuals, focus, popup, snow, kinetic, startTimeline };
  });
}

export async function startVisualTimeline(page, cues) {
  await page.evaluate(cues => window.__lectureVisuals?.startTimeline(cues), cues);
}

export async function clearVisualTimeline(page) {
  await page.evaluate(() => window.__lectureVisuals?.clearVisuals());
}

export async function startCaption(page, text, durationSeconds, wordBoundaries = []) {
  await page.evaluate(({ text, durationSeconds, wordBoundaries }) => {
    clearInterval(window.__lectureCaptionTimer);
    const chunks = [];
    if (wordBoundaries.length) {
      for (let index = 0; index < wordBoundaries.length; index += 10) {
        chunks.push({
          text: wordBoundaries.slice(index, index + 10).map(item => item.text).join(" "),
          atSeconds: wordBoundaries[index].offsetSeconds,
        });
      }
    } else {
      const words = text.trim().split(/\s+/);
      for (let index = 0; index < words.length; index += 10) {
        chunks.push({ text: words.slice(index, index + 10).join(" "), atSeconds: index / words.length * durationSeconds });
      }
    }
    const caption = document.querySelector("#lecture-caption span");
    const progress = document.querySelector("#lecture-caption-progress i");
    if (!caption || !progress || !chunks.length) return;
    const started = performance.now();
    const durationMs = Math.max(500, durationSeconds * 1000);
    const update = () => {
      const elapsedSeconds = (performance.now() - started) / 1000;
      const fraction = Math.min(1, elapsedSeconds / durationSeconds);
      let chunkIndex = 0;
      while (chunkIndex + 1 < chunks.length && chunks[chunkIndex + 1].atSeconds <= elapsedSeconds) chunkIndex += 1;
      caption.textContent = chunks[chunkIndex].text;
      progress.style.width = `${fraction * 100}%`;
      if (fraction >= 1) clearInterval(window.__lectureCaptionTimer);
    };
    update();
    window.__lectureCaptionTimer = setInterval(update, 100);
  }, { text, durationSeconds, wordBoundaries });
}

export async function clearCaption(page) {
  await page.evaluate(() => {
    clearInterval(window.__lectureCaptionTimer);
    const caption = document.querySelector("#lecture-caption span");
    if (caption) caption.textContent = "";
  });
}
