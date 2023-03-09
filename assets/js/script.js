var allquestions = [
    {
        question: 'What is i++?',
        answers: ['Super I!', 'i = i + 1', 'i = 1 + 1', 'i = i + i'],
        correct: 'i = i + 1',
    },
    {
        question: "How do you print '42' to the console in JS?",
        answers: ["console.log('%d',42)", "console.log('42')", "print('42')", "window.document(42)"],
        correct: "console.log('42')",
    },
    {
        question: 'How do we create an object in JavaScript?',
        answers: ['var object = {}', 'var object = []', 'object name = {}', 'var object = 4'],
        correct: 'var object = {}',
    },
    {
      question: 'Which of the following is not a predefined JS function',
      answers: ['for()', 'if()', 'while()', 'main()'],
      correct: 'main()',
    },
    {
        question: 'How do you comment out a line of code in JS',
        answers: ['//', '#', '<!----!>', '--'],
        correct: '//',
      },
  ];

var timeEl = document.querySelector('.time');
var penaltyEl = document.querySelector('.penalty');
var answersEl = document.querySelector('.answers');

var startButton = document.getElementById('start-button');
var titleEl = document.getElementById('title');
var savescoreEl = document.getElementById('score-save');
var questionsEl = document.getElementById('questions');
var initialsEl = document.getElementById('initials');
var finalscoreEl = document.getElementById('final-score');
var submitButton = document.getElementById('submit');
var scorelistEl = document.getElementById('score-results');
var clearButton = document.getElementById('clear');

var highscores = JSON.parse(window.localStorage.getItem('highscores')) || [];
var time = allquestions.length * 20;
var timer;
var score;
var pentalty = 20;
var questionIndex;

savescoreEl.removeAttribute('id');
questionsEl.removeAttribute('id');
penaltyEl.textContent = pentalty;
timeEl.textContent = time;

// start game func - when start is pressed begins timer and start Qs, begin hiding toggle
function startGame() {
    questionIndex = 0;
    score = 0;
    time = allquestions.length * 20;
    timeEl.textContent = time;
    timer = setInterval(startTimer, 1000);
    titleEl.removeAttribute('id');
    titleEl.setAttribute('class','hide');
    questionsEl.removeAttribute('class');
    questionsEl.setAttribute('id', 'questions');
    
    startQuestion();
}

// timer
function startTimer() {
    time--;
    timeEl.textContent = time;

    if (time === 0) {
        endGame();
    }
}


// insert questions and answers

function startQuestion() {

    var questionTitle = document.getElementById('title-q');
    questionTitle.textContent = allquestions[questionIndex].question;

    answersEl.innerHTML = '';
    for (var i = 0; i < allquestions[questionIndex].answers.length; i++) {
        var answerLi = document.createElement('button');
        var answervalue = allquestions[questionIndex].answers[i];
        answerLi.textContent = i + 1 + '. ' + allquestions[questionIndex].answers[i];
        answerLi.setAttribute('class', 'answerlist');
        answerLi.setAttribute('value', answervalue);
        answersEl.appendChild(answerLi);
    }
}

// answer func checks if is correct or is wrong + rewards & penalties
function checkAnswer(event) {
    var clicked = event.target;

    if (!clicked.matches('.answerlist')) {
        return;
    }

    if (clicked.value !== allquestions[questionIndex].correct) {
        time -= pentalty;
        console.log('wrong answer');
        clicked.setAttribute('class','wrong');
        if (time < 0) {
            time = 0;
        }

        timeEl.textContent = time;
        console.log(clicked.value);
        score -= 42;

    } else {

        console.log('right answer');
        clicked.setAttribute('class','right');
        console.log(clicked.value);
        score += 69;
    }
    questionIndex++;

    setTimeout(function () {
        if (time <= 0 || questionIndex === allquestions.length) {
            if ( questionIndex === allquestions.length){
                score += 666;
            }
            endGame();
        } else {
            startQuestion();
        }
    }, 500);
}

// game ends - save initials

function endGame() {
    clearInterval(timer);
    questionsEl.setAttribute('class','hide');
    questionsEl.removeAttribute('id');
    savescoreEl.setAttribute('id','score-save');
    savescoreEl.removeAttribute('class');

    finalscoreEl.textContent = score;
    time = allquestions.length * 20;
    timeEl.textContent = time;

    submitButton.addEventListener('click', saveScore);
}

// save scores locally func

function saveScore() {

    var initials = initialsEl.value.trim();

    var finalscore = {
        score: score,
        initials: initials,
    };

    highscores = JSON.parse(window.localStorage.getItem('highscores')) || [];
    highscores.push(finalscore);
    highscores.sort(function(a, b){return b.score - a.score});
    window.localStorage.setItem('highscores', JSON.stringify(highscores));

    savescoreEl.setAttribute('class','hide');
    savescoreEl.removeAttribute('id');
    titleEl.removeAttribute('class');
    titleEl.setAttribute('id','title');
    
    window.location.reload();
}

function printScore() {
    if (highscores.length > 0) {
        for (var i = 0; i < highscores.length; i++) {
            var scoreItem = document.createElement('li');
            scoreItem.textContent = highscores[i].initials + ': ' + highscores[i].score;
            scorelistEl.appendChild(scoreItem);
        }
    }
}

function clearScore() {
    window.localStorage.removeItem('highscores');
    window.location.reload();
}

printScore();
clearButton.addEventListener("click", clearScore);
startButton.addEventListener("click", startGame);
answersEl.addEventListener("click", checkAnswer);