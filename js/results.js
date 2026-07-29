/* Reads the questionnaire answers out of localStorage, maps them to
   product categories via data/categories.json, and renders matching
   products. This is informational matching based on stated interests,
   not personalized financial advice — see disclosure.html. */

(function () {
  const grid = document.getElementById("results-grid");
  const summary = document.getElementById("results-summary");
  const emptyLink = document.getElementById("results-empty-retake");

  init();

  async function init() {
    const raw = localStorage.getItem("oakridge_answers");

    if (!raw) {
      showNoAnswers();
      return;
    }

    let answers;
    try {
      answers = JSON.parse(raw);
    } catch {
      showNoAnswers();
      return;
    }

    const [categoryMap, allProducts] = await Promise.all([
      loadJSON("data/categories.json"),
      getAllProducts(),
    ]);

    if (!categoryMap || !allProducts.length) {
      grid.innerHTML = `<div class="empty-state"><h3>Something went wrong loading results</h3><p>Please try retaking the questionnaire.</p></div>`;
      return;
    }

    const matchedCategories = new Set();
    Object.values(answers).flat().forEach((answer) => {
      (categoryMap[answer] || []).forEach((cat) => matchedCategories.add(cat));
    });

    const matches = allProducts.filter((p) => matchedCategories.has(p.category));

    renderSummary(answers, matchedCategories.size);
    renderProductGrid(grid, matches);
  }

  function renderSummary(answers, categoryCount) {
    const goals = answers.goals || [];
    const goalText = goals.length
      ? goals.map((g) => g.toLowerCase()).join(", ")
      : "your answers";
    summary.textContent = categoryCount
      ? `Based on ${goalText}, here's what fits.`
      : `We couldn't find a strong match — here's a broader look.`;
  }

  function showNoAnswers() {
    summary.textContent = "";
    grid.innerHTML = `
      <div class="empty-state">
        <h3>No answers found</h3>
        <p>It looks like you haven't completed the questionnaire yet, or your answers expired.</p>
      </div>`;
    if (emptyLink) emptyLink.style.display = "inline-flex";
  }
})();
