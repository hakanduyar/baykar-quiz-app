const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const timeText = document.getElementById("time");
const loader = document.getElementById("loader");
const start = document.getElementById("start");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");

let currentQuestion = {};
let acceptingAnswer = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let timeLeft = document.getElementById("time");
let count = 31;
let countdown;
let clickedChoices = [];

let questions = [];

fetch("https://jsonplaceholder.typicode.com/posts")
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    questions = loadedQuestions.map((loadedQuestion) => {
      const formattedQuestion = {
        question: loadedQuestion.title,
      };

      // "body" alanındaki metni seçeneklere ayırın
      const answerChoices = loadedQuestion.body.split("\n");
      answerChoices.forEach((choice, index) => {
        // Her seçeneği "choiceX" olarak formatlayın
        formattedQuestion["choice" + (index + 1)] = choice.trim();
      });

      // Eğer yeterli seçenek yoksa, eksik olanları "Choice not available" ile doldurun
      for (let i = answerChoices.length; i < 4; i++) {
        formattedQuestion["choice" + (i + 1)] = "Choice not available";
      }

      formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;

      return formattedQuestion;
    });

    startQuiz();
  })
  .catch((err) => {
    console.error(err);
  });

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

//initial setup
function initial() {
  clearInterval(countdown);
  count = 30;
  timeLeft.innerHTML = `${count}s`; // Her durumda doğrudan 30 saniye göster
  timerDisplay();
}

const timerDisplay = () => {
  countdown = setInterval(() => {
    count--;
    timeLeft.innerHTML = `${count}s`;
    if (count == 20) {
      // 10 saniye bekletme süresi
      acceptingAnswer = true; // 10 saniye sonra seçeneklere tıklamayı kabul et
    }
    if (count == 0) {
      clearInterval(countdown);
      getNewQuestions();
    }
  }, 1000);
};

startQuiz = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  initial();
  getNewQuestions();
  start.classList.remove("hidden");
  loader.classList.add("hidden");
};

getNewQuestions = () => {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    //go to end page
    return window.location.assign("/end.html");
  }

  initial();

  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;

  //Update the progress bar
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  availableQuestions.splice(questionIndex, 1);
  acceptingAnswer = false;
};

// "end.js" dosyasında

// Quiz bittiğinde çağırılacak olan fonksiyon
function showSelectedChoices() {
  // Kaydedilen seçimlerin bulunduğu tabloyu alın
  const table = document.getElementById("selectedChoicesTable");

  // Kaydedilen seçimlerin sayısını alın
  const numOfChoices = clickedChoices.length;

  // Her bir seçimi tabloya ekleyin
  for (let i = 0; i < numOfChoices; i++) {
    const row = table.insertRow(-1); // Yeni bir satır ekle

    const questionCell = row.insertCell(0); // Soru numarası için hücre ekle
    questionCell.innerHTML = i + 1; // Soru numarası, 1'den başlayarak

    const selectedChoiceCell = row.insertCell(1); // Seçilen şık için hücre ekle
    selectedChoiceCell.innerHTML = clickedChoices[i];
  }
}

// "showSelectedChoices" fonksiyonunu çağırarak seçilen tüm şıkları "end" sayfasında gösterin
showSelectedChoices();
// "start.js" dosyasında

// Quiz sırasında seçilen tüm şıkları ve karşılık gelen soru numaralarını kaydeden fonksiyon
function saveSelectedChoices(question, selectedChoice) {
  const table = document.getElementById("selectedChoicesTable");

  // Tabloyu kontrol et
  if (table) {
    // Yeni bir satır oluştur
    const row = table.insertRow(-1);

    // Satıra hücreler ekle
    const questionCell = row.insertCell(0);
    const selectedChoiceCell = row.insertCell(1);

    // Hücrelere içerik ekle
    questionCell.textContent = question;
    selectedChoiceCell.textContent = selectedChoice;
  } else {
    console.error("Table not found!"); // Tablo bulunamadı hatası
  }
}

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswer) return;

    acceptingAnswer = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    }

    // Seçilen şıkkı "A", "B", "C", "D" harflerine dönüştürün
    const choiceLetters = ["A", "B", "C", "D"];
    const selectedLetter = choiceLetters[selectedAnswer - 1];

    clickedChoices.push(selectedLetter);
    saveSelectedChoices(questionCounter, selectedLetter); // Seçilen şık ve soru numarasını kaydet

    console.log(selectedLetter); // A, B, C, D olarak yazdırın

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestions();
    }, 1000);
  });
});
