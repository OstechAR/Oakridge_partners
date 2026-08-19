/* Loads data/products.json and turns product objects into card markup.
   Used by results.js (and available to any future page that wants
   to show a product grid, e.g. a category page under /learn).

   A product can optionally include a "features" array of short
   strings — if present, they're rendered as a bullet list on the
   card, above the button. Products without "features" render exactly
   as before. */

async function getAllProducts() {
  const products = await loadJSON("data/products.json");
  return products || [];
}

function productCardHTML(product) {
  return `
    <article class="product-card">
      <div class="product-card-top">
        <img src="${product.image || "images/products/placeholder-product.svg"}" alt="" />
        <div>
          <p class="product-card-category">${labelForCategory(product.category)}</p>
          <p class="product-card-name">${product.name}</p>
        </div>
      </div>
      <p class="product-card-tagline">${product.tagline || ""}</p>
      <p class="product-card-desc">${product.description || ""}</p>
      ${productFeaturesHTML(product.features)}
      <a class="btn btn-primary" href="${product.affiliate || "#"}" target="_blank" rel="noopener sponsored">
        ${product.cta || "Learn more"} &rarr;
      </a>
    </article>
  `;
}

function productFeaturesHTML(features) {
  if (!features || !features.length) return "";
  return `
    <ul class="product-features">
      ${features.map((f) => `<li>${f}</li>`).join("")}
    </ul>
  `;
}

function labelForCategory(category) {
  const labels = {
    "credit": "Credit",
    "credit-cards": "Credit Card",
    "insurance": "Insurance",
    "mortgages": "Mortgage",
    "loans": "Loan",
    "banking": "Banking",
    "business": "Business",
  };
  return labels[category] || capitalize(category || "");
}

function renderProductGrid(container, products) {
  if (!products.length) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>No matches yet</h3>
        <p>Try retaking the questionnaire with a couple more goals selected.</p>
      </div>`;
    return;
  }
  container.innerHTML = products.map(productCardHTML).join("");
}
