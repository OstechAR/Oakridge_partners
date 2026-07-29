/* =====================================
   Oakridge Partners
   Main JavaScript
===================================== */


/* =====================================
   Mobile Navigation
===================================== */


const mobileButton = document.getElementById("mobileButton");

if (mobileButton) {

    mobileButton.addEventListener("click", () => {

        const nav = document.querySelector("nav");

        nav.style.display =
            nav.style.display === "flex"
            ? "none"
            : "flex";

    });

}



/* =====================================
   Product Database
   Add new offers here
===================================== */


const offers = [

    {
        id: 1,

        name: "Borrowell Credit Score",

        provider: "Borrowell",

        category: "credit",

        description:
        "Access your credit score and learn more about your credit profile.",

        image:
        "https://placehold.co/600x400?text=Credit+Score",

        link:
        "https://example.com"

    },


    {
        id: 2,

        name: "Compare Financial Products",

        provider: "CompareHub",

        category: "credit",

        description:
        "Explore financial products and services from multiple providers.",

        image:
        "https://placehold.co/600x400?text=Compare+Products",

        link:
        "https://example.com"

    },


    {
        id: 3,

        name: "Canadian Web Hosting",

        provider:
        "Web Hosting Canada",

        category:
        "business",

        description:
        "Website hosting solutions designed for Canadian businesses.",

        image:
        "https://placehold.co/600x400?text=Business+Hosting",

        link:
        "https://example.com"

    },


    {
        id: 4,

        name:
        "Insurance Education",

        provider:
        "Oakridge Partners",

        category:
        "insurance",

        description:
        "Learn about different types of insurance products.",

        image:
        "https://placehold.co/600x400?text=Insurance",

        link:
        "#"

    }


];



/* =====================================
   Questionnaire Database
===================================== */


const questions = [

    {

        question:
        "What are you interested in learning about?",

        options:[

            {
                text:"Building or understanding credit",
                category:"credit"
            },

            {
                text:"Insurance products",
                category:"insurance"
            },

            {
                text:"Business services",
                category:"business"
            },

            {
                text:"Banking products",
                category:"banking"
            }

        ]

    },


    {

        question:
        "Which best describes you?",

        options:[

            {
                text:"Individual",
                category:"personal"
            },

            {
                text:"Business owner",
                category:"business"
            },

            {
                text:"Student",
                category:"credit"
            },

            {
                text:"Just researching",
                category:"education"
            }

        ]

    },


    {

        question:
        "What is your main goal?",

        options:[

            {
                text:"Improve financial knowledge",
                category:"education"
            },

            {
                text:"Find useful financial tools",
                category:"credit"
            },

            {
                text:"Explore business resources",
                category:"business"
            },

            {
                text:"Understand insurance",
                category:"insurance"
            }

        ]

    }

];



/* =====================================
   Questionnaire Logic
===================================== */


let currentQuestion = 0;

function loadQuestionnaire() {

    if (!questionContainer)
        return;


    questionContainer.innerHTML = "";


    questions.forEach((question, questionIndex) => {


        const questionBlock = document.createElement("div");

        questionBlock.className = "questionBlock";


        questionBlock.innerHTML = `

            <h3>
                ${questionIndex + 1}. ${question.question}
            </h3>

            <div class="options">

                ${
                    question.options.map((option, index)=>`

                        <label class="option">

                            <input 
                            type="radio"
                            name="question-${questionIndex}"
                            value="${option.category}"
                            >

                            ${option.text}

                        </label>

                    `).join("")
                }

            </div>

        `;


        questionContainer.appendChild(questionBlock);


    });


    questionContainer.innerHTML += `

        <button 
        type="button"
        id="submitQuestionnaire"
        class="primaryButton">

        View Results

        </button>

    `;


    document
    .getElementById("submitQuestionnaire")
    .addEventListener("click",()=>{


        answers = [];


        questions.forEach((question,index)=>{


            const selected =
            document.querySelector(
                `input[name="question-${index}"]:checked`
            );


            if(selected){

                answers.push(
                    selected.value
                );

            }


        });


        showResults();


    });


}


const backButton =
document.getElementById("backButton");


const progressBar =
document.getElementById("progressBar");



function loadQuestion(){


    if(!questionContainer)
    return;


    const question =
    questions[currentQuestion];


    questionContainer.innerHTML = `


        <h3>
        ${question.question}
        </h3>


        <div class="options">

        ${
            question.options.map((option,index)=>`

                <label class="option">

                    <input 
                    type="radio"
                    name="answer"
                    value="${index}"
                    >

                    ${option.text}

                </label>

            `).join("")
        }

        </div>


    `;


    updateProgress();


}



function updateProgress(){


    const progress =
    ((currentQuestion) / questions.length) * 100;


    progressBar.style.width =
    progress + "%";


}



if(nextButton){


nextButton.addEventListener("click",()=>{


    const selected =
    document.querySelector(
        'input[name="answer"]:checked'
    );


    if(!selected){

        alert(
        "Please select an option."
        );

        return;

    }



    const answer =
    questions[currentQuestion]
    .options[selected.value];


    answers.push(answer.category);



    currentQuestion++;



    if(currentQuestion >= questions.length){

        showResults();

        return;

    }



    loadQuestion();


});


}



if(backButton){


backButton.addEventListener("click",()=>{


    if(currentQuestion > 0){

        currentQuestion--;

        answers.pop();

        loadQuestion();

    }


});


}



/* =====================================
   Results System
===================================== */


const offersGrid =
document.getElementById("offersGrid");



function showResults(){


    document
    .getElementById("offers")
    .scrollIntoView();



    const matchedOffers =
    offers.filter(product=>{


        return answers.includes(
            product.category
        );


    });



    renderOffers(
        matchedOffers.length
        ? matchedOffers
        : offers
    );


}



function renderOffers(products){


    offersGrid.innerHTML = "";



    products.forEach(product=>{


        const card =
        document.createElement("div");


        card.className =
        "offerCard";



        card.innerHTML = `


        <img 
        src="${product.image}"
        alt="${product.name}"
        >


        <div class="offerContent">


        <h3>
        ${product.name}
        </h3>


        <p>
        ${product.description}
        </p>


        <small>
        Provided by ${product.provider}
        </small>


        <br>


        <a 
        class="offerButton"
        href="${product.link}"
        target="_blank">

        Learn More

        </a>


        </div>


        `;


        offersGrid.appendChild(card);



    });


}



/* =====================================
   Start Questionnaire Button
===================================== */


const startButton =
document.getElementById("startButton");



if(startButton){


startButton.addEventListener(
"click",
()=>{


document
.getElementById("questionnaire")
.scrollIntoView();



loadQuestion();


});


}



/* =====================================
   Initial Load
===================================== */


document.addEventListener(
"DOMContentLoaded",
()=>{


renderOffers(offers);


if(questionContainer){

loadQuestion();

}


});
