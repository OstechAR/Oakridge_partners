document.addEventListener('DOMContentLoaded', async () => {
    const resultsGrid = document.getElementById('results-grid');
    const noResults = document.getElementById('no-results');

    const storedAnswers = sessionStorage.getItem('oakridge_answers');
    
    if (!storedAnswers) {
        window.location.href = 'questionnaire.html';
        return;
    }

    const answers = JSON.parse(storedAnswers);

    try {
        const [productsResp, categoriesResp] = await Promise.all([
            fetch('data/products.json'),
            fetch('data/categories.json')
        ]);

        const products = await productsResp.json();
        const categoryMap = await categoriesResp.json();

        // Collect all selected options across questions
        const selectedOptions = Object.values(answers).flat();

        // Determine target product categories based on mapping
        const matchedCategorySet = new Set();
        selectedOptions.forEach(option => {
            if (categoryMap[option]) {
                categoryMap[option].forEach(cat => matchedCategorySet.add(cat));
            }
        });

        // Filter products matching category set
        const matchedProducts = products.filter(prod => matchedCategorySet.has(prod.category));

        if (matchedProducts.length === 0) {
            noResults.style.display = 'block';
            return;
        }

        // Render product cards
        resultsGrid.innerHTML = matchedProducts.map(prod => `
            <div class="product-card">
                <div>
                    <img src="${prod.image}" alt="${prod.name}" onerror="handleImageError(this)">
                    <h3>${prod.name}</h3>
                    <p>${prod.description}</p>
                </div>
                <a href="${prod.affiliate}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">
                    Learn More
                </a>
            </div>
        `).join('');

    } catch (error) {
        resultsGrid.innerHTML = `<p>Failed to load options. Please try again.</p>`;
    }
});
