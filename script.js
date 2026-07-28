/* =========================================
   Oakridge Partners MVP JavaScript
========================================= */


/* =========================================
   QUESTIONNAIRE SYSTEM
========================================= */


document.addEventListener("DOMContentLoaded", function(){


const questions = document.querySelectorAll(".question");

const nextButton = document.getElementById("next");

const backButton = document.getElementById("back");

const progress = document.getElementById("progress");


let currentQuestion = 0;


let answers = {};



/*
Only run questionnaire code
when questionnaire elements exist
*/

if(
    questions.length > 0 &&
    nextButton &&
    backButton
){


function updateQuestion(){


questions.forEach((question,index)=>{

question.classList.toggle(
"active",
index === currentQuestion
);

});



if(progress){

progress.style.width =
((currentQuestion + 1) / questions.length) * 100 + "%";

}



backButton.style.display =
currentQuestion === 0
? "none"
: "block";



nextButton.innerText =
currentQuestion === questions.length - 1
? "See Results"
: "Continue";


}




function saveAnswer(){


const current =
questions[currentQuestion];


const selected =
current.querySelector("input:checked");



if(!selected){

alert(
"Please select an option before continuing."
);

return false;

}



answers[selected.name] =
selected.value;


return true;


}





nextButton.addEventListener(
"click",
function(){


if(!saveAnswer()) return;



if(
currentQuestion <
questions.length - 1
){


currentQuestion++;

updateQuestion();


}

else{


localStorage.setItem(
"oakridgeAnswers",
JSON.stringify(answers)
);



window.location.href =
"results.html";


}


});







backButton.addEventListener(
"click",
function(){


if(currentQuestion > 0){

currentQuestion--;

updateQuestion();

}


});



updateQuestion();


}



});





/* =========================================
   RESULTS PAGE SYSTEM
========================================= */



document.addEventListener("DOMContentLoaded",function(){


const resourcesContainer =
document.getElementById("resources");



const topicElement =
document.getElementById("topic");



const goalElement =
document.getElementById("goal");



if(
!resourcesContainer ||
!topicElement
){

return;

}




const answers =
JSON.parse(
localStorage.getItem("oakridgeAnswers")
);



if(!answers){


topicElement.innerHTML =
`
<a href="questionnaire.html">
Complete the questionnaire first
</a>
`;

return;


}





const profiles = {


credit:{

title:
"Credit Education",

description:
"You are interested in understanding credit, credit scores, and financial history.",

resources:[

[
"Understanding Credit Scores",
"Learn how credit scores generally work and what information may influence them."
],

[
"Building Credit Knowledge",
"Explore common concepts related to establishing and managing credit history."
],

[
"Monitoring Credit Information",
"Learn about tools that help people stay aware of their credit information."
]

]

},



loans:{

title:
"Loan Education",

description:
"You are interested in understanding borrowing and loan concepts.",

resources:[

[
"How Loans Work",
"Understand interest rates, repayment schedules, and common loan structures."
],

[
"Comparing Borrowing Options",
"Learn what factors people commonly review before borrowing."
],

[
"Understanding Loan Costs",
"Explore how rates, terms, and fees can affect borrowing."
]

]

},




banking:{

title:
"Banking Education",

description:
"You are interested in understanding bank accounts and financial services.",

resources:[

[
"Choosing Banking Products",
"Learn about account features, fees, and common banking considerations."
],

[
"Savings Basics",
"Understand how savings products generally operate."
],

[
"Digital Banking",
"Explore online banking tools and modern financial services."
]

]

},




insurance:{

title:
"Insurance Education",

description:
"You are interested in understanding insurance categories.",

resources:[

[
"Insurance Basics",
"Learn how insurance products are generally designed."
],

[
"Understanding Coverage",
"Explore premiums, policies, and coverage concepts."
],

[
"Insurance Questions",
"Learn what people commonly consider when reviewing insurance."
]

]

}


};





const profile =
profiles[answers.topic]
||
profiles.credit;




topicElement.innerText =
profile.title;



if(goalElement){

goalElement.innerText =
profile.description;

}




profile.resources.forEach(function(item){


const resource =
document.createElement("div");


resource.className =
"resource";



resource.innerHTML =
`

<h3>${item[0]}</h3>

<p>${item[1]}</p>

`;



resourcesContainer.appendChild(resource);



});



});





/* =========================================
   FUTURE AFFILIATE TRACKING PLACEHOLDER
========================================= */


/*

Future use:

- Track questionnaire completion
- Track category interest
- Track partner clicks
- Track conversions

Example:

trackEvent(
"credit_resource_clicked"
)

*/


function trackEvent(eventName){


console.log(
"Event tracked:",
eventName
);


}
