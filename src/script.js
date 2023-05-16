const quiz = document.getElementById("quiz");
const answerEls = document.querySelectorAll(".answer");
const questionEl = document.getElementById("question");
const a_text = document.getElementById("a_text");
const b_text = document.getElementById("b_text");
const c_text = document.getElementById("c_text");
const d_text = document.getElementById("d_text");
const submitBtn = document.getElementById("submit");
const questionNumber = document.getElementById("questionNumber");

let currentQuiz = 0;
let score = 0;
let wrongAnswers = [];

// carregando dados JSON de um arquivo externo.
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
    questionNumber.innerText =
      currentQuiz + 1 + "/" + quizData.questions.length;
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
    // Checa se a resposta está correta ou não.
    const answer = getSelected();

    if (answer) {
      if (answer === quizData.questions[currentQuiz].correct) {
        score++;
      } else {
        wrongAnswers.push(currentQuiz);
      }

      currentQuiz++;
      if (currentQuiz < quizData.questions.length) {
        loadQuiz();
      } else {
        let resultHTML = `<h2>Você respondeu corretamente a ${score}/${quizData.questions.length} perguntas.</h2>`;

        if (wrongAnswers.length > 0) {
          resultHTML += `<h3 class="center">Perguntas que você errou:</h3>`;
          resultHTML += `<ul class="wrongAnswers">`;

          wrongAnswers.forEach((index) => {
            const question = quizData.questions[index];
            resultHTML += `<li>${
              question.question
            } - Resposta correta: <span class="correct">${
              question[question.correct]
            }</span></li>`;
          });

          resultHTML += "</ul>";
        }

        resultHTML += `<button class="enviar" onclick="location.reload()">Tentar novamente</button>`;
        quiz.innerHTML = resultHTML;

        if (document.body.classList.contains("dark")) {
          const h2Element = quiz.querySelector("h2");
          const h3Element = quiz.querySelector("h3");
          const liElement = quiz.querySelectorAll("ul li");
          const buttonElement = quiz.querySelector("button");
          h2Element.classList.toggle("dark-h2");
          h3Element.classList.toggle("dark-h3");
          liElement.forEach((element) => {
            element.classList.toggle("dark-li");
          });
          buttonElement.classList.toggle("dark-final");
        }
      }
    }
  });
});

// Função isolada para execução do darkmod
function darkMode() {
  const toggle = document.getElementById("toggle");
  const textContent = document.querySelectorAll(".text-content");
  const darkIcon = document.querySelector(".iIcon");

  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    quiz.classList.toggle("dark");
    questionNumber.classList.toggle("dark");
    submitBtn.classList.toggle("dark");
    questionEl.classList.toggle("dark");
    darkIcon.classList.toggle("dark");

    answerEls.forEach((answer) => {
      answer.classList.toggle("dark");
    });

    textContent.forEach((content) => {
      content.classList.toggle("dark");
    });
  });
}
darkMode();
