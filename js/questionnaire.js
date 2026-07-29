document.addEventListener('DOMContentLoaded', async () => {
    let questions = [];
    let currentStep = 0;
    const userAnswers = {};

    const questionCard = document.getElementById('question-card');
    const progressBar = document.getElementById('progress-bar');
    const stepIndicator = document.getElementById('step-indicator');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    // Load Questionnaire Data
    try {
        const response = await fetch('data/questionnaire.json');
        questions = await response.json();
        renderStep();
    } catch (error) {
        questionCard.innerHTML = `<p>Error loading questionnaire. Please try again later.</p>`;
    }

    function renderStep() {
        const q = questions[currentStep];
        
        // Progress Bar Calculation
        const progress = ((currentStep + 1) / questions.length) * 100;
        progressBar.style.width = `${progress}%`;
        stepIndicator.textContent = `Step ${currentStep + 1} of ${questions.length}`;

        // Options rendering
        const optionsHTML = q.options.map((opt, i) => `
            <label class="option-label">
                <input type="${q.type}" name="q${q.id}" value="${opt}" 
                ${(userAnswers[q.id] || []).includes(opt) ? 'checked' : ''}>
                <span>${opt}</span>
            </label>
        `).join('');

        questionCard.innerHTML = `
            <h2>${q.question}</h2>
            <div class="options-group">
                ${optionsHTML}
            </div>
        `;

        prevBtn.style.display = currentStep === 0 ? 'none' : 'inline-block';
        nextBtn.textContent = currentStep === questions.length - 1 ? 'See Results' : 'Next';
    }

    function saveAnswers() {
        const q = questions[currentStep];
        const checkedInputs = document.querySelectorAll(`input[name="q${q.id}"]:checked`);
        userAnswers[q.id] = Array.from(checkedInputs).map(cb => cb.value);
    }

    nextBtn.addEventListener('click', () => {
        saveAnswers();
        
        const q = questions[currentStep];
        if ((!userAnswers[q.id] || userAnswers[q.id].length === 0)) {
            alert('Please select at least one option to continue.');
            return;
        }

        if (currentStep < questions.length - 1) {
            currentStep++;
            renderStep();
        } else {
            // Save to Session Storage and redirect to results
            sessionStorage.setItem('oakridge_answers', JSON.stringify(userAnswers));
            window.location.href = 'results.html';
        }
    });

    prevBtn.addEventListener('click', () => {
        saveAnswers();
        if (currentStep > 0) {
            currentStep--;
            renderStep();
        }
    });
});
