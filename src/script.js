const quiz = document.getElementById("quiz");
const answerEls = document.querySelectorAll(".answer");
const questionEl = document.getElementById("question");
const a_text = document.getElementById("a_text");
const b_text = document.getElementById("b_text");
const c_text = document.getElementById("c_text");
const d_text = document.getElementById("d_text");
const submitBtn = document.getElementById("submit");

let currentQuiz = 0;
let score = 0;

// Loading data from external JSON
function loadJSON(callback) {
  const xhr = new XMLHttpRequest();
  xhr.overrideMimeType("application/json");
  xhr.open("GET", "./src/questions.json", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      callback(JSON.parse(xhr.responseText));
    }
  };
  xhr.send(null);
}

loadJSON(function (quizData) {
  loadQuiz();

  function loadQuiz() {
    deselectAnswers();

    const currentQuizData = quizData.questions[currentQuiz];

    questionEl.innerText = currentQuizData.question;
    a_text.innerText = currentQuizData.a;
    b_text.innerText = currentQuizData.b;
    c_text.innerText = currentQuizData.c;
    d_text.innerText = currentQuizData.d;
  }

  function getSelected() {
    let answer = undefined;

    answerEls.forEach((answerEl) => {
      if (answerEl.checked) {
        answer = answerEl.id;
      }
    });

    return answer;
  }

  function deselectAnswers() {
    answerEls.forEach((answerEl) => {
      answerEl.checked = false;
    });
  }

  submitBtn.addEventListener("click", () => {
    // check to see the answer
    const answer = getSelected();

    if (answer) {
      if (answer === quizData.questions[currentQuiz].correct) {
        score++;
      }

      currentQuiz++;
      if (currentQuiz < quizData.questions.length) {
        loadQuiz();
      } else {
        quiz.innerHTML = `
                <h2>Você respondeu corretamente a ${score}/${quizData.questions.length} perguntas.</h2>
                
                <button onclick="location.reload()">Tentar novamente</button>
            `;
      }
    }
  });
});
