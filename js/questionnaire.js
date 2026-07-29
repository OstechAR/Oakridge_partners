/* Controls the multi-step questionnaire.
   Renders questions from data/questionnaire.json, validates each
   step, saves answers to localStorage, and draws the ring progress
   indicator (one ring per question, filled in as it's answered). */

(function () {
  let questions = [];
  let current = 0;
  const answers = {}; // { questionId: [selected option strings] }

  const shell = document.getElementById("qz-shell");

  init();

  async function init() {
    questions = await loadJSON("data/questionnaire.json");
    if (!questions || !questions.length) {
      shell.innerHTML = `<div class="empty-state"><h3>The questionnaire couldn't load</h3><p>Please refresh the page. If this keeps happening, the data file may be missing.</p></div>`;
      return;
    }
    renderStep();
  }

  function renderStep() {
    const q = questions[current];
    const saved = answers[q.id] || [];

    shell.innerHTML = `
      <div class="qz-progress" aria-hidden="true">${ringSVG(questions.length, current)}</div>
      <p class="qz-progress-label">Question ${current + 1} of ${questions.length}</p>

      <div class="qz-card">
        <h1 class="qz-question">${q.question}</h1>
        ${q.helper ? `<p class="qz-helper">${q.helper}</p>` : ""}

        <div class="qz-options" role="group" aria-label="${q.question}">
          ${q.options
            .map((opt, i) => {
              const inputType = q.type === "checkbox" ? "checkbox" : "radio";
              const checked = saved.includes(opt) ? "checked" : "";
              const selectedClass = saved.includes(opt) ? "selected" : "";
              return `
                <label class="qz-option ${selectedClass}" data-option="${escapeAttr(opt)}">
                  <input type="${inputType}" name="q-${q.id}" value="${escapeAttr(opt)}" ${checked} />
                  <span>${opt}</span>
                </label>`;
            })
            .join("")}
        </div>

        <p class="qz-error" id="qz-error">Please choose at least one option to continue.</p>

        <div class="qz-nav">
          <button type="button" class="btn btn-ghost" id="qz-back" ${current === 0 ? "disabled" : ""}>&larr; Back</button>
          <button type="button" class="btn btn-primary" id="qz-next">
            ${current === questions.length - 1 ? "See my results" : "Next"} &rarr;
          </button>
        </div>
      </div>
    `;

    // Wire up option clicks (whole row toggles the input)
    shell.querySelectorAll(".qz-option").forEach((label) => {
      label.addEventListener("click", (e) => {
        if (e.target.tagName !== "INPUT") {
          const input = label.querySelector("input");
          input.checked = q.type === "checkbox" ? !input.checked : true;
          input.dispatchEvent(new Event("change"));
        }
      });
      label.querySelector("input").addEventListener("change", () => {
        syncSelectedState(q);
      });
    });

    document.getElementById("qz-back").addEventListener("click", goBack);
    document.getElementById("qz-next").addEventListener("click", () => goNext(q));
  }

  function syncSelectedState(q) {
    const inputs = shell.querySelectorAll(`input[name="q-${q.id}"]`);
    const selected = [];
    inputs.forEach((input) => {
      input.closest(".qz-option").classList.toggle("selected", input.checked);
      if (input.checked) selected.push(input.value);
    });
    answers[q.id] = selected;
    document.getElementById("qz-error").classList.remove("visible");
  }

  function goBack() {
    if (current === 0) return;
    current -= 1;
    renderStep();
  }

  function goNext(q) {
    const selected = answers[q.id] || [];
    if (selected.length === 0) {
      document.getElementById("qz-error").classList.add("visible");
      return;
    }

    if (current < questions.length - 1) {
      current += 1;
      renderStep();
    } else {
      saveAnswers();
      window.location.href = "results.html";
    }
  }

  function saveAnswers() {
    try {
      localStorage.setItem("oakridge_answers", JSON.stringify(answers));
    } catch (err) {
      console.error("Oakridge: could not save answers", err);
    }
  }

  /** Draws concentric rings, one per question. Rings up to the current
      question are filled (answered); the rest are outlines only. */
  function ringSVG(total, activeIndex) {
    const size = 120;
    const center = size / 2;
    const maxR = center - 6;
    const step = maxR / total;
    let circles = "";

    for (let i = 0; i < total; i++) {
      const r = maxR - i * step;
      const answered = i < activeIndex || (i === activeIndex);
      const isCurrent = i === activeIndex;
      const stroke = answered ? "var(--oak-amber)" : "var(--oak-line)";
      const width = isCurrent ? 2.4 : 1.4;
      circles += `<circle cx="${center}" cy="${center}" r="${r}" fill="none" stroke="${stroke}" stroke-width="${width}" />`;
    }

    return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${circles}
      <circle cx="${center}" cy="${center}" r="4" fill="var(--oak-forest)" />
    </svg>`;
  }

  function escapeAttr(str) {
    return String(str).replace(/"/g, "&quot;");
  }
})();
