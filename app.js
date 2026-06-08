const slides = [
  {
    title: "Who do you call?",
    type: "Hook",
    purpose: "Open with a simple choice that makes the research instantly understandable.",
    anchor: "50 people, 3 calls.",
    keyLine: "Can AI learn who is most worth contacting?",
    beats: ["Make the audience picture their own contact list.", "Say that the technical project has a simple question.", "End with the exact 50-to-3 choice."],
    x: 188,
    y: 90,
    color: "#3157d5"
  },
  {
    title: "3 calls",
    type: "Constraint",
    purpose: "Explain that the model must prioritize because attention is limited.",
    anchor: "The model cannot contact everyone.",
    keyLine: "This project is really about decision-making under limited time.",
    beats: ["Move from people to simulated clients.", "Stress that only three can be chosen each day.", "Name the three questions: respond, trade, worth attention."],
    x: 108,
    y: 245,
    color: "#1c8b6f"
  },
  {
    title: "The real world problem",
    type: "Why it matters",
    purpose: "Broaden the idea beyond finance so the audience cares.",
    anchor: "Too many options, not enough time.",
    keyLine: "When attention is limited, how do we decide what deserves attention first?",
    beats: ["List relatable overload examples.", "Use teacher, doctor, and business parallels.", "Land on prioritization as the human problem."],
    x: 178,
    y: 410,
    color: "#d65f48"
  },
  {
    title: "Sales and trading desk",
    type: "Setting",
    purpose: "Translate the technical environment into plain language.",
    anchor: "A safe practice version of a trading desk.",
    keyLine: "Before any trade happens, there is an earlier decision: which clients should the desk contact?",
    beats: ["Define the desk simply.", "Clarify that no real client or private data is used.", "Frame the simulation as a safe test space."],
    x: 385,
    y: 520,
    color: "#6d56b2"
  },
  {
    title: "The simple rule",
    type: "Baseline",
    purpose: "Introduce the fair comparison: recent trading volume over the last 30 days.",
    anchor: "Call whoever traded most recently.",
    keyLine: "The question is not whether AI can beat a terrible strategy; it is whether AI can beat a reasonable one.",
    beats: ["Define baseline.", "Explain why recent volume seems sensible.", "Ask: can AI do better than that?"],
    x: 615,
    y: 520,
    color: "#a46f11"
  },
  {
    title: "Why that might fail",
    type: "Tension",
    purpose: "Show why looking backward may miss context that matters today.",
    anchor: "Recent activity is not the whole story.",
    keyLine: "The simple rule only looks backward.",
    beats: ["Use the texting analogy.", "Name possible missing clues.", "Set up AI as a pattern tester."],
    x: 802,
    y: 410,
    color: "#d65f48"
  },
  {
    title: "My question",
    type: "Research question",
    purpose: "State the formal and classroom versions of the research question.",
    anchor: "Better than the obvious rule, without a new problem.",
    keyLine: "Can AI pick better than the obvious rule without creating a new problem?",
    beats: ["Give the formal version slowly.", "Translate it immediately.", "Emphasize that good research starts with a fair test."],
    x: 872,
    y: 245,
    color: "#3157d5"
  },
  {
    title: "How the AI learns",
    type: "Method",
    purpose: "Make Q-learning feel like trial and error with memory.",
    anchor: "Try, see the result, learn, try again.",
    keyLine: "Q-learning is trial and error with memory.",
    beats: ["Use the video game analogy.", "Explain choice, feedback, and reward.", "Connect rewards to trades and prices."],
    x: 792,
    y: 90,
    color: "#1c8b6f"
  },
  {
    title: "What counts as winning?",
    type: "Evaluation",
    purpose: "Explain that more trades only count if slippage is not worse.",
    anchor: "More trades, no worse prices.",
    keyLine: "A good decision improves the main goal without quietly damaging something else.",
    beats: ["Define slippage with the sneaker example.", "Say winning has two conditions.", "Make the realism point."],
    x: 610,
    y: 34,
    color: "#a46f11"
  },
  {
    title: "Big idea",
    type: "Close",
    purpose: "Leave the audience with the broader human meaning of the project.",
    anchor: "Better decisions start before the action.",
    keyLine: "AI should not replace human judgment. It should help us test human judgment before real consequences happen.",
    beats: ["Return to attention decisions.", "Say AI should not replace humans.", "Close by repeating the 50-to-3 question."],
    x: 370,
    y: 34,
    color: "#6d56b2"
  }
];

let current = 0;
let timerSeconds = 0;
let timerId = null;

const slideList = document.querySelector("#slideList");
const mindmap = document.querySelector("#mindmap");
const timer = document.querySelector("#timer");

function svgEl(name, attrs = {}) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", name);
  Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

function wrapSvgText(text, maxChars) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const next = `${line} ${word}`.trim();
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  });
  lines.push(line);
  return lines.slice(0, 2);
}

