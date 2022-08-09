// Select Element
let mySubjects = Array.from(document.querySelectorAll(".category .subject"));
let countSpan = document.querySelector(".quiz-app .count span");
let bullets = document.querySelector(".bullets");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answers-area");
let submit = document.querySelector(".quiz-app .submit-button");
let resultContainer = document.querySelector(".results");
let countdownElement = document.querySelector(".countdown");
// let 
// Set Options
let currentIndex = 0;
let countRightAnswer = 0;
let countDownInterval;
let numberOfQuestion = 10;
let choosenSubject;
// choose Subject
mySubjects.forEach(function(ele){
ele.onclick = function () {
    choosenSubject = ele.getAttribute("jsonFile");
    getQuestions();
    document.querySelector(".category").style.display = "none";
}
});
function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.open("GET", "/JS/html_questions.json", true);
    myRequest.send();
    myRequest.onreadystatechange = function () {
        if(this.readyState === 4 && this.status === 200) {
            let questionsObject = JSON.parse(this.responseText)
            let indexOfCurrentQuestion = getRandomNumber(0, 14);
            // Set Questions Count + Add Bullets
            createBullets(numberOfQuestion);
            // Add Questions Data
            addQuestionData(questionsObject[indexOfCurrentQuestion], questionsObject.length);
            // Count  Down
            countdown(10, numberOfQuestion);
            // Click On Submit
            submit.onclick = () => {
                // Get Right Answer
                let rightAnswer = questionsObject[indexOfCurrentQuestion]['right_answer'];
                currentIndex++;
                indexOfCurrentQuestion = getRandomNumber(0, questionsObject.length - 1);
                console.log(questionsObject.length);
                // Check The Answer
                checkAnswer(rightAnswer, questionsObject.length);
                // Remove Previous Question
                quizArea.innerHTML = "";
                answerArea.innerHTML = "";
                // Add Questions Data
                addQuestionData(questionsObject[indexOfCurrentQuestion], questionsObject.length - 1);
                // Handle Bullets Class
                handleBullets();
                // Start Countdown
                clearInterval(countDownInterval);
                countdown(10, numberOfQuestion);
                // Show Result
                showResult(numberOfQuestion);
            };
        }
    };
};
function createBullets (num) {
    countSpan.innerHTML = num;
    // Create Spans
    for(let i = 0; i < num; i++) {
        let theBullet = document.createElement("span");
        if(i === 0)
            theBullet.className = "on";
        bulletsSpanContainer.appendChild(theBullet);
    }
};
function addQuestionData(obj, count) {
    if(currentIndex < count){
        // Create h2 (Questions Title)
        let title = document.createElement("h2");
        title.innerText = obj.title;
        quizArea.appendChild(title);
        // Add Answers
        for(let i = 1; i <= 4; i++) {
            let answerContainer = document.createElement("div");
            answerContainer.className = "answer";
            let radio = document.createElement("input");
            radio.type = "radio";
            radio.id = `answer_${i}`;
            radio.name = "questions";
            // Add Data Attribute to Compare it With Right Answer
            radio.dataset.answer = obj[`answer_${i}`];        
            if(i === 1)
            radio.checked = true;
            let label = document.createElement("label");
            label.htmlFor = `answer_${i}`;
            label.innerText = obj[`answer_${i}`];
            answerContainer.appendChild(radio);
            answerContainer.appendChild(label);
            answerArea.appendChild(answerContainer);
        }
    }
};
function checkAnswer(rightAnswer, questionCount) {
    let answers = document.getElementsByName("questions");
    let theChoosenAns;
    for(let i = 0; i < answers.length; i++) {
        if(answers[i].checked) {
            theChoosenAns = answers[i].dataset.answer;
        }// end condition
    }//end loop
    if(theChoosenAns === rightAnswer)
    countRightAnswer++;
};
function handleBullets() {
    ////// -->
    let bulletsSpan = document.querySelectorAll(".bullets span");
    let arrayOfSpans = Array.from(bulletsSpan);
    arrayOfSpans.forEach((span, index) => {
        if (index === currentIndex)
        span.className = "on";
    });
};
function showResult (qcount) {
    // The Questions Done Then Show The Result
    let result;
    if(currentIndex === qcount) {
        quizArea.remove();
        answerArea.remove();
        submit.remove();
        bullets.remove();
        // Show Result
        if (countRightAnswer > (qcount / 2) && countRightAnswer < qcount) 
            result = `<span class="good">Good</span>, ${countRightAnswer} From ${qcount} Is Good`;
        else if (countRightAnswer === qcount)
            result = `<span class="perfect">perfect</span>, All Answers Is Good`;
        else 
        result = `<span class="bad">Bad</span>, ${countRightAnswer} From ${qcount}`;
        resultContainer.innerHTML = result;
        resultContainer.style.padding = "10px";
        resultContainer.style.backgroundColor = "white";
        resultContainer.style.marginTop = "10px";
    }
};
function countdown(duration, qcount) {
    if(currentIndex < qcount) {
        let minutes, seconds;
        countDownInterval = setInterval(function () {
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            countdownElement.innerHTML = `${minutes}:${seconds}`;
            if(--duration < 0){
                clearInterval(countDownInterval);
                submit.click();
            }
        }, 1000);
    }
};
function getRandomNumber(min, max) {
    let step1 = max - min + 1;
    let step2 = Math.random() * step1;
    let result = Math.floor(step2) + min;
    return result;
}

//Done