function drawMindmap() {
  mindmap.innerHTML = "";
  const center = { x: 490, y: 305, w: 220, h: 96 };

  slides.forEach((slide) => {
    const line = svgEl("path", {
      class: "branch-line",
      d: `M ${center.x} ${center.y} C ${(center.x + slide.x) / 2} ${center.y}, ${(center.x + slide.x) / 2} ${slide.y}, ${slide.x} ${slide.y}`
    });
    mindmap.appendChild(line);
  });

  const centerNode = createNode({
    title: "Who Do You Call?",
    subtitle: "50 possible people, 3 calls",
    x: center.x,
    y: center.y,
    w: center.w,
    h: center.h,
    index: -1,
    className: "center-node"
  });
  mindmap.appendChild(centerNode);

  slides.forEach((slide, index) => {
    const node = createNode({
      title: slide.title,
      subtitle: slide.anchor,
      x: slide.x,
      y: slide.y,
      w: 174,
      h: 78,
      index,
      color: slide.color
    });
    mindmap.appendChild(node);
  });
}

function createNode({ title, subtitle, x, y, w, h, index, color, className = "" }) {
  const group = svgEl("g", {
    class: `node-group ${className} ${index === current ? "active" : ""}`,
    transform: `translate(${x - w / 2} ${y - h / 2})`,
    tabindex: index >= 0 ? "0" : "-1",
    role: index >= 0 ? "button" : "img",
    "aria-label": title
  });

  const rect = svgEl("rect", {
    class: "node-rect",
    width: w,
    height: h,
    rx: 8,
    style: color ? `stroke:${index === current ? "#3157d5" : color}` : ""
  });
  group.appendChild(rect);

  wrapSvgText(title, 20).forEach((line, i) => {
    const text = svgEl("text", {
      class: "node-label",
      x: 16,
      y: 25 + i * 17
    });
    text.textContent = line;
    group.appendChild(text);
  });

  const sub = svgEl("text", {
    class: "node-sub",
    x: 16,
    y: h - 17
  });
  sub.textContent = subtitle.length > 27 ? `${subtitle.slice(0, 27)}...` : subtitle;
  group.appendChild(sub);

  if (index >= 0) {
    group.addEventListener("click", () => setSlide(index));
    group.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setSlide(index);
      }
    });
  }
  return group;
}

function renderSlideList() {
  slideList.innerHTML = slides
    .map(
      (slide, index) => `
        <button class="slide-button ${index === current ? "active" : ""}" data-index="${index}">
          <span class="slide-index">${index + 1}</span>
          <span><strong>${slide.title}</strong><span>${slide.type}</span></span>
        </button>
      `
    )
    .join("");

  slideList.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => setSlide(Number(button.dataset.index)));
  });
}

function setSlide(index) {
  current = (index + slides.length) % slides.length;
  const slide = slides[current];
  document.querySelector("#slideNumber").textContent = `Slide ${current + 1}`;
  document.querySelector("#slideType").textContent = slide.type;
  document.querySelector("#slideTitle").textContent = slide.title;
  document.querySelector("#slidePurpose").textContent = slide.purpose;
  document.querySelector("#memoryAnchor").textContent = slide.anchor;
  document.querySelector("#keyLine").textContent = slide.keyLine;
  document.querySelector("#speakerBeats").innerHTML = slide.beats.map((beat) => `<li>${beat}</li>`).join("");
  renderSlideList();
  drawMindmap();
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${secs}`;
}

function updateTimer() {
  timer.textContent = formatTime(timerSeconds);
}

document.querySelector("#timerToggle").addEventListener("click", () => {
  const button = document.querySelector("#timerToggle");
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
    button.innerHTML = '<i data-lucide="play"></i>';
    button.setAttribute("aria-label", "Start timer");
  } else {
    timerId = setInterval(() => {
      timerSeconds += 1;
      updateTimer();
    }, 1000);
    button.innerHTML = '<i data-lucide="pause"></i>';
    button.setAttribute("aria-label", "Pause timer");
  }
  lucide.createIcons();
});

document.querySelector("#timerReset").addEventListener("click", () => {
  timerSeconds = 0;
  updateTimer();
});

document.querySelector("#prevSlide").addEventListener("click", () => setSlide(current - 1));
document.querySelector("#nextSlide").addEventListener("click", () => setSlide(current + 1));

document.querySelector("#focusMode").addEventListener("click", () => {
  const slide = slides[current];
  document.querySelector("#focusNumber").textContent = `Slide ${current + 1} - ${slide.type}`;
  document.querySelector("#focusTitle").textContent = slide.title;
  document.querySelector("#focusLine").textContent = slide.keyLine;
  document.querySelector("#focusOverlay").hidden = false;
});

document.querySelector("#closeFocus").addEventListener("click", () => {
  document.querySelector("#focusOverlay").hidden = true;
});

document.querySelector("#copyCue").addEventListener("click", async () => {
  const slide = slides[current];
  const text = `Slide ${current + 1}: ${slide.title}\nAnchor: ${slide.anchor}\nKey line: ${slide.keyLine}`;
  await navigator.clipboard.writeText(text);
  const button = document.querySelector("#copyCue span");
  button.textContent = "Copied";
  setTimeout(() => {
    button.textContent = "Copy cue";
  }, 1200);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") setSlide(current + 1);
  if (event.key === "ArrowLeft") setSlide(current - 1);
  if (event.key === "Escape") document.querySelector("#focusOverlay").hidden = true;
});

setSlide(0);
updateTimer();
lucide.createIcons();
